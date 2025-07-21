import MovieCard from "./MovieCard";

export default function MovieListing({ movies, onBookNow }) {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onBookNow={onBookNow} />
          ))}
        </div>
      </div>
    </section>
  );
}
