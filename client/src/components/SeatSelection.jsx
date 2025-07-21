import { CreditCard } from "lucide-react";
import useMovieStore from "../store/useMovieStore";

export default function SeatSelection() {
  const {
    selectedSeats,
    selectedMovie,
    selectedDate,
    selectedTime,
    handleSeatClick,
    getSeatStatus,
    getSeatColor,
    generateSeats,
  } = useMovieStore();

  const seats = generateSeats();
  const bookedSeats = ["A5", "A6", "B3", "C7", "C8", "D5", "E2", "F9", "G4"];

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-slate-700">
      <h3 className="text-3xl font-bold text-white mb-8 text-center">
        Choose Your Seats
      </h3>

      {/* Screen */}
      <div className="relative mb-12">
        <div className="h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full mb-4"></div>
        <p className="text-center text-slate-400 text-sm font-medium tracking-widest">
          S C R E E N
        </p>
      </div>

      {/* Seats Grid */}
      <div className="mb-8 max-w-4xl mx-auto">
        {["A", "B", "C", "D", "E", "F", "G", "H"].map((row) => (
          <div key={row} className="flex items-center justify-center mb-3">
            <div className="w-6 text-slate-400 text-sm font-medium">{row}</div>
            <div className="flex gap-2 mx-4">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((seatNum) => {
                const seat = `${row}${seatNum}`;
                const status = getSeatStatus(seat);
                return (
                  <button
                    key={seat}
                    onClick={() => handleSeatClick(seat)}
                    disabled={status === "booked"}
                    className={`w-8 h-8 rounded-md text-xs font-semibold transition-all duration-200 transform hover:scale-110 ${getSeatColor(
                      status
                    )}`}
                  >
                    {seatNum}
                  </button>
                );
              })}
            </div>
            <div className="w-6 text-slate-400 text-sm font-medium">{row}</div>
          </div>
        ))}
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

      {/* Booking Summary */}
      {selectedSeats.length > 0 && selectedMovie && (
        <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl p-6 text-white shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-xl font-bold mb-2">Booking Summary</h4>
              <p className="text-emerald-100 mb-1">
                Movie: {selectedMovie.title}
              </p>
              <p className="text-emerald-100 mb-1">
                Date: {selectedDate} • Time: {selectedTime}
              </p>
              <p className="text-emerald-100">
                Seats: {selectedSeats.join(", ")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold mb-1">
                ${selectedMovie.price * selectedSeats.length}
              </p>
              <p className="text-emerald-100">
                {selectedSeats.length} tickets × ${selectedMovie.price}
              </p>
            </div>
          </div>
          <button className="w-full bg-white text-emerald-600 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-colors flex items-center justify-center space-x-3 shadow-lg">
            <CreditCard className="w-6 h-6" />
            <span>Proceed to Payment</span>
          </button>
        </div>
      )}
    </div>
  );
}
