// import { useEffect, useState } from "react";
// import socialApi from "../../api/socialApi";

// export default function NotificationPage() {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     socialApi.getNotifications().then(res => {
//       setNotifications(res.data.notifications || []);
//     });
//   }, []);

//   if (!notifications.length) {
//     return (
//       <div className="bg-white p-4 shadow rounded">
//         <h2 className="text-xl font-bold mb-4">Notifications</h2>
//         <p className="text-gray-600">No notifications yet.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white p-4 shadow rounded">
//       <h2 className="text-xl font-bold mb-4">Notifications</h2>

//       {notifications.map(n => (
//         <div key={n.id} className="flex justify-between py-2 border-b">
//           <span>{n.message}</span>
//         </div>
//       ))}
//     </div>
//   );
// }



// NotificationPage.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Heart, MessageCircle, UserPlus, Award, X, Check } from "lucide-react";
import socialApi from "../../api/socialApi";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    socialApi.getNotifications().then(res => {
      const notifs = (res.data.notifications || []).map(n => ({
        ...n,
        read: n.is_read
      }));
      setNotifications(notifs);
    });
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like": return <Heart size={16} className="text-red-500" />;
      case "comment": return <MessageCircle size={16} className="text-blue-500" />;
      case "follow": return <UserPlus size={16} className="text-green-500" />;
      case "achievement": return <Award size={16} className="text-yellow-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  const markAsRead = (id) => {
    socialApi.markNotificationRead(id).catch(err => console.error("Mark read failed:", err));
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    return true;
  });

  if (!notifications.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto p-6 min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
            <div className="flex items-center space-x-4">
              <motion.div 
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl"
              >
                🔔
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-purple-100">Stay updated with your activity</p>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">All caught up!</h3>
            <p className="text-gray-500">No notifications yet. Keep engaging to see updates here.</p>
          </div>
        </div>
      </motion.div>
    );
  }

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
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl"
              >
                🔔
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="flex items-center text-blue-600">
                    <Bell size={16} className="mr-1" />
                    <span className="font-semibold">{notifications.length} notifications</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
              </select>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold"
              >
                Mark All Read
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <AnimatePresence>
          {filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4, backgroundColor: "#f8fafc" }}
              className={`flex items-center justify-between p-6 border-b border-gray-100 group cursor-pointer transition-all duration-200 ${
                !notification.read ? "bg-blue-50/50" : ""
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="p-3 bg-gray-100 rounded-full"
                >
                  {getNotificationIcon(notification.type)}
                </motion.div>

                {/* Content */}
                <div>
                  <p className={`text-sm ${!notification.read ? "font-semibold text-gray-800" : "text-gray-600"}`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-gray-400">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                    {!notification.read && (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold"
                      >
                        New
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.read && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => markAsRead(notification.id)}
                    className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                  >
                    <Check size={14} />
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteNotification(notification.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                >
                  <X size={14} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
