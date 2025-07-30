const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show", // Reference to Show model
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    bookedSeats: {
      type: [String], // Array of seat numbers (e.g., ["A1", "A2"])
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentLink: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
