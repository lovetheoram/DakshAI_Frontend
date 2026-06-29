import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";

export default function MessageBubble({ message, isMine }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full my-1.5 ${isMine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-[70%] px-3.5 py-2.5 rounded-2xl shadow-md text-sm text-white ${
          isMine
            ? "bg-[#056162] rounded-tr-none text-white ml-12"
            : "bg-[#262d31] rounded-tl-none mr-12 border border-white/[0.02]"
        }`}
      >
        <p className="leading-relaxed break-words whitespace-pre-wrap pr-10 pb-1">
          {message.text}
        </p>

        {/* WhatsApp style bottom-right timestamp and checkmarks */}
        <div className="absolute bottom-1 right-2 flex items-center space-x-1 select-none">
          <span className="text-[9px] text-white/50">
            {message.created_at
              ? new Date(message.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : ""}
          </span>
          {isMine && (
            <CheckCheck size={12} className="text-emerald-400" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
