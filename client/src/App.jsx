import { useState } from "react";
import Navbar from "./components/Navbar";
import HeroSlider from "./components/HeroSlider";
import MovieListing from "./components/MovieListing";
import WhyChooseUs from "./components/WhyChooseUs";
import Footer from "./components/Footer";
import BookingPage from "./pages/BookingPage";
import { featuredMovies } from "./store/useMovieStore";
import Home from "./pages/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import Test from "./components/Test";
import MyBookings from "./pages/MyBookings";
import AddMovie from "./components/AddMovie";
import BookingsList from "./components/BookingList";
import AdminHome from "./components/AdminHome";
import AdminDashboard from "./pages/AdminDashboard";
import { useUser, SignIn, Protect } from "@clerk/clerk-react";

// Store
import useMovieStore from "./store/useMovieStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RequireAdmin from "./pages/RequireAdmin";
import AddShow from "./components/AddShow";
import ListShow from "./components/ListShow";
import Favourites from "./components/Favourites";
import UserBookings from "./components/UserBookings";
import Loading from "./components/Loading";
import ProtectedUserRoute from "./components/ProtectUserRotes";
import Error404 from "./components/Error";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <ToastContainer />
      <Routes>
        {/* Public Routes */}

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/booking/:id"
          element={
            <>
              <Navbar />
              <BookingPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/admin/sign-in"
          element={
            <div className="flex justify-center items-center min-h-screen">
              <SignIn
                routing="path"
                path="/admin/sign-in"
                redirectUrl="/admin"
              />
            </div>
          }
        />
        <Route
          path="/sign-in"
          element={
            <div className="flex justify-center items-center min-h-screen">
              <SignIn routing="path" path="/sign-in" redirectUrl="/" />
            </div>
          }
        />

        <Route
          path="/favourites"
          element={
            <ProtectedUserRoute>
              <>
                <Navbar />
                <Favourites />
                <Footer />
              </>
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/mybookings"
          element={
            <ProtectedUserRoute>
              <>
                <Navbar />
                <UserBookings />
                <Footer />
              </>
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/loading"
          element={
            <>
              <Navbar />
              <Loading />
              <Footer />
            </>
          }
        />

        <Route path="*" element={<Error404 />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="add-movie" element={<AddMovie />} />
          <Route path="add-show" element={<AddShow />} />
          <Route path="all-shows" element={<ListShow />} />
          <Route path="bookings" element={<BookingsList />} />
        </Route>
      </Routes>
    </div>
  );
}
