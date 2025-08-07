import { create } from "zustand";
import axios from "axios";

// base url of server
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// dummy Featured Movies and Regular Movies to handle frontend temporarily
export const featuredMovies = [
  {
    id: 1,
    title: "Pushpa 2: The Rule",
    genre: "Action • Crime • Drama",
    rating: 8.7,
    duration: "2h 45min",
    poster:
      "https://imgs.search.brave.com/2cDLqv2Q9OtC60_aDFV9sxbO1WIjlRoxRDV9WSrDAWw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvOTU1/NzQ4Ny5qcGc",
    description:
      "Pushpa returns stronger and more ruthless as he faces off against Bhanwar Singh in a high-stakes battle for supremacy.",
    price: 18,
    booking_link:
      "https://movieticketbookingapp.vercel.app/booking/688dd7959811fd57f2d7aeb5",
    trailer_link: "https://youtu.be/1kVK0MZlbI4",
  },
  {
    id: 2,
    title: "Baahubali: The Beginning",
    genre: "Action • Drama • Fantasy",
    rating: 8.0,
    duration: "2h 39min",
    poster:
      "https://imgs.search.brave.com/Happ1WcW1T7_FOjvcyGf3giVE-EcaUwyPISjUrQWhYU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDgyMzk4/NzguanBn",
    description:
      "Shivudu, a daring young man, discovers his royal lineage and begins a journey to rescue a queen and reclaim a lost kingdom.",
    price: 12,
    booking_link:
      "https://movieticketbookingapp.vercel.app/booking/6884d328ba044c7e6635fa0f",
    trailer_link: "https://youtu.be/VdafjyFK3ko",
  },

  {
    id: 3,
    title: "Stree 2",
    genre: "Comedy • Horror • Thriller",
    rating: 7.9,
    duration: "2h 10min",
    poster:
      "https://imgs.search.brave.com/FFLuRn3Escrs5V6Rva5LAo5GUbqFfA5DriKcx6HGaic/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuaGluZHVzdGFu/dGltZXMuY29tL2lt/Zy8yMDI0LzA4LzE1/LzU1MHgzMDkvc3Ry/ZWVfMl9yZXZpZXdf/c2hyYWRkaGFfa2Fw/b29yX3Jhamt1bW1h/cl9yYW9fMTcyMzY5/MjczNDgxN18xNzIz/NjkyNzM1MDA5Lmpw/Zw",
    description:
      "Chanderi is haunted once again as Stree returns. The gang reunites to uncover the mystery behind her reappearance.",
    price: 13,
    booking_link:
      "https://movieticketbookingapp.vercel.app/booking/688dd8c69811fd57f2d7aeb7",
    trailer_link: "https://youtu.be/VlvOgk5BHS4",
  },
  {
    id: 4,
    title: "Jawan",
    genre: "Action • Thriller • Drama",
    rating: 7.9,
    duration: "2h 49min",
    poster:
      "https://imgs.search.brave.com/-EdIXfYEMXWJW4_6SvD_ex8PLDieM_ggwl5n4tR5HF0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1QlkySmhPVE14/WkdZdFpHVTNNUzAw/WlRsbExUbGpNakV0/WXpWalpUSXhaV05t/TTJSbFhrRXlYa0Zx/Y0djQC5qcGc",
    description:
      "A man driven by a personal vendetta sets out to correct the wrongs in society, taking on a corrupt system with a daring plan.",
    price: 17,

    booking_link:
      "https://movieticketbookingapp.vercel.app/booking/688dd8c69811fd57f2d7aeb7",
    trailer_link: "https://youtu.be/k8YiqM0Y-78",
  },
  {
    id: 5,
    title: "Sitaare Zameen Par",
    genre: "Sports • Drama • Comedy",
    rating: 8.5,
    duration: "2h 38min",
    poster:
      "https://imgs.search.brave.com/Tpo6yakug7dFqst8f04gwHc6ww_0PNPnmluv5dTUcd8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/a29pbW9pLmNvbS93/cC1jb250ZW50L25l/dy1nYWxsZXJpZXMv/MjAyNS8wNi9zaXRh/YXJlLXphbWVlbi1w/YXItbW92aWUtcmV2/aWV3LTIuanBn",
    description:
      "A suspended basketball coach is ordered to train a team of players with disabilities, leading to an emotional journey of growth, inclusion, and triumph.",
    price: 20,
    booking_link:
      "https://movieticketbookingapp.vercel.app/booking/687e59a185de1426df651c06",
    trailer_link: "https://youtu.be/YH6k5weqwy8",
  },
];

