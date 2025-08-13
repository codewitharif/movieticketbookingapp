import { Film, Edit, Trash2, Plus } from "lucide-react";
import useMovieStore from "../store/useMovieStore";
import { useEffect } from "react";

export default function ListShows() {
  const { shows, fetchShows, theme } = useMovieStore();
  console.log("i got all my shows ", shows);
  
  const isDark = theme === "dark";

  useEffect(() => {
    fetchShows();
  }, [shows]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-3xl font-bold ${
          isDark ? "text-white" : "text-slate-900"
        }`}>Shows</h2>
        <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add New Show
        </button>
      </div>

      <div className={`rounded-xl border overflow-hidden ${
        isDark 
          ? "bg-slate-700 border-slate-600" 
          : "bg-white border-slate-200 shadow-lg"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${
              isDark ? "bg-slate-800" : "bg-slate-50"
            }`}>
              <tr>
                <th className={`px-6 py-4 text-left font-medium ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>
                  Movie
                </th>
                <th className={`px-6 py-4 text-left font-medium ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>
                  Date
                </th>
                <th className={`px-6 py-4 text-left font-medium ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>
                  Time
                </th>
                <th className={`px-6 py-4 text-left font-medium ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>
                  Price
                </th>
                <th className={`px-6 py-4 text-left font-medium ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>
                  Status
                </th>
                <th className={`px-6 py-4 text-right font-medium ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              isDark ? "divide-slate-600" : "divide-slate-200"
            }`}>
              {shows.map((show) => (
                <tr key={show._id} className={`transition-colors ${
                  isDark 
                    ? "hover:bg-slate-800/50" 
                    : "hover:bg-slate-50"
                }`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Film className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className={`font-medium ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}>
                        {show.movie?.Title || "Untitled"}
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}>
                    {new Date(show.showDate).toLocaleDateString()}
                  </td>
                  <td className={`px-6 py-4 ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      isDark 
                        ? "bg-slate-800 text-slate-300" 
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {show.showTime}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-semibold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}>
                    ₹{show.showPrice}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      show.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : show.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {show.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
                            : "text-slate-500 hover:text-emerald-600 hover:bg-slate-100"
                        }`}
                        title="Edit Show"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "text-slate-400 hover:text-red-400 hover:bg-slate-800"
                            : "text-slate-500 hover:text-red-600 hover:bg-slate-100"
                        }`}
                        title="Delete Show"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {(!shows || shows.length === 0) && (
          <div className="py-12 text-center">
            <Film className={`w-12 h-12 mx-auto mb-4 ${
              isDark ? "text-slate-500" : "text-slate-300"
            }`} />
            <h3 className={`text-lg font-medium mb-2 ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}>
              No shows found
            </h3>
            <p className={`mb-4 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}>
              Create your first movie show to get started.
            </p>
            <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
              Add First Show
            </button>
          </div>
        )}
      </div>
    </div>
  );
}