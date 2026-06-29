import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Star, CheckCheck } from "lucide-react";
import socialApi from "../../api/socialApi";
import { AuthContext } from "../../context/AuthContext";

export default function InboxPage() {
  const [inbox, setInbox] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "starred"
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    socialApi.getInbox()
      .then((res) => {
        setInbox(res.data.inbox || []);
      })
      .catch((err) => console.error("Inbox load error:", err))
      .finally(() => setLoading(false));
  }, []);

  const getOtherUser = (msg) => {
    if (!msg) return {};
    const senderId = typeof msg.sender === "object" ? msg.sender.id : msg.sender;
    const receiverId = typeof msg.receiver === "object" ? msg.receiver.id : msg.receiver;
    const currentUserId = user?.id;

    let otherObj = {};
    if (senderId === currentUserId) {
      otherObj = typeof msg.receiver === "object" ? msg.receiver : { id: receiverId };
    } else {
      otherObj = typeof msg.sender === "object" ? msg.sender : { id: senderId };
    }

    if (otherObj && !otherObj.username) {
      otherObj.username = `User #${otherObj.id}`;
    }
    return otherObj;
  };

  const filteredInbox = inbox.filter((msg) => {
    const other = getOtherUser(msg);
    const matchesSearch =
      other.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.text?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "starred") return matchesSearch && msg.starred;
    return matchesSearch;
  });

  return (
    <div className="max-w-xl mx-auto min-h-[calc(100vh-6rem)] bg-[#0b141a] border border-white/5 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col">
      
      {/* WhatsApp Styled Green/Dark Header */}
      <div className="bg-[#1f2c34] p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4 px-1">
          <h1 className="text-xl font-bold text-gray-100">WhatsApp Chat</h1>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${
                filter === "all"
                  ? "bg-[#00a884] text-[#111b21] border-[#00a884]"
                  : "bg-white/5 text-gray-400 border-white/5 hover:text-white"
              }`}
            >
              Chats
            </button>
            <button
              onClick={() => setFilter("starred")}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all flex items-center gap-1 ${
                filter === "starred"
                  ? "bg-[#00a884] text-[#111b21] border-[#00a884]"
                  : "bg-white/5 text-gray-400 border-white/5 hover:text-white"
              }`}
            >
              <Star size={10} className="fill-current" />
              Starred
            </button>
          </div>
        </div>

        {/* WhatsApp search bar */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#202c33] border border-transparent rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:bg-[#2a3942] transition-colors"
          />
        </div>
      </div>

      {/* Chats List Section */}
      <div className="flex-1 overflow-y-auto bg-[#0b141a]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Loader2 size={24} className="animate-spin text-emerald-400" />
            <p className="text-xs text-gray-500">Loading your chats...</p>
          </div>
        ) : filteredInbox.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <span className="text-4xl mb-3">💬</span>
            <h3 className="text-sm font-bold text-gray-400">No conversations found</h3>
            <p className="text-xs text-gray-500 mt-1">Start messaging peers from the suggestions tab in community.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            <AnimatePresence>
              {filteredInbox.map((msg) => {
                const other = getOtherUser(msg);
                const isSentByMe = msg.sender?.id === user?.id || msg.sender === user?.id;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => navigate(`/messages/${other.id}`)}
                    className="flex items-center gap-3.5 p-4 hover:bg-[#202c33]/40 cursor-pointer transition-colors"
                  >
                    {/* User Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-300 rounded-full flex items-center justify-center font-bold text-base shadow-md">
                        {other.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-[#0b141a]" />
                    </div>

                    {/* Chat details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-200 text-sm truncate">{other.username}</h4>
                        <span className="text-[10px] text-gray-500">
                          {msg.created_at
                            ? new Date(msg.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })
                            : ""}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-1 gap-1">
                        <p className="text-xs text-gray-400 truncate flex items-center gap-1.5 flex-1 min-w-0">
                          {isSentByMe && (
                            <CheckCheck size={14} className="text-emerald-400 flex-shrink-0" />
                          )}
                          <span className="truncate">{msg.text}</span>
                        </p>

                        {/* Starred indicators */}
                        {msg.starred && (
                          <Star size={10} className="fill-current text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