const useMovieStore = create((set, get) => ({
  // Main States - Real API data
  isAdmin: false,
  movies: [], // Real movies from API
  shows: [], // Real shows from API
  favoriteMovies: [],
  adminBookings: [], // Real bookings for admin to see
  userBookings: [], // User bookings
  occupiedSeats: {}, // Real occupied seats data
  loading: false,
  error: null,

  // Auth related - Fixed hooks usage
  user: null,
  token: null,

  // Dashboard specific data
  dashboardData: {
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: 0,
    totalUser: 0,
  },

  selectedShow: null,
  movieShows: [],
  moviesWithShows: [],

  // Dummy states for handling frontend
  selectedMovie: null,
  showBooking: false,
  selectedSeats: [],
  selectedTime: "",
  selectedDate: "Today",
  currentSlide: 0,

  // Initialize auth data (call this in component useEffect)
  initializeAuth: (user, getToken) => {
    console.log("my token is ", getToken);
    set({ user, getToken: getToken });
  },

  // Real Actions for API calls
  setIsAdmin: (admin) => set({ isAdmin: admin }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Fetch movies from API
  fetchMovies: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get("/api/movies");

      if (data.success) {
        set({ movies: data.movies, loading: false });
      } else {
        set({ error: data.message, loading: false });
      }
    } catch (error) {
      console.log("Error fetching movies:", error);
      set({ error: "Failed to fetch movies", loading: false });
    }
  },
  // Fetch single movie by ID
fetchMovieById: async (movieId) => {
  try {
    set({ loading: true, error: null });
    const { data } = await axios.get(`/api/movies/${movieId}`);

    if (data.success) {
      set({ loading: false });
      return { success: true, movie: data.movie };
    } else {
      set({ error: data.message, loading: false });
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.log("Error fetching movie:", error);
    set({ error: "Failed to fetch movie", loading: false });
    return { success: false, message: "Failed to fetch movie" };
  }
},

// In your useMovieStore
// fetchMovieById: async (movieId) => {
//   try {
//     set({ loading: true, error: null });
//     const { data } = await axios.get(`/api/movies/${movieId}`);

//     if (data.success) {
//       set({ loading: false });
//       return { success: true, movie: data.movie };
//     } else {
//       set({ error: data.message, loading: false });
//       return { success: false, message: data.message };
//     }
//   } catch (error) {
//     console.log("Error fetching movie:", error);
//     set({ error: "Failed to fetch movie", loading: false });
//     return { success: false, message: "Failed to fetch movie" };
//   }
// },

// setSelectedMovie: (movie) => set({ selectedMovie: movie }),

  fetchShows: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(`/api/shows/`);

      if (data.success) {
        set({ shows: data.shows, loading: false });
      } else {
        set({ error: data.message, loading: false });
      }
    } catch (error) {
      console.log("Error fetching shows:", error);
      set({ error: "Failed to fetch shows", loading: false });
    }
  },

  // Add this function to your store actions
  fetchMovieShows: async (movieId) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(`/api/shows/movie/${movieId}`);

      if (data.success) {
        set({ movieShows: data.shows, loading: false });
        return { success: true, shows: data.shows };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.log("Error fetching movie shows:", error);
      set({ error: "Failed to fetch movie shows", loading: false });
      return { success: false, message: "Failed to fetch movie shows" };
    }
  },

  fetchMoviesWithShows: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(`/api/movies/movies-with-shows`);

      if (data.success) {
        set({ moviesWithShows: data.movies, loading: false });
        return { success: true, shows: data.movies };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.log("Error fetching movie with shows:", error);
      set({ error: "Failed to fetch movie with shows", loading: false });
      return { success: false, message: "Failed to fetch movie with shows" };
    }
  },

  // Helper function to group shows by date
  groupShowsByDate: () => {
    const { movieShows } = get();
    const grouped = {};
    movieShows.forEach((show) => {
      const dateKey = new Date(show.showDate).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(show);
    });
    return grouped;
  },

  // Fetch dashboard data
  fetchDashboardData: async () => {
    try {
      set({ loading: true, error: null });
      const { getToken } = get();

      if (!getToken) {
        throw new Error("Authentication required");
      }

      const token = await getToken();
      const { data } = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        set({
          dashboardData: data.dashboardData,
          loading: false,
        });
        return { success: true, data: data.data };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
      set({ error: "Failed to fetch dashboard data", loading: false });
      return { success: false, message: "Failed to fetch dashboard data" };
    }
  },

  fetchFavoriteMovies: async (getToken) => {
    try {
      set({ loading: true, error: null });
      const token = await getToken();

      if (!token) {
        throw new Error("Authentication required");
      }

      const { data } = await axios.get(`/api/user/favourites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        set({ favoriteMovies: data.movies, loading: false });
        console.log("success");
      } else {
        set({ error: data.message, loading: false });
      }
    } catch (error) {
      console.log("Error fetching favorite movies:", error);
      set({ error: "Failed to fetch favorite movies", loading: false });
    }
  },

  addFavorite: (id) =>
    set((state) => ({ favoriteMovies: [...state.favoriteMovies, id] })),
  removeFavorite: (id) =>
    set((state) => ({
      favoriteMovies: state.favoriteMovies.filter((movieId) => movieId !== id),
    })),
  // isFavorite: (id) => get().favoriteMovies.includes(id),
  isFavorite: (id) => get().favoriteMovies.some((m) => m._id === id),

  // Toggle favourite for a movie
  toggleFavorite: async (movieId, token) => {
    try {
      set({ loading: true, error: null });
      // const token = await getToken();

      const res = await axios.post(
        "/api/user/update-favourites",
        { movieId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        console.log("you toggled succesfully");
        get().fetchFavoriteMovies(token);
      }
    } catch (error) {
      console.log("Error toggling favorite:", error);
    }
  },

  // Fetch shows for a specific movie
  fetchShowsByMovie: async (movieId) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(`/api/shows/movie/${movieId}`);
      if (data.success) {
        set({ shows: data.shows, loading: false });
      } else {
        set({ error: data.message, loading: false });
      }
    } catch (error) {
      console.log("Error fetching shows:", error);
      set({ error: "Failed to fetch shows", loading: false });
    }
  },

  // Fetch occupied seats for a show
  fetchOccupiedSeats: async (showId) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(`/api/bookings/seats/${showId}`);

      if (data.success) {
        set({ occupiedSeats: data.occupiedSeats, loading: false });
        return { success: true, occupiedSeats: data.occupiedSeats };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.log("Error fetching occupied seats:", error);
      set({ error: "Failed to fetch occupied seats", loading: false });
      return { success: false, message: "Failed to fetch occupied seats" };
    }
  },

  // Create booking - Updated to match SeatSelection component
  createBooking: async (bookingData) => {
    try {
      set({ loading: true, error: null });
      const { getToken } = get();

      if (!getToken) {
        throw new Error("Authentication required");
      }

      const token = await getToken();
      const { data } = await axios.post("/api/bookings/create", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (data.success) {
        set({ loading: false });
        // Clear selected seats after successful booking
        set({ selectedSeats: [] });
        return {
          success: true,
          booking: data.booking,
          bookingId: data.bookingId,
        };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.log("Error creating booking:", error);
      set({ error: "Failed to create booking", loading: false });
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create booking",
      };
    }
  },

  fetchAdminBookings: async () => {
    try {
      set({ loading: true, error: null });
      const { getToken, user } = get();

      if (!getToken || !user) {
        throw new Error("Authentication required");
      }

      const token = await getToken();
      const { data } = await axios.get(`/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        set({ adminBookings: data.bookings, loading: false });
      } else {
        set({ error: data.message, loading: false });
      }
    } catch (error) {
      console.log("Error fetching admin bookings:", error);
      set({ error: "Failed to fetch bookings", loading: false });
    }
  },

  // Fetch user bookings
  fetchUserBookings: async () => {
    try {
      set({ loading: true, error: null });
      const { getToken, user } = get();

      if (!getToken || !user) {
        throw new Error("Authentication required");
      }

      const token = await getToken();
      const { data } = await axios.get(`/api/bookings/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        set({ userBookings: data.bookings, loading: false });
        return { success: true, bookings: data.bookings };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.log("Error fetching user bookings:", error);
      set({ error: "Failed to fetch bookings", loading: false });
      return { success: false, message: "Failed to fetch bookings" };
    }
  },

  // Fetch booking by ID - for confirmation page
  fetchBookingById: async (bookingId) => {
    try {
      set({ loading: true, error: null });
      const { getToken } = get();

      if (!getToken) {
        throw new Error("Authentication required");
      }

      const token = await getToken();
      const { data } = await axios.get(`/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        set({ loading: false });
        return { success: true, booking: data.booking };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.log("Error fetching booking:", error);
      set({ error: "Failed to fetch booking", loading: false });
      return { success: false, message: "Failed to fetch booking" };
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    try {
      set({ loading: true, error: null });
      const { getToken } = get();

      if (!getToken) {
        throw new Error("Authentication required");
      }

      const token = await getToken();
      const { data } = await axios.put(
        `/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        set({ loading: false });
        // Refresh user bookings
        get().fetchUserBookings();
        return { success: true, message: data.message };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.log("Error cancelling booking:", error);
      set({ error: "Failed to cancel booking", loading: false });
      return { success: false, message: "Failed to cancel booking" };
    }
  },

  // Check if user is admin
  fetchIsAdmin: async () => {
    console.log("Starting admin check...");
    try {
      const { getToken } = get();

      if (!getToken) {
        console.log("No token available");
        return false; // Explicit return
      }

      const token = await getToken();
      console.log("Token acquired, making API call...");

      const { data } = await axios.get("/api/admin/is-admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", data);
      set({ isAdmin: data.isAdmin, loading: false });
      return data.isAdmin; // Return value for immediate use
    } catch (error) {
      console.error("Admin check failed:", error);
      set({ isAdmin: false, loading: false });
      return false;
    }
  },

  setSelectedShow: (show) => set({ selectedShow: show }),

  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  setShowBooking: (show) => set({ showBooking: show }),
  setSelectedSeats: (seats) => set({ selectedSeats: seats }),
  setSelectedTime: (time) => set({ selectedTime: time }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setCurrentSlide: (slide) => set({ currentSlide: slide }),

  // Enhanced handleBookNow with real API integration
  handleBookNow: async (movie) => {
    console.log("Movie is clicked, handleBookNow called", movie);

    set({
      selectedMovie: movie,
      showBooking: true,
      selectedSeats: [],
      selectedTime: "",
      selectedDate: "Today",
    });

    // Fetch shows for this movie
    // await get().fetchShowsByMovie(movie._id || movie.id);
  },
  handleSelectedMovie: async (movie) => {
    console.log("Movie is clicked, handleSelectedMovie called", movie);

    set({
      selectedMovie: movie,
      showBooking: true,
      selectedSeats: [],
      selectedTime: "",
      selectedDate: "Today",
    });

    // Fetch shows for this movie
    // await get().fetchShowsByMovie(movie._id || movie.id);
  },

  handleShowSelection: async (show) => {
    console.log("Show is clicked, handleShowSelection called", show);

    set({
      selectedShow: show,
      // selectedMovie:show,
      showBooking: true,
      selectedSeats: [],
      selectedTime: "",
      selectedDate: "Today",
    });
    // Fetch shows for this movie
    // await get().fetchShowsByMovie(movie._id);
  },

  // Helper function to get unique movies from shows
  getUniqueMoviesFromShows: () => {
    const { shows } = get();
    if (!shows || shows.length === 0) return [];

    const movieMap = new Map();

    shows.forEach((show) => {
      const movie = show.movie;
      if (movie && !movieMap.has(movie._id)) {
        movieMap.set(movie._id, {
          ...movie,
          shows: shows.filter((s) => s.movie._id === movie._id),
        });
      }
    });

    return Array.from(movieMap.values());
  },

  handleBackToMovies: () => {
    set({
      showBooking: false,
      selectedMovie: null,
      selectedSeats: [],
      shows: [],
      occupiedSeats: {},
    });
  },
  handleBackToShows: () => {
    set({
      showBooking: false,
      selectedShow: null,
      //  selectedMovie: null,
      selectedSeats: [],
      shows: [],
      occupiedSeats: {},
    });
  },

  // Enhanced seat selection with real occupied seats
  handleSeatClick: (seat) => {
    set((state) => {
      // Check if seat is occupied from real API data
      const { occupiedSeats, selectedTime } = state;
      const isOccupied = occupiedSeats[selectedTime]?.[seat];

      if (isOccupied) {
        return {}; // Don't allow selection of occupied seats
      }

      return {
        selectedSeats: state.selectedSeats.includes(seat)
          ? state.selectedSeats.filter((s) => s !== seat)
          : [...state.selectedSeats, seat],
      };
    });
  },

  // Generate seats
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

  // Enhanced seat status with real data
  getSeatStatus: (seat) => {
    const { selectedSeats, occupiedSeats, selectedTime } = get();

    // Check real occupied seats from API
    if (occupiedSeats[selectedTime]?.[seat]) {
      return "booked";
    }

    if (selectedSeats.includes(seat)) {
      return "selected";
    }

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
