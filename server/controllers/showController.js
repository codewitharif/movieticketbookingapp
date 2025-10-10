const Show = require("../models/show");
const Movie = require("../models/movie");
const { inngest } = require("../inngest/index");

exports.createShow = async (req, res) => {
  try {
    const { movie, showPrice, totalSeats, dateTimings } = req.body;
    console.log("my totalSeats are", totalSeats);

    // Validate input
    if (!movie || !showPrice || !dateTimings || !Array.isArray(dateTimings)) {
      return res.status(400).json({
        message: "Movie, showPrice and dateTimings are required",
      });
    }

    // Check if movie exists
    const movieExists = await Movie.findById(movie);
    if (!movieExists) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Validate dateTimings structure
    for (const dateEntry of dateTimings) {
      if (
        !dateEntry.date ||
        !dateEntry.timings ||
        !Array.isArray(dateEntry.timings)
      ) {
        return res.status(400).json({
          message: "Each date entry must have date and timings array",
        });
      }

      if (dateEntry.timings.length === 0) {
        return res.status(400).json({
          message: "Each date must have at least one timing",
        });
      }

      for (const timing of dateEntry.timings) {
        if (!timing.time) {
          return res.status(400).json({
            message: "Each timing must have a time value",
          });
        }
      }
    }

    // Collect all show data to create
    const showsToCreate = [];
    for (const dateEntry of dateTimings) {
      for (const timing of dateEntry.timings) {
        showsToCreate.push({
          movie,
          showDate: new Date(dateEntry.date),
          showTime: timing.time,
          showPrice: Number(showPrice),
          totalSeats: Number(totalSeats || 100),
          occupiedSeats: timing.occupiedSeats || {},
        });
      }
    }

    // Check for duplicates before creating any shows
    const duplicateChecks = showsToCreate.map((show) =>
      Show.findOne({
        movie: show.movie,
        showDate: show.showDate,
        showTime: show.showTime,
      })
    );

    const existingShows = await Promise.all(duplicateChecks);
    const duplicates = existingShows.filter((show) => show !== null);

    if (duplicates.length > 0) {
      const duplicate = duplicates[0];
      return res.status(400).json({
        message: `A show for this movie already exists on ${duplicate.showDate.toLocaleDateString()} at ${
          duplicate.showTime
        }`,
      });
    }

    // Create all shows using insertMany for better performance
    const savedShows = await Show.insertMany(showsToCreate);
    //trigger inngest function to send emails
    await Promise.all(
      savedShows.map(async (show) => {
        const populatedMovie = await Movie.findById(show.movie);

        return inngest.send({
          name: "app/show.added",
          data: {
            movieId: show.movie,
            movieTitle: populatedMovie.Title,
            moviePoster: populatedMovie.Poster,
            showDate: show.showDate,
            showTime: show.showTime,
          },
        });
      })
    );

    res.status(201).json({
      success: true,
      message: `${savedShows.length} shows added successfully`,
      shows: savedShows,
    });
  } catch (error) {
    console.error("Error creating shows:", error);

    // Handle duplicate key error from database
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "Duplicate show detected. A show with same movie, date and time already exists.",
      });
    }

    res.status(500).json({
      message: "Failed to create shows",
      error: error.message,
    });
  }
};

exports.getShows = async (req, res) => {
  try {
    const shows = await Show.find({}).populate("movie").sort({ createdAt: -1 });

    res.status(200).json({ success: true, shows });
  } catch (error) {
    console.error("Error fetching shows:", error);
    res.status(500).json({
      message: "Failed to fetch shows",
      error: error.message,
    });
  }
};

exports.getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate("movie");

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }
    res.status(200).json({ success: true, show });
  } catch (error) {
    console.error("Error fetching show:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch show", error: error.message });
  }
};

