import { Film, Edit, Trash2 } from "lucide-react";
import useMovieStore from "../store/useMovieStore";
import { useEffect } from "react";

export default function ListShows() {
  const { shows, fetchShows } = useMovieStore();
  console.log("i got all my shows ", shows);

  useEffect(() => {
    fetchShows();
  }, [shows]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Shows</h2>
        <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg">
          Add New Show
        </button>
      </div>

      <div className="bg-slate-700 rounded-xl border border-slate-600 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">
                  Movie
                </th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">
                  Price
                </th>
                <th className="px-6 py-4 text-right text-slate-300 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600">
              {shows.map((show) => (
                <tr key={show._id} className="hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Film className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-white">
                        {show.movie?.Title || "Untitled"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {new Date(show.showDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-300">{show.showTime}</td>
                  <td className="px-6 py-4 text-slate-300">
                    ₹{show.showPrice}
                  </td>
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
    </div>
  );
}
