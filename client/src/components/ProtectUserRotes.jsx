// src/components/ProtectedRoute.js
import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedUserRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  // Wait for Clerk to load
  if (!isLoaded) return null;

  // Not signed in, redirect to sign-in
  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Signed in, allow access
  return children;
}
