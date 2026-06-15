import { motion } from "framer-motion";
import GlowButton from "./GlowButton";

export default function ErrorDisplay({ error, onRetry }) {
  return (
    <motion.div
      className="bg-red-900/50 border border-red-500/50 rounded-xl p-6 mb-6 backdrop-blur-sm"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center mb-4">
        <motion.div
          className="w-6 h-6 bg-red-500 rounded-full mr-3"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <h3 className="text-red-400 font-bold text-lg">Oops! Something went wrong</h3>
      </div>
      <p className="text-red-200 mb-4">{error}</p>
      {onRetry && <GlowButton variant="danger" onClick={onRetry}>Try Again</GlowButton>}
    </motion.div>
  );
}
