// src/components/social/InboxPage.jsx
import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  CheckCheck,
  MessageSquare,
  ArrowLeft,
  MoreVertical,
  UserCheck,
  UserPlus,
  Clock,
  Check,
  X,
  UserX
} from "lucide-react";
import socialApi from "../../api/socialApi";
import { AuthContext } from "../../context/AuthContext";

export default function InboxPage() {
  const [inbox, setInbox] = useState([]);
  const [connections, setConnections] = useState({
    incoming_pending: [],
    outgoing_pending: [],
    accepted: [],
    rejected: []
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" | "pending" | "rejected"
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [inboxRes, connRes] = await Promise.all([
        socialApi.getInbox().catch(() => ({ data: [] })),
        socialApi.getConnections().catch(() => ({
          data: { incoming_pending: [], outgoing_pending: [], accepted: [], rejected: [] }
        }))
      ]);

      setInbox(inboxRes.data?.inbox || inboxRes.data || []);
      if (connRes.data) {
        setConnections({
          incoming_pending: connRes.data.incoming_pending || [],
          outgoing_pending: connRes.data.outgoing_pending || [],
          accepted: connRes.data.accepted || [],
          rejected: connRes.data.rejected || []
        });
      }
    } catch (err) {
      console.error("Inbox data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Close 3-dot menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAcceptConnection = async (targetUserId) => {
    if (actionLoadingId) return;
    setActionLoadingId(targetUserId);
    try {
      await socialApi.acceptConnection(targetUserId, "accept");
      await fetchData();
    } catch (err) {
      console.error("Accept failed:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectConnection = async (targetUserId) => {
    if (actionLoadingId) return;
    setActionLoadingId(targetUserId);
    try {
      await socialApi.acceptConnection(targetUserId, "reject");
      await fetchData();
    } catch (err) {
      console.error("Reject failed:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

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
    return (
      other.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.text?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const incomingPendingCount = connections.incoming_pending?.length || 0;

  return (
    <div className="max-w-xl mx-auto min-h-[calc(100vh-6rem)] daksh-card border border-[var(--color-border)] rounded-2xl shadow-xs overflow-hidden text-[var(--color-text-primary)] flex flex-col select-none relative">
      
      {/* Header */}
      <div className="bg-[var(--color-bg-primary)] p-4 sm:p-5 border-b border-[var(--color-border)] flex-shrink-0 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/world")}
              className="p-1.5 rounded-xl hover:bg-[var(--color-gold-pale)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
              title="Back to World"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-2">
                <span>Peer Messages</span>
                {incomingPendingCount > 0 && (
                  <span className="text-[10px] font-bold text-[var(--color-gold-dark)] bg-[var(--color-gold-pale)] px-2 py-0.5 rounded-full border border-[var(--color-gold)]/30">
                    {incomingPendingCount} Pending
                  </span>
                )}
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                1-on-1 study discussions and connection requests
              </p>
            </div>
          </div>
          
          {/* 3-Dot Options Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-xl hover:bg-[var(--color-gold-pale)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
              title="Connection Options"
            >
              <MoreVertical size={18} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="absolute right-0 mt-2 w-48 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-md p-1.5 z-50 space-y-1"
                >
                  <button
                    onClick={() => {
                      setActiveTab("all");
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                      activeTab === "all"
                        ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)]"
                        : "hover:bg-[var(--color-gold-pale)]/50 text-[var(--color-text-primary)]"
                    }`}
                  >
                    <MessageSquare size={14} />
                    <span>All Chats</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("pending");
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                      activeTab === "pending"
                        ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)]"
                        : "hover:bg-[var(--color-gold-pale)]/50 text-[var(--color-text-primary)]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>Pending Requests</span>
                    </div>
                    {incomingPendingCount > 0 && (
                      <span className="text-[10px] bg-[var(--color-gold)] text-white font-bold px-1.5 py-0.2 rounded-full">
                        {incomingPendingCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("rejected");
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                      activeTab === "rejected"
                        ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)]"
                        : "hover:bg-[var(--color-gold-pale)]/50 text-[var(--color-text-primary)]"
                    }`}
                  >
                    <UserX size={14} />
                    <span>Rejected List</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tab Selection Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-[var(--color-border)]">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/40"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            All Chats
          </button>
          
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "pending"
                ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/40"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <span>Pending</span>
            {incomingPendingCount > 0 && (
              <span className="text-[10px] bg-[var(--color-gold)] text-white px-1.5 rounded-full">
                {incomingPendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "rejected"
                ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/40"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            Rejected
          </button>
        </div>

        {/* Search Bar */}
        {activeTab === "all" && (
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder="Search conversations or peers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-gold)] transition-colors"
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Loader2 size={24} className="animate-spin text-[var(--color-gold)]" />
            <p className="text-xs text-[var(--color-text-secondary)]">Loading messages & connection requests...</p>
          </div>
        ) : activeTab === "pending" ? (
          /* PENDING REQUESTS TAB */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-gold-dark)]">
                Incoming Connection Requests ({incomingPendingCount})
              </h3>
            </div>

            {incomingPendingCount === 0 ? (
              <div className="py-12 text-center border border-[var(--color-border)] rounded-2xl p-6 space-y-2">
                <Clock size={24} className="mx-auto text-[var(--color-text-secondary)] opacity-50" />
                <p className="text-xs text-[var(--color-text-secondary)]">No pending connection requests at the moment.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {connections.incoming_pending.map((peer) => (
                  <div
                    key={peer.id}
                    className="daksh-card p-4 rounded-2xl border border-[var(--color-gold)]/40 bg-[var(--color-gold-pale)]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => navigate(`/user/${peer.id}`)}
                        className="w-10 h-10 rounded-full bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/40 flex items-center justify-center font-bold text-sm shrink-0 cursor-pointer"
                      >
                        {peer.username?.charAt(0).toUpperCase() || "P"}
                      </div>
                      <div>
                        <h4
                          onClick={() => navigate(`/user/${peer.id}`)}
                          className="font-bold text-xs sm:text-sm text-[var(--color-text-primary)] hover:underline cursor-pointer"
                        >
                          {peer.username}
                        </h4>
                        <p className="text-[11px] text-[var(--color-text-secondary)]">
                          Wants to connect with you to start 1-on-1 direct messaging.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleAcceptConnection(peer.id)}
                        disabled={actionLoadingId === peer.id}
                        className="btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {actionLoadingId === peer.id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Check size={14} />
                        )}
                        <span>Accept / OK</span>
                      </button>

                      <button
                        onClick={() => handleRejectConnection(peer.id)}
                        disabled={actionLoadingId === peer.id}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:text-[var(--color-danger)] transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "rejected" ? (
          /* REJECTED LIST TAB */
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Rejected Requests ({connections.rejected?.length || 0})
            </h3>

            {connections.rejected?.length === 0 ? (
              <div className="py-12 text-center border border-[var(--color-border)] rounded-2xl p-6">
                <p className="text-xs text-[var(--color-text-secondary)]">No rejected connection requests.</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {connections.rejected.map((peer) => (
                  <div key={peer.id} className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-full flex items-center justify-center font-bold text-xs">
                        {peer.username?.charAt(0).toUpperCase() || "P"}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[var(--color-text-primary)]">{peer.username}</h4>
                        <span className="text-[10px] text-[var(--color-text-secondary)]">Declined Connection</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcceptConnection(peer.id)}
                      className="px-3 py-1 rounded-xl text-[11px] font-bold btn-gold cursor-pointer"
                    >
                      Accept Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ALL CHATS TAB */
          <div className="space-y-3">
            {/* Banner for pending requests if any exist */}
            {incomingPendingCount > 0 && (
              <div
                onClick={() => setActiveTab("pending")}
                className="daksh-card p-3 rounded-xl border border-[var(--color-gold)]/40 bg-[var(--color-gold-pale)]/40 flex items-center justify-between cursor-pointer hover:bg-[var(--color-gold-pale)]/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[var(--color-gold-dark)] text-white flex items-center justify-center text-xs font-bold">
                    {incomingPendingCount}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[var(--color-text-primary)]">
                      Incoming Connection Requests
                    </h4>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">
                      {incomingPendingCount} learner{incomingPendingCount > 1 ? "s" : ""} requested to connect with you.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[var(--color-gold-dark)] hover:underline">
                  View Requests →
                </span>
              </div>
            )}

            {filteredInbox.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 border border-[var(--color-border)] rounded-2xl p-6">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30 flex items-center justify-center text-[var(--color-gold-dark)]">
                  <MessageSquare size={22} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)]">No active conversations yet</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] max-w-xs">
                    Accept a connection request or connect with peers from World to start 1-on-1 messaging.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/world")}
                  className="btn-gold px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Explore Peer Community
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
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
                        className="flex items-center gap-3.5 p-3.5 hover:bg-[var(--color-gold-pale)]/30 rounded-xl cursor-pointer transition-colors"
                      >
                        {/* User Avatar */}
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30 text-[var(--color-gold-dark)] rounded-full flex items-center justify-center font-bold text-sm">
                            {other.username?.charAt(0).toUpperCase() || "P"}
                          </div>
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                        </div>

                        {/* Chat details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-[var(--color-text-primary)] text-xs sm:text-sm truncate">
                              {other.username}
                            </h4>
                            <span className="text-[10px] text-[var(--color-text-secondary)]">
                              {msg.created_at
                                ? new Date(msg.created_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })
                                : ""}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-0.5 gap-1">
                            <p className="text-xs text-[var(--color-text-secondary)] truncate flex items-center gap-1.5 flex-1 min-w-0">
                              {isSentByMe && (
                                <CheckCheck size={14} className="text-[var(--color-gold-dark)] shrink-0" />
                              )}
                              <span className="truncate">{msg.text}</span>
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

