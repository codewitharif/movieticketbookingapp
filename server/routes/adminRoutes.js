// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isAdmin } = require("../controllers/adminController");
const { protectAdmin } = require("../middlewares/auth");

router.get("/is-admin", protectAdmin, isAdmin);
router.get("/dashboard", protectAdmin, adminController.getDashboardData);
router.get("/shows", protectAdmin, adminController.getAllShows);
router.get("/bookings", protectAdmin, adminController.getAllBookings);
router.get("/stats", protectAdmin, adminController.getBookingStats);
router.get("/revenue", protectAdmin, adminController.getRevenueByMovie);

module.exports = router;
