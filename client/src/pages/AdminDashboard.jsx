import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Film,
  Ticket,
  PlusCircle,
  PlusSquare,
  Sun,
  Moon,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Ticket as TicketIcon } from "lucide-react";
import useMovieStore from "../store/useMovieStore";

const AdminDashboard = () => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useMovieStore();
  
  const isDark = theme === "dark";

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/add-movie", icon: PlusCircle, label: "Add Movie" },
    { path: "/admin/add-show", icon: PlusSquare, label: "Add Show" },
    { path: "/admin/all-shows", icon: Film, label: "List Shows" },
    { path: "/admin/bookings", icon: Ticket, label: "Bookings" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`flex h-screen ${
      isDark 
        ? "bg-slate-800 text-slate-200" 
        : "bg-slate-100 text-slate-800"
    }`}>
      {/* Sidebar */}
      <aside
        className={`${
          isMobile ? "w-20" : "w-64"
        } h-full border-r transition-all duration-300 flex flex-col ${
          isDark 
            ? "bg-slate-900 border-slate-700" 
            : "bg-white border-slate-300 shadow-lg"
        }`}
      >
        <div className={`p-4 border-b flex justify-center lg:justify-start ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}>
          {isMobile ? (
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <TicketIcon className="w-5 h-5 text-white" />
            </div>
          ) : (
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              IndieShows
            </h1>
          )}
        </div>

        <nav className="p-2 lg:p-4 flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center justify-center lg:justify-start px-3 py-3 lg:px-4 rounded-lg transition-colors
                    ${
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                        : isDark
                        ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  title={item.label}
                >
                  <item.icon className="w-5 h-5 lg:mr-3" />
                  <span className={`${isMobile ? "hidden" : "block"}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Theme Toggle Button */}
        <div className={`p-2 lg:p-4 border-t ${
          isDark ? "border-slate-700" : "border-slate-200"
        }`}>
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-center lg:justify-start px-3 py-3 lg:px-4 rounded-lg transition-colors ${
              isDark
                ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? (
              <Sun className="w-5 h-5 lg:mr-3" />
            ) : (
              <Moon className="w-5 h-5 lg:mr-3" />
            )}
            <span className={`${isMobile ? "hidden" : "block"}`}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto transition-all duration-300">
        <div className="flex-1 h-full p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;