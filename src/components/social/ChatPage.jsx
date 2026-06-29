import { useEffect, useRef, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, Loader2 } from "lucide-react";
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
          socialApi.getMessages(userId),
          socialApi.getProfile(userId)
        ]);
        setMessages(msgRes.data.messages || []);
        setOtherUser(profileRes.data.user || { username: `User #${userId}` });
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
      setMessages((prev) => [...prev, res.data.data]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-2xl mx-auto bg-[#0b141a] border border-white/5 rounded-3xl shadow-2xl overflow-hidden text-white relative">
      
      {/* WhatsApp Styled Room Header */}
      <div className="bg-[#1f2c34] px-4 py-3 border-b border-white/[0.02] flex items-center justify-between gap-3 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/messages")}
            className="p-1 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center font-bold text-sm">
              {otherUser?.username?.charAt(0).toUpperCase() || "P"}
            </div>
            <div>
              <h3 className="font-bold text-gray-100 text-sm leading-tight">
                {otherUser?.username || "Chat Buddy"}
              </h3>
              <p className="text-[10px] text-emerald-400 mt-0.5 font-semibold">online</p>
            </div>
          </div>
        </div>

        <button className="p-1 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Messages Feed View Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#0b141a] relative">
        {/* WhatsApp Background Wallpaper Overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <Loader2 size={24} className="animate-spin text-emerald-400" />
            <p className="text-xs text-gray-500">Loading chat history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 relative z-10">
            <span className="text-4xl mb-3">💬</span>
            <h4 className="font-bold text-gray-300 text-sm">No messages here yet</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">Send a direct message to begin your WhatsApp study loop.</p>
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

      {/* WhatsApp Message Input capsule */}
      <div className="flex-shrink-0 z-10">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
