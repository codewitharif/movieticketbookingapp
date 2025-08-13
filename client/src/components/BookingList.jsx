import { Ticket, User, Calendar, Clock } from "lucide-react";
import useMovieStore from "../store/useMovieStore";
import { useEffect } from "react";

export default function BookingsList() {
  const { adminBookings, fetchAdminBookings, theme } = useMovieStore();
  
  const isDark = theme === "dark";

  useEffect(() => {
    fetchAdminBookings();
  }, []);

  return (
    <div>
      <h2 className={`text-3xl font-bold mb-6 ${
        isDark ? "text-white" : "text-slate-900"
      }`}>Bookings</h2>

      <div className={`rounded-xl border overflow-x-auto ${
        isDark 
          ? "bg-slate-700 border-slate-600" 
          : "bg-white border-slate-200 shadow-lg"
      }`}>
        <table className="w-full">
          <thead className={`${
            isDark ? "bg-slate-800" : "bg-slate-50"
          }`}>
            <tr>
              <th className={`px-6 py-4 text-left font-medium ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}>
                Booking ID
              </th>
              <th className={`px-6 py-4 text-left font-medium ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}>
                Movie
              </th>
              <th className={`px-6 py-4 text-left font-medium ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}>
                User
              </th>
              <th className={`px-6 py-4 text-left font-medium ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}>
                Show
              </th>
              <th className={`px-6 py-4 text-left font-medium ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}>
                Seats
              </th>
              <th className={`px-6 py-4 text-left font-medium ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            isDark ? "divide-slate-600" : "divide-slate-200"
          }`}>
            {adminBookings?.map((booking) => (
              <tr key={booking._id} className={`transition-colors ${
                isDark 
                  ? "hover:bg-slate-800/50" 
                  : "hover:bg-slate-50"
              }`}>
                <td className="px-6 py-4 text-emerald-400 font-medium">
                  #{booking._id}
                </td>

                <td className={`px-6 py-4 font-medium ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {booking.show?.movie?.Title || "N/A"}
                </td>

                <td className={`px-6 py-4 ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {booking.user?.name || "N/A"}
                  </div>
                </td>

                <td className={`px-6 py-4 ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(booking.show?.showDate).toLocaleDateString()}
                    <Clock className="w-4 h-4 ml-3 mr-2" />
                    {booking.show?.showTime || "N/A"}
                  </div>
                </td>

                <td className={`px-6 py-4 ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}>
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    isDark 
                      ? "bg-slate-800 text-slate-300" 
                      : "bg-slate-100 text-slate-700"
                  }`}>
                    {Array.isArray(booking.bookedSeats)
                      ? booking.bookedSeats.join(", ")
                      : "N/A"}
                  </span>
                </td>

                <td className={`px-6 py-4 font-semibold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  ₹{booking.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {(!adminBookings || adminBookings.length === 0) && (
          <div className="py-12 text-center">
            <Ticket className={`w-12 h-12 mx-auto mb-4 ${
              isDark ? "text-slate-500" : "text-slate-300"
            }`} />
            <h3 className={`text-lg font-medium mb-2 ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}>
              No bookings found
            </h3>
            <p className={`${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}>
              No movie bookings have been made yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}