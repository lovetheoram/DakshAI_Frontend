import { useEffect, useState } from "react";
import socialApi from "../../api/socialApi";
import FollowButton from "./FollowButton";
import { Users } from "lucide-react";

export default function SuggestedUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socialApi.getSuggestedUsers().then((res) => {
      setUsers(res.data.suggestions || []); 
    });
  }, []);

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 rounded-3xl text-white shadow-2xl">
      <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-300 mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
        <Users size={16} className="text-purple-400" />
        Suggested Peers
      </h3>

      <div className="space-y-3.5">
        {users.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-2">No recommendations found.</p>
        ) : (
          users.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-300 font-extrabold text-sm flex items-center justify-center">
                  {u.username?.charAt(0)?.toUpperCase() || "P"}
                </div>
                <span className="text-sm font-semibold text-gray-200">{u.username}</span>
              </div>
              <FollowButton userId={u.id} isFollowing={u.is_following} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
