import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, Bookmark, TrendingUp, FileText, X, Send, Sparkles, Rocket, HelpCircle, Compass, Award } from "lucide-react";
import Comments from "./Comments";
import socialApi from "../../api/socialApi";

const CARD_THEMES = [
  {
    border: "border-purple-500/30 hover:border-purple-400/60",
    bgGradient: "bg-gradient-to-br from-purple-950/30 via-slate-900/90 to-slate-950",
    accentText: "text-purple-400",
    badgeBg: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    avatarBg: "from-purple-500 to-indigo-600 shadow-purple-500/20",
    glow: "shadow-purple-500/10",
  },
  {
    border: "border-indigo-500/30 hover:border-indigo-400/60",
    bgGradient: "bg-gradient-to-br from-indigo-950/30 via-slate-900/90 to-slate-950",
    accentText: "text-indigo-400",
    badgeBg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    avatarBg: "from-indigo-500 to-blue-600 shadow-indigo-500/20",
    glow: "shadow-indigo-500/10",
  },
  {
    border: "border-emerald-500/30 hover:border-emerald-400/60",
    bgGradient: "bg-gradient-to-br from-emerald-950/30 via-slate-900/90 to-slate-950",
    accentText: "text-emerald-400",
    badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    avatarBg: "from-emerald-500 to-teal-600 shadow-emerald-500/20",
    glow: "shadow-emerald-500/10",
  },
  {
    border: "border-amber-500/30 hover:border-amber-400/60",
    bgGradient: "bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-slate-950",
    accentText: "text-amber-400",
    badgeBg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    avatarBg: "from-amber-500 to-orange-600 shadow-amber-500/20",
    glow: "shadow-amber-500/10",
  },
  {
    border: "border-pink-500/30 hover:border-pink-400/60",
    bgGradient: "bg-gradient-to-br from-pink-950/30 via-slate-900/90 to-slate-950",
    accentText: "text-pink-400",
    badgeBg: "bg-pink-500/15 text-pink-300 border-pink-500/30",
    avatarBg: "from-pink-500 to-rose-600 shadow-pink-500/20",
    glow: "shadow-pink-500/10",
  },
  {
    border: "border-cyan-500/30 hover:border-cyan-400/60",
    bgGradient: "bg-gradient-to-br from-cyan-950/30 via-slate-900/90 to-slate-950",
    accentText: "text-cyan-400",
    badgeBg: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    avatarBg: "from-cyan-500 to-blue-600 shadow-cyan-500/20",
    glow: "shadow-cyan-500/10",
  },
  {
    border: "border-teal-500/30 hover:border-teal-400/60",
    bgGradient: "bg-gradient-to-br from-teal-950/30 via-slate-900/90 to-slate-950",
    accentText: "text-teal-400",
    badgeBg: "bg-teal-500/15 text-teal-300 border-teal-500/30",
    avatarBg: "from-teal-500 to-emerald-600 shadow-teal-500/20",
    glow: "shadow-teal-500/10",
  },
  {
    border: "border-violet-500/30 hover:border-violet-400/60",
    bgGradient: "bg-gradient-to-br from-violet-950/30 via-slate-900/90 to-slate-950",
    accentText: "text-violet-400",
    badgeBg: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    avatarBg: "from-violet-500 to-purple-600 shadow-violet-500/20",
    glow: "shadow-violet-500/10",
  },
];

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes('youtube.com/embed/')) {
    return url.replace('youtube.com', 'youtube-nocookie.com');
  }
  if (url.includes('youtube-nocookie.com/embed/')) return url;
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  const long = url.match(/v=([a-zA-Z0-9_-]+)/);
  const id = short?.[1] || long?.[1];
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
};

