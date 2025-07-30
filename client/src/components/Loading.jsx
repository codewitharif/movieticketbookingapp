import React from "react";
import { Loader } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const { next_url } = useParams();
  const navigate = useNavigate();
  if (next_url) {
    setTimeout(() => {
      navigate("/" + next_url);
    }, 7000);
  }
  return (
    <div className="min-h-screen bg-slate-700 rounded-2xl p-8 mb-6 border border-slate-600 text-center">
      <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-400" />
      <p className="text-slate-300">Processing payment...</p>
    </div>
  );
};

export default Loading;
