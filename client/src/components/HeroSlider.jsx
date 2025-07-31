import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider({ featuredMovies }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  return (
    <section className="relative h-96 md:h-[500px] overflow-hidden">
      {featuredMovies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${movie.poster})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 h-full flex items-center">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {movie.title}
              </h2>
              <p className="text-xl text-slate-300 mb-4">{movie.description}</p>
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">
                    {movie.rating}
                  </span>
                </div>
                <span className="text-slate-300">{movie.genre}</span>
                <span className="text-slate-300">{movie.duration}</span>
              </div>
              <div className="flex space-x-4">
                <div className="flex space-x-4 flex-wrap sm:flex-nowrap">
                  <button
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white 
    px-4 py-2 sm:px-8 sm:py-3 text-sm sm:text-base 
    rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Book Tickets
                  </button>
                  <button
                    className="bg-slate-800/80 backdrop-blur-sm text-white 
    px-4 py-2 sm:px-8 sm:py-3 text-sm sm:text-base 
    rounded-xl font-semibold hover:bg-slate-700 transition-colors border border-slate-700"
                  >
                    Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slider Controls */}
      <button
        onClick={() =>
          setCurrentSlide(
            (prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length
          )
        }
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)
        }
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slider Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-emerald-400" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
