import { useState, useEffect } from "react";
import {
  Star,
  Calendar,
  Clock,
  MapPin,
  Play,
  Loader,
  Heart,
  AlertCircle,
} from "lucide-react";
import SeatSelection from "../components/SeatSelection";
import { useNavigate, useParams } from "react-router-dom";
import useMovieStore from "../store/useMovieStore";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";

export default function BookingPage() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const myMovieId = useParams();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState({});
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [selectedShowMovieDetail, setSelectedShowMovieDetail] = useState(null);

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
    theme,
  } = useMovieStore();

  const isDark = theme === "dark";

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

    const movieId =
      selectedMovie?._id || selectedShow?.movie?._id || myMovieId?.id;

    console.log("selectedMovie?._id", selectedMovie?._id);
    console.log("selectedShow?.movie?._id", selectedShow?.movie?._id);

    if (movieId) {
      console.log("movieId:", movieId);

      const fetchData = async () => {
        try {
          // Direct API call to ensure we get the data
          const response = await axios.get(`/api/shows/movie/${movieId}`);
          console.log("Direct API response:", response.data);

          if (response.data.success) {
            const result = response.data;

            // Set movie details - priority order:
            // 1. From API response movie object
            // 2. From first show's populated movie
            // 3. From selectedMovie state
            if (result.movie) {
              setSelectedShowMovieDetail(result.movie);
            } else if (result.shows && result.shows.length > 0 && result.shows[0].movie) {
              setSelectedShowMovieDetail(result.shows[0].movie);
            } else if (selectedMovie) {
              setSelectedShowMovieDetail(selectedMovie);
            }

            // If selectedShow exists, set it up
            if (selectedShow && result.shows.length > 0) {
              const showDate = new Date(selectedShow.showDate).toDateString();
              setSelectedDate(showDate);
              setSelectedTime(selectedShow.showTime);
              setSelectedShowData(selectedShow);
              fetchOccupiedSeats(selectedShow._id);
            }
          }
        } catch (error) {
          console.error("Error fetching movie shows:", error);
        }
      };

      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMovie?._id, selectedShow?._id, myMovieId?.id]);

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
        toast.success("Favorite updated!");
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
    setSelectedSeats([]);
  };

  // Handle time selection
  const handleTimeSelect = async (time, showData) => {
    setSelectedTime(time);
    setSelectedShowData(showData);
    setSelectedSeats([]);
    await fetchOccupiedSeats(showData._id);
  };

  // Get current movie data with proper fallback
  const currentMovie =
    selectedShow?.movie || selectedMovie || selectedShowMovieDetail;

  console.log("current movie ", currentMovie);
  console.log("selected show movie detail ", selectedShowMovieDetail);

  // Show loading
  const isDirectUrlAccess = myMovieId?.id && !selectedMovie && !selectedShow;
  const shouldShowLoading =
    loading || (isDirectUrlAccess && !selectedShowMovieDetail);

  if (shouldShowLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark 
          ? "bg-slate-800" 
          : "bg-slate-100"
      }`}>
        <div className={`flex items-center ${
          isDark ? "text-white" : "text-slate-800"
        }`}>
          <Loader className="w-6 h-6 animate-spin mr-2" />
          Loading movie details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark 
          ? "bg-slate-800" 
          : "bg-slate-100"
      }`}>
        <div className={`text-center ${
          isDark ? "text-white" : "text-slate-800"
        }`}>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-600 text-white"
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
  const hasShows = availableDates.length > 0;

  return (
    <div className={`min-h-screen ${
      isDark 
        ? "bg-gradient-to-b from-slate-900 to-slate-800" 
        : "bg-gradient-to-b from-slate-50 to-slate-100"
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Movie Info */}
        <div className={`rounded-2xl p-6 mb-8 border ${
          isDark 
            ? "bg-slate-700 border-slate-600" 
            : "bg-white border-slate-200 shadow-lg"
        }`}>
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={currentMovie?.Poster}
              alt={currentMovie?.Title}
              draggable={false}
              className="w-32 h-48 rounded-xl object-cover shadow-lg"
            />
            <div className={`flex-1 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <h2 className="text-3xl font-bold mb-2">{currentMovie?.Title}</h2>
              <p className={`mb-2 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}>{currentMovie?.Genre}</p>
              <p className={`text-sm mb-4 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                {currentMovie?.Plot}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm mb-6">
                <span className="flex items-center bg-yellow-500/20 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 mr-1 text-yellow-400" />
                  {currentMovie?.Ratings || "N/A"}
                </span>
                <span className={`flex items-center ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}>
                  <Clock className="w-4 h-4 mr-1" />
                  {currentMovie?.Runtime}
                </span>
                <span className={`flex items-center ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}>
                  <MapPin className="w-4 h-4 mr-1" />
                  CinemaVibe Multiplex
                </span>
                <span className={`px-3 py-1 rounded-full ${
                  isDark 
                    ? "bg-slate-600 text-slate-200" 
                    : "bg-slate-200 text-slate-700"
                }`}>
                  {currentMovie?.Rated}
                </span>
                <span className={`px-3 py-1 rounded-full ${
                  isDark 
                    ? "bg-slate-600 text-slate-200" 
                    : "bg-slate-200 text-slate-700"
                }`}>
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
                  <span className={`${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}>Director:</span>
                  <p className={`${
                    isDark ? "text-slate-200" : "text-slate-700"
                  }`}>{currentMovie?.Director}</p>
                </div>
                <div>
                  <span className={`${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}>Language:</span>
                  <p className={`${
                    isDark ? "text-slate-200" : "text-slate-700"
                  }`}>{currentMovie?.Language}</p>
                </div>
                <div className="md:col-span-2">
                  <span className={`${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}>Cast:</span>
                  <p className={`${
                    isDark ? "text-slate-200" : "text-slate-700"
                  }`}>{currentMovie?.Actors}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection - Show even if no shows */}
        <div className={`rounded-2xl p-6 mb-6 border ${
          isDark 
            ? "bg-slate-700 border-slate-600" 
            : "bg-white border-slate-200 shadow-lg"
        }`}>
          <h3 className={`text-xl font-semibold mb-4 flex items-center ${
            isDark ? "text-white" : "text-slate-900"
          }`}>
            <Calendar className="w-5 h-5 mr-2" />
            Select Date
          </h3>
          
          {hasShows ? (
            <div className="flex flex-wrap gap-3">
              {availableDates.map((dateString) => (
                <button
                  key={dateString}
                  onClick={() => handleDateSelect(dateString)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    selectedDate === dateString
                      ? "bg-emerald-500 text-white shadow-lg"
                      : isDark
                      ? "bg-slate-600 text-slate-300 hover:bg-slate-500"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
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
          ) : (
            <div className="text-center py-8">
              <AlertCircle className={`w-12 h-12 mx-auto mb-3 ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`} />
              <p className={`text-lg font-medium ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}>
                No shows available for this movie
              </p>
              <p className={`text-sm mt-2 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                Please check back later or explore other movies
              </p>
            </div>
          )}
        </div>

        {/* Time Selection */}
        {selectedDate && hasShows && (
          <div className={`rounded-2xl p-6 mb-6 border ${
            isDark 
              ? "bg-slate-700 border-slate-600" 
              : "bg-white border-slate-200 shadow-lg"
          }`}>
            <h3 className={`text-xl font-semibold mb-4 flex items-center ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
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
                      ? isDark
                        ? "bg-slate-600 text-slate-300 hover:bg-slate-500"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
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
          <div className={`rounded-2xl p-6 mb-6 ${
            isDark 
              ? "bg-emerald-900/20 border border-emerald-500/30" 
              : "bg-emerald-50 border border-emerald-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-3 ${
              isDark ? "text-emerald-400" : "text-emerald-700"
            }`}>
              Selected Show Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className={`${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>Movie:</span>
                <p className={`font-medium ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>{currentMovie?.Title}</p>
              </div>
              <div>
                <span className={`${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>Date:</span>
                <p className={`font-medium ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {formatDateForDisplay(selectedDate)}
                </p>
              </div>
              <div>
                <span className={`${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>Time:</span>
                <p className={`font-medium ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {selectedShowData.showTime}
                </p>
              </div>
              <div>
                <span className={`${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>Price per Seat:</span>
                <p className={`font-medium text-lg ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}>
                  ₹{selectedShowData.showPrice}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Seats */}
        {loadingSeats && (
          <div className={`rounded-2xl p-8 mb-6 border text-center ${
            isDark 
              ? "bg-slate-700 border-slate-600" 
              : "bg-white border-slate-200 shadow-lg"
          }`}>
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-400" />
            <p className={`${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}>Loading seat information...</p>
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

        {/* No selection messages - Only show if there ARE shows */}
        {hasShows && !selectedDate && (
          <div className="text-center py-12">
            <Calendar className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? "text-slate-500" : "text-slate-300"
            }`} />
            <p className={`text-lg ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}>
              Please select a date to see available show times
            </p>
          </div>
        )}

        {hasShows && selectedDate && !selectedTime && (
          <div className="text-center py-12">
            <Clock className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? "text-slate-500" : "text-slate-300"
            }`} />
            <p className={`text-lg ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}>
              Please select a show time to continue
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
