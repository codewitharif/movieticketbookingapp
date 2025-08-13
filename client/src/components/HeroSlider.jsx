import { useState } from "react";
import { Star, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../App.css";

export default function HeroSlider({ featuredMovies }) {
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [selectedMovieForTrailer, setSelectedMovieForTrailer] = useState(null);
  const navigate = useNavigate();

  const sampleMovies = [
    {
      id: 1,
      title: "The Dark Knight",
      description:
        "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
      poster:
        "https://images.unsplash.com/photo-1489599611389-c6b01e6b5b6d?w=800&h=600&fit=crop",
      rating: "9.0",
      genre: "Action, Crime, Drama",
      duration: "152 min",
      trailer_link: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
      booking_link: "/book/dark-knight",
    },
    {
      id: 2,
      title: "Inception",
      description:
        "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      poster:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=600&fit=crop",
      rating: "8.8",
      genre: "Action, Sci-Fi, Thriller",
      duration: "148 min",
      trailer_link: "https://www.youtube.com/watch?v=YoHD9XEInc0",
      booking_link: "/book/inception",
    },
  ];

  const movies =
    featuredMovies && featuredMovies.length > 0 ? featuredMovies : sampleMovies;

  const handleTrailerClick = (movie) => {
    if (movie?.trailer_link) {
      setSelectedMovieForTrailer(movie);
      setShowTrailerModal(true);
    }
  };

  const handleBookingClick = (movie) => {
    if (movie?.booking_link) {
      navigate(movie.booking_link);
    }
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const getEmbedUrl = (trailerUrl) => {
    const videoId = getYouTubeVideoId(trailerUrl);
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
      : trailerUrl;
  };

  return (
    <>
      <section className="relative h-96 md:h-[660px] overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          className="h-full"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id}>
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
                  <p className="text-xl text-slate-300 mb-4">
                    {movie.description}
                  </p>
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
                  <div className="flex space-x-4 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={() => handleBookingClick(movie)}
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 sm:px-8 sm:py-3 text-sm sm:text-base rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Book Tickets
                    </button>
                    <button
                      onClick={() => handleTrailerClick(movie)}
                      className="bg-slate-800/80 backdrop-blur-sm text-white px-4 py-2 sm:px-8 sm:py-3 text-sm sm:text-base rounded-xl font-semibold hover:bg-slate-700 transition-colors border border-slate-700"
                    >
                      Watch Trailer
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Trailer Modal */}
      {showTrailerModal && selectedMovieForTrailer && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowTrailerModal(false);
            setSelectedMovieForTrailer(null);
          }}
        >
          <div
            className="relative bg-black rounded-xl overflow-hidden w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowTrailerModal(false);
                setSelectedMovieForTrailer(null);
              }}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src={getEmbedUrl(selectedMovieForTrailer.trailer_link)}
              title={`${selectedMovieForTrailer.title} Trailer`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
