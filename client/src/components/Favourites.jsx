import React, { useEffect, useState } from "react";
import useMovieStore from "../store/useMovieStore";
import { useAuth } from "@clerk/clerk-react";
import { Clock, Heart, Star, Loader } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Favourites = () => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  // const [loading, setLoading] = false;
  const { getToken } = useAuth();
  const {
    loading,
    setLoading,
    fetchFavoriteMovies: fetchFavoritesFromStore,
  } = useMovieStore();

  // Fetch favorites on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/favourites`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.success) {
          setFavoriteMovies(data.movies);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  // Toggle favorite status
  const toggleFavorite = async (movie) => {
    try {
      const token = await getToken();

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update-favourites`,
        { movieId: movie._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setFavoriteMovies((prev) => {
        const isCurrentlyFavorite = prev.some((m) => m._id === movie._id);

        if (isCurrentlyFavorite) {
          return prev.filter((m) => m._id !== movie._id);
        } else {
          return [...prev, movie];
        }
      });

      toast.success("Removed from faviourites");
    } catch (err) {
      console.error("Error toggling favorite:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">My Favourites</h1>
          <p className="text-xl text-slate-400">
            View and manage your favourites
          </p>
        </div>
      </div>

      {loading ? (
        <div className="min-h-screen flex justify-center">
          <div className="flex justify-center text-white">
            <Loader className="w-6 h-6 animate-spin mr-2" />
            Loading Favourite Movies...
          </div>
        </div>
      ) : favoriteMovies.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">
            No favorites found
          </h3>
          <p className="text-slate-400">You haven't made any favorites yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteMovies.map((movie) => {
            const isFav = favoriteMovies.some((m) => m._id === movie._id);

            return (
              <div
                key={movie._id}
                className="group cursor-pointer max-w-sm mx-auto"
              >
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative">
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Favorite Heart Icon */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => toggleFavorite(movie)}
                        className={`backdrop-blur-sm rounded-full p-1 transition-colors ${
                          isFav
                            ? "bg-gray-600/80 hover:bg-gray-700"
                            : "bg-black/50 hover:bg-red-500/80"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isFav
                              ? "fill-red-500 text-red-500 scale-110"
                              : "text-white"
                          }`}
                        />
                      </button>
                    </div>

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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favourites;
