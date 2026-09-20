// src/components/social/ChatPage.jsx
import { useEffect, useRef, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles, Lock, UserPlus, Clock, Check, X } from "lucide-react";
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
  const [connectionStatus, setConnectionStatus] = useState("none"); // "none" | "pending" | "incoming_pending" | "accepted" | "rejected"
  const [actionLoading, setActionLoading] = useState(false);
  const bottomRef = useRef(null);

  const fetchChat = async () => {
    if (!userId || userId === "undefined") return;
    setLoading(true);
    try {
      // 1. Fetch Profile first to determine connection status
      const profileRes = await socialApi.getProfile(userId).catch(() => ({ data: null }));
      
      let rawUser = null;
      let connStatus = "none";

      if (profileRes.data) {
        const raw = profileRes.data.profile || profileRes.data;
        rawUser = raw.user || raw;
        connStatus = raw.connection_status || (raw.user?.is_following ? "accepted" : "none");
        setOtherUser(rawUser);
        setConnectionStatus(connStatus);
      }

      // 2. Fetch Messages if connected or check for 403 status details
      if (connStatus === "accepted") {
        const msgRes = await socialApi.getMessages(userId);
        setMessages(msgRes.data?.messages || msgRes.data || []);
      } else {
        try {
          const msgRes = await socialApi.getMessages(userId);
          setMessages(msgRes.data?.messages || msgRes.data || []);
          setConnectionStatus("accepted");
        } catch (err) {
          if (err.response?.status === 403) {
            const apiConnStatus = err.response.data?.connection_status;
            if (apiConnStatus) {
              setConnectionStatus(apiConnStatus);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error fetching chat/profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      if (err.response?.status === 403) {
        setConnectionStatus("none");
      }
      console.error("Error sending message:", err);
    }
  };

  const handleConnect = async () => {
    if (actionLoading || !userId) return;
    setActionLoading(true);
    try {
      const res = await socialApi.followUser(userId);
      setConnectionStatus(res.data?.connection_status || "pending");
      fetchChat();
    } catch (err) {
      console.error("Connection failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async () => {
    if (actionLoading || !userId) return;
    setActionLoading(true);
    try {
      const res = await socialApi.acceptConnection(userId, "accept");
      setConnectionStatus(res.data?.connection_status || "accepted");
      fetchChat();
    } catch (err) {
      console.error("Accept failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (actionLoading || !userId) return;
    setActionLoading(true);
    try {
      const res = await socialApi.acceptConnection(userId, "reject");
      setConnectionStatus(res.data?.connection_status || "rejected");
    } catch (err) {
      console.error("Reject failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const isConnected = connectionStatus === "accepted";
  const isPending = connectionStatus === "pending";
  const isIncomingPending = connectionStatus === "incoming_pending";

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-2xl mx-auto daksh-card border border-[var(--color-border)] rounded-2xl shadow-xs overflow-hidden select-none relative">
      
      {/* Header */}
      <div className="bg-[var(--color-bg-primary)] px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between gap-3 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-[var(--color-gold-pale)] rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            title="Back to profile"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div
              onClick={() => userId && navigate(`/user/${userId}`)}
              className="w-9 h-9 rounded-full bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/30 flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer"
            >
              {otherUser?.username?.charAt(0).toUpperCase() || "P"}
            </div>
            <div>
              <h3
                onClick={() => userId && navigate(`/user/${userId}`)}
                className="font-bold text-[var(--color-text-primary)] text-sm leading-tight cursor-pointer hover:underline"
              >
                {otherUser?.username || `Learner #${userId}`}
              </h3>
              <p className="text-[10px] text-[var(--color-gold-dark)] font-semibold">
                {isConnected
                  ? "Connected Peer"
                  : isPending
                  ? "Connection Pending"
                  : isIncomingPending
                  ? "Request Received"
                  : "Not Connected"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 relative flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <Loader2 size={20} className="animate-spin text-[var(--color-gold)]" />
            <p className="text-xs text-[var(--color-text-secondary)]">Loading chat history...</p>
          </div>
        ) : isIncomingPending ? (
          /* INCOMING REQUEST BANNER: Receiver gets request on chat page & clicks OK! */
          <div className="daksh-card p-6 rounded-2xl border border-[var(--color-gold)]/40 bg-[var(--color-gold-pale)]/30 max-w-md mx-auto text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/40 flex items-center justify-center text-[var(--color-gold-dark)] mx-auto">
              <UserPlus size={22} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[var(--color-text-primary)] text-sm">
                Connection Request
              </h4>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                <span className="font-bold text-[var(--color-text-primary)]">{otherUser?.username || "This learner"}</span> wants to connect with you on DakshAI. Click <span className="font-bold text-[var(--color-gold-dark)]">OK / Accept</span> to enable direct 1-on-1 messaging.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleAccept}
                disabled={actionLoading}
                className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {actionLoading ? <Loader2 size={13} className="animate-spin" /> : <Check size={15} />}
                <span>OK / Accept Connection</span>
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:text-[var(--color-danger)] transition-all cursor-pointer disabled:opacity-50"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : isPending ? (
          /* OUTGOING REQUEST PENDING */
          <div className="daksh-card p-6 rounded-2xl border border-[var(--color-border)] max-w-md mx-auto text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30 flex items-center justify-center text-[var(--color-gold-dark)] mx-auto">
              <Clock size={20} className="animate-pulse" />
            </div>
            <h4 className="font-bold text-[var(--color-text-primary)] text-sm">Request Sent</h4>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Your connection request has been sent to <span className="font-semibold text-[var(--color-text-primary)]">{otherUser?.username || "this learner"}</span>. Messaging will unlock as soon as they click OK on their chat page.
            </p>
            <span className="inline-block text-[11px] font-bold text-[var(--color-gold-dark)] bg-[var(--color-gold-pale)] px-3 py-1 rounded-full border border-[var(--color-gold)]/30">
              ⏳ Waiting for {otherUser?.username || "peer"} to accept
            </span>
          </div>
        ) : !isConnected ? (
          /* NOT CONNECTED AT ALL */
          <div className="daksh-card p-6 rounded-2xl border border-[var(--color-border)] max-w-md mx-auto text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30 flex items-center justify-center text-[var(--color-gold-dark)] mx-auto">
              <Lock size={20} />
            </div>
            <h4 className="font-bold text-[var(--color-text-primary)] text-sm">Connection Required</h4>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              You must connect with <span className="font-semibold text-[var(--color-text-primary)]">{otherUser?.username || "this learner"}</span> before exchanging direct messages.
            </p>
            <button
              onClick={handleConnect}
              disabled={actionLoading}
              className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {actionLoading ? <Loader2 size={13} className="animate-spin" /> : <UserPlus size={14} />}
              <span>Send Connection Request</span>
            </button>
          </div>
        ) : messages.length === 0 ? (
          /* CONNECTED, BUT NO MESSAGES YET */
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
            <div className="w-10 h-10 rounded-full bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30 flex items-center justify-center text-[var(--color-gold-dark)]">
              <Sparkles size={18} />
            </div>
            <h4 className="font-bold text-[var(--color-text-primary)] text-sm">You are connected!</h4>
            <p className="text-xs text-[var(--color-text-secondary)] max-w-xs">
              Send a direct message to start discussing concepts, formulas, and study goals with {otherUser?.username || "this peer"}.
            </p>
          </div>
        ) : (
          /* CONNECTED WITH MESSAGES */
          <div className="space-y-1 w-full h-full flex flex-col justify-end">
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

      {/* Message Input Bar (Enabled only when connected) */}
      {isConnected && (
        <div className="shrink-0 z-10">
          <MessageInput onSend={handleSend} />
        </div>
      )}
    </div>
  );
}

