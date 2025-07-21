import { Film, Edit, Trash2 } from 'lucide-react';

export default function MoviesList() {
  // Sample data - replace with real data from your store/API
  const movies = [
    { id: 1, title: "Dune: Part Two", genre: "Sci-Fi", rating: 8.4, shows: 4 },
    { id: 2, title: "The Batman", genre: "Action", rating: 8.2, shows: 5 },
    // Add more movies...
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Movies</h2>
        <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg">
          Add New Movie
        </button>
      </div>

      <div className="bg-slate-700 rounded-xl border border-slate-600 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-slate-300 font-medium">Movie</th>
              <th className="px-6 py-4 text-left text-slate-300 font-medium">Genre</th>
              <th className="px-6 py-4 text-left text-slate-300 font-medium">Rating</th>
              <th className="px-6 py-4 text-left text-slate-300 font-medium">Shows</th>
              <th className="px-6 py-4 text-right text-slate-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-600">
            {movies.map((movie) => (
              <tr key={movie.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Film className="w-5 h-5 text-emerald-400 mr-3" />
                    <span className="text-white">{movie.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300">{movie.genre}</td>
                <td className="px-6 py-4 text-slate-300">{movie.rating}</td>
                <td className="px-6 py-4 text-slate-300">{movie.shows}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-emerald-400 mr-4">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="text-slate-400 hover:text-red-400">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}