const express = require("express");
const router = express.Router();
const showController = require("../controllers/showController");
const { protectAdmin } = require("../middlewares/auth");

// Public routes for checking availability
router.get("/check-timeslot", showController.checkTimeSlotAvailability);

// Public routes (for users to view shows)
router.get("/active", showController.getActiveShows); // Get only active shows
router.get("/date-range", showController.getShowsByDateRange); // Get shows by date range
router.get("/movie/:movieId", showController.getShowsByMovieId);
router.get("/", showController.getShows);
router.get("/:id", showController.getShowById);

// Routes for seat booking (you might want to protect these with user authentication)
router.post("/:showId/book-seat", showController.bookSeat);
router.post("/:showId/cancel-seat", showController.cancelSeat);

// Admin protected routes
router.post("/", protectAdmin, showController.createShow);
router.put("/:id", protectAdmin, showController.updateShow);
router.delete("/:id", protectAdmin, showController.deleteShow);

module.exports = router;