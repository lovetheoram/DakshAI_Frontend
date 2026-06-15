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
import { ArrowLeft, Phone, Video, MoreVertical, Zap, Crown } from "lucide-react";
import socialApi from "../../api/socialApi";
import { AuthContext } from "../../context/AuthContext";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatPage() {
  const { userId } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [chatScore, setChatScore] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [chatStreak, setChatStreak] = useState(3);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!userId || userId === "undefined") {
      console.warn("[WARN] ChatPage: userId is undefined or invalid!");
      return;
    }
    socialApi.getMessages(userId).then((res) => {
      setMessages(res.data.messages || []);
      setChatScore(res.data.messages?.length * 5 || 0);
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
      setChatScore(prev => prev + 10);
      setChatStreak(prev => prev + 1);
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-gradient-to-br from-slate-50 to-indigo-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
      {/* Enhanced Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 border-b border-slate-200 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </motion.button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg"
                >
                  U
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                ></motion.div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Chat Buddy</h3>
                <div className="flex items-center space-x-2">
                  <motion.div 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-400 rounded-full"
                  ></motion.div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Chat Score */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold flex items-center"
            >
              <Zap size={14} className="mr-1" />
              {chatScore} XP
            </motion.div>

            {/* Streak Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-red-100 to-pink-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold flex items-center"
            >
              🔥 {chatStreak}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
            >
              <Phone size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
            >
              <Video size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <MoreVertical size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-white/50">
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
              <h3 className="text-xl font-bold text-gray-600 mb-2">Start the conversation!</h3>
              <p className="text-gray-500">Send your first message to begin this amazing chat journey.</p>
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
              className="flex items-center space-x-2 text-gray-500"
            >
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
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
