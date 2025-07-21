import { useState, useEffect } from "react";
import { Star, Calendar, Clock, MapPin, Play } from "lucide-react";
import SeatSelection from "../components/SeatSelection";
import { useNavigate } from "react-router-dom";
import useMovieStore from "../store/useMovieStore";

export default function BookingPage() {
  const navigate = useNavigate();
  const { selectedMovie } = useMovieStore();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("Today");

  const dates = ["Today", "Tomorrow", "Thu 21", "Fri 22", "Sat 23", "Sun 24"];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!selectedMovie) {
      navigate("/");
    }
  }, [selectedMovie, navigate]);

  if (!selectedMovie) {
    return null; // Return null while redirecting
  }

  return (
    <div className="min-h-screen bg-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Movie Info */}
        <div className="bg-slate-700 rounded-2xl p-6 mb-8 border border-slate-600">
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={selectedMovie.poster}
              alt={selectedMovie.title}
              className="w-32 h-48 rounded-xl object-cover shadow-lg"
            />
            <div className="text-white flex-1">
              <h2 className="text-3xl font-bold mb-2">{selectedMovie.title}</h2>
              <p className="text-slate-300 mb-4">{selectedMovie.genre}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <span className="flex items-center bg-yellow-500/20 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 mr-1 text-yellow-400" />
                  {selectedMovie.rating}
                </span>
                <span className="flex items-center text-slate-300">
                  <Clock className="w-4 h-4 mr-1 text-slate-300" />
                  {selectedMovie.duration}
                </span>
                <span className="flex items-center text-slate-300">
                  <MapPin className="w-4 h-4 mr-1 text-slate-300" />
                  CinemaVibe Multiplex
                </span>
              </div>

              {/* Date Selection */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Select Date
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedDate === date
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Select Time
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMovie.times?.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedTime === time
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seat Selection */}
        <SeatSelection
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
          selectedMovie={selectedMovie}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
      </div>
    </div>
  );
}