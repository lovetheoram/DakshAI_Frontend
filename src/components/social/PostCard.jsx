import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Bookmark, TrendingUp, MessageSquare, UserCheck, Share2 } from "lucide-react";
import Comments from "./Comments";
import socialApi from "../../api/socialApi";
import { parseYouTubeEmbedUrl } from "./CreatePost";

const getYouTubeEmbedUrl = (url) => {
  return parseYouTubeEmbedUrl(url) || url;
};

export default function PostCard({ post, onConceptClick }) {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(post.is_liked ?? false);
  const [likes, setLikes] = useState(Number(post.likes_count) || 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(post.user?.is_following ?? false);
  const isOwnPost = post.user?.is_self ?? false;

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

  const handleDirectChat = () => {
    if (post.user?.id) {
      navigate(`/messages/${post.user.id}`);
    }
  };

  return (
    <motion.div
      layout
      className="bg-slate-900/90 rounded-2xl p-5 sm:p-6 space-y-4 relative border border-indigo-500/30 hover:border-indigo-400/60 shadow-xl shadow-slate-950/60 transition-all duration-300 text-slate-100 mb-4 overflow-hidden"
    >
      {/* Subtle Top Accent Glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-amber-500 to-indigo-500 opacity-60" />

      {/* Popular Badge */}
      {likes > 5 && (
        <span className="absolute top-4 right-4 bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-lg text-[10px] font-bold flex items-center shadow-sm">
          <TrendingUp size={11} className="mr-1 text-amber-400" />
          Trending
        </span>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            onClick={() => post.user?.id && navigate(`/profile/${post.user.id}`)}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center font-black text-sm border border-amber-400/30 ring-2 ring-indigo-500/20 cursor-pointer shrink-0 shadow-md hover:scale-105 transition-transform"
          >
            {post.user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                onClick={() => post.user?.id && navigate(`/profile/${post.user.id}`)}
                className="font-black text-slate-100 text-sm hover:text-amber-400 transition-colors cursor-pointer truncate"
              >
                {post.user?.username || "Learner"}
              </h4>
              <span className="text-[9px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Peer Student
              </span>
            </div>

            {post.concept_name && (
              <button
                onClick={() => onConceptClick?.(post.concept_id)}
                className="text-[11px] text-amber-400 font-extrabold hover:underline block mt-0.5 text-left cursor-pointer"
              >
                #{post.concept_name}
              </button>
            )}
          </div>
        </div>

        {/* Direct Actions: Chat & Follow */}
        <div className="flex items-center gap-2 shrink-0">
          {!isOwnPost && post.user?.id && (
            <>
              {/* Direct Message / Chat Icon Button */}
              <button
                onClick={handleDirectChat}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title={`Start direct chat with ${post.user.username}`}
              >
                <MessageSquare size={13} className="text-amber-400" />
                <span className="hidden sm:inline">Chat</span>
              </button>

              {/* Follow Button */}
              <button
                onClick={toggleFollow}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isFollowing
                    ? "bg-slate-800 text-slate-400 border-slate-700"
                    : "bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-500/30 hover:from-amber-500 hover:to-amber-600 shadow-md"
                }`}
              >
                {isFollowing ? "Following" : "+ Follow"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Post Content */}
      {post.content && (
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium whitespace-pre-line select-text">
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
                  className="w-full max-h-96 object-cover rounded-xl border border-slate-800 shadow-lg"
                />
              );
            }
            if (item.type === "video") {
              const embedUrl = getYouTubeEmbedUrl(item.url);
              return (
                <div key={i} className="aspect-video w-full rounded-xl overflow-hidden border border-slate-800 bg-black shadow-lg">
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
      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs font-bold text-slate-400">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              liked ? "text-rose-500 font-bold" : "hover:text-slate-200"
            }`}
          >
            <Heart size={16} className={liked ? "fill-rose-500 text-rose-500" : ""} />
            <span>{likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              showComments ? "text-amber-400 font-bold" : "hover:text-slate-200"
            }`}
          >
            <MessageCircle size={16} className={showComments ? "text-amber-400" : ""} />
            <span>{post.comments?.length || "Discuss"}</span>
          </button>

          {!isOwnPost && post.user?.id && (
            <button
              onClick={handleDirectChat}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer"
              title="Direct message user"
            >
              <MessageSquare size={15} className="text-amber-400" />
              <span>Direct Chat</span>
            </button>
          )}
        </div>

        <button
          onClick={toggleBookmark}
          className={`transition-colors cursor-pointer ${bookmarked ? "text-amber-400" : "hover:text-slate-200"}`}
          title="Save post"
        >
          <Bookmark size={16} className={bookmarked ? "fill-amber-400 text-amber-400" : ""} />
        </button>
      </div>

      {/* Working Expandable Inline Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pt-3 border-t border-slate-800"
          >
            <Comments postId={post.id} post={post} initialComments={post.comments || []} isInline={true} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

