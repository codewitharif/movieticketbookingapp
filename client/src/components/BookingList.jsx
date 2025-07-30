import { Ticket, User, Calendar, Clock } from "lucide-react";
import useMovieStore from "../store/useMovieStore";
import { useEffect } from "react";

export default function BookingsList() {
  const { adminBookings, fetchAdminBookings } = useMovieStore();
  

  useEffect(()=>{
    fetchAdminBookings()
  },[])

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Bookings</h2>

      <div className="bg-slate-700 rounded-xl border border-slate-600 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-slate-300 font-medium">
                Booking ID
              </th>
              <th className="px-6 py-4 text-left text-slate-300 font-medium">
                Movie
              </th>
              <th className="px-6 py-4 text-left text-slate-300 font-medium">
                User
              </th>
              <th className="px-6 py-4 text-left text-slate-300 font-medium">
                Show
              </th>
              <th className="px-6 py-4 text-left text-slate-300 font-medium">
                Seats
              </th>
              <th className="px-6 py-4 text-left text-slate-300 font-medium">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-600">
            {adminBookings?.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 text-emerald-400">#{booking.id}</td>
                <td className="px-6 py-4 text-white">{booking.movie}</td>
                <td className="px-6 py-4 text-slate-300">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {booking.user}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {booking.date}
                    <Clock className="w-4 h-4 ml-3 mr-2" />
                    {booking.time}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {booking.seats.join(", ")}
                </td>
                <td className="px-6 py-4 text-white">{booking.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
