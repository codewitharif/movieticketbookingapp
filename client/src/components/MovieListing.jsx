import { useEffect } from "react";
import MovieCard from "./MovieCard";
import useMovieStore from "../store/useMovieStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";

export default function MovieListing({ onBookNow }) {
  const { moviesWithShows, fetchMoviesWithShows, loading, error } =
    useMovieStore();

  const { getToken } = useAuth();

  useEffect(() => {
    fetchMoviesWithShows();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-white mb-4">Now Showing</h3>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Discover the latest blockbusters and indie favorites playing at
            CinemaVibe
          </p>
        </div>

        {loading ? (
          <div className="  flex items-center justify-center">
            <div className="flex items-center text-white">
              <Loader className="w-6 h-6 animate-spin mr-2" />
              Loading shows...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
