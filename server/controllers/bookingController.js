// controllers/bookingController.js
const { inngest } = require("../inngest/index");
const Booking = require("../models/booking");
const Show = require("../models/show");
const mongoose = require("mongoose");
const stripe = require("stripe");

// Helper function to check seat availability
const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const show = await Show.findById(showId);
    if (!show) {
      return { available: false, message: "Show not found" };
    }

    // Check if show is active
    if (show.status !== "active") {
      return { available: false, message: "Show is not active" };
    }

    // Check selected seats against occupied seats
    for (let seat of selectedSeats) {
      if (show.occupiedSeats[seat]) {
        return {
          available: false,
          message: `Seat ${seat} is already booked`,
        };
      }
    }

    // Check if enough seats available
    const requestedSeatsCount = selectedSeats.length;
    const availableSeatsCount = show.availableSeats;

    if (requestedSeatsCount > availableSeatsCount) {
      return {
        available: false,
        message: `Only ${availableSeatsCount} seats available`,
      };
    }

    return { available: true, message: "All seats are available" };
  } catch (error) {
    return { available: false, message: "Error checking seat availability" };
  }
};

// Get occupied seats for a specific show
const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    const show = await Show.findById(showId).populate("movie");
    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    res.status(200).json({
      success: true,
      occupiedSeats: show.occupiedSeats || {},
      showDetails: {
        movie: show.movie,
        showDate: show.showDate,
        showTime: show.showTime,
        showPrice: show.showPrice,
        totalSeats: show.totalSeats,
        availableSeats: show.availableSeats,
        status: show.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching occupied seats",
      error: error.message,
    });
  }
};

// Create new booking with DEBUG LOGS
const createBooking = async (req, res) => {
  try {
    const { userId, showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    console.log("🎬 Booking attempt:", { userId, showId, selectedSeats });

    // Validate required fields
    if (
      !userId ||
      !showId ||
      !selectedSeats ||
      !Array.isArray(selectedSeats) ||
      selectedSeats.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, showId, selectedSeats",
      });
    }

    // Check seat availability
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
    if (!isAvailable.available) {
      console.log("❌ Seats not available:", isAvailable.message);
      return res.status(400).json({
        success: false,
        message: isAvailable.message,
      });
    }

    // Get show details for pricing
    const showForPricing = await Show.findById(showId).populate("movie");
    if (!showForPricing) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    console.log("📊 Show before booking:", {
      occupiedSeats: showForPricing.occupiedSeats,
      totalSeats: showForPricing.totalSeats,
      status: showForPricing.status,
    });

    // Calculate total amount
    const totalAmount = selectedSeats.length * showForPricing.showPrice;

    // Start transaction for booking
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      // Create booking INSIDE transaction
      const newBooking = new Booking({
        user: userId,
        show: showId,
        amount: totalAmount,
        bookedSeats: selectedSeats,
        isPaid: false,
      });

      await newBooking.save({ session: dbSession });
      console.log("💾 Booking saved:", newBooking._id);

      // Get show WITH transaction session
      const showWithSession = await Show.findById(showId).session(dbSession);

      console.log("🎭 Show with session before update:", {
        occupiedSeats: showWithSession.occupiedSeats,
        status: showWithSession.status,
      });

      // Double check seats availability within transaction
      for (let seat of selectedSeats) {
        if (showWithSession.occupiedSeats[seat]) {
          throw new Error(`Seat ${seat} is already booked`);
        }
      }

      // Update occupied seats
      for (let seat of selectedSeats) {
        showWithSession.occupiedSeats[seat] = true;
        console.log(`🪑 Marking seat ${seat} as occupied`);
      }

      // Mark the occupiedSeats as modified (IMPORTANT!)
      showWithSession.markModified("occupiedSeats");

      // Update status if needed
      const occupiedCount = Object.keys(showWithSession.occupiedSeats).length;
      console.log(
        `📈 Occupied count: ${occupiedCount}/${showWithSession.totalSeats}`
      );

      if (occupiedCount >= showWithSession.totalSeats) {
        showWithSession.status = "sold-out";
        console.log("🚫 Show marked as sold-out");
      }

      await showWithSession.save({ session: dbSession });
      console.log("💾 Show updated with new seats");

      // Commit transaction
      await dbSession.commitTransaction();
      console.log("✅ Transaction committed");

      // Verify the update by fetching fresh data
      const verifyShow = await Show.findById(showId);
      console.log("🔍 Verification - Show after commit:", {
        occupiedSeats: verifyShow.occupiedSeats,
        status: verifyShow.status,
      });

      // Rest of your Stripe and response code...
      // [Keep the existing Stripe code as is]

      // Stripe gateway initialize
      const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

      const line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: showForPricing.movie.Title || showId,
            },
            unit_amount: Math.floor(totalAmount) * 100,
          },
          quantity: 1,
        },
      ];

      const stripeSession = await stripeInstance.checkout.sessions.create({
        success_url: `${origin}/mybookings`,
        cancel_url: `${origin}/mybookings`,
        line_items: line_items,
        mode: "payment",
        metadata: {
          bookingId: newBooking._id.toString(),
        },
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      });

      // Update payment link (outside transaction)
      newBooking.paymentLink = stripeSession.url;
      await newBooking.save();

      // Send Inngest event
      // try {
      //   await inngest.send({
      //     name: "app/checkpayment",
      //     data: {
      //       bookingId: newBooking._id.toString(),
      //     },
      //   });
      // } catch (inngestError) {
      //   console.error("Inngest error:", inngestError);
      // }

      // Send Inngest event with better logging and error handling
      try {
        console.log(
          "🚀 Triggering Inngest event for booking:",
          newBooking._id.toString()
        );

        const inngestResponse = await inngest.send({
          name: "app/checkpayment",
          data: {
            bookingId: newBooking._id.toString(),
          },
        });

        console.log("✅ Inngest event sent successfully:", inngestResponse);
      } catch (inngestError) {
        console.error("❌ Inngest error details:", {
          error: inngestError.message,
          stack: inngestError.stack,
          bookingId: newBooking._id.toString(),
        });

        // Don't throw here - we don't want to fail the booking if Inngest fails
        // But log it properly for debugging
      }

      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        booking: newBooking,
        bookingId: newBooking._id,
        url: stripeSession.url,
      });
    } catch (transactionError) {
      console.error("💥 Transaction error:", transactionError.message);
      await dbSession.abortTransaction();
      throw transactionError;
    } finally {
      dbSession.endSession();
    }
  } catch (error) {
    console.error("🔥 Booking error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
    });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ user: userId })
      .populate("user", "name email")
      .populate({
        path: "show",
        populate: { path: "movie", select: "Title Poster Genre Runtime" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
      count: bookings.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user bookings",
      error: error.message,
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("user", "name email")
      .populate({
        path: "show",
        populate: { path: "movie", select: "Title Poster Genre Runtime" },
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching booking details",
      error: error.message,
    });
  }
};

// Cancel booking (new function)
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("show");
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if booking can be cancelled (maybe add time restrictions)
    if (booking.isPaid) {
      // You might want to handle refund logic here
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Cancel seats in show
      const show = await Show.findById(booking.show._id);
      for (let seat of booking.bookedSeats) {
        await show.cancelSeat(seat);
      }

      // Delete booking or mark as cancelled
      await Booking.findByIdAndDelete(bookingId, { session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling booking",
      error: error.message,
    });
  }
};

module.exports = {
  checkSeatsAvailability,
  getOccupiedSeats,
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
};
