import { useState, useEffect } from "react";
import { Film, Home, Search, ArrowLeft, Play, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Error404() {
  const [glitchActive, setGlitchActive] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const navigate = useNavigate();

  // Create floating movie elements
  useEffect(() => {
    const elements = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      delay: i * 0.5,
      duration: 3 + Math.random() * 2,
    }));
    setFloatingElements(elements);

    // Periodic glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleGoHome = () => {
    navigate("/");
    // console.log('Navigate to home');
  };

  const handleGoBack = () => {
    navigate(-1);
    // console.log("Go back");
  };

  const handleSearch = () => {
    // navigate('/search');
    console.log("Navigate to search");
  };

  const moviePosters = [
    "https://images.unsplash.com/photo-1489599611389-c6b01e6b5b6d?w=200&h=300&fit=crop",
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=300&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=300&fit=crop",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=300&fit=crop",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute opacity-10"
            style={{
              left: `${10 + element.id * 15}%`,
              top: `${20 + (element.id % 3) * 20}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          >
            <Film
              className="w-16 h-16 text-emerald-500 animate-pulse"
              style={{
                animation: `float ${element.duration}s ease-in-out infinite`,
                animationDelay: `${element.delay}s`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Movie Posters Floating */}
      <div className="absolute inset-0 pointer-events-none">
        {moviePosters.map((poster, index) => (
          <div
            key={index}
            className="absolute opacity-20 rotate-12 hover:rotate-0 transition-transform duration-1000"
            style={{
              left: `${5 + index * 20}%`,
              top: `${10 + (index % 2) * 60}%`,
              transform: `rotate(${(index - 2) * 15}deg)`,
              animation: `floatSlow ${4 + index}s ease-in-out infinite`,
            }}
          >
            <img
              src={poster}
              alt=""
              className="w-20 h-28 object-cover rounded-lg shadow-2xl"
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* 404 Number with Glitch Effect */}
        <div className="relative mb-8">
          <h1
            className={`text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 leading-none ${
              glitchActive ? "animate-pulse" : ""
            }`}
            style={{
              textShadow: glitchActive
                ? "2px 0 #10b981, -2px 0 #06b6d4"
                : "none",
              animation: glitchActive ? "glitch 0.3s ease-in-out" : "none",
            }}
          >
            404
          </h1>

          {/* Glitch overlay */}
          <div
            className={`absolute inset-0 text-8xl md:text-9xl font-black text-emerald-500 opacity-50 ${
              glitchActive ? "block" : "hidden"
            }`}
            style={{
              transform: "translate(2px, -2px)",
              clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
            }}
          >
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Film className="w-8 h-8 text-emerald-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Show Not Found
            </h2>
            <Film className="w-8 h-8 text-emerald-500" />
          </div>

          <p className="text-xl text-gray-300 mb-2">
            Oops! The movie you're looking for has gone off-screen.
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            It seems like this page took an intermission and never came back.
            Don't worry, there are plenty of other great shows waiting for you
            at IndieShows!
          </p>
        </div>

        {/* Popular Suggestions */}
        {/* <div className="mb-12">
          <h3 className="text-lg font-semibold text-white mb-4">
            🎬 You might be looking for:
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['Featured Movies', 'New Releases', 'Top Rated', 'Coming Soon'].map((suggestion, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/70 text-gray-300 hover:text-white rounded-full text-sm transition-all duration-300 border border-slate-700 hover:border-emerald-500"
              >
                <span className="flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>{suggestion}</span>
                </span>
              </button>
            ))}
          </div>
        </div> */}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handleGoHome}
            className="group bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <span className="flex items-center space-x-3">
              <Home className="w-5 h-5 group-hover:animate-bounce" />
              <span>Back to Home</span>
            </span>
          </button>

          <button
            onClick={handleGoBack}
            className="group bg-transparent hover:bg-slate-800/50 text-gray-400 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-gray-600 hover:border-gray-500"
          >
            <span className="flex items-center space-x-3">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </span>
          </button>
        </div>

        {/* Fun Quote */}
        <div className="mt-12 p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50">
          <Play className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
          <p className="text-gray-300 italic text-lg">
            "In the cinema of life, every wrong turn is just another scene in
            your story."
          </p>
          <p className="text-sm text-gray-500 mt-2">- IndieShows Team</p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0px) rotate(var(--rotate));
          }
          50% {
            transform: translateY(-30px) rotate(calc(var(--rotate) + 5deg));
          }
        }

        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }
      `}</style>
    </div>
  );
}
