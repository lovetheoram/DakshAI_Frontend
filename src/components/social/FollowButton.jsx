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
      className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
        follow
          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
          : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg"
      } disabled:opacity-50`}
    >
      {follow ? "Following" : "Follow"}
    </button>
  );
}
