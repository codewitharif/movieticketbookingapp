import { create } from "zustand";

// Featured Movies and Regular Movies could also be in the store if they're fetched
export const featuredMovies = [
  // ... same featuredMovies data as before
  {
    id: 1,
    title: "Guardians of the Galaxy Vol. 3",
    genre: "Action • Adventure • Comedy",
    rating: 8.4,
    duration: "2h 30min",
    poster:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1200&h=600&fit=crop",
    description:
      "The beloved Guardians embark on their final adventure in this epic conclusion to the trilogy.",
    price: 15,
  },
  {
    id: 2,
    title: "Spider-Man: Across the Spider-Verse",
    genre: "Animation • Action • Adventure",
    rating: 9.0,
    duration: "2h 20min",
    poster:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop",
    description:
      "Miles Morales catapults across the Multiverse in this stunning animated masterpiece.",
    price: 14,
  },
  {
    id: 3,
    title: "John Wick: Chapter 4",
    genre: "Action • Thriller",
    rating: 8.7,
    duration: "2h 49min",
    poster:
      "https://images.unsplash.com/photo-1489599511215-5ce4ce8da93d?w=1200&h=600&fit=crop",
    description:
      "John Wick faces his most deadly adversaries in this action-packed finale.",
    price: 16,
  },
];
export const movies = [
  {
    id: 4,
    title: "Avatar: The Way of Water",
    genre: "Sci-Fi • Drama",
    rating: 8.1,
    duration: "3h 12min",
    poster:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    price: 12,
    times: ["10:00", "13:30", "17:00", "20:30"],
  },
  {
    id: 5,
    title: "Top Gun: Maverick",
    genre: "Action • Drama",
    rating: 8.7,
    duration: "2h 11min",
    poster:
      "https://images.unsplash.com/photo-1489599511215-5ce4ce8da93d?w=400&h=600&fit=crop",
    price: 15,
    times: ["11:15", "14:45", "18:15", "21:45"],
  },
  {
    id: 6,
    title: "Black Panther: Wakanda Forever",
    genre: "Action • Adventure",
    rating: 7.3,
    duration: "2h 41min",
    poster:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
    price: 13,
    times: ["12:00", "15:30", "19:00", "22:30"],
  },
  {
    id: 7,
    title: "The Batman",
    genre: "Action • Crime • Drama",
    rating: 8.2,
    duration: "2h 56min",
    poster:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
    price: 14,
    times: ["13:00", "16:30", "20:00", "23:30"],
  },
  {
    id: 8,
    title: "Doctor Strange 2",
    genre: "Action • Fantasy",
    rating: 7.8,
    duration: "2h 6min",
    poster:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    price: 13,
    times: ["11:00", "14:00", "17:30", "21:00"],
  },
  {
    id: 9,
    title: "Minions: The Rise of Gru",
    genre: "Animation • Comedy",
    rating: 7.5,
    duration: "1h 27min",
    poster:
      "https://images.unsplash.com/photo-1489599511215-5ce4ce8da93d?w=400&h=600&fit=crop",
    price: 11,
    times: ["10:30", "13:00", "15:30", "18:00"],
  },
];



const useMovieStore = create((set) => ({
  // State
  selectedMovie: null,
  showBooking: false,
  selectedSeats: [],
  selectedTime: "",
  selectedDate: "Today",
  currentSlide: 0,

    // NEW: Add bookings array (initialized with your sample booking)
  bookings: [
    {
      id: "b1234567",
      movie: {
        title: "Dune: Part Two",
        poster: "https://example.com/dune-poster.jpg",
        genre: "Sci-Fi/Adventure",
      },
      date: "Mar 15, 2024",
      time: "7:30 PM",
      theater: "CinemaVibe PVR, Mumbai",
      seats: ["E5", "E6"],
      total: 1200,
    }
  ],

  // Actions
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  setShowBooking: (show) => set({ showBooking: show }),
  setSelectedSeats: (seats) => set({ selectedSeats: seats }),
  setSelectedTime: (time) => set({ selectedTime: time }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setCurrentSlide: (slide) => set({ currentSlide: slide }),

  // Derived actions
  handleBookNow: (movie) => {
    console.log("movie is clicked handlebook now called", movie);
    set({
      selectedMovie: movie,
      showBooking: true,
      selectedSeats: [], // Reset seats when booking new movie
      selectedTime: "", // Reset time selection
      selectedDate: "Today", // Reset date selection
    });
  },

  handleBackToMovies: () => {
    set({ showBooking: false, selectedMovie: null, selectedSeats: [] });
  },

  // Seat selection logic
  handleSeatClick: (seat) => {
    set((state) => {
      if (["A5", "A6", "B3", "C7", "C8", "D5", "E2", "F9", "G4"].includes(seat))
        return {};

      return {
        selectedSeats: state.selectedSeats.includes(seat)
          ? state.selectedSeats.filter((s) => s !== seat)
          : [...state.selectedSeats, seat],
      };
    });
  },

  // Generate seats (could be memoized)
  generateSeats: () => {
    const seats = [];
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    rows.forEach((row) => {
      for (let i = 1; i <= 12; i++) {
        seats.push(`${row}${i}`);
      }
    });
    return seats;
  },

  // Get seat status
  getSeatStatus: (seat) => {
    const { selectedSeats } = useMovieStore.getState();
    if (["A5", "A6", "B3", "C7", "C8", "D5", "E2", "F9", "G4"].includes(seat))
      return "booked";
    if (selectedSeats.includes(seat)) return "selected";
    return "available";
  },

  // Get seat color
  getSeatColor: (status) => {
    switch (status) {
      case "booked":
        return "bg-red-500 cursor-not-allowed";
      case "selected":
        return "bg-emerald-500 shadow-lg";
      default:
        return "bg-slate-600 hover:bg-emerald-400 cursor-pointer";
    }
  },
}));

export default useMovieStore;
