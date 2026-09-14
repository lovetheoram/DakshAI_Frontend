// src/components/social/InboxPage.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Star, CheckCheck, MessageSquare, ArrowLeft } from "lucide-react";
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
        setInbox(res.data?.inbox || res.data || []);
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
      otherObj.username = `Learner #${otherObj.id || 'Peer'}`;
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
    <div className="max-w-xl mx-auto min-h-[calc(100vh-6rem)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/20 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col select-none">
      
      {/* Header */}
      <div className="bg-slate-900/90 p-5 border-b border-slate-800 flex-shrink-0 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/world")}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-all cursor-pointer"
              title="Back to World"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Peer Messages</span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Direct Chat
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">1-on-1 study discussions and mentorship</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-slate-800/60 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              All Chats
            </button>
            <button
              onClick={() => setFilter("starred")}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1 cursor-pointer ${
                filter === "starred"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-slate-800/60 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <Star size={10} className="fill-current text-amber-400" />
              Starred
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations or peers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Chats List Section */}
      <div className="flex-1 overflow-y-auto bg-slate-950/60">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Loader2 size={24} className="animate-spin text-amber-400" />
            <p className="text-xs text-slate-400">Loading study conversations...</p>
          </div>
        ) : filteredInbox.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <MessageSquare size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">No active conversations</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Start a conversation by visiting the Recommended Peers tab or accepting a help ticket in World.
              </p>
            </div>
            <button
              onClick={() => navigate("/world")}
              className="btn-gold px-4 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              Explore Peer Community
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
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
                    className="flex items-center gap-3.5 p-4 hover:bg-slate-900/60 cursor-pointer transition-colors"
                  >
                    {/* User Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-11 h-11 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                        {other.username?.charAt(0).toUpperCase() || "P"}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
                    </div>

                    {/* Chat details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-100 text-xs sm:text-sm truncate">{other.username}</h4>
                        <span className="text-[10px] text-slate-400">
                          {msg.created_at
                            ? new Date(msg.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : ""}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-1 gap-1">
                        <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 flex-1 min-w-0">
                          {isSentByMe && (
                            <CheckCheck size={14} className="text-amber-400 flex-shrink-0" />
                          )}
                          <span className="truncate">{msg.text}</span>
                        </p>

                        {/* Starred indicators */}
                        {msg.starred && (
                          <Star size={10} className="fill-current text-amber-400 flex-shrink-0" />
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
