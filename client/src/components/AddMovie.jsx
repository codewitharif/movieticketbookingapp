import { useState } from 'react';
import { Image, Film, Clock, Star, Type } from 'lucide-react';

export default function AddMovie() {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    duration: '',
    rating: '',
    description: '',
    poster: '',
    price: '',
    times: ['10:00', '13:30', '17:00', '20:30']
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Movie added:', formData);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Add New Movie</h2>
      
      <form onSubmit={handleSubmit} className="bg-slate-700 rounded-xl p-6 border border-slate-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-slate-300 flex items-center">
              <Type className="w-4 h-4 mr-2" />
              Movie Title
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 flex items-center">
              <Film className="w-4 h-4 mr-2" />
              Genre
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.genre}
              onChange={(e) => setFormData({...formData, genre: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Duration
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              placeholder="e.g. 2h 30min"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Rating
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-slate-300 flex items-center">
              <Image className="w-4 h-4 mr-2" />
              Poster URL
            </label>
            <input
              type="url"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              value={formData.poster}
              onChange={(e) => setFormData({...formData, poster: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-slate-300">Description</label>
            <textarea
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
        >
          Add Movie
        </button>
      </form>
    </div>
  );
}