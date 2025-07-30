const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { protectAdmin } = require("../middlewares/auth");

router.get("/movies-with-shows", movieController.getMoviesWithShows);
router.post("/", movieController.createMovie);
router.get("/", movieController.getMovies);
router.get("/:id", movieController.getMovieById);
router.put("/:id", movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);

module.exports = router;
