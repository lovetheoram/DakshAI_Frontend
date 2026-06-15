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
import { motion, AnimatePresence } from "framer-motion";
import { Send, Smile, Paperclip, Mic, Gift } from "lucide-react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  const emojis = ["😀", "😍", "🤔", "👍", "❤️", "🔥", "💯", "🎉"];

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleEmojiClick = (emoji) => {
    setText(prev => prev + emoji);
    setShowEmojis(false);
  };

  return (
    <div className="bg-white border-t border-slate-200 p-4">
      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 p-4 bg-gray-50 rounded-2xl border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-600">Quick Reactions</span>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                onClick={() => setShowEmojis(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </motion.button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {emojis.map((emoji, index) => (
                <motion.button
                  key={emoji}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-2xl p-2 hover:bg-white rounded-xl transition-colors"
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-3">
        {/* Attachment Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
        >
          <Paperclip size={18} />
        </motion.button>

        {/* Input Container */}
        <div className="flex-1 relative">
          <div className="flex items-end bg-gray-100 rounded-3xl border-2 border-transparent focus-within:border-purple-300 transition-colors">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="flex-1 bg-transparent resize-none px-4 py-3 focus:outline-none text-gray-800 placeholder-gray-500 max-h-32"
              placeholder="Type your message... ✨"
              rows="1"
            />
            
            <div className="flex items-center p-2 space-x-1">
              {/* Emoji Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEmojis(!showEmojis)}
                className="p-2 text-gray-500 hover:text-yellow-500 transition-colors"
              >
                <Smile size={18} />
              </motion.button>

              {/* Gift Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-500 hover:text-purple-500 transition-colors"
              >
                <Gift size={18} />
              </motion.button>
            </div>
          </div>

          {/* Character Count */}
          {text.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -bottom-6 right-0 text-xs text-gray-400"
            >
              {text.length} characters
            </motion.div>
          )}
        </div>

        {/* Send/Voice Button */}
        {text.trim() ? (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSubmit}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Send size={18} />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onMouseDown={() => setIsRecording(true)}
            onMouseUp={() => setIsRecording(false)}
            className={`p-3 rounded-full transition-all duration-200 ${
              isRecording 
                ? "bg-red-500 text-white shadow-lg" 
                : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-500"
            }`}
          >
            <motion.div
              animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: isRecording ? Infinity : 0 }}
            >
              <Mic size={18} />
            </motion.div>
          </motion.button>
        )}
      </div>

      {/* Recording Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-3 flex items-center justify-center space-x-3 text-red-500"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="w-3 h-3 bg-red-500 rounded-full"
            />
            <span className="text-sm font-medium">Recording voice message...</span>
            <motion.div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ["4px", "16px", "4px"] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 bg-red-500 rounded-full"
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
