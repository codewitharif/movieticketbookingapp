import { useState } from "react";
import { Play, Menu, X, Ticket, Heart, Sun, Moon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
  useUser,
} from "@clerk/clerk-react";
import useMovieStore from "../store/useMovieStore"; // Import your Zustand store

export default function Navbar({ setShowBooking }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get theme from Zustand store
  const { theme, toggleTheme } = useMovieStore();
  const isDark = theme === "dark";

  const { openSignIn } = useClerk();
  const { user } = useUser();

  // If we're on the booking route, show the booking header
  if (location.pathname === "/booking" || location.pathname === "/mybooking") {
    return (
      <header className={`${
        isDark 
          ? "bg-slate-900/90 border-slate-800" 
          : "bg-white/90 border-slate-200"
      } backdrop-blur-md border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                IndieShows
              </h1>
            </div>
            <button
              onClick={() => navigate("/")}
              className={`${
                isDark 
                  ? "bg-slate-800 hover:bg-slate-700 text-white" 
                  : "bg-slate-100 hover:bg-slate-200 text-slate-900"
              } px-6 py-2 rounded-lg transition-colors`}
            >
              ← Back to Movies
            </button>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`${
                isDark 
                  ? "bg-slate-800 hover:bg-slate-700 text-white" 
                  : "bg-slate-100 hover:bg-slate-200 text-slate-900"
              } p-2 rounded-lg transition-colors`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Default navbar for all other routes
  return (
    <header className={`${
      isDark 
        ? "bg-slate-900/95 border-slate-800" 
        : "bg-white/95 border-slate-200"
    } backdrop-blur-md border-b sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <Link to={"/"}>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                IndieShows
              </h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex space-x-8">
            <Link
              to="/"
              className={`${
                isDark ? "text-white" : "text-slate-900"
              } hover:text-emerald-400 transition-colors font-medium`}
            >
              Home
            </Link>
            <a
              href="#"
              className={`${
                isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              } transition-colors font-medium`}
            >
              Movies
            </a>

            <Link
              to="/mybookings"
              className={`${
                isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              } transition-colors font-medium`}
            >
              Bookings
            </Link>
            <Link
              to="/favourites"
              className={`${
                isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              } transition-colors font-medium`}
            >
              Favourites
            </Link>
          </nav>

          {/* Right side (Auth/User + Mobile Menu) */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button - Always visible */}
            <button
              onClick={toggleTheme}
              className={`${
                isDark 
                  ? "bg-slate-800 hover:bg-slate-700 text-white" 
                  : "bg-slate-100 hover:bg-slate-200 text-slate-900"
              } p-2 rounded-lg transition-colors`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="My Bookings"
                      labelIcon={<Ticket width={15} />}
                      onClick={() => navigate("/mybookings")}
                    />
                  </UserButton.MenuItems>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="My Favourites"
                      labelIcon={<Heart width={15} />}
                      onClick={() => navigate("/favourites")}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            ) : (
              <>
                {/* Sign In button only for large screens and up */}
                <button
                  onClick={() => openSignIn()}
                  className="hidden lg:block bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Sign In
                </button>

                {/* Hamburger icon only for small screens */}
                <button
                  className={`lg:hidden ml-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`lg:hidden py-4 border-t ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}>
            <nav className="flex flex-col space-y-3">
              <a
                href="#"
                className={`${
                  isDark ? "text-white" : "text-slate-900"
                } hover:text-emerald-400 transition-colors font-medium`}
              >
                Home
              </a>
              <a
                href="#"
                className={`${
                  isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                } transition-colors font-medium`}
              >
                Movies
              </a>

              <Link
                to="/mybookings"
                className={`${
                  isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                } transition-colors font-medium`}
              >
                Bookings
              </Link>
              <Link
                to="/favourites"
                className={`${
                  isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                } transition-colors font-medium`}
              >
                Favourites
              </Link>
              {!user && (
                <button
                  onClick={() => openSignIn()}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all text-left"
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}