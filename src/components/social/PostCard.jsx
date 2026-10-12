// src/components/social/PostCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Heart,
  ArrowRight,
  MoreHorizontal,
  Trash2,
  ShieldAlert,
  Users,
  Tag,
  FolderGit2,
  HelpCircle,
  Trophy,
} from "lucide-react";
import Comments from "./Comments";
import ReportModal from "./ReportModal";
import socialApi from "../../api/socialApi";
import { parseYouTubeEmbedUrl } from "./CreatePost";

const getYouTubeEmbedUrl = (url) => {
  return parseYouTubeEmbedUrl(url) || url;
};

const STAGE_LABELS = {
  below_6: "Class <6",
  class_6_10: "Class 6-10",
  class_11_12: "Class 11-12",
  jee: "JEE Prep",
  neet: "NEET Prep",
  college: "College",
  placement: "Placements",
  pcs: "State PCS",
  other: "Student",
};

export default function PostCard({ post, onConceptClick, onDelete }) {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(post.is_liked ?? false);
  const [likes, setLikes] = useState(Number(post.likes_count) || 0);
  const [isFollowing, setIsFollowing] = useState(post.user?.is_following ?? false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const isOwnPost = post.is_owner || post.user?.is_self;

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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await socialApi.deletePost(post.id);
      if (onDelete) onDelete(post.id);
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handleOpenConcept = () => {
    if (post.concept_id) {
      if (onConceptClick) {
        onConceptClick(post.concept_id);
      } else {
        navigate(`/learn/${post.concept_id}`);
      }
    }
  };

  const stageLabel = STAGE_LABELS[post.user?.education_stage] || "";

  return (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-[var(--color-border)] space-y-3.5 mb-4 shadow-xs hover:border-[var(--color-gold)]/50 transition-all select-none text-left">
      {/* 1. Header: Author + Education Stage + Options Menu */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            onClick={() => post.user?.id && navigate(`/user/${post.user.id}`)}
            className="w-9 h-9 rounded-full bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer border border-[var(--color-gold)]/40 overflow-hidden"
          >
            {post.user?.avatar ? (
              <img src={post.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              post.user?.display_name?.charAt(0)?.toUpperCase() || post.user?.username?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                onClick={() => post.user?.id && navigate(`/user/${post.user.id}`)}
                className="font-bold text-xs sm:text-sm text-[var(--color-text-primary)] hover:text-[var(--color-gold-dark)] transition-colors cursor-pointer truncate"
              >
                {post.user?.display_name || post.user?.username || "Learner"}
              </h4>
              {stageLabel && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  {stageLabel}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[var(--color-mid-gray)] block">
              @{post.user?.username} · {new Date(post.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Follow Button */}
          {!isOwnPost && post.user?.id && (
            <button
              onClick={toggleFollow}
              className={`text-xs font-bold transition-all cursor-pointer px-3 py-1 rounded-xl ${
                isFollowing
                  ? "text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"
                  : "text-black bg-[var(--color-gold)] hover:bg-[var(--color-gold-dark)] hover:text-white"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}

          {/* Options Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-7 h-7 rounded-lg text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] flex items-center justify-center cursor-pointer"
            >
              <MoreHorizontal size={16} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-8 w-36 bg-white dark:bg-zinc-800 border border-[var(--color-border)] rounded-2xl shadow-xl p-1.5 z-20"
                >
                  {isOwnPost ? (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleDelete();
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-medium text-red-600 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete Post
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setReportModalOpen(true);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-medium text-amber-600 hover:bg-amber-500/10 flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldAlert size={13} /> Report
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 2. Badge Indicators (Circle, Project, Question) */}
      <div className="flex items-center gap-2 flex-wrap">
        {post.content_type === "project" && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <FolderGit2 size={11} /> Project Showcase
          </span>
        )}
        {post.content_type === "question" && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <HelpCircle size={11} /> Question / Help
          </span>
        )}
        {post.content_type === "milestone" && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Trophy size={11} /> Milestone
          </span>
        )}
        {post.community && (
          <button
            onClick={() => navigate(`/communities/${post.community.slug || post.community.id}`)}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/30 hover:underline cursor-pointer"
          >
            <Users size={11} /> {post.community.name}
          </button>
        )}
      </div>

      {/* 3. Post Title */}
      {post.title && (
        <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)] leading-snug">
          {post.title}
        </h3>
      )}

      {/* 4. Post Content */}
      {post.content && (
        <p className="text-xs sm:text-sm text-[var(--color-text-primary)] leading-relaxed whitespace-pre-line select-text">
          {post.content}
        </p>
      )}

      {/* 5. Tags */}
      {Array.isArray(post.tags) && post.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {post.tags.map((t, idx) => (
            <span key={idx} className="inline-flex items-center gap-0.5 text-[10px] font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] px-2 py-0.5 rounded-lg border border-[var(--color-border)]">
              <Tag size={9} /> #{t}
            </span>
          ))}
        </div>
      )}

      {/* 6. Media Attachments */}
      {Array.isArray(post.media) && post.media.length > 0 && (
        <div className="space-y-2 pt-1">
          {post.media.map((item, i) => {
            if (item.type === "image") {
              return (
                <img
                  key={i}
                  src={item.url}
                  alt="Post media"
                  className="w-full max-h-80 object-cover rounded-2xl border border-[var(--color-border)] shadow-xs"
                />
              );
            }
            if (item.type === "video") {
              const embedUrl = getYouTubeEmbedUrl(item.url);
              return (
                <div key={i} className="aspect-video w-full rounded-2xl overflow-hidden border border-[var(--color-border)] bg-black shadow-xs">
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

      {/* 7. Footer Interactions (Like, Comment, Concept link) */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)] text-xs font-semibold text-[var(--color-mid-gray)]">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              liked ? "text-red-500 font-bold" : "hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Heart size={15} className={liked ? "fill-red-500 text-red-500" : ""} />
            <span>{likes > 0 ? likes : "Like"}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              showComments ? "text-[var(--color-gold-dark)] font-bold" : "hover:text-[var(--color-text-primary)]"
            }`}
          >
            <MessageCircle size={15} />
            <span>{post.comments_count ? `${post.comments_count} comments` : "Comment"}</span>
          </button>
        </div>

        {post.concept_id && (
          <button
            onClick={handleOpenConcept}
            className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-gold-dark)] hover:underline cursor-pointer"
          >
            <span>Learn {post.concept_name || "concept"}</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>

      {/* 8. Expandable Comments */}
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

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType="post"
        targetId={post.id}
        targetTitle={post.title || post.content?.slice(0, 30)}
      />
    </div>
  );
}
