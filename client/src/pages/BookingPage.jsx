import { useState, useEffect } from "react";
import {
  Star,
  Calendar,
  Clock,
  MapPin,
  Play,
  Loader,
  Heart,
} from "lucide-react";
import SeatSelection from "../components/SeatSelection";
import { useNavigate, useParams } from "react-router-dom";
import useMovieStore from "../store/useMovieStore";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";

export default function BookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getToken } = useAuth();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState({});
  const [loadingSeats, setLoadingSeats] = useState(false);

  const {
    selectedMovie,
    selectedShow,
    movieShows,
    loading,
    error,
    fetchMovieShows,
    groupShowsByDate,
    selectedSeats,
    setSelectedSeats,
  } = useMovieStore();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedShowData, setSelectedShowData] = useState(null);

  // Fetch occupied seats for a specific show
  const fetchOccupiedSeats = async (showId) => {
    try {
      setLoadingSeats(true);
      const response = await axios.get(`/api/bookings/seats/${showId}`);

      if (response.data.success) {
        setOccupiedSeats(response.data.occupiedSeats);
        return response.data.occupiedSeats;
      } else {
        toast.error("Failed to fetch seat information");
        return {};
      }
    } catch (error) {
      console.error("Error fetching occupied seats:", error);
      toast.error("Error loading seat information");
      return {};
    } finally {
      setLoadingSeats(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!selectedMovie && !selectedShow) {
      navigate("/");
      return;
    }

    // Get movie ID from either selectedMovie or selectedShow
    const movieId = selectedMovie?._id || selectedShow?.movie?._id;
    if (movieId) {
      fetchMovieShows(movieId).then((result) => {
        if (result.success && selectedShow) {
          // Pre-select date and time if coming from show selection
          const showDate = new Date(selectedShow.showDate).toDateString();
          setSelectedDate(showDate);
          setSelectedTime(selectedShow.showTime);
          setSelectedShowData(selectedShow);

          // Fetch occupied seats for this show
          fetchOccupiedSeats(selectedShow._id);
        }
      });
    }
  }, [selectedMovie, selectedShow, navigate, fetchMovieShows]);

  // Fetch favorite movies
  const fetchFavoriteMovies = async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const { data } = await axios.get(`/api/user/favourites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setFavoriteMovies(data.movies);
      }
    } catch (error) {
      console.log("Error fetching favorite movies:", error);
    }
  };

  useEffect(() => {
    fetchFavoriteMovies();
  }, []);

  // Toggle favorite
  const toggleFavorite = async (movieId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `/api/user/update-favourites`,
        { movieId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success("Favorite toggled");
        fetchFavoriteMovies();
      }
    } catch (err) {
      console.error("Error toggling favorite:", err.message);
      toast.error("Error toggling favorite");
    }
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Handle date selection
  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
    setSelectedTime("");
    setSelectedShowData(null);
    setOccupiedSeats({});
    setSelectedSeats([]); // Clear selected seats when date changes
  };

  // Handle time selection
  const handleTimeSelect = async (time, showData) => {
    setSelectedTime(time);
    setSelectedShowData(showData);
    setSelectedSeats([]); // Clear selected seats when time changes

    // Fetch occupied seats for the selected show
    await fetchOccupiedSeats(showData._id);
  };

  // Get current movie data
  const currentMovie = selectedShow?.movie || selectedMovie;

  if (!currentMovie) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="flex items-center text-white">
          <Loader className="w-6 h-6 animate-spin mr-2" />
          Loading show times...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const groupedShows = groupShowsByDate();
  const availableDates = Object.keys(groupedShows).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  return (
    <div className="min-h-screen bg-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Movie Info */}
        <div className="bg-slate-700 rounded-2xl p-6 mb-8 border border-slate-600">
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={currentMovie?.Poster}
              alt={currentMovie?.Title}
              className="w-32 h-48 rounded-xl object-cover shadow-lg"
            />
            <div className="text-white flex-1">
              <h2 className="text-3xl font-bold mb-2">{currentMovie?.Title}</h2>
              <p className="text-slate-300 mb-2">{currentMovie?.Genre}</p>
              <p className="text-slate-400 text-sm mb-4">
                {currentMovie?.Plot}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm mb-6">
                <span className="flex items-center bg-yellow-500/20 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 mr-1 text-yellow-400" />
                  {currentMovie?.Ratings || "N/A"}
                </span>
                <span className="flex items-center text-slate-300">
                  <Clock className="w-4 h-4 mr-1 text-slate-300" />
                  {currentMovie?.Runtime}
                </span>
                <span className="flex items-center text-slate-300">
                  <MapPin className="w-4 h-4 mr-1 text-slate-300" />
                  CinemaVibe Multiplex
                </span>
                <span className="bg-slate-600 px-3 py-1 rounded-full text-slate-200">
                  {currentMovie?.Rated}
                </span>
                <span className="bg-slate-600 px-3 py-1 rounded-full text-slate-200">
                  <button
                    onClick={() => toggleFavorite(currentMovie._id)}
                    className="backdrop-blur-sm rounded-full p-1 transition-colors bg-black/50"
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform duration-200 ${
                        favoriteMovies.find(
                          (fav) => fav._id === currentMovie._id
                        )
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-white"
                      }`}
                    />
                  </button>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <span className="text-slate-400">Director:</span>
                  <p className="text-slate-200">{currentMovie?.Director}</p>
                </div>
                <div>
                  <span className="text-slate-400">Language:</span>
                  <p className="text-slate-200">{currentMovie?.Language}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-slate-400">Cast:</span>
                  <p className="text-slate-200">{currentMovie?.Actors}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-slate-700 rounded-2xl p-6 mb-6 border border-slate-600">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Select Date
          </h3>
          <div className="flex flex-wrap gap-3">
            {availableDates.map((dateString) => (
              <button
                key={dateString}
                onClick={() => handleDateSelect(dateString)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedDate === dateString
                    ? "bg-emerald-500 text-white shadow-lg"
                    : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                }`}
              >
                <div className="text-center">
                  <p className="font-semibold">
                    {formatDateForDisplay(dateString)}
                  </p>
                  <p className="text-xs opacity-80">
                    {new Date(dateString).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div className="bg-slate-700 rounded-2xl p-6 mb-6 border border-slate-600">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Select Show Time
            </h3>
            <div className="flex flex-wrap gap-3">
              {groupedShows[selectedDate]?.map((show) => (
                <button
                  key={show._id}
                  onClick={() => handleTimeSelect(show.showTime, show)}
                  disabled={show.status !== "active"}
                  className={`px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedTime === show.showTime
                      ? "bg-emerald-500 text-white shadow-lg"
                      : show.status === "active"
                      ? "bg-slate-600 text-slate-300 hover:bg-slate-500"
                      : "bg-red-600/20 text-red-400"
                  }`}
                >
                  <div className="text-center">
                    <p className="font-semibold">{show.showTime}</p>
                    <p className="text-xs opacity-80">₹{show.showPrice}</p>
                    <p className="text-xs opacity-80">
                      {show.availableSeats} seats left
                    </p>
                    {show.status !== "active" && (
                      <p className="text-xs text-red-400">
                        {show.status === "sold-out" ? "Sold Out" : "Cancelled"}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Show Summary */}
        {selectedShowData && (
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-emerald-400 mb-3">
              Selected Show Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Movie:</span>
                <p className="text-white font-medium">{currentMovie?.Title}</p>
              </div>
              <div>
                <span className="text-slate-400">Date:</span>
                <p className="text-white font-medium">
                  {formatDateForDisplay(selectedDate)}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Time:</span>
                <p className="text-white font-medium">
                  {selectedShowData.showTime}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Price per Seat:</span>
                <p className="text-emerald-400 font-medium text-lg">
                  ₹{selectedShowData.showPrice}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Seats */}
        {loadingSeats && (
          <div className="bg-slate-700 rounded-2xl p-8 mb-6 border border-slate-600 text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-400" />
            <p className="text-slate-300">Loading seat information...</p>
          </div>
        )}

        {/* Seat Selection */}
        {selectedShowData && !loadingSeats && (
          <SeatSelection
            selectedShow={selectedShowData}
            pricePerSeat={selectedShowData.showPrice}
            occupiedSeats={occupiedSeats}
            fetchOccupiedSeats={fetchOccupiedSeats}
          />
        )}

        {/* No selection messages */}
        {!selectedDate && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">
              Please select a date to see available show times
            </p>
          </div>
        )}

        {selectedDate && !selectedTime && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">
              Please select a show time to continue
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
