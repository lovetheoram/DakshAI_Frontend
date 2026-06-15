import { motion } from "framer-motion";

export default function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;
  return (
    <div className="w-full bg-gray-800/50 rounded-full h-3 mb-6 overflow-hidden border border-cyan-500/30">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full relative"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
      </motion.div>
    </div>
  );
}
