import { useState } from "react";
import Navbar from "./components/Navbar";
import HeroSlider from "./components/HeroSlider";
import MovieListing from "./components/MovieListing";
import WhyChooseUs from "./components/WhyChooseUs";
import Footer from "./components/Footer";
import BookingPage from "./pages/BookingPage";
import { featuredMovies, movies } from "./store/useMovieStore";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Test from "./components/Test";
import MyBookings from "./pages/MyBookings";
import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";
import BookingsList from "./components/BookingList";
import AdminHome from "./components/AdminHome";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        <Route path="/booking/:id" element={
          <>
            <Navbar />
            <BookingPage />
            <Footer />
          </>
        } />
        <Route path="/mybooking" element={
          <>
            <Navbar />
            <MyBookings />
            <Footer />
          </>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          <Route path="add-movie" element={<AddMovie />} />
          <Route path="movies" element={<MoviesList />} />
          <Route path="bookings" element={<BookingsList />} />
        </Route>
      </Routes>
    </div>
  );
}