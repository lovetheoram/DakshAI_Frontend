import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageSquare, Heart, Bookmark, Award, Sparkles, ArrowLeft } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading user profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">User not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-semibold mb-6 transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-100 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-lg">
              {profile.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-white"></div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black text-gray-800 flex items-center justify-center md:justify-start gap-2">
              {profile.username}
              {profile.is_self && (
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-bold">You</span>
              )}
            </h1>
            <p className="text-gray-500 font-medium mt-1">Nimides Explorer</p>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto md:mx-0 leading-relaxed">
              {profile.bio || "No bio yet. Learning and growing every day."}
            </p>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-8 mt-6 border-t border-gray-100 pt-6">
              <div className="text-center">
                <span className="block text-xl font-bold text-gray-800">{posts.length}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Posts</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-gray-800">{profile.followers_count || 0}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Followers</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-gray-800">{profile.following_count || 0}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Following</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!profile.is_self && (
            <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
              <FollowButton userId={profile.id} isFollowing={profile.is_following} />
              
              <button
                onClick={() => navigate(`/messages/${profile.id}`)}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-purple-100 text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-200 transition font-bold"
              >
                <MessageSquare size={18} />
                Message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User's Posts */}
      <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
        <Sparkles className="text-purple-600" size={20} />
        Recent Posts
      </h2>
      
      {posts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-slate-200">
          <p className="text-gray-500 font-medium text-lg">No posts shared yet by this user.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
