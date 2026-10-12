// src/pages/CommunitiesPage.jsx
// Student Circles & Interest Guilds: Join, Leave, Create, and Circle Feeds
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  PlusCircle,
  Sparkles,
  ArrowLeft,
  X,
  Check,
  Loader2,
  FolderGit2,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import socialApi from "../api/socialApi";
import PostCard from "../components/social/PostCard";
import CreatePostModal from "../components/social/CreatePostModal";
import SkeletonLoader from "../components/ui/SkeletonLoader";

const CATEGORIES = [
  "All Categories",
  "Robotics & Hardware",
  "Computer Science & AI",
  "Mathematics & Logic",
  "Medicine & NEET",
  "JEE & Engineering",
  "Civil Services & PCS",
  "Literature & Humanities",
  "Creative Arts & Design",
];

export default function CommunitiesPage() {
  const { slugOrId } = useParams();
  const navigate = useNavigate();

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Detail view state
  const [currentCommunity, setCurrentCommunity] = useState(null);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Modals
  const [createCircleModalOpen, setCreateCircleModalOpen] = useState(false);
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);

  // Create Circle Form
  const [circleName, setCircleName] = useState("");
  const [circleDesc, setCircleDesc] = useState("");
  const [circleCategory, setCircleCategory] = useState("Computer Science & AI");
  const [circleRules, setCircleRules] = useState("");
  const [submittingCircle, setSubmittingCircle] = useState(false);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== "All Categories" ? { category: selectedCategory } : {};
      const res = await socialApi.getCommunities(params);
      setCommunities(res.data?.communities || []);
    } catch (err) {
      console.error("Fetch communities failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityDetail = async (targetId) => {
    try {
      setLoadingDetail(true);
      const [detailRes, postsRes] = await Promise.all([
        socialApi.getCommunityDetail(targetId),
        socialApi.getPosts({ community_id: targetId }),
      ]);
      setCurrentCommunity(detailRes.data);
      setCommunityPosts(postsRes.data?.posts || []);
    } catch (err) {
      console.error("Fetch community detail failed:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (slugOrId) {
      fetchCommunityDetail(slugOrId);
    } else {
      setCurrentCommunity(null);
      fetchCommunities();
    }
  }, [slugOrId, selectedCategory]);

  const handleJoinToggle = async (community) => {
    try {
      if (community.is_member) {
        await socialApi.leaveCommunity(community.id);
      } else {
        await socialApi.joinCommunity(community.id);
      }
      if (slugOrId) {
        fetchCommunityDetail(community.id);
      } else {
        fetchCommunities();
      }
    } catch (err) {
      console.error("Membership toggle error:", err);
    }
  };

  const handleCreateCircle = async (e) => {
    e.preventDefault();
    if (!circleName.trim()) return;
    try {
      setSubmittingCircle(true);
      const res = await socialApi.createCommunity({
        name: circleName.trim(),
        description: circleDesc.trim(),
        category: circleCategory,
        rules: circleRules.trim(),
        visibility: "public",
      });
      setCreateCircleModalOpen(false);
      setCircleName("");
      setCircleDesc("");
      setCircleRules("");
      navigate(`/communities/${res.data?.community?.slug || res.data?.community?.id}`);
    } catch (err) {
      console.error("Create circle error:", err);
    } finally {
      setSubmittingCircle(false);
    }
  };

  // -----------------------------------------------------------------
  // VIEW 1: SINGLE CIRCLE DETAIL VIEW
  // -----------------------------------------------------------------
  if (slugOrId && currentCommunity) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 select-none font-sans text-left">
        {/* Back Link */}
        <button
          onClick={() => navigate("/communities")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer transition-colors"
        >
          <ArrowLeft size={14} /> Back to All Circles
        </button>

        {/* Circle Header Hero */}
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-[var(--color-border)] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/40">
                {currentCommunity.category}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[var(--color-text-primary)]">
                {currentCommunity.name}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
                {currentCommunity.description || "A student interest circle for discussion and shared work."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleJoinToggle(currentCommunity)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  currentCommunity.is_member
                    ? "bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-red-500 hover:text-red-600"
                    : "btn-gold"
                }`}
              >
                {currentCommunity.is_member ? "Member · Leave" : "+ Join Circle"}
              </button>

              <button
                onClick={() => setCreatePostModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-gold)] bg-white dark:bg-zinc-800 text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PlusCircle size={14} className="text-[var(--color-gold-dark)]" />
                <span>Post Here</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--color-border)]/60 flex items-center gap-5 text-xs text-[var(--color-mid-gray)]">
            <span className="flex items-center gap-1">
              <Users size={14} /> {currentCommunity.members_count || 1} members
            </span>
            {currentCommunity.rules && (
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} /> Rules: {currentCommunity.rules}
              </span>
            )}
          </div>
        </div>

        {/* Circle Posts */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Circle Feed ({communityPosts.length})
          </h3>

          {loadingDetail ? (
            <SkeletonLoader lines={3} />
          ) : communityPosts.length === 0 ? (
            <div className="p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-[var(--color-border)] text-center space-y-3">
              <MessageSquare size={24} className="mx-auto text-[var(--color-mid-gray)]" />
              <h4 className="text-sm font-bold text-[var(--color-text-primary)]">No posts in this circle yet</h4>
              <p className="text-xs text-[var(--color-text-secondary)]">Be the first to start a conversation or share a project here.</p>
              <button
                onClick={() => setCreatePostModalOpen(true)}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-bold"
              >
                Start First Discussion
              </button>
            </div>
          ) : (
            communityPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={(id) => setCommunityPosts((prev) => prev.filter((p) => p.id !== id))}
              />
            ))
          )}
        </div>

        <CreatePostModal
          isOpen={createPostModalOpen}
          onClose={() => setCreatePostModalOpen(false)}
          defaultCommunity={currentCommunity}
          onPostCreated={(newPost) => setCommunityPosts((prev) => [newPost, ...prev])}
        />
      </div>
    );
  }

  // -----------------------------------------------------------------
  // VIEW 2: ALL CIRCLES DIRECTORY
  // -----------------------------------------------------------------
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7 select-none font-sans text-left">
      {/* Directory Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/40 text-xs font-bold text-[var(--color-gold-dark)]">
            <Users size={14} />
            <span>Student Circles & Guilds</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
            Find Your Collaborative Circle
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-xl">
            Interest-based circles run by students. Join communities to share experiments, challenge problems, code repositories, and study techniques.
          </p>
        </div>

        <button
          onClick={() => setCreateCircleModalOpen(true)}
          className="btn-gold px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 self-start shadow-xs cursor-pointer"
        >
          <PlusCircle size={15} />
          <span>Create a Circle</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-[var(--color-border)]">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[var(--color-text-primary)] text-white shadow-xs"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Circle Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonLoader lines={3} />
          <SkeletonLoader lines={3} />
        </div>
      ) : communities.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-zinc-900 border border-[var(--color-border)] text-center space-y-3">
          <Users size={28} className="mx-auto text-[var(--color-mid-gray)]" />
          <h3 className="text-base font-bold text-[var(--color-text-primary)]">No circles in this category</h3>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-md mx-auto">
            You can create the first circle for this category and invite fellow students to join.
          </p>
          <button
            onClick={() => setCreateCircleModalOpen(true)}
            className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 mt-2"
          >
            <PlusCircle size={14} /> Create This Circle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((comm) => (
            <div
              key={comm.id}
              className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-[var(--color-border)] hover:border-[var(--color-gold)] transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                    {comm.category}
                  </span>
                  <span className="text-[11px] font-semibold text-[var(--color-mid-gray)]">
                    {comm.members_count || 1} members
                  </span>
                </div>

                <h3
                  onClick={() => navigate(`/communities/${comm.slug || comm.id}`)}
                  className="text-base font-bold text-[var(--color-text-primary)] hover:text-[var(--color-gold-dark)] transition-colors cursor-pointer"
                >
                  {comm.name}
                </h3>

                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed">
                  {comm.description || "A student interest circle for discussion, peer projects, and learning."}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--color-border)]/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => navigate(`/communities/${comm.slug || comm.id}`)}
                  className="text-xs font-bold text-[var(--color-text-primary)] hover:text-[var(--color-gold-dark)] transition-colors cursor-pointer"
                >
                  View Feed →
                </button>

                <button
                  onClick={() => handleJoinToggle(comm)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    comm.is_member
                      ? "bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                      : "btn-gold"
                  }`}
                >
                  {comm.is_member ? "Joined" : "Join"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE CIRCLE MODAL */}
      <AnimatePresence>
        {createCircleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
            <div className="fixed inset-0" onClick={() => setCreateCircleModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full bg-white dark:bg-zinc-900 border border-[var(--color-border)] rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[var(--color-gold-dark)]" />
                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">Create New Student Circle</h3>
                </div>
                <button onClick={() => setCreateCircleModalOpen(false)} className="text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)]">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateCircle} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
                    Circle Name
                  </label>
                  <input
                    type="text"
                    required
                    value={circleName}
                    onChange={(e) => setCircleName(e.target.value)}
                    placeholder="e.g. Competitive Programming Club, Organic Chemistry Circle"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    value={circleCategory}
                    onChange={(e) => setCircleCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-white dark:bg-zinc-800 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)]"
                  >
                    {CATEGORIES.filter((c) => c !== "All Categories").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
                    Description & Mission
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={circleDesc}
                    onChange={(e) => setCircleDesc(e.target.value)}
                    placeholder="Describe what members will share, solve, or build together..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)] resize-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
                    Community Rules (Optional)
                  </label>
                  <input
                    type="text"
                    value={circleRules}
                    onChange={(e) => setCircleRules(e.target.value)}
                    placeholder="e.g. Be respectful, share reproducible code."
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--color-border)] bg-transparent text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setCreateCircleModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-text-secondary)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingCircle}
                    className="btn-gold px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
                  >
                    {submittingCircle ? <Loader2 size={14} className="animate-spin" /> : "Launch Circle"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
