const Booking = require("../models/booking");
const Movie = require("../models/movie");
const User = require("../models/user");
const { clerkClient } = require("@clerk/express");
// api controller to get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const user = req.auth().userId;
    const bookings = await Booking.find({ user })
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

exports.updateFaviourite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    if (!movieId || typeof movieId !== "string") {
      return res.status(400).json({ success: false, message: "Invalid movie ID" });
    }

    const user = await clerkClient.users.getUser(userId);
    let favorites = user.privateMetadata.favorites || [];

    if (!favorites.includes(movieId)) {
      favorites.push(movieId);
    } else {
      favorites = favorites.filter((item) => item !== movieId);
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: { ...user.privateMetadata, favorites },
    });

    return res.status(200).json({ success: true, message: "Favourite movies updated", favorites });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFavourites = async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.auth().userId);
    const favorites = user.privateMetadata.favorites || [];

    // getting movies from database
    const movies = await Movie.find({ _id: { $in: favorites } });

    return res.json({ success: true, movies });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
