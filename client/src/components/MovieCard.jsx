import { Heart, Clock, Star, Calendar } from "lucide-react";
import useMovieStore from "../store/useMovieStore";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function MovieCard({ movie, shows }) {
  const navigate = useNavigate();
  const { handleSelectedMovie } = useMovieStore();
  const { getToken } = useAuth();
  // const isFav = isFavorite(movie._id);

  const bookShow = () => {
    handleSelectedMovie(movie);
    navigate(`/booking/${movie._id}`);
  };

  const uniqueDates = [
    ...new Set(
      shows.map((show) => new Date(show.showDate).toLocaleDateString())
    ),
  ];
  const minPrice = Math.min(...shows.map((show) => show.showPrice));

  return (
    <div className="group cursor-pointer max-w-sm mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
        <div className="relative">
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Favorite Heart Icon */}
          {/* <div className="absolute top-2 right-2">
            <button
              onClick={async () => toggleFavorite(movie)}
              className="backdrop-blur-sm rounded-full p-1 transition-colors 
                  bg-black/50 hover:bg-red-500/80"
            >
              <Heart
                className={`w-4 h-4 transition-transform duration-200 ${
                  fetchFavoriteMovies.find(movie => movie._id===id)
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-white"
                }`}
              />
            </button>
          </div> */}

          {/* Rating */}
          <div className="absolute top-2 left-2">
            <div className="bg-yellow-500/90 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center space-x-1">
              <Star className="w-3 h-3 text-black" />
              <span className="text-black font-semibold text-xs">
                {movie.Ratings || "8.0"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">
            {movie.Title}
          </h4>
          <p className="text-slate-400 text-xs mb-2">{movie.Genre}</p>
          <p className="text-slate-400 text-xs mb-2 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {movie.Runtime}
          </p>

          <div className="mb-3">
            <p className="text-slate-400 text-xs mb-2 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {shows.length} shows available
            </p>
            <p className="text-slate-400 text-xs">
              Dates:{" "}
              <span className="text-white">
                {uniqueDates.slice(0, 2).join(", ")}
              </span>
              {uniqueDates.length > 2 && (
                <span className="text-emerald-400">
                  {" "}
                  +{uniqueDates.length - 2} more
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-emerald-400">
                ₹{minPrice}
              </span>
              <span className="text-slate-400 text-xs ml-1">/ ticket</span>
            </div>
            <button
              onClick={bookShow}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              View Shows
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
