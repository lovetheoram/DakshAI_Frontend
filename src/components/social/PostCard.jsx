// src/components/social/PostCard.jsx
// Lightweight Human Stream Post — 100% Ivory + Ink + Antique Gold identity.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Heart, ArrowRight } from "lucide-react";
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
  const [isFollowing, setIsFollowing] = useState(post.user?.is_following ?? false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setIsFollowing(post.user?.is_following ?? false);
  }, [post.user?.is_following]);

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

  const toggleFollow = async (e) => {
    if (e) e.stopPropagation();
    if (!post.user?.id) return;

    const previousState = isFollowing;
    setIsFollowing(!previousState);

    try {
      if (previousState) {
        await socialApi.unfollowUser(post.user.id);
      } else {
        await socialApi.followUser(post.user.id);
      }
    } catch (err) {
      console.error("Follow error", err);
      setIsFollowing(previousState);
    }
  };

  const subjectName = post.subject_name || post.post_metadata?.subject || "";
  const conceptName = post.concept_name || post.post_metadata?.concept_name || "";
  const contentTypeLabel =
    post.content_type === "learning"
      ? "Learning"
      : post.content_type === "strategy"
      ? "Strategy"
      : post.content_type === "project"
      ? "Project"
      : post.content_type === "discovery"
      ? "Discovery"
      : post.content_type === "question"
      ? "Question"
      : "Experience";



  const handleOpenConcept = () => {
    if (post.concept_id) {
      if (onConceptClick) {
        onConceptClick(post.concept_id);
      } else {
        navigate(`/learn/${post.concept_id}`);
      }
    }
  };

  const contentText = post.content || "";
  const isLongContent = contentText.length > 280;
  const displayContent = isLongContent && !expanded
    ? contentText.slice(0, 280) + "..."
    : contentText;

  return (
    <div className="py-4 border-b border-[var(--color-border)] space-y-2.5 select-none">
      {/* Level 1: Person */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            onClick={() => post.user?.id && navigate(`/user/${post.user.id}`)}
            className="w-7 h-7 rounded-full bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer border border-[var(--color-gold)]/30"
          >
            {post.user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <h4
            onClick={() => post.user?.id && navigate(`/user/${post.user.id}`)}
            className="font-bold text-sm text-[var(--color-text-primary)] hover:text-[var(--color-gold-dark)] transition-colors cursor-pointer truncate"
          >
            {post.user?.username || "Learner"}
          </h4>
        </div>

        {!isOwnPost && post.user?.id && (
          <button
            onClick={toggleFollow}
            className={`text-[11px] font-semibold transition-all cursor-pointer px-2 py-0.5 rounded-md ${
              isFollowing
                ? "text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)] bg-transparent border border-[var(--color-border)]"
                : "text-[var(--color-gold-dark)] hover:bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30"
            }`}
          >
            {isFollowing ? "Following" : "+ Follow"}
          </button>
        )}
      </div>

      {/* Level 2: Experience (The Hero Human Sentence) */}
      {contentText && (
        <div className="space-y-1">
          <p className="text-sm sm:text-base text-[var(--color-text-primary)] leading-relaxed font-normal whitespace-pre-line select-text">
            {displayContent}
          </p>
          {isLongContent && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-semibold text-[var(--color-gold-dark)] hover:underline cursor-pointer"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}

      {/* Quiz Attempt Card Summary Banner */}
      {post.post_metadata?.score && (
        <div className="p-3 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-between text-xs my-1">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-bold text-[10px]">
              🎯
            </span>
            <div>
              <span className="font-bold text-[var(--color-text-primary)] block">
                Quiz Attempt: {conceptName || post.post_metadata.concept_name || "Practice"}
              </span>
              {post.post_metadata.struggled_topics?.length > 0 && (
                <span className="text-[10px] text-[var(--color-mid-gray)] font-medium block">
                  Struggled with: {post.post_metadata.struggled_topics.join(", ")}
                </span>
              )}
            </div>
          </div>
          <span className="font-extrabold text-[var(--color-gold-dark)] text-xs bg-white px-2.5 py-1 rounded-lg border border-[var(--color-border)]">
            Score {post.post_metadata.score}
          </span>
        </div>
      )}

      {/* Media Attachments */}
      {Array.isArray(post.media) && post.media.length > 0 && (
        <div className="space-y-2 pt-1">
          {post.media.map((item, i) => {
            if (item.type === "image") {
              return (
                <img
                  key={i}
                  src={item.url}
                  alt="Post media"
                  className="w-full max-h-72 object-cover rounded-xl border border-[var(--color-border)]"
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



      {/* Level 4: Actions */}
      <div className="flex items-center justify-between text-xs font-medium text-[var(--color-text-secondary)] pt-1">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              showComments ? "text-[var(--color-gold-dark)] font-bold" : "hover:text-[var(--color-text-primary)]"
            }`}
          >
            <MessageCircle size={14} />
            <span>{post.comments?.length ? `${post.comments.length} comments` : "Comment"}</span>
          </button>

          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              liked ? "text-[var(--color-danger)] font-bold" : "hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Heart size={14} className={liked ? "fill-[var(--color-danger)] text-[var(--color-danger)]" : ""} />
            <span>{likes > 0 ? likes : "Like"}</span>
          </button>
        </div>

        {post.concept_id && (
          <button
            onClick={handleOpenConcept}
            className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-gold-dark)] hover:underline cursor-pointer"
          >
            <span>Open {conceptName || "concept"}</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>

      {/* Expandable Inline Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pt-2"
          >
            <Comments postId={post.id} post={post} initialComments={post.comments || []} isInline={true} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
