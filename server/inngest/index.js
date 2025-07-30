const { Inngest } = require("inngest");
const User = require("../models/user");
const Booking = require("../models/booking");
const Show = require("../models/show");

// Create Inngest instance
const inngest = new Inngest({ id: "movie-ticket-booking" });

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

const releaseSeatsAndDeleteBooking = inngest.createFunction(
  { id: "release-seats-delete-booking" },
  { event: "app/checkpayment" },
  async ({ event, step }) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
    await step.sleepUntil("wait-for-10-minutes", tenMinutesLater);

    await step.run("check-payment-status", async () => {
      const bookingId = event.data.bookingId;
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        console.log("Booking not found");
        return;
      }

      // if booking is not made, release seats and delete booking
      if (!booking.isPaid) {
        const show = await Show.findById(booking.show);
        if (!show) {
          console.log("Show not found");
          return;
        }

        booking.bookedSeats.forEach((seat) => {
          delete show.occupiedSeats[seat]; // ✅ corrected key
        });
        show.markModified("occupiedSeats");
        await show.save();
        await Booking.findByIdAndDelete(booking._id);
        console.log("Seats released and booking deleted.");
      }
    });
  }
);

// Export functions
const functions = [
  syncUserCreation,
  syncUserUpdate,
  syncUserDeletion,
  releaseSeatsAndDeleteBooking,
];
module.exports = { inngest, functions };
