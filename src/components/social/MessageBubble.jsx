// export default function MessageBubble({ message, isMine }) {
//   return (
//     <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
//       <div
//         className={`px-3 py-2 rounded-lg max-w-xs text-sm ${
//           isMine
//             ? "bg-blue-500 text-white"
//             : "bg-gray-200 text-gray-800"
//         }`}
//       >
//         {message.text}
//         <div className="text-[10px] opacity-70 mt-1">
//           {new Date(message.created_at).toLocaleTimeString()}
//         </div>
//       </div>
//     </div>
//   );
// }


// MessageBubble.jsx
import { motion, AnimatePresence } from "framer-motion";

import { Check, CheckCheck, Heart, Reply } from "lucide-react";
import { useState } from "react";

export default function MessageBubble({ message, isMine }) {
  const [liked, setLiked] = useState(false);
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`flex w-full my-3 ${isMine ? "justify-end" : "justify-start"}`}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
    >
      <div className={`flex items-end space-x-2 max-w-xs ${isMine ? "flex-row-reverse space-x-reverse" : ""}`}>
        {!isMine && (
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold mb-1"
          >
            U
          </motion.div>
        )}

        <div className="relative group">
          <motion.div
            whileHover={{ y: -2 }}
            className={`
              px-4 py-3 rounded-2xl shadow-lg relative overflow-hidden
              ${isMine 
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none" 
                : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
              }
            `}
          >
            {/* Background Pattern for own messages */}
            {isMine && (
              <motion.div
                animate={{ x: ["0%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            )}

            <div className="relative z-10">
              <p className="text-sm leading-relaxed">{message.text}</p>
              
              <div className={`flex items-center justify-between mt-2 ${isMine ? "text-blue-100" : "text-gray-500"}`}>
                <p className="text-[10px] opacity-70">
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                
                {isMine && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CheckCheck size={14} className="text-blue-200" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Reaction indicator */}
            {liked && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-1"
              >
                <Heart size={12} fill="white" className="text-white" />
              </motion.div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className={`absolute top-0 ${isMine ? "-left-20" : "-right-20"} flex space-x-1 bg-white rounded-full shadow-lg border p-1`}
              >
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setLiked(!liked)}
                  className={`p-2 rounded-full ${liked ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500"} transition-colors`}
                >
                  <Heart size={12} fill={liked ? "currentColor" : "none"} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-500 transition-colors"
                >
                  <Reply size={12} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
