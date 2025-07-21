import { Film, Ticket, Users, TrendingUp } from "lucide-react";

export default function AdminHome() {
  const stats = [
    { title: "Total Movies", value: "24", icon: Film, change: "+3 this month" },
    {
      title: "Total Bookings",
      value: "1,284",
      icon: Ticket,
      change: "12% increase",
    },
    { title: "Active Users", value: "892", icon: Users, change: "5% increase" },
    {
      title: "Revenue",
      value: "₹2,84,500",
      icon: TrendingUp,
      change: "18% increase",
    },
  ];

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
        {/* Activity feed would go here */}
      </div>
    </div>
  );
}
