import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="bg-[#111b21] border-t border-white/[0.04] p-3.5 flex items-center gap-2">
      {/* WhatsApp Capsule Input */}
      <div className="flex-1 bg-[#202c33] border border-white/[0.04] rounded-full flex items-center px-4 py-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="flex-1 bg-transparent resize-none focus:outline-none text-white placeholder-gray-500 text-sm py-2 max-h-24 scrollbar-hide"
          placeholder="Type a message"
          rows="1"
        />
      </div>

      {/* WhatsApp Circular Green Send Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleSubmit}
        className="w-11 h-11 bg-[#00a884] hover:bg-[#00c298] text-[#111b21] rounded-full flex items-center justify-center shadow-lg transition-colors flex-shrink-0"
      >
        <Send size={18} className="ml-0.5 fill-current" />
      </motion.button>
    </div>
  );
}
