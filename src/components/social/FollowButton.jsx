import { useState, useEffect } from "react";
import socialApi from "../../api/socialApi";

export default function FollowButton({ userId, isFollowing }) {
  const [follow, setFollow] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFollow(isFollowing);
  }, [isFollowing]);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (follow) {
        await socialApi.unfollowUser(userId);
      } else {
        await socialApi.followUser(userId);
      }
      setFollow(!follow);
    } catch (err) {
      console.error("Failed to toggle follow status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all duration-200 active:scale-[0.97] ${
        follow
          ? "bg-white/10 text-gray-300 border border-white/5 hover:bg-white/15"
          : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg"
      } disabled:opacity-50`}
    >
      {follow ? "Following" : "Follow"}
    </button>
  );
}
