import { useEffect } from "react";
import MovieCard from "./MovieCard";
import useMovieStore from "../store/useMovieStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";

export default function MovieListing({ onBookNow }) {
  const {theme, moviesWithShows, fetchMoviesWithShows, loading, error } =
    useMovieStore();

  const { getToken } = useAuth();
  
  const isDark = theme === "dark";

  useEffect(() => {
    fetchMoviesWithShows();
  }, []);

  return (
    <section className={`py-16 ${
      isDark 
        ? "bg-gradient-to-b from-slate-900 to-slate-800" 
        : "bg-gradient-to-b from-slate-100 to-white"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className={`text-4xl font-bold mb-4 ${
            isDark ? "text-white" : "text-slate-900"
          }`}>
            Now Showing
          </h3>
          <p className={`text-xl max-w-2xl mx-auto ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            Discover the latest blockbusters and indie favorites playing at
            IndieShows
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center">
            <div className={`flex items-center ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <Loader className="w-6 h-6 animate-spin mr-2" />
              Loading shows...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {moviesWithShows.map(({ movie, shows }) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                shows={shows}
                onBookNow={onBookNow}
              />
            ))}
          </div>
        )}

        {error && (
          <p className="text-red-400 text-center mt-4">
            Failed to load movies. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}