import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function Drawer({ isOpen, onClose, children, side = "right", title }) {
  const isRight = side === "right";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            className={`absolute top-0 bottom-0 ${isRight ? "right-0" : "left-0"} w-full max-w-sm bg-slate-900/95 backdrop-blur-xl border-${isRight ? "l" : "r"} border-white/[0.06] overflow-y-auto`}
            initial={{ x: isRight ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRight ? "100%" : "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                <h3 className="text-subheading">{title}</h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