export default function PostCard({ post, onConceptClick }) {
  const navigate = useNavigate();

  // Pick random vibrant theme based on post.id
  const theme = CARD_THEMES[(post.id || 0) % CARD_THEMES.length];

  // State
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(post.is_liked ?? false);
  const [likes, setLikes] = useState(Number(post.likes_count) || 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(post.user?.is_following ?? false);
  const isOwnPost = post.user?.is_self ?? false;

  // Actions
  const toggleLike = async () => {
    try {
      if (liked) {
        await socialApi.unlikePost(post.id);
        setLikes((l) => Math.max(0, l - 1));
      } else {
        await socialApi.likePost(post.id);
        setLikes((l) => l + 1);
      }
      setLiked(!liked);
    } catch (err) {
      console.error("Like error", err);
    }
  };

  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await socialApi.unfollowUser(post.user.id);
      } else {
        await socialApi.followUser(post.user.id);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow error", err);
    }
  };

  const toggleBookmark = () => setBookmarked(!bookmarked);

  const getTypeLabel = (type) => {
    switch (type) {
      case "project": return "🛸 Project Showcase";
      case "milestone": return "🎯 Milestone";
      case "help": return "❓ Help Request";
      case "discovery": return "💡 Discovery";
      case "opportunity": return "🏆 Opportunity";
      case "discussion": return "💬 Discussion";
      case "story": return "📖 Student Story";
      case "progress": return "📊 Progress Update";
      default: return "✨ Insight";
    }
  };

  return (
    <motion.div 
      layout 
      className={`backdrop-blur-xl border ${theme.border} ${theme.bgGradient} ${theme.glow} rounded-3xl shadow-xl transition-all duration-300 relative overflow-hidden text-white mb-4`}
    >
      {/* Trending Badge */}
      {likes > 5 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 z-10 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center shadow-md"
        >
          <TrendingUp size={10} className="mr-1" />
          Popular
        </motion.div>
      )}

      <div className="p-5 sm:p-6 space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br ${theme.avatarBg} flex items-center justify-center text-white font-black text-sm border border-white/20 shadow-md`}
            >
              {post.user?.username?.charAt(0)?.toUpperCase() || "U"}
            </motion.div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm sm:text-base leading-tight">{post.user?.username}</h4>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badgeBg}`}>
                  {getTypeLabel(post.post_type)}
                </span>
              </div>

              {post.concept_name && (
                <button
                  onClick={() => onConceptClick?.(post.concept_id)}
                  className={`text-[11px] ${theme.accentText} font-semibold hover:underline block mt-0.5 text-left`}
                >
                  #{post.concept_name}
                </button>
              )}
            </div>
          </div>

          {!isOwnPost && (
            <button
              onClick={toggleFollow}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all border ${
                isFollowing
                  ? "bg-white/10 text-gray-300 border-white/10 hover:bg-white/15"
                  : `bg-gradient-to-r ${theme.avatarBg} text-white border-transparent shadow-sm hover:opacity-90`
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* Post Content */}
        {post.content && (
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal whitespace-pre-line">
            {post.content}
          </p>
        )}

        {/* Media Attachments */}
        {Array.isArray(post.media) && post.media.length > 0 && (
          <div className="space-y-3 pt-1">
            {post.media.map((item, i) => {
              if (item.type === "image") {
                return (
                  <img
                    key={i}
                    src={item.url}
                    alt="Post media"
                    className="w-full max-h-80 object-cover rounded-2xl border border-white/10"
                  />
                );
              }
              if (item.type === "video") {
                const embedUrl = getYouTubeEmbedUrl(item.url);
                return (
                  <div key={i} className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video src={item.url} controls className="w-full h-full object-cover" />
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] text-xs font-semibold text-gray-400">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1.5 transition-colors ${
                liked ? "text-red-400 font-bold" : "hover:text-white"
              }`}
            >
              <Heart size={16} className={liked ? "fill-red-400 text-red-400" : ""} />
              <span>{likes}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <MessageCircle size={16} />
              <span>{post.comments?.length || 0}</span>
            </button>
          </div>

          <button
            onClick={toggleBookmark}
            className={`transition-colors ${bookmarked ? theme.accentText : "hover:text-white"}`}
          >
            <Bookmark size={16} className={bookmarked ? "fill-current" : ""} />
          </button>
        </div>

        {/* Expandable Comments */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pt-3 border-t border-white/[0.04]"
            >
              <Comments postId={post.id} comments={post.comments || []} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
