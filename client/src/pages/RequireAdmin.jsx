import { Navigate, useLocation } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import useMovieStore from "../store/useMovieStore";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const RequireAdmin = ({ children }) => {
  const location = useLocation();
  const { isSignedIn, isLoaded: isUserLoaded, user } = useUser();
  const { getToken, isLoaded: isTokenLoaded } = useAuth();
  const { fetchIsAdmin, initializeAuth, isAdmin } = useMovieStore();

  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      // If auth is not loaded yet, wait
      if (!isUserLoaded || !isTokenLoaded) {
        return;
      }

      // If user is not signed in, stop checking and redirect
      if (!isSignedIn) {
        setCheckingAdmin(false);
        return;
      }

      // If user is signed in, check admin status
      try {
        initializeAuth(user, getToken);
        const result = await fetchIsAdmin();
        console.log("Admin check result:", result);
        if (!result) {
          toast.error("Not authorized");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast.error("Error checking authorization");
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdmin();
  }, [isSignedIn, isUserLoaded, isTokenLoaded, user, getToken, fetchIsAdmin, initializeAuth]);

  // Show loader while auth is loading OR while checking admin status
  if (!isUserLoaded || !isTokenLoaded || checkingAdmin) {
    return <Loader />;
  }

  // Not signed in → redirect to admin sign in
  if (!isSignedIn) {
    return <Navigate to="/admin/sign-in" state={{ from: location }} replace />;
  }

  // Signed in but not admin → redirect to home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Signed in and is admin → allow access
  return children;
};

export default RequireAdmin;