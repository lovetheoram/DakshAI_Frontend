// src/pages/social/NotificationsPage.jsx
import { useEffect, useState } from "react";
import socialApi from "../../api/socialApi";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await socialApi.getNotifications();
      setNotifications(data.notifications);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const markAsRead = async (id) => {
    try {
      await socialApi.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading notifications...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <div className="space-y-3">
        {notifications.length === 0 && (
          <p className="text-gray-500">No notifications yet.</p>
        )}

        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-lg border flex justify-between items-center ${
              notif.is_read ? "bg-gray-100" : "bg-white shadow"
            }`}
          >
            <div>
              <p className="text-gray-800">{notif.message}</p>
              <small className="text-gray-400">
                {new Date(notif.created_at).toLocaleString()}
              </small>
            </div>
            {!notif.is_read && (
              <button
                className="text-blue-500 font-semibold hover:underline"
                onClick={() => markAsRead(notif.id)}
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
