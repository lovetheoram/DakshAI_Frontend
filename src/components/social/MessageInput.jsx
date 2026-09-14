// src/components/social/MessageInput.jsx
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
    <div className="bg-slate-900/90 border-t border-slate-800 p-3.5 flex items-center gap-2">
      {/* Input Field */}
      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl flex items-center px-4 py-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="flex-1 bg-transparent resize-none focus:outline-none text-slate-100 placeholder-slate-500 text-xs sm:text-sm py-2 max-h-24 scrollbar-hide font-medium"
          placeholder="Type a message..."
          rows="1"
        />
      </div>

      {/* Gold Send Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        disabled={!text.trim()}
        className="w-11 h-11 btn-gold text-slate-950 rounded-2xl flex items-center justify-center shadow-lg transition-colors flex-shrink-0 cursor-pointer disabled:opacity-40"
      >
        <Send size={16} className="ml-0.5" />
      </motion.button>
    </div>
  );
}
