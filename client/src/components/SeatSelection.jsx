import { CreditCard, Loader, LogIn } from "lucide-react";
import { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import useMovieStore from "../store/useMovieStore";

export default function SeatSelection({
  selectedShow,
  pricePerSeat,
  occupiedSeats,
  fetchOccupiedSeats,
}) {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [bookingLoading, setBookingLoading] = useState(false);

  const { selectedSeats, setSelectedSeats, selectedMovie } = useMovieStore();

  // Generate seats layout
  const generateSeats = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const seatsPerRow = 12;
    const seats = [];

    rows.forEach((row) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        seats.push(`${row}${i}`);
      }
    });

    return seats;
  };

  // Get seat status
  const getSeatStatus = (seat) => {
    if (occupiedSeats[seat]) return "booked";
    if (selectedSeats.includes(seat)) return "selected";
    return "available";
  };

  // Get seat color based on status
  const getSeatColor = (status) => {
    switch (status) {
      case "booked":
        return "bg-red-500 text-white cursor-not-allowed";
      case "selected":
        return "bg-emerald-500 text-white shadow-lg transform scale-110";
      case "available":
      default:
        return "bg-slate-600 hover:bg-slate-500 text-slate-300 cursor-pointer";
    }
  };

  // Handle seat click
  const handleSeatClick = (seat) => {
    const status = getSeatStatus(seat);

    if (status === "booked") return;

    // Check if user is logged in
    if (!isSignedIn) {
      toast.error("Please login to select seats");
      navigate("/sign-in");
      return;
    }

    if (status === "selected") {
      // Remove seat from selection
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      // Add seat to selection (max 8 seats)
      if (selectedSeats.length < 8) {
        setSelectedSeats([...selectedSeats, seat]);
      } else {
        toast.warning("Maximum 8 seats can be selected");
      }
    }
  };

  // Handle booking creation
  const handleBooking = async () => {
    if (!isSignedIn) {
      toast.error("Please login to book tickets");
      navigate("/sign-in");
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    try {
      setBookingLoading(true);
      const token = await getToken();

      const bookingData = {
        userId: user.id,
        showId: selectedShow._id,
        selectedSeats: selectedSeats,
      };

      const response = await axios.post("/api/bookings/create", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success("Booking created successfully!");

        // Refresh occupied seats
        await fetchOccupiedSeats(selectedShow._id);

        // Clear selected seats
        setSelectedSeats([]);

        // Navigate to payment
        window.location.href = response.data.url;
      } else {
        toast.error(response.data.message || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create booking. Please try again.");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const seats = generateSeats();
  const currentMovie = selectedShow?.movie || selectedMovie;

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-slate-700">
      <h3 className="text-3xl font-bold text-white mb-8 text-center">
        Choose Your Seats
      </h3>

      {/* Login Warning for non-authenticated users */}
      {!isSignedIn && (
        <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LogIn className="w-5 h-5 text-yellow-400" />
              <p className="text-yellow-200">
                You can view seats but need to login to book tickets
              </p>
            </div>
            <button
              onClick={() => navigate("/sign-in")}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Login Now
            </button>
          </div>
        </div>
      )}

      {/* Screen */}
      <div className="relative mb-12">
        <div className="h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full mb-4"></div>
        <p className="text-center text-slate-400 text-sm font-medium tracking-widest">
          S C R E E N
        </p>
      </div>

      {/* Seats Grid */}
      <div className="mb-8 w-full">
        {/* Mobile Layout - Compact Vertical */}
        <div className="block sm:hidden px-4">
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((row) => (
            <div key={row} className="mb-3">
              <div className="flex items-center">
                <div className="w-6 text-slate-400 text-sm font-medium">
                  {row}
                </div>
                <div className="flex gap-1 flex-wrap mx-2 flex-1 justify-center">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(
                    (seatNum) => {
                      const seat = `${row}${seatNum}`;
                      const status = getSeatStatus(seat);
                      return (
                        <button
                          key={seat}
                          onClick={() => handleSeatClick(seat)}
                          disabled={status === "booked" || bookingLoading}
                          className={`
                    w-7 h-7 
                    rounded-md 
                    text-xs 
                    font-semibold 
                    transition-all duration-200 
                    disabled:cursor-not-allowed
                    ${getSeatColor(status)}
                  `}
                        >
                          {seatNum}
                        </button>
                      );
                    }
                  )}
                </div>
                <div className="w-6 text-slate-400 text-sm font-medium">
                  {row}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Layout - Original */}
        <div className="hidden sm:block max-w-4xl mx-auto">
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((row) => (
            <div key={row} className="flex items-center justify-center mb-3">
              <div className="w-6 text-slate-400 text-sm font-medium">
                {row}
              </div>
              <div className="flex gap-2 mx-4">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((seatNum) => {
                  const seat = `${row}${seatNum}`;
                  const status = getSeatStatus(seat);
                  return (
                    <button
                      key={seat}
                      onClick={() => handleSeatClick(seat)}
                      disabled={status === "booked" || bookingLoading}
                      className={`w-8 h-8 rounded-md text-xs font-semibold transition-all duration-200 transform hover:scale-110 disabled:cursor-not-allowed ${getSeatColor(
                        status
                      )}`}
                    >
                      {seatNum}
                    </button>
                  );
                })}
              </div>
              <div className="w-6 text-slate-400 text-sm font-medium">
                {row}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-8 mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-slate-600 rounded-md"></div>
          <span className="text-slate-300 text-sm">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-emerald-500 rounded-md"></div>
          <span className="text-slate-300 text-sm">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-red-500 rounded-md"></div>
          <span className="text-slate-300 text-sm">Booked</span>
        </div>
      </div>

      {/* Seat Selection Info */}
      <div className="text-center mb-6">
        <p className="text-slate-400 text-sm">
          You can select up to 8 seats.
          {selectedSeats.length > 0 && (
            <span className="text-emerald-400 ml-2">
              {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""}{" "}
              selected
            </span>
          )}
        </p>
        {selectedSeats.length > 0 && (
          <p className="text-slate-300 text-sm mt-2">
            Selected seats: {selectedSeats.join(", ")}
          </p>
        )}
      </div>

      {/* Booking Summary */}
      {selectedSeats.length > 0 && currentMovie && (
        <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl p-6 text-white shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-xl font-bold mb-2">Booking Summary</h4>
              <p className="text-emerald-100 mb-1">
                Movie: {currentMovie.Title}
              </p>
              <p className="text-emerald-100 mb-1">
                Date: {new Date(selectedShow.showDate).toLocaleDateString()}
              </p>
              <p className="text-emerald-100 mb-1">
                Time: {selectedShow.showTime}
              </p>
              <p className="text-emerald-100">
                Seats: {selectedSeats.join(", ")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold mb-1">
                ₹{pricePerSeat * selectedSeats.length}
              </p>
              <p className="text-emerald-100">
                {selectedSeats.length} tickets × ₹{pricePerSeat}
              </p>
            </div>
          </div>

          {isSignedIn ? (
            <button
              onClick={handleBooking}
              disabled={bookingLoading || selectedSeats.length === 0}
              className="w-full bg-white text-emerald-600 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-colors flex items-center justify-center space-x-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bookingLoading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Creating Booking...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-6 h-6" />
                  <span>Book Now</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                toast.info("Please login to proceed with booking");
                navigate("/sign-in");
              }}
              className="w-full bg-yellow-500 text-black py-4 rounded-xl font-bold text-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-3 shadow-lg"
            >
              <LogIn className="w-6 h-6" />
              <span>Login to Book</span>
            </button>
          )}
        </div>
      )}

      {/* Show availability info */}
      <div className="mt-6 text-center">
        <p className="text-slate-400 text-sm">
          Available Seats: {selectedShow.availableSeats} /{" "}
          {selectedShow.totalSeats}
        </p>
        {Object.keys(occupiedSeats).length > 0 && (
          <p className="text-red-400 text-sm mt-1">
            {Object.keys(occupiedSeats).length} seats already booked
          </p>
        )}
      </div>
    </div>
  );
}