import { Film, Ticket, Users, TrendingUp, Loader } from "lucide-react";
import { useEffect } from "react";
import useMovieStore from "../store/useMovieStore";

export default function AdminHome() {
  const {
    movies,
    fetchMovies,
    dashboardData,
    fetchDashboardData,
    loading,
    error,
  } = useMovieStore();
  
  const totalActiveShows = 
    Array.isArray(dashboardData?.activeShows) 
      ? dashboardData.activeShows.reduce((total, show) => {
          return total + (show.timings?.length || 0);
        }, 0) 
      : 0;

  useEffect(() => {
    // Fetch dashboard data when component mounts
    fetchDashboardData();
    fetchMovies();
  }, [fetchDashboardData, fetchMovies]);

  console.log("my dashboard data is ", dashboardData);

  const stats = [
    {
      title: "Active Shows",
      value: dashboardData?.activeShows || 0,
      icon: Film,
      change: "+3 this month",
    },
    {
      title: "Total Bookings",
      value: dashboardData?.totalBookings || 0,
      icon: Ticket,
      change: "12% increase",
    },
    {
      title: "Active Users",
      value: dashboardData?.totalUser || 0,
      icon: Users,
      change: "5% increase",
    },
    {
      title: "Revenue",
      value: `₹${dashboardData?.totalRevenue?.toLocaleString("en-IN") || 0}`,
      icon: TrendingUp,
      change: "18% increase",
    },
  ];

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          {/* <p className="text-white text-lg font-medium">Loading...</p> */}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-700 rounded-xl p-6 border border-slate-600"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {stat.value}
                </h3>
                <p className="text-emerald-400 text-sm mt-1">{stat.change}</p>
              </div>
              <div className="p-3 bg-slate-800 rounded-lg">
                <stat.icon className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-700 rounded-xl p-6 border border-slate-600">
        <h3 className="text-xl font-semibold text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-600">
            <span className="text-slate-300">Active Shows</span>
            <span className="text-emerald-400 font-semibold">
              {dashboardData?.activeShows || 0}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-600">
            <span className="text-slate-300">Total Movies Available</span>
            <span className="text-emerald-400 font-semibold">
              {movies?.length || 0}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-300">System Status</span>
            <span className="text-green-400 font-semibold">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}