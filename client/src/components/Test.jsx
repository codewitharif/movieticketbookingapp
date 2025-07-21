import { useState, useEffect } from 'react';
import { Star, Calendar, Clock, MapPin, Users, CreditCard, Heart, Play, Menu, X, ChevronLeft, ChevronRight, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function MyComp() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('Today');

  const featuredMovies = [
    {
      id: 1,
      title: "Guardians of the Galaxy Vol. 3",
      genre: "Action • Adventure • Comedy",
      rating: 8.4,
      duration: "2h 30min",
      poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1200&h=600&fit=crop",
      description: "The beloved Guardians embark on their final adventure in this epic conclusion to the trilogy.",
      price: 15
    },
    {
      id: 2,
      title: "Spider-Man: Across the Spider-Verse",
      genre: "Animation • Action • Adventure",
      rating: 9.0,
      duration: "2h 20min",
      poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop",
      description: "Miles Morales catapults across the Multiverse in this stunning animated masterpiece.",
      price: 14
    },
    {
      id: 3,
      title: "John Wick: Chapter 4",
      genre: "Action • Thriller",
      rating: 8.7,
      duration: "2h 49min",
      poster: "https://images.unsplash.com/photo-1489599511215-5ce4ce8da93d?w=1200&h=600&fit=crop",
      description: "John Wick faces his most deadly adversaries in this action-packed finale.",
      price: 16
    }
  ];

  const movies = [
    {
      id: 4,
      title: "Avatar: The Way of Water",
      genre: "Sci-Fi • Drama",
      rating: 8.1,
      duration: "3h 12min",
      poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
      price: 12,
      times: ["10:00", "13:30", "17:00", "20:30"]
    },
    {
      id: 5,
      title: "Top Gun: Maverick",
      genre: "Action • Drama",
      rating: 8.7,
      duration: "2h 11min",
      poster: "https://images.unsplash.com/photo-1489599511215-5ce4ce8da93d?w=400&h=600&fit=crop",
      price: 15,
      times: ["11:15", "14:45", "18:15", "21:45"]
    },
    {
      id: 6,
      title: "Black Panther: Wakanda Forever",
      genre: "Action • Adventure",
      rating: 7.3,
      duration: "2h 41min",
      poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
      price: 13,
      times: ["12:00", "15:30", "19:00", "22:30"]
    },
    {
      id: 7,
      title: "The Batman",
      genre: "Action • Crime • Drama",
      rating: 8.2,
      duration: "2h 56min",
      poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
      price: 14,
      times: ["13:00", "16:30", "20:00", "23:30"]
    },
    {
      id: 8,
      title: "Doctor Strange 2",
      genre: "Action • Fantasy",
      rating: 7.8,
      duration: "2h 6min",
      poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
      price: 13,
      times: ["11:00", "14:00", "17:30", "21:00"]
    },
    {
      id: 9,
      title: "Minions: The Rise of Gru",
      genre: "Animation • Comedy",
      rating: 7.5,
      duration: "1h 27min",
      poster: "https://images.unsplash.com/photo-1489599511215-5ce4ce8da93d?w=400&h=600&fit=crop",
      price: 11,
      times: ["10:30", "13:00", "15:30", "18:00"]
    }
  ];

  const dates = ['Today', 'Tomorrow', 'Thu 21', 'Fri 22', 'Sat 23', 'Sun 24'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const generateSeats = () => {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    rows.forEach(row => {
      for (let i = 1; i <= 12; i++) {
        seats.push(`${row}${i}`);
      }
    });
    return seats;
  };

  const seats = generateSeats();
  const bookedSeats = ['A5', 'A6', 'B3', 'C7', 'C8', 'D5', 'E2', 'F9', 'G4'];

  const handleSeatClick = (seat) => {
    if (bookedSeats.includes(seat)) return;
    
    setSelectedSeats(prev => 
      prev.includes(seat) 
        ? prev.filter(s => s !== seat)
        : [...prev, seat]
    );
  };

  const getSeatStatus = (seat) => {
    if (bookedSeats.includes(seat)) return 'booked';
    if (selectedSeats.includes(seat)) return 'selected';
    return 'available';
  };

  const getSeatColor = (status) => {
    switch (status) {
      case 'booked': return 'bg-red-500 cursor-not-allowed';
      case 'selected': return 'bg-emerald-500 shadow-lg';
      default: return 'bg-slate-600 hover:bg-emerald-400 cursor-pointer';
    }
  };

  if (showBooking && selectedMovie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
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
                onClick={() => setShowBooking(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                ← Back to Movies
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Movie Info */}
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 mb-8 border border-slate-700">
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
              <img 
                src={selectedMovie.poster} 
                alt={selectedMovie.title}
                className="w-32 h-48 rounded-xl object-cover shadow-lg"
              />
              <div className="text-white flex-1">
                <h2 className="text-3xl font-bold mb-2">{selectedMovie.title}</h2>
                <p className="text-slate-300 mb-4">{selectedMovie.genre}</p>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <span className="flex items-center bg-yellow-500/20 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    {selectedMovie.rating}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-slate-400" />
                    {selectedMovie.duration}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                    CinemaVibe Multiplex
                  </span>
                </div>

                {/* Date Selection */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Select Date</h3>
                  <div className="flex flex-wrap gap-2">
                    {dates.map(date => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedDate === date 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Select Time</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.times?.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedTime === time 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seat Selection */}
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-slate-700">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">Choose Your Seats</h3>
            
            {/* Screen */}
            <div className="relative mb-12">
              <div className="h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full mb-4"></div>
              <p className="text-center text-slate-400 text-sm font-medium tracking-widest">S C R E E N</p>
            </div>

            {/* Seats Grid */}
            <div className="mb-8 max-w-4xl mx-auto">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(row => (
                <div key={row} className="flex items-center justify-center mb-3">
                  <div className="w-6 text-slate-400 text-sm font-medium">{row}</div>
                  <div className="flex gap-2 mx-4">
                    {Array.from({length: 12}, (_, i) => i + 1).map(seatNum => {
                      const seat = `${row}${seatNum}`;
                      const status = getSeatStatus(seat);
                      return (
                        <button
                          key={seat}
                          onClick={() => handleSeatClick(seat)}
                          disabled={status === 'booked'}
                          className={`w-8 h-8 rounded-md text-xs font-semibold transition-all duration-200 transform hover:scale-110 ${getSeatColor(status)}`}
                        >
                          {seatNum}
                        </button>
                      );
                    })}
                  </div>
                  <div className="w-6 text-slate-400 text-sm font-medium">{row}</div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-slate-600 rounded-md"></div>
                <span className="text-slate-300 text-sm">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-emerald-500 rounded-md"></div>
                <span className="text-slate-300 text-sm">Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-500 rounded-md"></div>
                <span className="text-slate-300 text-sm">Booked</span>
              </div>
            </div>

            {/* Booking Summary */}
            {selectedSeats.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl p-6 text-white shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-xl font-bold mb-2">Booking Summary</h4>
                    <p className="text-emerald-100 mb-1">Movie: {selectedMovie.title}</p>
                    <p className="text-emerald-100 mb-1">Date: {selectedDate} • Time: {selectedTime}</p>
                    <p className="text-emerald-100">Seats: {selectedSeats.join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold mb-1">${selectedMovie.price * selectedSeats.length}</p>
                    <p className="text-emerald-100">{selectedSeats.length} tickets × ${selectedMovie.price}</p>
                  </div>
                </div>
                <button className="w-full bg-white text-emerald-600 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-colors flex items-center justify-center space-x-3 shadow-lg">
                  <CreditCard className="w-6 h-6" />
                  <span>Proceed to Payment</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
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
            
            <nav className="hidden lg:flex space-x-8">
              <a href="#" className="text-white hover:text-emerald-400 transition-colors font-medium">Movies</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors font-medium">Theaters</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors font-medium">Events</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors font-medium">Food & Drinks</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors font-medium">Offers</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="hidden md:block bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
                Sign In
              </button>
              <button 
                className="lg:hidden text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-800">
              <nav className="flex flex-col space-y-3">
                <a href="#" className="text-white hover:text-emerald-400 transition-colors font-medium">Movies</a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors font-medium">Theaters</a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors font-medium">Events</a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors font-medium">Food & Drinks</a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors font-medium">Offers</a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Slider */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        {featuredMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${movie.poster})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 h-full flex items-center">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                  {movie.title}
                </h2>
                <p className="text-xl text-slate-300 mb-4">{movie.description}</p>
                <div className="flex items-center space-x-6 mb-8">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-semibold">{movie.rating}</span>
                  </div>
                  <span className="text-slate-300">{movie.genre}</span>
                  <span className="text-slate-300">{movie.duration}</span>
                </div>
                <div className="flex space-x-4">
                  <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Book Tickets
                  </button>
                  <button className="bg-slate-800/80 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-700 transition-colors border border-slate-700">
                    Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-emerald-400' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Now Showing Section */}
      <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">Now Showing</h3>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Discover the latest blockbusters and indie favorites playing at CinemaVibe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {movies.map(movie => (
              <div key={movie.id} className="group cursor-pointer">
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                  <div className="relative">
                    <img 
                      src={movie.poster} 
                      alt={movie.title}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <button className="bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-red-500/80 transition-colors">
                        <Heart className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <div className="absolute top-4 left-4">
                      <div className="bg-yellow-500/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                        <Star className="w-4 h-4 text-black" />
                        <span className="text-black font-semibold text-sm">{movie.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-slate-400 text-sm mb-4">{movie.genre}</p>
                    <p className="text-slate-400 text-sm mb-4 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {movie.duration}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {movie.times.map(time => (
                        <button 
                          key={time}
                          className="bg-slate-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-emerald-400">${movie.price}</span>
                        <span className="text-slate-400 text-sm ml-1">per ticket</span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedMovie(movie);
                          setShowBooking(true);
                        }}
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">Why Choose CinemaVibe?</h3>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Experience cinema like never before with our premium facilities and services
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-semibold text-white mb-4">Premium Comfort</h4>
              <p className="text-slate-400 leading-relaxed">
                Enjoy our luxury recliner seats with extra legroom, personal side tables, and premium sound systems for the ultimate comfort experience.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-semibold text-white mb-4">Easy Booking</h4>
              <p className="text-slate-400 leading-relaxed">
                Book your tickets instantly through our intuitive interface with secure payment options and real-time seat selection.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-semibold text-white mb-4">Prime Locations</h4>
              <p className="text-slate-400 leading-relaxed">
                Find us in convenient locations across the city with ample parking, easy public transport access, and nearby dining options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  CinemaVibe
                </h4>
              </div>
              <p className="text-slate-400 mb-4">
                Your premier destination for the latest movies and unforgettable cinema experiences.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Now Showing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Coming Soon</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Theaters</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Events</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Gift Cards</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">Support</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Feedback</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">Contact Info</h5>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-400">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-400">info@cinemavibe.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-400">123 Cinema Street, Movie City</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-400">
              © 2025 CinemaVibe. All rights reserved. | Designed with ❤️ for movie lovers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}