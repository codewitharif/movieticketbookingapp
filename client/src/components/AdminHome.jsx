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
    theme,
  } = useMovieStore();
  
  const isDark = theme === "dark";
  
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
        <div className={`text-lg ${
          isDark ? "text-red-400" : "text-red-600"
        }`}>Error: {error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-slate-900" : "bg-gray-50"
      }`}>
        <div className="flex flex-col items-center space-y-4">
          <Loader className={`w-12 h-12  animate-spin ${
            isDark 
              ? "border-white" 
              : "border-slate-800 border-t-transparent"
          }`}></Loader>
          {/* <p className="text-white text-lg font-medium">Loading...</p> */}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className={`text-3xl font-bold mb-8 ${
        isDark ? "text-white" : "text-slate-900"
      }`}>Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl p-6 border ${
              isDark 
                ? "bg-slate-700 border-slate-600" 
                : "bg-white border-slate-200 shadow-lg"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}>{stat.title}</p>
                <h3 className={`text-2xl font-bold mt-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {stat.value}
                </h3>
                <p className="text-emerald-500 text-sm mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${
                isDark ? "bg-slate-800" : "bg-slate-50"
              }`}>
                <stat.icon className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`rounded-xl p-6 border ${
        isDark 
          ? "bg-slate-700 border-slate-600" 
          : "bg-white border-slate-200 shadow-lg"
      }`}>
        <h3 className={`text-xl font-semibold mb-4 ${
          isDark ? "text-white" : "text-slate-900"
        }`}>
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className={`flex items-center justify-between py-2 border-b ${
            isDark ? "border-slate-600" : "border-slate-200"
          }`}>
            <span className={`${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}>Active Shows</span>
            <span className="text-emerald-500 font-semibold">
              {dashboardData?.activeShows || 0}
            </span>
          </div>
          <div className={`flex items-center justify-between py-2 border-b ${
            isDark ? "border-slate-600" : "border-slate-200"
          }`}>
            <span className={`${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}>Total Movies Available</span>
            <span className="text-emerald-500 font-semibold">
              {movies?.length || 0}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className={`${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}>System Status</span>
            <span className="text-green-500 font-semibold">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}