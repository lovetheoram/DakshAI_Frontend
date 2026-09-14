// src/components/social/ChatPage.jsx
import { useEffect, useRef, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, Loader2, Sparkles } from "lucide-react";
import socialApi from "../../api/socialApi";
import { AuthContext } from "../../context/AuthContext";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!userId || userId === "undefined") {
      console.warn("[WARN] ChatPage: userId is undefined or invalid!");
      return;
    }

    const fetchChat = async () => {
      setLoading(true);
      try {
        const [msgRes, profileRes] = await Promise.all([
          socialApi.getMessages(userId).catch(() => ({ data: { messages: [] } })),
          socialApi.getProfile(userId).catch(() => ({ data: { user: null } }))
        ]);
        setMessages(msgRes.data?.messages || msgRes.data || []);
        setOtherUser(profileRes.data?.user || { username: `Learner #${userId}` });
      } catch (err) {
        console.error("Error fetching chat/profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text) => {
    if (!userId || userId === "undefined") return;
    try {
      const res = await socialApi.sendMessage(userId, text);
      const newMsg = res.data?.data || res.data;
      if (newMsg) {
        setMessages((prev) => [...prev, newMsg]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-2xl mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/20 rounded-3xl shadow-2xl overflow-hidden text-slate-100 relative select-none">
      
      {/* Header */}
      <div className="bg-slate-900/90 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/messages")}
            className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            title="Back to messages"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
              {otherUser?.username?.charAt(0).toUpperCase() || "P"}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm leading-tight">
                {otherUser?.username || "Study Peer"}
              </h3>
              <p className="text-[10px] text-emerald-400 mt-0.5 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Peer
              </p>
            </div>
          </div>
        </div>

        <button className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-950/70 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <Loader2 size={24} className="animate-spin text-amber-400" />
            <p className="text-xs text-slate-400">Loading chat history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 relative z-10 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles size={22} />
            </div>
            <h4 className="font-bold text-white text-sm">No messages yet</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Send a direct message to start discussing concepts, formulas, and study goals with {otherUser?.username || "this peer"}.
            </p>
          </div>
        ) : (
          <div className="relative z-10 space-y-1">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isMine={msg.sender?.id === user?.id || msg.sender === user?.id}
                />
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 z-10">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
