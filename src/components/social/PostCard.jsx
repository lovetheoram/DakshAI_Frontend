import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Bookmark, TrendingUp } from "lucide-react";
import Comments from "./Comments";
import socialApi from "../../api/socialApi";
import { parseYouTubeEmbedUrl } from "./CreatePost";

const getYouTubeEmbedUrl = (url) => {
  return parseYouTubeEmbedUrl(url) || url;
};

export default function PostCard({ post, onConceptClick }) {
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

  return (
    <motion.div
      layout
      className="daksh-card p-5 sm:p-6 space-y-4 relative text-[var(--color-text-primary)] mb-4 border-l-2 border-l-[var(--color-gold)]"
    >
      {/* Popular Badge */}
      {likes > 5 && (
        <span className="absolute top-4 right-4 bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] px-2.5 py-0.5 rounded-md text-[10px] font-bold flex items-center border border-[var(--color-gold)]/20">
          <TrendingUp size={10} className="mr-1" />
          Popular
        </span>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-bold text-sm border border-[var(--color-gold)]/20">
            {post.user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[var(--color-text-primary)] text-sm">{post.user?.username}</h4>
              <span className="text-[10px] font-bold text-[var(--color-mid-gray)] bg-[var(--color-bg-primary)] px-2 py-0.5 rounded-md border border-[var(--color-border)] uppercase">
                Peer Update
              </span>
            </div>

            {post.concept_name && (
              <button
                onClick={() => onConceptClick?.(post.concept_id)}
                className="text-[11px] text-[var(--color-gold-dark)] font-semibold hover:underline block mt-0.5 text-left cursor-pointer"
              >
                #{post.concept_name}
              </button>
            )}
          </div>
        </div>

        {!isOwnPost && (
          <button
            onClick={toggleFollow}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
              isFollowing
                ? "bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border-[var(--color-border)]"
                : "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border-[var(--color-gold)]/30 font-bold"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {/* Post Content */}
      {post.content && (
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal whitespace-pre-line">
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
                  className="w-full max-h-80 object-cover rounded-xl border border-[var(--color-border)]"
                />
              );
            }
            if (item.type === "video") {
              const embedUrl = getYouTubeEmbedUrl(item.url);
              return (
                <div key={i} className="aspect-video w-full rounded-xl overflow-hidden border border-[var(--color-border)] bg-black">
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
      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              liked ? "text-[var(--color-danger)] font-bold" : "hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Heart size={16} className={liked ? "fill-[var(--color-danger)] text-[var(--color-danger)]" : ""} />
            <span>{likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          >
            <MessageCircle size={16} />
            <span>{post.comments?.length || 0}</span>
          </button>
        </div>

        <button
          onClick={toggleBookmark}
          className={`transition-colors cursor-pointer ${bookmarked ? "text-[var(--color-gold-dark)]" : "hover:text-[var(--color-text-primary)]"}`}
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
            className="overflow-hidden pt-3 border-t border-[var(--color-border)]"
          >
            <Comments postId={post.id} comments={post.comments || []} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
