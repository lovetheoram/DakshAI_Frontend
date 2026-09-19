// src/components/social/PostCard.jsx
// Clean tactile Post Card — 100% Ivory + Ink + Antique Gold identity.

import { useState } from "react";
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
    setIsFollowing(!isFollowing);
    try {
      if (isFollowing) {
        await socialApi.unfollowUser(post.user.id);
      } else {
        await socialApi.followUser(post.user.id);
      }
    } catch (err) {
      console.error("Follow error", err);
      setIsFollowing(isFollowing);
    }
  };

  const domainTag = post.domain_tag && post.domain_tag !== "General" ? post.domain_tag : "";
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
      : "General";

  // Top header breadcrumb: Show Exam & Subject (or concept if no bottom link)
  const contextBreadcrumb = post.concept_id
    ? [domainTag, subjectName].filter(Boolean).join(" · ")
    : [domainTag, subjectName, conceptName].filter(Boolean).join(" · ");

  const handleOpenConcept = () => {
    if (post.concept_id) {
      if (onConceptClick) {
        onConceptClick(post.concept_id);
      } else {
        navigate(`/learn/${post.concept_id}`);
      }
    }
  };

  const isHighlightedType = post.content_type === "learning" || post.content_type === "strategy";

  return (
    <div
      className={`daksh-card p-4.5 rounded-2xl border border-[var(--color-border)] space-y-3 mb-3.5 shadow-xs hover:border-[var(--color-gold)]/40 transition-all select-none ${
        isHighlightedType ? "border-l-3 border-l-[var(--color-gold)]" : ""
      }`}
    >
      {/* 1. Header: Author + Context Tag + Follow Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            onClick={() => post.user?.id && navigate(`/user/${post.user.id}`)}
            className="w-8 h-8 rounded-full bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer border border-[var(--color-gold)]/30"
          >
            {post.user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0 flex items-center gap-2 flex-wrap">
            <h4
              onClick={() => post.user?.id && navigate(`/user/${post.user.id}`)}
              className="font-bold text-xs text-[var(--color-text-primary)] hover:text-[var(--color-gold-dark)] transition-colors cursor-pointer truncate"
            >
              {post.user?.username || "Learner"}
            </h4>
          </div>
        </div>

        {/* Follow Action */}
        {!isOwnPost && post.user?.id && (
          <button
            onClick={toggleFollow}
            className={`text-[11px] font-bold transition-all cursor-pointer px-2.5 py-1 rounded-lg ${
              isFollowing
                ? "text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] border border-[var(--color-border)]"
                : "text-[var(--color-gold-dark)] bg-[var(--color-gold-pale)] hover:bg-[var(--color-gold)] hover:text-white border border-[var(--color-gold)]/30"
            }`}
          >
            {isFollowing ? "Following" : "+ Follow"}
          </button>
        )}
      </div>

      {/* 2. Strategy / Attempt Metadata Banner (if applicable) */}
      {post.content_type === "strategy" && post.post_metadata?.score && (
        <div className="p-3 rounded-xl bg-[var(--color-gold-pale)]/50 border border-[var(--color-gold)]/30 text-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-[var(--color-text-primary)]">
            <span>Quiz Strategy Evidence: {post.post_metadata.score}</span>
            <span className="text-[var(--color-gold-dark)]">{conceptName || "Concept Quiz"}</span>
          </div>
        </div>
      )}

      {/* 3. Post Body Text */}
      {post.content && (
        <p className="text-xs sm:text-sm text-[var(--color-text-primary)] leading-relaxed font-normal whitespace-pre-line select-text pl-1">
          {post.content}
        </p>
      )}

      {/* 4. Media Attachments */}
      {Array.isArray(post.media) && post.media.length > 0 && (
        <div className="space-y-2 pt-1">
          {post.media.map((item, i) => {
            if (item.type === "image") {
              return (
                <img
                  key={i}
                  src={item.url}
                  alt="Post media"
                  className="w-full max-h-72 object-cover rounded-xl border border-[var(--color-border)] shadow-xs"
                />
              );
            }
            if (item.type === "video") {
              const embedUrl = getYouTubeEmbedUrl(item.url);
              return (
                <div key={i} className="aspect-video w-full rounded-xl overflow-hidden border border-[var(--color-border)] bg-black shadow-xs">
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

      {/* 5. Concept Handoff Link & Footer Interactions */}
      <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border)] text-xs font-semibold text-[var(--color-mid-gray)]">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              liked ? "text-[var(--color-danger)] font-bold" : "hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Heart size={14} className={liked ? "fill-[var(--color-danger)] text-[var(--color-danger)]" : ""} />
            <span>{likes > 0 ? likes : "Like"}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              showComments ? "text-[var(--color-gold-dark)] font-bold" : "hover:text-[var(--color-text-primary)]"
            }`}
          >
            <MessageCircle size={14} />
            <span>{post.comments?.length ? `${post.comments.length} comments` : "Comment"}</span>
          </button>
        </div>

        {post.concept_id && (
          <button
            onClick={handleOpenConcept}
            className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-gold-dark)] hover:underline cursor-pointer"
          >
            <span>
              {post.content_type === "strategy" ? `Practice ${conceptName || "concept"}` : `Open ${conceptName || "concept"}`}
            </span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>

      {/* 6. Expandable Inline Comments */}
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
