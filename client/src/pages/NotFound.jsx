import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Ghost } from "lucide-react";

export default function NotFound404() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col justify-center items-center bg-slate-900 text-white px-6 text-center"
    >
      <Ghost className="w-16 h-16 text-cyan-400 mb-4" />
      <motion.h1
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-5xl font-extrabold text-emerald-400 mb-2"
      >
        404
      </motion.h1>
      <p className="text-lg text-slate-300 mb-4">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 transition-all text-white px-5 py-2 rounded-lg text-sm font-medium"
      >
        Go Home
      </Link>
    </motion.div>
  );
}
