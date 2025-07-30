const userController = require("../controllers/userController")
const express = require("express");
const router = express.Router();




router.get("/bookings", userController.getUserBookings);
router.post("/update-favourites", userController.updateFaviourite);
router.get("/favourites", userController.getFavourites);

module.exports = router;
