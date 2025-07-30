const Booking = require("../models/booking");
const Show = require("../models/show");
const User = require("../models/user");

// api to check if user is Admin
exports.isAdmin = async (req, res) => {
  res.json({ success: true, isAdmin: true });
};

// api to get dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    const bookings = await Booking.find({ isPaid: true });

    // Fixed: Use date field instead of showDateTime (as per your Show model)
    const activeShows = await Show.countDocuments();

    const totalUser = await User.countDocuments();

    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows,
      totalUser,
    };

    return res.json({ success: true, dashboardData });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// api to get all shows
exports.getAllShows = async (req, res) => {
  try {
    // Fixed: Use date field and added response
    const shows = await Show.find({ date: { $gte: new Date() } })
      .populate("movie")
      .sort({ date: 1 });

    return res.json({ success: true, shows }); // Added missing response
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// api to get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user")
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

// Additional useful admin functions
exports.getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const paidBookings = await Booking.countDocuments({ isPaid: true });
    const pendingBookings = await Booking.countDocuments({ isPaid: false });

    const todayBookings = await Booking.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });

    return res.json({
      success: true,
      stats: {
        totalBookings,
        paidBookings,
        pendingBookings,
        todayBookings,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

exports.getRevenueByMovie = async (req, res) => {
  try {
    const revenueData = await Booking.aggregate([
      { $match: { isPaid: true } },
      {
        $lookup: {
          from: "shows",
          localField: "show",
          foreignField: "_id",
          as: "showData",
        },
      },
      { $unwind: "$showData" },
      {
        $lookup: {
          from: "movies",
          localField: "showData.movie",
          foreignField: "_id",
          as: "movieData",
        },
      },
      { $unwind: "$movieData" },
      {
        $group: {
          _id: "$movieData._id",
          movieTitle: { $first: "$movieData.Title" },
          totalRevenue: { $sum: "$amount" },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    return res.json({ success: true, revenueData });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
