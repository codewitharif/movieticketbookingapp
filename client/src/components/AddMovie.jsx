import { useState } from "react";
import {
  Image,
  Film,
  Clock,
  Star,
  Type,
  Calendar,
  Globe,
  Award,
  User,
  BookOpen,
} from "lucide-react";
import useMovieStore from "../store/useMovieStore";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

export default function AddMovie() {
  const { loading, setLoading } = useMovieStore();
  const { getToken } = useAuth();

  const [formData, setFormData] = useState({
    Title: "",
    Year: "",
    Rated: "",
    Released: "",
    Runtime: "",
    Genre: "",
    Director: "",
    Writer: "",
    Actors: "",
    Plot: "",
    Language: "",
    Country: "",
    Awards: "",
    Poster: "",
    Ratings: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ✅ Get the token

      const token = await getToken();
      console.log("my token", token);

      // ✅ Axios request
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/movies`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success("Movie added successfully!");
        // Reset form
        setFormData({
          Title: "",
          Year: "",
          Rated: "",
          Released: "",
          Runtime: "",
          Genre: "",
          Director: "",
          Writer: "",
          Actors: "",
          Plot: "",
          Language: "",
          Country: "",
          Awards: "",
          Poster: "",
          Ratings: "",
        });
      } else {
        toast.error(data.message || "Failed to add movie");
      }
    } catch (error) {
      console.error("Error adding movie:", error);
      toast.error("Failed to add movie. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Add New Movie</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-700 rounded-xl p-6 border border-slate-600"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Title - Required */}
          <div className="space-y-2">
            <label className="text-slate-300 flex items-center">
              <Type className="w-4 h-4 mr-2" />
              Movie Title <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.Title}
              onChange={(e) => handleInputChange("Title", e.target.value)}
              required
            />
          </div>

          {/* Year - Required */}
          <div className="space-y-2">
            <label className="text-slate-300 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Year <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.Year}
              onChange={(e) => handleInputChange("Year", e.target.value)}
              placeholder="e.g. 2023"
              required
            />
          </div>

          {/* Rated */}
          <div className="space-y-2">
            <label className="text-slate-300 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Rated
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.Rated}
              onChange={(e) => handleInputChange("Rated", e.target.value)}
              placeholder="e.g. PG-13, R, PG"
            />
          </div>

          {/* Released */}
          <div className="space-y-2">
            <label className="text-slate-300 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Released
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.Released}
              onChange={(e) => handleInputChange("Released", e.target.value)}
              placeholder="e.g. 15 Dec 2023"
            />
          </div>

          {/* Runtime */}
          <div className="space-y-2">
            <label className="text-slate-300 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Runtime
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.Runtime}
              onChange={(e) => handleInputChange("Runtime", e.target.value)}
              placeholder="e.g. 150 min"
            />
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <label className="text-slate-300 flex items-center">
              <Film className="w-4 h-4 mr-2" />
              Genre
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.Genre}
              onChange={(e) => handleInputChange("Genre", e.target.value)}
              placeholder="e.g. Action, Drama, Comedy"
            />
          </div>

          {/* Director */}
          <div className="space-y-2">
            <label className="text-slate-300 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Director
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.Director}
              onChange={(e) => handleInputChange("Director", e.target.value)}
            />
          </div>

          {/* Writer */}
          <div className="space-y-2">
            <label className="text-slate-300 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Writer
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.Writer}
              onChange={(e) => handleInputChange("Writer", e.target.value)}
            />
          </div>

          {/* Actors */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-slate-300 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Actors
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.Actors}
              onChange={(e) => handleInputChange("Actors", e.target.value)}
              placeholder="e.g. Actor 1, Actor 2, Actor 3"
            />
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-slate-300 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Language
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.Language}
              onChange={(e) => handleInputChange("Language", e.target.value)}
              placeholder="e.g. English, Hindi"
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="text-slate-300 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Country
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.Country}
              onChange={(e) => handleInputChange("Country", e.target.value)}
              placeholder="e.g. USA, India"
            />
          </div>

          {/* Awards */}
          <div className="space-y-2">
            <label className="text-slate-300 flex items-center">
              <Award className="w-4 h-4 mr-2" />
              Awards
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.Awards}
              onChange={(e) => handleInputChange("Awards", e.target.value)}
            />
          </div>

          {/* Ratings */}
          <div className="space-y-2">
            <label className="text-slate-300 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Ratings
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.Ratings}
              onChange={(e) => handleInputChange("Ratings", e.target.value)}
              placeholder="e.g. 8.5/10"
            />
          </div>

          {/* Poster URL */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-slate-300 flex items-center">
              <Image className="w-4 h-4 mr-2" />
              Poster URL
            </label>
            <input
              type="url"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.Poster}
              onChange={(e) => handleInputChange("Poster", e.target.value)}
            />
          </div>

          {/* Plot */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-slate-300">Plot</label>
            <textarea
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              rows="4"
              value={formData.Plot}
              onChange={(e) => handleInputChange("Plot", e.target.value)}
              placeholder="Movie plot/description..."
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding Movie..." : "Add Movie"}
        </button>
      </form>
    </div>
  );
}
