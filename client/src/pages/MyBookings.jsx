import { Ticket, Clock, Calendar, MapPin, Film, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useMovieStore from "../store/useMovieStore";

export default function MyBookings() {
  const navigate = useNavigate();
  const { bookings } = useMovieStore();

  return (
    <div className="min-h-screen bg-slate-800 pb-12">


      {/* Bookings List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-slate-700 rounded-2xl p-8 border border-slate-600 inline-block">
              <Ticket className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                No Bookings Yet
              </h2>
              <p className="text-slate-300 mb-4">
                Your booked tickets will appear here.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Book a Movie
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-slate-700 rounded-2xl p-6 border border-slate-600 hover:border-emerald-400 transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Movie Poster */}
                  <img
                    src={booking.movie.poster}
                    alt={booking.movie.title}
                    className="w-32 h-48 rounded-xl object-cover shadow-lg self-start"
                  />

                  {/* Booking Details */}
                  <div className="flex-1 text-white">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-bold">
                        {booking.movie.title}
                      </h2>
                      <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm flex items-center">
                        <Ticket className="w-4 h-4 mr-1" />#
                        {booking.id.slice(0, 8)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-slate-300">
                        <Calendar className="w-5 h-5 mr-2 text-slate-300" />
                        {booking.date}
                      </div>
                      <div className="flex items-center text-slate-300">
                        <Clock className="w-5 h-5 mr-2 text-slate-300" />
                        {booking.time}
                      </div>
                      <div className="flex items-center text-slate-300">
                        <MapPin className="w-5 h-5 mr-2 text-slate-300" />
                        {booking.theater}
                      </div>
                      <div className="flex items-center text-slate-300">
                        <Film className="w-5 h-5 mr-2 text-slate-300" />
                        {booking.movie.genre}
                      </div>
                    </div>

                    {/* Seats & Price */}
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="flex flex-wrap gap-4 justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-1">
                            Seats
                          </h4>
                          <p className="font-mono text-slate-100">
                            {booking.seats.join(", ")}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-1">
                            Total Paid
                          </h4>
                          <p className="text-xl font-bold text-emerald-400">
                            ₹{booking.total}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}