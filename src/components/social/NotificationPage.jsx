import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Heart, MessageCircle, UserPlus, Award, Loader2, Check, Trash2 } from "lucide-react";
import socialApi from "../../api/socialApi";
import GlassCard from "../ui/GlassCard";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "unread"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    socialApi.getNotifications()
      .then((res) => {
        const notifs = (res.data.notifications || []).map((n) => ({
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
        return <Heart size={14} className="text-red-500 fill-current" />;
      case "comment":
        return <MessageCircle size={14} className="text-blue-400 fill-current" />;
      case "follow":
        return <UserPlus size={14} className="text-emerald-400" />;
      case "achievement":
        return <Award size={14} className="text-yellow-500" />;
      default:
        return <Bell size={14} className="text-gray-400" />;
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
    <div className="max-w-xl mx-auto p-4 md:p-6 min-h-[calc(100vh-6rem)] space-y-6 text-white bg-[var(--color-bg-primary)]">
      
      {/* LinkedIn Style Header */}
      <div className="border-b border-white/[0.04] pb-4">
        <h1 className="text-xl font-bold tracking-tight text-white">Notifications</h1>
        
        {/* Filter Pills */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              activeTab === "all"
                ? "bg-white text-slate-950 border-white"
                : "bg-white/[0.02] text-gray-400 border-white/5 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              activeTab === "unread"
                ? "bg-white text-slate-950 border-white"
                : "bg-white/[0.02] text-gray-400 border-white/5 hover:text-white"
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Notifications List (LinkedIn Feed Style) */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Loader2 size={24} className="animate-spin text-purple-400" />
            <p className="text-xs text-gray-500">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-4xl">🎉</span>
            <p className="text-gray-500 text-xs mt-3">You're all caught up! No notifications to show.</p>
          </div>
        ) : (
          <div className="space-y-0.5 bg-slate-900/40 rounded-3xl border border-white/[0.04] overflow-hidden divide-y divide-white/[0.02]">
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
                    className={`flex items-start gap-3.5 p-4 hover:bg-white/[0.02] transition-colors relative group ${
                      isUnread ? "bg-blue-500/[0.02]" : ""
                    }`}
                  >
                    {/* LinkedIn Unread Blue Dot Marker */}
                    {isUnread && (
                      <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                    )}

                    {/* Avatar with type icon overlay */}
                    <div className="relative pl-2 flex-shrink-0">
                      <div className="w-11 h-11 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-300 rounded-full flex items-center justify-center font-extrabold text-base shadow-sm">
                        {userChar}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-slate-950 p-1.5 rounded-full border border-white/[0.04] shadow-md">
                        {getNotificationIcon(n.type)}
                      </div>
                    </div>

                    {/* Notification body context */}
                    <div className="flex-1 min-w-0 pr-10">
                      <p className="text-xs sm:text-sm text-gray-300 leading-normal">
                        <span className="font-extrabold text-white mr-1">
                          {n.triggered_by?.username || "Someone"}
                        </span>
                        {n.type === "like" && "liked your study update"}
                        {n.type === "comment" && "commented on your learning post"}
                        {n.type === "follow" && "started following your growth progress"}
                        {n.type === "achievement" && "unlocked a new growth milestone"}
                        {!["like", "comment", "follow", "achievement"].includes(n.type) && n.message}
                      </p>
                      
                      <span className="text-[10px] text-gray-600 block mt-1">
                        {n.created_at ? new Date(n.created_at).toLocaleDateString() : ""}
                      </span>
                    </div>

                    {/* Hover Actions toolbar */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isUnread && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="w-7 h-7 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center transition-all"
                          title="Mark read"
                        >
                          <Check size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(n.id)}
                        className="w-7 h-7 bg-white/[0.02] hover:bg-red-500/20 hover:text-red-400 border border-white/[0.06] text-gray-500 rounded-lg flex items-center justify-center transition-all"
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
