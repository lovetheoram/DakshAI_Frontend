import { motion } from "framer-motion";

export default function GameLoader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <motion.div
        className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mb-4"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <motion.p
        className="text-white font-semibold text-lg"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        {text}
      </motion.p>
    </div>
  );
}
