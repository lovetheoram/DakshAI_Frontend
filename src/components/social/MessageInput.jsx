// import { useState } from "react";

// export default function MessageInput({ onSend }) {
//   const [text, setText] = useState("");

//   const handleSubmit = () => {
//     if (!text.trim()) return;
//     onSend(text);
//     setText("");
//   };

//   return (
//     <div className="flex gap-2 p-3 border-t">
//       <input
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//         className="flex-1 border rounded px-3 py-2"
//         placeholder="Type a message..."
//       />
//       <button
//         onClick={handleSubmit}
//         className="bg-blue-600 text-white px-4 rounded"
//       >
//         Send
//       </button>
//     </div>
//   );
// }



// MessageInput.jsx
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
    <div className="bg-slate-900/90 border-t border-white/10 p-4">
      <div className="flex items-center gap-3">
        {/* Input Container */}
        <div className="flex-1 relative">
          <div className="flex items-center bg-slate-950/60 rounded-3xl border border-white/10 focus-within:border-purple-500/50 transition-colors">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="flex-1 bg-transparent resize-none px-4 py-3 focus:outline-none text-white placeholder-gray-400 max-h-32 text-sm"
              placeholder="Type your message... ✨"
              rows="1"
            />
          </div>

          {/* Character Count */}
          {text.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -bottom-6 right-0 text-[10px] text-gray-400"
            >
              {text.length} characters
            </motion.div>
          )}
        </div>

        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Send size={18} />
        </motion.button>
      </div>
    </div>
  );
}
