const Movie = require("../models/movie");
const Show = require("../models/show");

exports.createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const savedMovie = await movie.save();
    res.json({ success: true, savedMovie });
  } catch (error) {
    console.error("Error creating movie:", error);
    res
      .status(500)
      .json({ message: "Failed to create movie", error: error.message });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json({ success: true, movies });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch movies", error: error.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(movie);
  } catch (error) {
    console.error("Error fetching movie:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch movie", error: error.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error("Error updating movie:", error);
    res
      .status(500)
      .json({ message: "Failed to update movie", error: error.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res
      .status(500)
      .json({ message: "Failed to delete movie", error: error.message });
  }
};

// exports.getMoviesWithShows = async (req, res) => {
//   try {
//     const shows = await Show.find({ status: "active" })
//       .populate("movie")
//       .sort({ showDate: 1, showTime: 1 });

//     // Group shows by movie
//     const moviesWithShows = shows.reduce((acc, show) => {
//       const movieId = show.movie._id.toString();

//       if (!acc[movieId]) {
//         acc[movieId] = {
//           movie: show.movie,
//           shows: [],
//         };
//       }

//       acc[movieId].shows.push({
//         _id: show._id,
//         showDate: show.showDate,
//         showTime: show.showTime,
//         showPrice: show.showPrice,
//         availableSeats: show.availableSeats,
//         totalSeats: show.totalSeats,
//       });

//       return acc;
//     }, {});

//     // Convert to array
//     const result = Object.values(moviesWithShows);

//     res.status(200).json({
//       success: true,
//       movies: result,
//       count: result.length,
//     });
//   } catch (error) {
//     console.error("Error fetching movies with shows:", error);
//     res.status(500).json({
//       message: "Failed to fetch movies with shows",
//       error: error.message,
//     });
//   }
// };

exports.getMoviesWithShows = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ensure we're comparing only the date

    const shows = await Show.find({
      status: "active",
      showDate: { $gt: today },
    })
      .populate("movie")
      .sort({ showDate: 1, showTime: 1 });

    // Group shows by movie
    const moviesWithShows = shows.reduce((acc, show) => {
      const movieId = show.movie._id.toString();

      if (!acc[movieId]) {
        acc[movieId] = {
          movie: show.movie,
          shows: [],
        };
      }

      acc[movieId].shows.push({
        _id: show._id,
        showDate: show.showDate,
        showTime: show.showTime,
        showPrice: show.showPrice,
        availableSeats: show.availableSeats,
        totalSeats: show.totalSeats,
      });

      return acc;
    }, {});

    const result = Object.values(moviesWithShows);

    res.status(200).json({
      success: true,
      movies: result,
      count: result.length,
    });
  } catch (error) {
    console.error("Error fetching movies with shows:", error);
    res.status(500).json({
      message: "Failed to fetch movies with shows",
      error: error.message,
    });
  }
};
