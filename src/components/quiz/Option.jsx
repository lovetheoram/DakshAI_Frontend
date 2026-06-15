import { motion } from "framer-motion";

export default function Option({ label, text, selected, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative w-full text-left p-4 rounded-xl mb-3 font-medium
        backdrop-blur-sm border-2 transition-all duration-300
        ${selected
          ? "bg-gradient-to-r from-green-500/20 to-emerald-600/20 border-green-400 shadow-lg shadow-green-400/25"
          : "bg-gray-800/30 border-gray-600/50 hover:bg-gray-700/40 hover:border-cyan-400/70"
        }
      `}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="flex items-center">
        <motion.div
          className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold text-sm
            ${selected ? "bg-green-500 text-white shadow-lg shadow-green-500/50" : "bg-gray-700 text-gray-300 border border-gray-600"}`}
          animate={selected ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.div>
        <span className={selected ? "text-green-100" : "text-gray-200"}>{text}</span>
      </div>
      {selected && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/10 to-emerald-500/10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
}
