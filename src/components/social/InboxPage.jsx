// import { useEffect, useState ,useContext} from "react";
// import { useNavigate } from "react-router-dom";
// import socialApi from "../../api/socialApi";
// import { AuthContext } from "../../context/AuthContext";

// export default function InboxPage() {
//   const [inbox, setInbox] = useState([]);
//     const { user } = useContext(AuthContext);
  
//   const navigate = useNavigate();

//   useEffect(() => {
//     socialApi.getInbox().then((res) => {
//       setInbox(res.data.inbox || []);
//     });
//   }, []);

//   const getOtherUser = (msg) =>
//     msg.sender.id === user.id ? msg.receiver : msg.sender;

//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <h2 className="text-xl font-bold mb-4">Messages</h2>

//       {inbox.map((msg) => {
//         const other = getOtherUser(msg);

//         return (
//           <div
//             key={msg.id}
//             onClick={() => navigate(`/messages/${other.id}`)}
//             className="flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-100"
//           >
//             <div className="w-10 h-10 bg-gray-300 rounded-full" />
//             <div className="flex-1">
//               <div className="font-semibold">{other.username}</div>
//               <div className="text-sm text-gray-600 truncate">
//                 {msg.text}
//               </div>
//             </div>
//             <div className="text-xs text-gray-400">
//               {new Date(msg.created_at).toLocaleTimeString()}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }


// InboxPage.jsx
import { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Star, Archive, MoreVertical, MessageSquare, Clock } from "lucide-react";
import socialApi from "../../api/socialApi";
import { AuthContext } from "../../context/AuthContext";

export default function InboxPage() {
  const [inbox, setInbox] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    socialApi.getInbox().then((res) => {
      setInbox(res.data.inbox || []);
    });
  }, []);

  const getOtherUser = (msg) => {
    if (!msg) return {};
    
    // Resolve sender ID safely
    let senderId = null;
    if (msg.sender && typeof msg.sender === 'object') {
      senderId = msg.sender.id;
    } else if (typeof msg.sender === 'number' || typeof msg.sender === 'string') {
      senderId = msg.sender;
    }
    
    // Resolve receiver ID safely
    let receiverId = null;
    if (msg.receiver && typeof msg.receiver === 'object') {
      receiverId = msg.receiver.id;
    } else if (typeof msg.receiver === 'number' || typeof msg.receiver === 'string') {
      receiverId = msg.receiver;
    }

    const currentUserId = user?.id;

    // Determine the counterparty
    let otherObj = {};
    if (senderId == currentUserId) {
      otherObj = typeof msg.receiver === 'object' ? msg.receiver : { id: receiverId };
    } else {
      otherObj = typeof msg.sender === 'object' ? msg.sender : { id: senderId };
    }

    // Assign fallback username if missing
    if (otherObj && !otherObj.username) {
      otherObj.username = `User #${otherObj.id}`;
    }

    return otherObj;
  };

  const filteredInbox = inbox.filter(msg => {
    const other = getOtherUser(msg);
    const matchesSearch = other.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "unread") return matchesSearch && !msg.read;
    if (filter === "starred") return matchesSearch && msg.starred;
    return matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header with Gamification */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 mb-6 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-2xl"
              >
                💬
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Messages Hub
                </h1>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="flex items-center text-blue-600">
                    <MessageSquare size={16} className="mr-1" />
                    <span className="font-semibold">{inbox.length} conversations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-200"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 font-medium"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="starred">Starred</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors"
            >
              <Filter size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Messages List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <AnimatePresence>
          {filteredInbox.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                📭
              </motion.div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">
                {searchTerm ? "No matching conversations" : "No messages yet"}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? "Try adjusting your search terms" : "Start a conversation to see messages here"}
              </p>
            </motion.div>
          ) : (
            filteredInbox.map((msg, index) => {
              const other = getOtherUser(msg);
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4, backgroundColor: "#f8fafc" }}
                  onClick={() => navigate(`/messages/${other.id}`)}
                  className="flex items-center gap-4 p-6 border-b border-gray-100 cursor-pointer transition-all duration-200 group"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    >
                      {other.username?.charAt(0)?.toUpperCase() || "U"}
                    </motion.div>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"
                    ></motion.div>
                    
                    {/* Unread indicator */}
                    {!msg.read && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
                      ></motion.div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-gray-800 text-lg group-hover:text-purple-600 transition-colors">
                        {other.username}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {msg.starred && (
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Star size={16} fill="gold" className="text-yellow-500" />
                          </motion.div>
                        )}
                        <span className="text-xs text-gray-400 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate group-hover:text-gray-800 transition-colors">
                      {msg.text}
                    </p>
                    
                    {/* Message Stats */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        {!msg.read && (
                          <motion.span
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold"
                          >
                            New
                          </motion.span>
                        )}
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle more options
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <MoreVertical size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
