import { useState } from "react";
import { Play, Menu, X, Ticket, Heart } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
  useUser,
} from "@clerk/clerk-react";

export default function Navbar({ setShowBooking }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { openSignIn } = useClerk();
  const { user } = useUser();

  // If we're on the booking route, show the booking header
  if (location.pathname === "/booking" || location.pathname === "/mybooking") {
    return (
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                CinemaVibe
              </h1>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              ← Back to Movies
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Default navbar for all other routes
  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              CinemaVibe
            </h1>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex space-x-8">
            <Link
              to="/"
              className="text-white hover:text-emerald-400 transition-colors font-medium"
            >
              Home
            </Link>
            <a
              href="#"
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              Movies
            </a>
            <a
              href="#"
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              Theaters
            </a>
            <a
              href="#"
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              Releases
            </a>
            <Link
              to="/favourites"
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              Favourites
            </Link>
          </nav>

          {/* Right side (Auth/User + Mobile Menu) */}
          <div className="flex items-center space-x-4">
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
                <button
                  onClick={() => openSignIn()}
                  className="hidden md:block bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Sign In
                </button>
                <button
                  className="lg:hidden text-white"
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
          <div className="lg:hidden py-4 border-t border-slate-800">
            <nav className="flex flex-col space-y-3">
              <a
                href="#"
                className="text-white hover:text-emerald-400 transition-colors font-medium"
              >
                Home
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                Movies
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                Theaters
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                Releases
              </a>
              <Link
                to="/favourites"
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                Favourites
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
