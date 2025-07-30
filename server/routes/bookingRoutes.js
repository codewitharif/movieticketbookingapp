// routes/booking.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
// const { protectUser } = require("../middlewares/auth"); // Assuming you have user auth middleware

// Create new booking (protected route)
router.post("/create", bookingController.createBooking);

// Get occupied seats for a show (public route)
router.get("/seats/:showId", bookingController.getOccupiedSeats);

// Get user's bookings (protected route)
router.get("/user/:userId", bookingController.getUserBookings);

// Get specific booking details (protected route)
router.get("/:bookingId", bookingController.getBookingById);

// Cancel booking (protected route) - NEW
router.delete("/:bookingId", bookingController.cancelBooking);

module.exports = router;
