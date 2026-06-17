// import { useEffect, useRef, useState,useContext } from "react";
// import { useParams } from "react-router-dom";
// import socialApi from "../../api/socialApi";
// import { AuthContext } from "../../context/AuthContext";
// import MessageBubble from "./MessageBubble";
// import MessageInput from "./MessageInput";

// export default function ChatPage() {
//   const { userId } = useParams();
//   const { user } = useContext(AuthContext);
//   const [messages, setMessages] = useState([]);
//   const bottomRef = useRef(null);

//   useEffect(() => {
//     socialApi.getMessages(userId).then((res) => {
//       setMessages(res.data.messages || []);
//     });
//   }, [userId]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async (text) => {
//     const res = await socialApi.sendMessage(userId, text);
//     setMessages((prev) => [...prev, res.data.data]);
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-xl mx-auto border">
//       <div className="p-3 border-b font-semibold">
//         Chat
//       </div>

//       <div className="flex-1 overflow-y-auto p-3 space-y-2">
//         {messages.map((msg) => (
//           <MessageBubble
//             key={msg.id}
//             message={msg}
//             isMine={msg.sender.id === user.id}
//           />
//         ))}
//         <div ref={bottomRef} />
//       </div>

//       <MessageInput onSend={handleSend} />
//     </div>
//   );
// }



// ChatPage.jsx
import { useEffect, useRef, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { ArrowLeft, MoreVertical } from "lucide-react";
import socialApi from "../../api/socialApi";
import { AuthContext } from "../../context/AuthContext";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatPage() {
  const { userId } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!userId || userId === "undefined") {
      console.warn("[WARN] ChatPage: userId is undefined or invalid!");
      return;
    }
    socialApi.getMessages(userId).then((res) => {
      setMessages(res.data.messages || []);
    }).catch(err => {
      console.error("Error fetching chat messages:", err);
    });
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text) => {
    if (!userId || userId === "undefined") {
      alert("Cannot send message: recipient ID is missing.");
      return;
    }
    try {
      const res = await socialApi.sendMessage(userId, text);
      setMessages((prev) => [...prev, res.data.data]);
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] pb-16 md:pb-0 max-w-2xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-white">
      {/* Enhanced Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/80 p-6 border-b border-white/10 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </motion.button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg border border-purple-500/20"
                >
                  U
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-950"
                ></motion.div>
              </div>
              
              <div>
                <h3 className="font-bold text-white text-lg">Chat Buddy</h3>
                <div className="flex items-center space-x-2">
                  <motion.div 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-400 rounded-full"
                  ></motion.div>
                  <span className="text-sm text-green-400 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 text-gray-300 transition-colors"
            >
              <MoreVertical size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-transparent">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center py-20"
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                💬
              </motion.div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">Start the conversation!</h3>
              <p className="text-gray-400">Send your first message to begin this amazing chat journey.</p>
            </motion.div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MessageBubble
                  message={msg}
                  isMine={msg.sender.id === user.id}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-2 text-gray-400"
            >
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-white/40 rounded-full"
                  />
                ))}
              </div>
              <span className="text-sm">Typing...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={handleSend} />
    </div>
  );
}
