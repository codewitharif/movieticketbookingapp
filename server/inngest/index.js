const { Inngest } = require("inngest");
const User = require("../models/user");
const Booking = require("../models/booking");
const Show = require("../models/show");
const { model } = require("mongoose");
const { sendEmail } = require("../config/nodeMailer");

// Create Inngest instance
const inngest = new Inngest({
  id: "movie-ticket-booking",
  eventKey: process.env.INNGEST_EVENT_KEY,
});

/**
 * Sync user creation from Clerk to MongoDB
 */
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      email: email_addresses[0]?.email_address || "",
      name: `${first_name} ${last_name}`.trim(),
      image: image_url,
    };

    await User.create(userData);
    console.log("User created in MongoDB:", userData);
    return { success: true };
  }
);

/**
 * Sync user update from Clerk to MongoDB
 */
const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const updatedData = {
      email: email_addresses[0]?.email_address || "",
      name: `${first_name} ${last_name}`.trim(),
      image: image_url,
    };

    await User.findByIdAndUpdate(id, updatedData, { new: true });
    console.log("User updated in MongoDB:", updatedData);
    return { success: true };
  }
);

/**
 * Sync user deletion from Clerk to MongoDB
 */
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await User.findByIdAndDelete(id);
    console.log("User deleted from MongoDB:", id);
    return { success: true };
  }
);

// inngest function to cancel booking and release seats of show after 100 minutes of booking created  if payment s not made
// const releaseSeatsAndDeleteBooking = inngest.createFunction(
//   { id: "release-seats-delete-booking" },
//   { event: "app/checkpayment" },
//   async ({ event, step }) => {
//     const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
//     await step.sleepUntil("wait-for-10-minutes", tenMinutesLater);

//     await step.run("check-payment-status", async () => {
//       const bookingId = event.data.bookingId;
//       const booking = await Booking.findById(bookingId);

//       if (!booking) {
//         console.log("Booking not found");
//         return;
//       }

//       // if booking is not made, release seats and delete booking
//       if (!booking.isPaid) {
//         const show = await Show.findById(booking.show);
//         if (!show) {
//           console.log("Show not found");
//           return;
//         }
//         // Instead of forEach, use for...of for async operations
//         for (const seat of booking.bookedSeats) {
//           if (show.occupiedSeats && show.occupiedSeats[seat]) {
//             delete show.occupiedSeats[seat];
//           }
//         }
//         // booking.bookedSeats.forEach((seat) => {
//         //   delete show.occupiedSeats[seat]; //
//         // });
//         show.markModified("occupiedSeats");
//         await show.save();
//         await Booking.findByIdAndDelete(booking._id);
//         console.log("Seats released and booking deleted.");
//       }
//     });
//   }
// );

const releaseSeatsAndDeleteBooking = inngest.createFunction(
  { id: "release-seats-delete-booking" },
  { event: "app/checkpayment" },
  async ({ event, step }) => {
    try {
      const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
      await step.sleepUntil("wait-for-10-minutes", tenMinutesLater);

      await step.run("check-payment-status", async () => {
        const bookingId = event.data.bookingId;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
          console.log("Booking not found");
          return;
        }

        if (!booking.isPaid) {
          const show = await Show.findById(booking.show);
          if (!show) {
            console.log("Show not found");
            return;
          }

          // Use for...of instead of forEach for async operations
          for (const seat of booking.bookedSeats) {
            if (show.occupiedSeats && show.occupiedSeats[seat]) {
              delete show.occupiedSeats[seat];
            }
          }

          show.markModified("occupiedSeats");
          await show.save();
          await Booking.findByIdAndDelete(booking._id);
          console.log("Seats released and booking deleted.");
        }
      });
    } catch (error) {
      console.error("Error in releaseSeatsAndDeleteBooking:", error);
      throw error;
    }
  }
);

const sendBookingConfirmationEmail = inngest.createFunction(
  { id: "send-booking-confirmation-email" },
  { event: "app/show.booked" },
  async ({ event, step }) => {
    const { bookingId } = event.data;

    const booking = await Booking.findById(bookingId)
      .populate({
        path: "show",
        populate: { path: "movie", model: "Movie" },
      })
      .populate("user");
    console.log(booking.user.email);

    // Debug logs add karo
    console.log("📧 Booking found:", !!booking);
    console.log("👤 User found:", !!booking?.user);
    console.log("✉️ User email:", booking?.user?.email);
    console.log("🎬 Movie title:", booking?.show?.movie?.Title);

    if (!booking) {
      console.log("❌ Booking not found");
      return;
    }

    if (!booking.user) {
      console.log("❌ User not populated");
      return;
    }

    if (!booking.user.email) {
      console.log("❌ User email is missing");
      return;
    }

    await sendEmail({
      to: booking.user.email,
      subject: `Payment Confirmation : "${booking.show.movie.Title}" booked!`,
      body: `   <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background-color: #111827; color: white; padding: 20px;">
          <h2 style="margin: 0;">🎟️ Booking Confirmed!</h2>
        </div>
        <div style="padding: 20px;">
          <p>Hi <strong>${booking.user.name || "Guest"}</strong>,</p>
          <p>Thank you for booking your ticket with us. Here are your booking details:</p>
          <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>🎬 Movie</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                booking.show.movie.Title
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>📅 Date</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(
                booking.show.showDate
              ).toLocaleDateString("en-IN", {
                timeZone: "Asia/Kolkata",
              })}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>⏰ Time</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                booking.show.showTime
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>💺 Seats</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.bookedSeats.join(
                ", "
              )}</td>
            </tr>
            <tr>
              <td style="padding: 8px;"><strong>💰 Price</strong></td>
              <td style="padding: 8px;">₹${booking.amount}</td>
            </tr>
          </table>

          <p style="margin-top: 20px;">We hope you enjoy the show! 🎉</p>

          <p style="color: #555; font-size: 14px;">If you have any questions, feel free to reply to this email.</p>
        </div>
        <div style="background-color: #f9fafb; text-align: center; padding: 15px; color: #888; font-size: 12px;">
          &copy; ${new Date().getFullYear()} IndieShows. All rights reserved.
        </div>
      </div>
    </div>`,
    });
  }
);

// Export functions
const functions = [
  syncUserCreation,
  syncUserUpdate,
  syncUserDeletion,
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail,
];
module.exports = { inngest, functions };
