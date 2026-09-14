// src/components/social/MessageBubble.jsx
import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";

export default function MessageBubble({ message, isMine }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full my-1.5 ${isMine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-[75%] px-4 py-2.5 rounded-2xl shadow-md text-xs sm:text-sm ${
          isMine
            ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-tr-none shadow-amber-950/40 ml-10"
            : "bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none mr-10 shadow-slate-950/60"
        }`}
      >
        <p className="leading-relaxed break-words whitespace-pre-wrap pr-12 pb-1 font-normal">
          {message.text}
        </p>

        {/* Bottom-right timestamp & checkmarks */}
        <div className="absolute bottom-1 right-2.5 flex items-center space-x-1 select-none">
          <span className="text-[9px] opacity-70">
            {message.created_at
              ? new Date(message.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : ""}
          </span>
          {isMine && (
            <CheckCheck size={12} className="text-amber-200" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
