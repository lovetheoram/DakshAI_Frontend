// src/components/social/NotificationPage.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Heart, MessageCircle, UserPlus, Award, Loader2, Check, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import socialApi from "../../api/socialApi";

export default function NotificationPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "unread"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    socialApi.getNotifications()
      .then((res) => {
        const notifs = (res.data?.notifications || res.data || []).map((n) => ({
          ...n,
          read: n.is_read,
        }));
        setNotifications(notifs);
      })
      .catch((err) => console.error("Notifications error:", err))
      .finally(() => setLoading(false));
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart size={14} className="text-red-400 fill-current" />;
      case "comment":
        return <MessageCircle size={14} className="text-blue-400 fill-current" />;
      case "follow":
        return <UserPlus size={14} className="text-emerald-400" />;
      case "achievement":
        return <Award size={14} className="text-amber-400" />;
      default:
        return <Bell size={14} className="text-amber-400" />;
    }
  };

  const markAsRead = (id) => {
    socialApi.markNotificationRead(id).catch((err) => console.error("Mark read failed:", err));
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    return true;
  });

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 min-h-[calc(100vh-6rem)] space-y-6 text-slate-100 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/world")}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-all cursor-pointer"
            title="Back to World"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Notifications</span>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                Activity
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Peer interactions and learning updates</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all border cursor-pointer ${
              activeTab === "all"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all border cursor-pointer ${
              activeTab === "unread"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Notifications Stream */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Loader2 size={24} className="animate-spin text-amber-400" />
            <p className="text-xs text-slate-400">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="daksh-card p-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center text-amber-400">
              <Bell size={22} />
            </div>
            <p className="text-white text-xs font-bold">You're all caught up!</p>
            <p className="text-slate-400 text-[11px]">No new peer notifications right now.</p>
          </div>
        ) : (
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/60 shadow-xl">
            <AnimatePresence initial={false}>
              {filteredNotifications.map((n) => {
                const userChar = n.triggered_by?.username?.charAt(0).toUpperCase() || "U";
                const isUnread = !n.read;

                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-start gap-3.5 p-4 hover:bg-slate-900/60 transition-colors relative group ${
                      isUnread ? "bg-amber-500/[0.04]" : ""
                    }`}
                  >
                    {/* Unread indicator */}
                    {isUnread && (
                      <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    )}

                    {/* Avatar */}
                    <div className="relative pl-2 flex-shrink-0">
                      <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                        {userChar}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-slate-950 p-1.5 rounded-full border border-slate-800 shadow-md">
                        {getNotificationIcon(n.type)}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0 pr-10">
                      <p className="text-xs sm:text-sm text-slate-200 leading-normal">
                        <span className="font-bold text-white mr-1">
                          {n.triggered_by?.username || "A peer"}
                        </span>
                        {n.type === "like" && "liked your concept update"}
                        {n.type === "comment" && "commented on your learning post"}
                        {n.type === "follow" && "started following your growth progress"}
                        {n.type === "achievement" && "unlocked a new growth milestone"}
                        {!["like", "comment", "follow", "achievement"].includes(n.type) && n.message}
                      </p>
                      
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {n.created_at ? new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isUnread && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="w-7 h-7 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                          title="Mark read"
                        >
                          <Check size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(n.id)}
                        className="w-7 h-7 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 border border-slate-700 text-slate-400 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
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
