import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageSquare, Heart, Bookmark, Award, Sparkles, ArrowLeft, Loader2, UserCheck } from "lucide-react";
import socialApi from "../../api/socialApi";
import FollowButton from "./FollowButton";
import PostCard from "./PostCard";

export default function ProfilePage() {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    socialApi.getProfile(userId)
      .then((res) => {
        const rawData = res.data;
        let raw = rawData;
        if (rawData.profile) {
          raw = rawData.profile;
        } else if (rawData.data) {
          raw = rawData.data;
          if (raw.profile) raw = raw.profile;
        }

        const id = raw.user?.id || raw.id || rawData.user?.id || rawData.id;
        const username = raw.user?.username || raw.username || rawData.user?.username || rawData.username;
        const is_following = raw.is_following ?? raw.user?.is_following ?? rawData.is_following ?? rawData.user?.is_following;
        const is_self = raw.is_self ?? raw.user?.is_self ?? rawData.is_self ?? rawData.user?.is_self;

        setProfile({
          ...raw,
          id,
          username,
          is_following,
          is_self,
        });
      })
      .catch((err) => {
        console.error("Error loading user profile:", err);
      });

    socialApi.getPosts({ user_id: userId })
      .then((res) => {
        setPosts(res.data?.posts || []);
      })
      .catch((err) => {
        console.error("Error loading user posts:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 size={24} className="animate-spin text-amber-500" />
        <p className="text-xs text-slate-400 font-medium">Loading user profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800 shadow-xl">
        <h2 className="text-xl font-bold text-slate-200">User not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-5 py-2 rounded-xl text-xs font-bold hover:shadow-lg transition cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 min-h-screen bg-slate-950 text-slate-100 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-amber-400 text-xs font-semibold transition cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Social
      </button>

      {/* Header Profile Card */}
      <div className="bg-slate-900/80 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg border border-amber-400/30">
              {profile.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900" title="Active learner"></div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 flex items-center justify-center md:justify-start gap-2.5">
              {profile.username}
              {profile.is_self && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  You
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">DakshAI Peer Explorer</p>
            <p className="text-slate-300 text-xs mt-3 max-w-xl mx-auto md:mx-0 leading-relaxed">
              {profile.bio || "No bio set yet. Dedicated student pushing limits in concept mastery."}
            </p>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-8 mt-6 border-t border-slate-800 pt-5">
              <div className="text-center">
                <span className="block text-lg font-black text-amber-400">{posts.length}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Posts</span>
              </div>
              <div className="text-center">
                <span className="block text-lg font-black text-amber-400">{profile.followers_count || 0}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Followers</span>
              </div>
              <div className="text-center">
                <span className="block text-lg font-black text-amber-400">{profile.following_count || 0}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Following</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!profile.is_self && (
            <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0 shrink-0">
              <FollowButton userId={profile.id} isFollowing={profile.is_following} />
              
              <button
                onClick={() => navigate(`/messages/${profile.id}`)}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-5 py-2.5 rounded-xl transition text-xs font-bold cursor-pointer"
              >
                <MessageSquare size={15} className="text-amber-400" />
                Message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User's Posts */}
      <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
        <Sparkles className="text-amber-400" size={18} />
        Recent Posts
      </h2>
      
      {posts.length === 0 ? (
        <div className="bg-slate-900/60 rounded-3xl p-8 text-center border border-slate-800">
          <p className="text-slate-400 text-xs font-medium">No updates or posts shared yet by this peer.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

