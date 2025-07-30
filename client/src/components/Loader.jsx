import React from "react";

const Loader = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        {/* <p className="text-white text-lg font-medium">Loading...</p> */}
      </div>
    </div>
  );
};

export default Loader;
