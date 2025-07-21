import { Heart, Clock, Star } from "lucide-react";
import useMovieStore from "../store/useMovieStore";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie, onBookNow }) {
  const navigate = useNavigate();
  const { handleBookNow } = useMovieStore();

  const bookMovie = (movie) => {
    handleBookNow(movie);
    navigate(`/booking/${movie.id}`); // Navigate from component, not store
  };
  return (
    <div className="group cursor-pointer">
      <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
        <div className="relative">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4">
            <button className="bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-red-500/80 transition-colors">
              <Heart className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="absolute top-4 left-4">
            <div className="bg-yellow-500/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
              <Star className="w-4 h-4 text-black" />
              <span className="text-black font-semibold text-sm">
                {movie.rating}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h4 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
            {movie.title}
          </h4>
          <p className="text-slate-400 text-sm mb-4">{movie.genre}</p>
          <p className="text-slate-400 text-sm mb-4 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {movie.duration}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {movie.times.map((time) => (
              <button
                key={time}
                className="bg-slate-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                {time}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-emerald-400">
                ${movie.price}
              </span>
              <span className="text-slate-400 text-sm ml-1">per ticket</span>
            </div>
            <button
              onClick={() => bookMovie(movie)}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