exports.updateShow = async (req, res) => {
  try {
    const { showDate, showTime, showPrice, totalSeats, status } = req.body;
    const showId = req.params.id;

    // Get the current show
    const currentShow = await Show.findById(showId);
    if (!currentShow) {
      return res.status(404).json({ message: "Show not found" });
    }

    // If showDate or showTime are being updated, check for duplicates
    if (showDate || showTime) {
      const checkDate = showDate ? new Date(showDate) : currentShow.showDate;
      const checkTime = showTime || currentShow.showTime;

      const existingShow = await Show.findOne({
        movie: currentShow.movie,
        showDate: checkDate,
        showTime: checkTime,
        _id: { $ne: showId }, // Exclude current show from duplicate check
      });

      if (existingShow) {
        return res.status(400).json({
          message: `A show for this movie already exists on ${checkDate.toLocaleDateString()} at ${checkTime}`,
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (showDate) updateData.showDate = new Date(showDate);
    if (showTime) updateData.showTime = showTime;
    if (showPrice) updateData.showPrice = Number(showPrice);
    if (totalSeats) updateData.totalSeats = Number(totalSeats);
    if (status) updateData.status = status;

    const updatedShow = await Show.findByIdAndUpdate(showId, updateData, {
      new: true,
      runValidators: true,
    }).populate("movie");

    res.status(200).json({ success: true, show: updatedShow });
  } catch (error) {
    console.error("Error updating show:", error);
    res
      .status(500)
      .json({ message: "Failed to update show", error: error.message });
  }
};

exports.deleteShow = async (req, res) => {
  try {
    const deletedShow = await Show.findByIdAndDelete(req.params.id);
    if (!deletedShow) {
      return res.status(404).json({ message: "Show not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Show deleted successfully" });
  } catch (error) {
    console.error("Error deleting show:", error);
    res
      .status(500)
      .json({ message: "Failed to delete show", error: error.message });
  }
};

exports.getShowsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;
    const now = new Date();
    
    // First get the movie details
    const movie = await Movie.findById(movieId);
    
    if (!movie) {
      return res.status(404).json({ 
        success: false, 
        message: "Movie not found" 
      });
    }
    
    const shows = await Show.find({
      movie: movieId,
      status: "active",
      $or: [
        { showDate: { $gt: now } },
        {
          showDate: { $eq: now.toISOString().split("T")[0] },
          showTime: { $gt: now.toTimeString().slice(0, 5) },
        },
      ],
    })
      .populate("movie")
      .sort({ showDate: 1, showTime: 1 });

    res.status(200).json({ 
      success: true, 
      movie: movie, // Always send movie details
      shows: shows,
      message: shows.length === 0 ? "No shows found for this movie" : null
    });
  } catch (error) {
    console.error("Error fetching shows by movie ID:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch shows", 
      error: error.message 
    });
  }
};

exports.checkTimeSlotAvailability = async (req, res) => {
  try {
    const { movieId, date, time } = req.query;
    console.log("movieId is ", movieId, "date is", date, "time is ", time);

    if (!movieId || !date || !time) {
      return res
        .status(400)
        .json({ message: "movieId, date, and time are required" });
    }

    const isAvailable = await Show.isTimeSlotAvailable(movieId, date, time);
    res.status(200).json({ available: isAvailable });
  } catch (error) {
    console.error("Error checking time slot:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// New method to book a seat
exports.bookSeat = async (req, res) => {
  try {
    const { showId } = req.params;
    const { seatNumber } = req.body;

    if (!seatNumber) {
      return res.status(400).json({ message: "Seat number is required" });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    await show.bookSeat(seatNumber);

    res.status(200).json({
      success: true,
      message: "Seat booked successfully",
      show: show,
      availableSeats: show.availableSeats,
    });
  } catch (error) {
    console.error("Error booking seat:", error);
    res.status(400).json({
      message: error.message || "Failed to book seat",
    });
  }
};

// New method to cancel a seat booking
exports.cancelSeat = async (req, res) => {
  try {
    const { showId } = req.params;
    const { seatNumber } = req.body;

    if (!seatNumber) {
      return res.status(400).json({ message: "Seat number is required" });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    await show.cancelSeat(seatNumber);

    res.status(200).json({
      success: true,
      message: "Seat booking cancelled successfully",
      show: show,
      availableSeats: show.availableSeats,
    });
  } catch (error) {
    console.error("Error cancelling seat:", error);
    res.status(400).json({
      message: error.message || "Failed to cancel seat booking",
    });
  }
};

// Get shows by date range
exports.getShowsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, movieId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Start date and end date are required",
      });
    }

    let query = {
      showDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    if (movieId) {
      query.movie = movieId;
    }

    const shows = await Show.find(query)
      .populate("movie")
      .sort({ showDate: 1, showTime: 1 });

    res.status(200).json({
      success: true,
      shows,
      count: shows.length,
    });
  } catch (error) {
    console.error("Error fetching shows by date range:", error);
    res.status(500).json({
      message: "Failed to fetch shows",
      error: error.message,
    });
  }
};

// Get active shows only
exports.getActiveShows = async (req, res) => {
  try {
    const shows = await Show.find({ status: "active" })
      .populate("movie")
      .sort({ showDate: 1, showTime: 1 });

    res.status(200).json({
      success: true,
      shows,
      count: shows.length,
    });
  } catch (error) {
    console.error("Error fetching active shows:", error);
    res.status(500).json({
      message: "Failed to fetch active shows",
      error: error.message,
    });
  }
};
