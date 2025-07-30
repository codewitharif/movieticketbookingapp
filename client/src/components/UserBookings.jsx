import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Users,
  Ticket,
  Star,
  X,
  Loader,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock user ID - replace with actual user ID from auth
  const { isLoaded, user: clerkUser } = useUser();
  //   const userId = user.user?.id;
  //   console.log("my userId is ",userId)

  // Fetch user bookings
  //   useEffect(() => {
  //     fetchUserBookings();
  //   }, []);

  useEffect(() => {
    if (isLoaded && clerkUser) {
      fetchUserBookings();
    }
  }, [isLoaded, clerkUser]);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      //   const userId = clerkUser.user?.id;
      const userId = clerkUser?.id;

      console.log(userId);
      const { data } = await axios.get(`/api/bookings/user/${userId}`);
      console.log("this is api res fata1", data);

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.log("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        // Remove booking from list
        setBookings(bookings.filter((booking) => booking._id !== bookingId));
        setShowModal(false);
        alert("Booking cancelled successfully!");
      } else {
        alert("Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Error cancelling booking");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getStatusColor = (isPaid) => {
    return isPaid ? "text-green-400" : "text-yellow-400";
  };

  const getStatusText = (isPaid) => {
    return isPaid ? "Paid" : "Pending Payment";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center ml-12">
        <div className="flex items-center text-white">
          <Loader className="w-6 h-6 animate-spin mr-2" />
          Loading Bookings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">My Bookings</h1>
          <p className="text-xl text-slate-400">
            View and manage your movie bookings
          </p>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <Ticket className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">
              No bookings found
            </h3>
            <p className="text-slate-400">You haven't made any bookings yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => {
                  setSelectedBooking(booking);
                  setShowModal(true);
                }}
              >
                {/* Movie Poster */}
                <div className="relative h-48">
                  <img
                    src={
                      booking.show?.movie?.Poster || "/placeholder-movie.jpg"
                    }
                    alt={booking.show?.movie?.Title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        booking.isPaid
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {getStatusText(booking.isPaid)}
                    </div>
                  </div>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm bg-opacity-80 ${
                      booking.isPaid
                        ? "bg-green-600/80 text-white"
                        : "bg-red-600/80 text-white"
                    }`}
                  >
                    {getStatusText(booking.isPaid)}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 truncate">
                    {booking.show?.movie?.Title}
                  </h3>

                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-emerald-400" />
                      {formatDate(booking.show?.showDate)}
                    </div>

                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-emerald-400" />
                      {formatTime(booking.show?.showTime)}
                    </div>

                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-emerald-400" />
                      {booking.bookedSeats?.length} seats:{" "}
                      {booking.bookedSeats?.join(", ")}
                    </div>

                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-emerald-400" />
                      <span className="font-semibold">₹{booking.amount}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700">
                    <div className="text-xs text-slate-400">
                      Booked on: {formatDate(booking.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Detail Modal */}
        {showModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-2xl font-bold text-white">
                  Booking Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Movie Info */}
                  <div>
                    <img
                      src={
                        selectedBooking.show?.movie?.Poster ||
                        "/placeholder-movie.jpg"
                      }
                      alt={selectedBooking.show?.movie?.Title}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-bold text-white mb-2">
                      {selectedBooking.show?.movie?.Title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">
                      {selectedBooking.show?.movie?.Genre}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {selectedBooking.show?.movie?.Runtime}
                    </p>
                  </div>

                  {/* Booking Info */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-3">
                        Show Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center text-slate-300">
                          <Calendar className="w-4 h-4 mr-3 text-emerald-400" />
                          {formatDate(selectedBooking.show?.showDate)}
                        </div>
                        <div className="flex items-center text-slate-300">
                          <Clock className="w-4 h-4 mr-3 text-emerald-400" />
                          {formatTime(selectedBooking.show?.showTime)}
                        </div>
                        <div className="flex items-center text-slate-300">
                          <Users className="w-4 h-4 mr-3 text-emerald-400" />
                          {selectedBooking.bookedSeats?.length} seats
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-3">Seats</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedBooking.bookedSeats?.map((seat) => (
                          <span
                            key={seat}
                            className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-3">Payment</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-slate-300">
                          <span>Total Amount:</span>
                          <span className="font-semibold">
                            ₹{selectedBooking.amount}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Status:</span>
                          <span
                            className={getStatusColor(selectedBooking.isPaid)}
                          >
                            {getStatusText(selectedBooking.isPaid)}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Booking Date:</span>
                          <span>{formatDate(selectedBooking.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 space-y-2">
                      {!selectedBooking.isPaid && (
                        <button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                          Complete Payment
                        </button>
                      )}
                      <button
                        onClick={() => handleCancelBooking(selectedBooking._id)}
                        className="w-full bg-red-500/20 text-red-400 border border-red-500/50 py-2 px-4 rounded-lg font-semibold hover:bg-red-500/30 transition-all duration-300"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;
