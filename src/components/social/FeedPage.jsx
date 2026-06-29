import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import socialApi from "../../api/socialApi";
import syllabusApi from "../../api/syllabusApi";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import FollowButton from "./FollowButton";
import { MessageSquare, Users, Sparkles, UserCheck, Trash2, Loader2 } from "lucide-react";

export default function FeedPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "matchmaking" | "suggestions"
  const [loading, setLoading] = useState(true);

  // Suggested peers state
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        const data = await syllabusApi.getConceptList();
        setConcepts(data);
      } catch (err) {
        console.error("Error fetching concepts:", err);
        setConcepts([]);
      }
    };
    fetchConcepts();
  }, []);

  // Fetch posts when tab or selected concept changes
  useEffect(() => {
    if (activeTab === "suggestions") return; // Suggestions handled by its own fetcher

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const filters = {
          ...(selectedConcept ? { concept_id: selectedConcept } : {}),
          ...(activeTab === "matchmaking" ? { matchmaking: "true" } : {}),
        };
        const res = await socialApi.getPosts(filters);
        setPosts(res.data?.posts || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [selectedConcept, activeTab]);

  // Fetch suggested peers when entering recommendations tab
  useEffect(() => {
    if (activeTab === "suggestions") {
      const fetchSuggestions = async () => {
        setLoadingSuggestions(true);
        try {
          const res = await socialApi.getSuggestedUsers();
          setSuggestedUsers(res.data.suggestions || []);
        } catch (err) {
          console.error("Error fetching suggestions:", err);
          setSuggestedUsers([]);
        } finally {
          setLoadingSuggestions(false);
        }
      };
      fetchSuggestions();
    }
  }, [activeTab]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDismissSuggestion = (id) => {
    setSuggestedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] overflow-x-hidden text-white">
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* Page Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.04] mb-2">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Community Space</h1>
            <p className="text-xs text-gray-500 mt-1">Connect, share weakness matches, and study with peers.</p>
          </div>
          <button
            onClick={() => navigate("/messages")}
            className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all"
            title="Open Inbox"
          >
            <MessageSquare size={18} />
          </button>
        </div>

        {/* Tab Filter Navigation (General | Weakness | Snapchat Suggestions) */}
        <div className="flex gap-2 border-b border-white/[0.02] pb-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              activeTab === "all"
                ? "bg-purple-600/15 text-purple-300 border-purple-500/30 shadow-lg shadow-purple-500/5"
                : "bg-white/[0.02] text-gray-400 border-white/5 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            General Feed
          </button>
          <button
            onClick={() => setActiveTab("matchmaking")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              activeTab === "matchmaking"
                ? "bg-gradient-to-r from-purple-600/15 to-indigo-600/15 text-purple-300 border-purple-500/30 shadow-lg shadow-purple-500/5"
                : "bg-white/[0.02] text-gray-400 border-white/5 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Sparkles size={12} className="text-purple-400" />
            🧠 Weakness Match
          </button>
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              activeTab === "suggestions"
                ? "bg-gradient-to-r from-emerald-600/15 to-teal-600/15 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/5"
                : "bg-white/[0.02] text-gray-400 border-white/5 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Users size={12} className="text-emerald-400" />
            👥 Quick Add (Peers)
          </button>
        </div>

        {/* FEED MODE (General vs Matchmaking) */}
        {activeTab !== "suggestions" && (
          <div className="space-y-6">
            
            {/* Create Post Area */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
              <CreatePost onPostCreated={handlePostCreated} />
            </motion.div>

            {/* Concept Filter (Only on Posts tab) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3"
            >
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                Filter Concept
              </label>
              <div className="relative flex-1">
                <select
                  className="appearance-none bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 pr-12 focus:outline-none focus:border-purple-500 transition-all w-full text-xs text-white"
                  value={selectedConcept || ""}
                  onChange={(e) => setSelectedConcept(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="" className="bg-slate-900">✨ All Concepts</option>
                  {concepts.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900">
                      🎓 {c.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400 text-xs">
                  ▼
                </div>
              </div>
            </motion.div>

            {/* Posts Stream */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 size={24} className="animate-spin text-purple-400" />
                  <p className="text-xs text-gray-500">Loading feed updates...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center shadow-xl">
                  <p className="text-gray-500 text-sm">No updates posted here yet.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <PostCard post={post} onConceptClick={(id) => setSelectedConcept(id)} />
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* SNAPCHAT-STYLE SUGGESTED USERS TAB */}
        {activeTab === "suggestions" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-2">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                Quick Add suggested peers
              </span>
              <span className="text-[10px] text-gray-500">{suggestedUsers.length} recommendations</span>
            </div>

            {loadingSuggestions ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 size={24} className="animate-spin text-emerald-400" />
                <p className="text-xs text-gray-500">Scanning neural matrix matches...</p>
              </div>
            ) : suggestedUsers.length === 0 ? (
              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center shadow-xl">
                <p className="text-gray-500 text-sm">No recommended study peers found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                <AnimatePresence>
                  {suggestedUsers.map((u, index) => (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ delay: index * 0.03 }}
                      className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300 font-extrabold text-base flex items-center justify-center shadow-inner flex-shrink-0">
                          {u.username?.charAt(0).toUpperCase() || "P"}
                        </div>
                        {/* Meta */}
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-white text-sm truncate">{u.username}</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                            <UserCheck size={10} className="text-emerald-400" />
                            Complementary study match
                          </p>
                        </div>
                      </div>

                      {/* Snapchat Style Action Toolbar */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <FollowButton userId={u.id} isFollowing={u.is_following} />
                        
                        <button
                          onClick={() => navigate(`/messages/${u.id}`)}
                          className="px-3.5 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all"
                        >
                          Chat
                        </button>
                        
                        <button
                          onClick={() => handleDismissSuggestion(u.id)}
                          className="w-8 h-8 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-white/[0.04] transition-all"
                          title="Quick Ignore"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
