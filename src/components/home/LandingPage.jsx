import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-indigo-600/6 rounded-full blur-[100px]" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <motion.div
          className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        >
          <Brain size={32} className="text-white" />
        </motion.div>

        <h1 className="text-display text-white mb-4">
          Your brain knows
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            more than you think.
          </span>
        </h1>

        <p className="text-body text-lg mb-10 max-w-sm mx-auto">
          DakshAI doesn't just test you. It reveals how you learn, where you forget, and when you're ready.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={() => navigate("/signup")}
            className="group px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Begin
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </motion.button>

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:text-white hover:bg-white/[0.08] font-medium text-sm transition-all"
          >
            Sign In
          </button>
        </div>
      </motion.div>

      {/* Subtle bottom text */}
      <motion.p
        className="absolute bottom-8 text-xs text-gray-600 tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Behavioral Learning OS
      </motion.p>
    </div>
  );
}
