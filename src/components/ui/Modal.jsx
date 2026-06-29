import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, children, title, maxWidth = "max-w-lg" }) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <motion.div
            className={`relative z-10 w-full ${maxWidth} glass p-0 overflow-hidden`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <h3 className="text-subheading">{title}</h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Body */}
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
