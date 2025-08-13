import React from "react";
import { Loader } from "lucide-react";
import useMovieStore from "../store/useMovieStore";

const Loader2 = () => {
  const { theme } = useMovieStore();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDark ? "bg-slate-900" : "bg-gray-50"
    }`}>
      <div className="flex flex-col items-center space-y-4">
        <Loader className={`w-12 h-12 animate-spin ${
          isDark ? "text-white" : "text-slate-800"
        }`} />
        {/* <p className={`text-lg font-medium ${
          isDark ? "text-white" : "text-slate-800"
        }`}>Loading...</p> */}
      </div>
    </div>
  );
};

export default Loader2;


<Loader />