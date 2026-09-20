import { useState, useEffect } from "react";
import socialApi from "../../api/socialApi";

export default function FollowButton({ userId, isFollowing }) {
  const [follow, setFollow] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFollow(isFollowing);
  }, [isFollowing]);

  const toggle = async (e) => {
    if (e) e.stopPropagation();
    if (loading || !userId) return;
    setLoading(true);
    const previousState = follow;
    setFollow(!previousState);
    try {
      if (previousState) {
        await socialApi.unfollowUser(userId);
      } else {
        await socialApi.followUser(userId);
      }
    } catch (err) {
      console.error("Failed to toggle follow status:", err);
      setFollow(previousState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 active:scale-[0.97] cursor-pointer ${
        follow
          ? "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
          : "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-md hover:shadow-amber-500/20"
      } disabled:opacity-50`}
    >
      {follow ? "Following" : "+ Follow"}
    </button>
  );
}

