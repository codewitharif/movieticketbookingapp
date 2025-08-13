import React, { useEffect, useState } from "react";
import useMovieStore from "../store/useMovieStore";
import { toast } from "react-toastify";
import { Clock, Plus, Trash2, Calendar, AlertCircle } from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";

const AddShow = () => {
  const { movies, fetchMovies, loading, setLoading, theme } = useMovieStore();
  const [movieId, setMovieId] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [totalSeats, setTotalSeats] = useState(100);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [dateTimingsMap, setDateTimingsMap] = useState(new Map());
  const [conflictCheck, setConflictCheck] = useState({
    checking: false,
    conflicts: [],
  });
  const user = useUser();
  const token = useAuth();

  const isDark = theme === "dark";

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Add date and time to map
  const handleAddDateTime = async () => {
    if (!currentDateTime) {
      toast.error("Please select a date and time");
      return;
    }

    if (!movieId) {
      toast.error("Please select a movie first");
      return;
    }

    const dateTimeObj = new Date(currentDateTime);
    const date = dateTimeObj.toISOString().split("T")[0];
    const timeString = dateTimeObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Check if this specific time slot is available
    try {
      setConflictCheck({ checking: true, conflicts: [] });
      
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/shows/check-timeslot?movieId=${movieId}&date=${date}&time=${encodeURIComponent(
          timeString
        )}`
      );

      const data = await response.json();

      if (!data.available) {
        toast.error(`This time slot is already booked for the selected movie`);
        setConflictCheck({ checking: false, conflicts: [] });
        return;
      }
    } catch (error) {
      console.error("Error checking time slot:", error);
      toast.error("Error checking availability. Please try again.");
      setConflictCheck({ checking: false, conflicts: [] });
      return;
    } finally {
      setConflictCheck({ checking: false, conflicts: [] });
    }

    const newMap = new Map(dateTimingsMap);

    if (newMap.has(date)) {
      const existingTimings = newMap.get(date);
      if (!existingTimings.includes(timeString)) {
        existingTimings.push(timeString);
        existingTimings.sort(); // Keep timings sorted
        newMap.set(date, existingTimings);
      } else {
        toast.error("This timing already exists for the selected date");
        return;
      }
    } else {
      newMap.set(date, [timeString]);
    }

    setDateTimingsMap(newMap);
    setCurrentDateTime("");
    toast.success("Show time added successfully!");
  };

  // Remove specific timing from a date
  const handleRemoveTiming = (date, timing) => {
    const newMap = new Map(dateTimingsMap);
    const timings = newMap.get(date);
    const updatedTimings = timings.filter((t) => t !== timing);

    if (updatedTimings.length > 0) {
      newMap.set(date, updatedTimings);
    } else {
      newMap.delete(date);
    }

    setDateTimingsMap(newMap);
    setConflictCheck({ checking: false, conflicts: [] }); // Clear conflicts when removing
  };

  // Remove entire date with all timings
  const handleRemoveDate = (date) => {
    const newMap = new Map(dateTimingsMap);
    newMap.delete(date);
    setDateTimingsMap(newMap);
    setConflictCheck({ checking: false, conflicts: [] }); // Clear conflicts when removing
  };

  // Handle movie change
  const handleMovieChange = (e) => {
    const selectedMovieId = e.target.value;
    setMovieId(selectedMovieId);
    // Clear any existing conflicts when movie changes
    setConflictCheck({ checking: false, conflicts: [] });
  };

  const validateForm = () => {
    if (!movieId) {
      toast.error("Please select a movie");
      return false;
    }
    if (!showPrice || showPrice < 1) {
      toast.error("Please enter a valid show price");
      return false;
    }
    if (!totalSeats || totalSeats < 1) {
      toast.error("Please enter a valid total seats count");
      return false;
    }
    if (dateTimingsMap.size === 0) {
      toast.error("Please add at least one date with timings");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Convert Map to array format for API (compatible with current backend)
    const dateTimingsArray = Array.from(dateTimingsMap.entries()).map(
      ([date, timings]) => ({
        date,
        timings: timings.map((time) => ({
          time,
          occupiedSeats: {},
        })),
      })
    );

    const showData = {
      movie: movieId,
      showPrice: Number(showPrice),
      totalSeats: Number(totalSeats),
      dateTimings: dateTimingsArray,
    };

    try {
      setLoading(true);
      // ✅ Get the actual JWT token by calling getToken()
      const authToken = await token.getToken();
      console.log("Actual token:", authToken);

      console.log("i got my token ", authToken);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/shows`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(showData),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        // Reset form
        setMovieId("");
        setShowPrice("");
        setTotalSeats(100);
        setCurrentDateTime("");
        setDateTimingsMap(new Map());
        setConflictCheck({ checking: false, conflicts: [] });
      } else {
        toast.error(data.message || "Failed to add shows");
      }
    } catch (error) {
      console.error("Error adding shows:", error);
      toast.error("Error adding shows. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get minimum datetime (current date and time)
  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className={`p-6 max-w-4xl rounded-xl shadow-md border ${
      isDark 
        ? "bg-slate-800 border-slate-600" 
        : "bg-white border-slate-200 shadow-lg"
    }`}>
      <h2 className={`text-2xl font-bold mb-6 ${
        isDark ? "text-white" : "text-slate-900"
      }`}>Add New Shows</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Movie Selector */}
        <div className="relative">
          <label className={`block mb-1 ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}>
            Select Movie <span className="text-red-400">*</span>
          </label>
          <select
            value={movieId}
            onChange={handleMovieChange}
            className={`w-full border text-sm rounded px-3 py-2 focus:outline-none focus:border-emerald-500 ${
              isDark 
                ? "bg-slate-700 border-slate-600 text-white" 
                : "bg-slate-50 border-slate-300 text-slate-900"
            }`}
            required
          >
            <option value="" disabled>
              -- Select Movie --
            </option>
            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>
                {movie.Title} ({movie.Year})
              </option>
            ))}
          </select>
        </div>

        {/* Show Price and Total Seats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block mb-1 ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}>
              Show Price (₹) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={showPrice}
              onChange={(e) => setShowPrice(e.target.value)}
              min="1"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-emerald-500 ${
                isDark 
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" 
                  : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500"
              }`}
              placeholder="Enter price in rupees"
              required
            />
          </div>

          <div>
            <label className={`block mb-1 ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}>
              Total Seats <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              min="1"
              max="500"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-emerald-500 ${
                isDark 
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" 
                  : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500"
              }`}
              placeholder="Theater capacity"
              required
            />
          </div>
        </div>

        {/* Date and Time Input Section */}
        <div className={`rounded-lg p-4 border ${
          isDark 
            ? "bg-slate-700 border-slate-600" 
            : "bg-slate-50 border-slate-200"
        }`}>
          <label className={`block mb-3 flex items-center ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}>
            <Calendar className="w-4 h-4 mr-2" />
            Add Date & Time
          </label>

          {/* DateTime Input */}
          <div className="mb-4">
            <label className={`block text-sm mb-2 flex items-center ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}>
              <Clock className="w-4 h-4 mr-2" />
              Select Date and Time
            </label>
            <input
              type="datetime-local"
              value={currentDateTime}
              onChange={(e) => setCurrentDateTime(e.target.value)}
              min={getMinDateTime()}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-emerald-500 ${
                isDark 
                  ? "bg-slate-600 border-slate-500 text-white" 
                  : "bg-white border-slate-300 text-slate-900"
              }`}
            />
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={handleAddDateTime}
            disabled={!movieId || !currentDateTime || conflictCheck.checking}
            className={`text-sm cursor-pointer flex items-center mb-4 disabled:cursor-not-allowed ${
              conflictCheck.checking || !movieId || !currentDateTime
                ? isDark ? "text-slate-500" : "text-slate-400"
                : "text-emerald-500 hover:text-emerald-400"
            }`}
          >
            <Plus className="w-4 h-4 mr-1" />
            {conflictCheck.checking ? "Checking availability..." : "Add Date & Time"}
          </button>

          {/* Checking Status */}
          {conflictCheck.checking && (
            <div className="flex items-center text-yellow-500 text-sm mb-4">
              <AlertCircle className="w-4 h-4 mr-2" />
              Checking availability...
            </div>
          )}

          {/* Display Added Dates and Timings */}
          {dateTimingsMap.size > 0 && (
            <div className="mt-4">
              <h4 className={`text-sm mb-3 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}>Added Shows:</h4>
              {Array.from(dateTimingsMap.entries())
                .sort(([a], [b]) => new Date(a) - new Date(b)) // Sort by date
                .map(([date, timings]) => (
                  <div key={date} className={`rounded p-3 mb-2 ${
                    isDark ? "bg-slate-600" : "bg-slate-100"
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className={`font-medium ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}>
                        {new Date(date).toLocaleDateString("en-IN", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveDate(date)}
                        className="text-red-500 hover:text-red-400"
                        title="Remove all shows for this date"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {timings.map((timing, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded text-sm flex items-center gap-1 bg-emerald-500 text-white"
                        >
                          {timing}
                          <button
                            type="button"
                            onClick={() => handleRemoveTiming(date, timing)}
                            className="text-red-200 hover:text-red-100 ml-1"
                            title="Remove this timing"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {dateTimingsMap.size > 0 && (
          <div className={`rounded-lg p-4 border ${
            isDark 
              ? "bg-slate-700 border-slate-600" 
              : "bg-slate-50 border-slate-200"
          }`}>
            <h4 className={`text-sm mb-2 ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}>Summary:</h4>
            <div className={`text-sm space-y-1 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}>
              <p>
                Total Shows:{" "}
                {Array.from(dateTimingsMap.values()).reduce(
                  (acc, timings) => acc + timings.length,
                  0
                )}
              </p>
              <p>Total Days: {dateTimingsMap.size}</p>
              <p>Price per Show: ₹{showPrice || 0}</p>
              <p>Seats per Show: {totalSeats}</p>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-5 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? "Adding Shows..." : "Add Shows"}
        </button>
      </form>
    </div>
  );
};

export default AddShow;