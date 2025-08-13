import {
  Play,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import useMovieStore from "../store/useMovieStore"; // Import your Zustand store

export default function Footer() {
  // Get theme from Zustand store
  const { theme } = useMovieStore();
  const isDark = theme === "dark";

  return (
    <footer className={`border-t ${
      isDark 
        ? "bg-slate-900 border-slate-800" 
        : "bg-white border-slate-200"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                IndieShows
              </h4>
            </div>
            <p className={`mb-4 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}>
              Your premier destination for the latest movies and unforgettable
              cinema experiences.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className={`hover:text-emerald-400 transition-colors ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className={`hover:text-emerald-400 transition-colors ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className={`hover:text-emerald-400 transition-colors ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className={`hover:text-emerald-400 transition-colors ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h5 className={`font-semibold mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Quick Links
            </h5>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className={`transition-colors ${
                    isDark 
                      ? "text-slate-400 hover:text-white" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Now Showing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`transition-colors ${
                    isDark 
                      ? "text-slate-400 hover:text-white" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Coming Soon
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`transition-colors ${
                    isDark 
                      ? "text-slate-400 hover:text-white" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Theaters
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`transition-colors ${
                    isDark 
                      ? "text-slate-400 hover:text-white" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`transition-colors ${
                    isDark 
                      ? "text-slate-400 hover:text-white" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Gift Cards
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className={`font-semibold mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Support
            </h5>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className={`transition-colors ${
                    isDark 
                      ? "text-slate-400 hover:text-white" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`transition-colors ${
                    isDark 
                      ? "text-slate-400 hover:text-white" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`transition-colors ${
                    isDark 
                      ? "text-slate-400 hover:text-white" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Feedback
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`transition-colors ${
                    isDark 
                      ? "text-slate-400 hover:text-white" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`transition-colors ${
                    isDark 
                      ? "text-slate-400 hover:text-white" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className={`font-semibold mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Contact Info
            </h5>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className={`${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}>
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className={`${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}>
                  info@indieshows.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className={`${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}>
                  Movie City, Bhopal
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`border-t pt-8 text-center ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}>
          <p className={`${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            © 2025 IndieShows. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}