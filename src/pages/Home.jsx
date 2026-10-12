// src/pages/Home.jsx
// DAKSHAI — People-First Student Social Ecosystem Home Experience
// Prioritizes peer discoveries, student projects, questions, communities, and challenges.
// Personal study momentum is compact and optional.

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Compass,
  FolderGit2,
  HelpCircle,
  Users,
  Trophy,
  PlusCircle,
  ArrowRight,
  Target,
  Flame,
  Search,
  BookOpen,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import socialApi from "../api/socialApi";
import progressApi from "../api/progressApi";
import PostCard from "../components/social/PostCard";
import CreatePostModal from "../components/social/CreatePostModal";
import LandingPage from "../components/home/LandingPage";
import SkeletonLoader from "../components/ui/SkeletonLoader";

const FEED_TABS = [
  { id: "feed", label: "For You", icon: Sparkles },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "questions", label: "Q&A Help", icon: HelpCircle },
  { id: "my_world", label: "My Circle", icon: Users },
];

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Feed State
  const [activeTab, setActiveTab] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Discovery Sidebar State
  const [discovery, setDiscovery] = useState({ people: [], communities: [], activities: [] });
  const [studyMomentum, setStudyMomentum] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Fetch Feed
  const fetchFeed = async (targetScope = activeTab, targetPage = 1, append = false) => {
    try {
      if (targetPage === 1) setLoadingPosts(true);
      else setLoadingMore(true);

      const res = await socialApi.getPosts({
        scope: targetScope,
        page: targetPage,
        page_size: 10,
      });

      const fetchedPosts = res.data?.posts || [];
      setPosts(append ? (prev) => [...prev, ...fetchedPosts] : fetchedPosts);
      setHasMore(Boolean(res.data?.has_more));
      setPage(targetPage);
    } catch (err) {
      console.error("Feed fetch failed:", err);
    } finally {
      setLoadingPosts(false);
      setLoadingMore(false);
    }
  };

  // Fetch Sidebar Discovery & Momentum
  const fetchSidebarData = async () => {
    try {
      const [discRes, dashRes] = await Promise.all([
        socialApi.getDiscovery().catch(() => ({ data: {} })),
        progressApi.getDashboard().catch(() => null),
      ]);
      setDiscovery({
        people: discRes.data?.people || [],
        communities: discRes.data?.communities || [],
        activities: discRes.data?.activities || [],
      });
      if (dashRes) {
        setStudyMomentum({
          examName: dashRes.goal?.exam_name || dashRes.goal?.exam?.name || "Target Track",
          daysRemaining: dashRes.prediction?.days_remaining ?? null,
          streak: dashRes.streak_stats?.practice_streak || dashRes.visit_streak || 0,
        });
      }
    } catch (err) {
      console.error("Sidebar data failed:", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchFeed(activeTab, 1, false);
    fetchSidebarData();
  }, [user, activeTab]);

  const handlePostCreated = (newPost) => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
    }
  };

  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
  };

  if (!user) return <LandingPage />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none font-sans text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ==================================================== */}
        {/* MAIN FEED COLUMN (Columns 1-8 on desktop) */}
        {/* ==================================================== */}
        <main className="lg:col-span-8 space-y-5">
          {/* 1. Welcoming Quick Composer Card */}
          <div className="bg-white dark:bg-zinc-900 p-4.5 rounded-3xl border border-[var(--color-border)] shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div
                onClick={() => navigate("/profile")}
                className="w-10 h-10 rounded-full bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-bold text-sm shrink-0 border border-[var(--color-gold)]/40 cursor-pointer overflow-hidden"
              >
                {user?.profile?.avatar ? (
                  <img src={user.profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.username?.[0]?.toUpperCase() || "U"
                )}
              </div>

              <button
                onClick={() => setCreateModalOpen(true)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-[var(--color-bg-secondary)]/60 hover:bg-[var(--color-bg-secondary)] text-left text-xs text-[var(--color-text-secondary)] border border-transparent hover:border-[var(--color-gold)]/30 transition-all cursor-pointer truncate"
              >
                Share a project, ask a question, or reflect on your learning...
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]/60 text-xs">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-1.5 font-medium transition-colors cursor-pointer text-xs"
                >
                  <FolderGit2 size={15} className="text-indigo-500" />
                  <span>Showcase Project</span>
                </button>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-1.5 font-medium transition-colors cursor-pointer text-xs"
                >
                  <HelpCircle size={15} className="text-amber-500" />
                  <span>Ask Question</span>
                </button>
              </div>

              <button
                onClick={() => setCreateModalOpen(true)}
                className="btn-gold px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <PlusCircle size={14} /> Post
              </button>
            </div>
          </div>

          {/* 2. Feed Scope Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-[var(--color-border)]">
            {FEED_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[var(--color-text-primary)] text-white shadow-xs"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-[var(--color-gold)]" : ""} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3. Posts Stream */}
          {loadingPosts ? (
            <div className="space-y-4 pt-2">
              <SkeletonLoader lines={3} />
              <SkeletonLoader lines={4} />
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 p-10 rounded-3xl border border-[var(--color-border)] text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center mx-auto">
                <Compass size={24} />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                {activeTab === "projects"
                  ? "No projects showcased yet"
                  : activeTab === "questions"
                  ? "No open questions in this view"
                  : "Your feed is quiet"}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
                Be the first to share an experiment, project, or question with fellow students, or discover circles in the sidebar.
              </p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="btn-gold px-5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 mt-2 cursor-pointer shadow-xs"
              >
                <PlusCircle size={14} /> Create First Post
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onDelete={handlePostDeleted} />
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => fetchFeed(activeTab, page + 1, true)}
                    disabled={loadingMore}
                    className="px-6 py-2.5 rounded-xl border border-[var(--color-border)] bg-white dark:bg-zinc-800 text-xs font-bold text-[var(--color-text-primary)] hover:border-[var(--color-gold)] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {loadingMore ? "Loading more stories..." : "Load More Activity"}
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* ==================================================== */}
        {/* RIGHT DISCOVERY SIDEBAR (Columns 9-12 on desktop) */}
        {/* ==================================================== */}
        <aside className="lg:col-span-4 space-y-5">
          {/* A. Discover Peers Card */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-[var(--color-border)] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[var(--color-gold-dark)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                  Peers to Discover
                </h3>
              </div>
              <button
                onClick={() => navigate("/discover")}
                className="text-[11px] font-bold text-[var(--color-gold-dark)] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Explore <ArrowRight size={11} />
              </button>
            </div>

            <div className="space-y-2.5">
              {discovery.people.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-2xl hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  <div
                    onClick={() => navigate(`/user/${p.id}`)}
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-[var(--color-gold)]/30">
                      {p.avatar ? (
                        <img src={p.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        p.display_name?.[0] || p.username?.[0] || "U"
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                        {p.display_name || p.username}
                      </h4>
                      <span className="text-[10px] text-[var(--color-mid-gray)] block truncate">
                        @{p.username}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/user/${p.id}`)}
                    className="px-2.5 py-1 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-gold)] text-[11px] font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] shrink-0 transition-colors cursor-pointer"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* B. Student Communities (Circles) */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-[var(--color-border)] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                  Active Circles
                </h3>
              </div>
              <button
                onClick={() => navigate("/communities")}
                className="text-[11px] font-bold text-[var(--color-gold-dark)] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                All Circles <ArrowRight size={11} />
              </button>
            </div>

            <div className="space-y-2">
              {discovery.communities.slice(0, 3).map((comm) => (
                <div
                  key={comm.id}
                  onClick={() => navigate(`/communities/${comm.slug || comm.id}`)}
                  className="p-3 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-gold)]/60 hover:bg-[var(--color-gold-pale)]/10 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                      {comm.name}
                    </h4>
                    <span className="text-[10px] text-[var(--color-mid-gray)] shrink-0">
                      {comm.members_count || 1} members
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                    {comm.description || comm.category}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* C. Live Sprints & Challenges */}
          {discovery.activities.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-[var(--color-border)] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                    Challenges & Sprints
                  </h3>
                </div>
              </div>

              <div className="space-y-2.5">
                {discovery.activities.slice(0, 2).map((act) => (
                  <div
                    key={act.id}
                    onClick={() => navigate("/discover")}
                    className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer space-y-1"
                  >
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                      {act.category}
                    </span>
                    <h4 className="text-xs font-bold text-[var(--color-text-primary)]">
                      {act.title}
                    </h4>
                    <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-2">
                      {act.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* D. Compact, Optional Study Momentum Widget */}
          {studyMomentum && (
            <div className="p-4 rounded-3xl bg-[var(--color-bg-secondary)]/70 border border-[var(--color-border)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Study Momentum
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  <Flame size={12} /> {studyMomentum.streak}d streak
                </span>
              </div>

              <div className="text-xs text-[var(--color-text-secondary)] flex items-center justify-between">
                <span>{studyMomentum.examName}</span>
                {studyMomentum.daysRemaining !== null && (
                  <span>{studyMomentum.daysRemaining} days left</span>
                )}
              </div>

              <button
                onClick={() => navigate("/learn")}
                className="w-full py-2 rounded-xl border border-[var(--color-border)] bg-white dark:bg-zinc-800 hover:border-[var(--color-gold)] text-xs font-bold text-[var(--color-text-primary)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <BookOpen size={13} className="text-[var(--color-gold-dark)]" />
                <span>Enter Study Room</span>
                <ArrowRight size={12} />
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
