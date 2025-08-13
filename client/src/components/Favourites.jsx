import React, { useEffect, useState } from "react";
import useMovieStore from "../store/useMovieStore";
// import { useStore } from "../store/useStore"; // Import your Zustand store
import { useAuth } from "@clerk/clerk-react";
import { Clock, Heart, Star, Loader } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Favourites = () => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const { getToken } = useAuth();
  const {
    theme,
    loading,
    setLoading,
    fetchFavoriteMovies: fetchFavoritesFromStore,
  } = useMovieStore();
  
  const isDark = theme === "dark";

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

      toast.success("Removed from favourites");
    } catch (err) {
      console.error("Error toggling favorite:", err.message);
    }
  };

  return (
    <div className={`min-h-screen py-8 ${
      isDark 
        ? "bg-gradient-to-b from-slate-900 to-slate-800" 
        : "bg-gradient-to-b from-slate-50 to-slate-100"
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${
            isDark ? "text-white" : "text-slate-900"
          }`}>
            My Favourites
          </h1>
          <p className={`text-xl ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            View and manage your favourites
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className={`flex justify-center ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <Loader className="w-6 h-6 animate-spin mr-2" />
              Loading Favourite Movies...
            </div>
          </div>
        ) : favoriteMovies.length === 0 ? (
          <div className="text-center py-16">
            <Heart className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? "text-slate-600" : "text-slate-300"
            }`} />
            <h3 className={`text-2xl font-semibold mb-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              No favorites found
            </h3>
            <p className={`${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}>
              You haven't made any favorites yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favoriteMovies.map((movie) => {
              const isFav = favoriteMovies.some((m) => m._id === movie._id);

              return (
                <div
                  key={movie._id}
                  className={`backdrop-blur-md rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                    isDark 
                      ? "bg-slate-800/50 border-slate-700 hover:border-emerald-500/50" 
                      : "bg-white/80 border-slate-200 hover:border-emerald-400/50 shadow-lg hover:shadow-xl"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      draggable={false}
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
                    <h4 className={`text-lg font-semibold mb-1 group-hover:text-emerald-400 transition-colors ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      {movie.Title}
                    </h4>
                    <p className={`text-xs mb-2 ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {movie.Genre}
                    </p>
                    <p className={`text-xs mb-2 flex items-center ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}>
                      <Clock className="w-3 h-3 mr-1" />
                      {movie.Runtime}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourites;