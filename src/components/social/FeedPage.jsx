// src/components/social/FeedPage.jsx
// Peer Feed & Quick Add — 100% Strict Ivory + Ink + Antique Gold styling.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import socialApi from "../../api/socialApi";
import syllabusApi from "../../api/syllabusApi";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import FollowButton from "./FollowButton";
import InfoTooltip from "../ui/InfoTooltip";
import { MessageSquare, Users, Sparkles, UserCheck, Trash2, Loader2, Globe, Layers } from "lucide-react";

export default function FeedPage({ initialTab = "all" }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab); // "all" | "projects" | "suggestions"
  const [loading, setLoading] = useState(true);

  // Suggested peers state
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        const data = await syllabusApi.getConceptList();
        setConcepts(Array.isArray(data) ? data : data?.concepts || []);
      } catch (err) {
        console.error("Error fetching concepts:", err);
        setConcepts([]);
      }
    };
    fetchConcepts();
  }, []);

  // Fetch posts when tab or selected concept changes
  useEffect(() => {
    if (activeTab === "suggestions") return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const filters = {
          ...(selectedConcept ? { concept_id: selectedConcept } : {}),
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

  // Fetch suggested peers
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
    <div className="space-y-6 select-none">
      {/* Tab Filter Navigation */}
      <div className="flex gap-2 border-b border-[var(--color-border)] pb-3 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
            activeTab === "all"
              ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border-[var(--color-gold)]/30 font-bold"
              : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          General Peer Feed
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
            activeTab === "projects"
              ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border-[var(--color-gold)]/30 font-bold"
              : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          <span>Learner Updates</span>
        </button>
        <button
          onClick={() => setActiveTab("suggestions")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
            activeTab === "suggestions"
              ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border-[var(--color-gold)]/30 font-bold"
              : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          <Users size={13} className="text-[var(--color-gold)]" />
          <span>Recommended Peers</span>
        </button>
      </div>

      {/* FEED MODE */}
      {activeTab !== "suggestions" && (
        <div className="space-y-5">
          {/* Create Post Area */}
          <CreatePost onPostCreated={handlePostCreated} />

          {/* Concept Filter */}
          {concepts.length > 0 && (
            <div className="daksh-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                Filter by Concept
              </label>
              <select
                className="input-field py-1.5 text-xs max-w-xs"
                value={selectedConcept || ""}
                onChange={(e) => setSelectedConcept(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">All Concepts</option>
                {concepts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Posts Stream */}
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-2">
                <Loader2 size={20} className="animate-spin text-[var(--color-gold)]" />
                <p className="text-xs text-[var(--color-text-secondary)]">Loading peer updates...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="daksh-card p-8 text-center text-xs text-[var(--color-text-secondary)]">
                No updates posted here yet.
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post, index) => (
                  <PostCard key={post.id} post={post} onConceptClick={(id) => setSelectedConcept(id)} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* SUGGESTED PEERS TAB */}
      {activeTab === "suggestions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-caption tracking-widest text-[var(--color-text-primary)] font-bold">
              Recommended Study Peers
            </span>
            <span className="text-[10px] text-[var(--color-mid-gray)]">{suggestedUsers.length} Recommendations</span>
          </div>

          {loadingSuggestions ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <Loader2 size={20} className="animate-spin text-[var(--color-gold)]" />
              <p className="text-xs text-[var(--color-text-secondary)]">Finding peer matches...</p>
            </div>
          ) : suggestedUsers.length === 0 ? (
            <div className="daksh-card p-8 text-center text-xs text-[var(--color-text-secondary)]">
              No recommended study peers found at this time.
            </div>
          ) : (
            <div className="space-y-3">
              {suggestedUsers.map((u) => (
                <div
                  key={u.id}
                  className="daksh-card p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/20 text-[var(--color-gold-dark)] font-bold text-sm flex items-center justify-center shrink-0">
                      {u.username?.charAt(0).toUpperCase() || "P"}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[var(--color-text-primary)] text-xs truncate">{u.username}</h4>
                      <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 flex items-center gap-1">
                        <UserCheck size={10} className="text-[var(--color-gold-dark)]" />
                        Complementary study match
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <FollowButton userId={u.id} isFollowing={u.is_following} />
                    <button
                      onClick={() => navigate(`/messages/${u.id}`)}
                      className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-white hover:border-[var(--color-gold)] text-xs font-semibold text-[var(--color-text-primary)] transition-all cursor-pointer"
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => handleDismissSuggestion(u.id)}
                      className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-mid-gray)] hover:text-[var(--color-danger)] transition-all cursor-pointer"
                      title="Ignore"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
