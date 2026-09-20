// src/components/social/FeedPage.jsx
// World Activity Stream — Lightweight Human Editorial Feed & Quiet Concept Filtering.

import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import socialApi from "../../api/socialApi";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import Modal from "../ui/Modal";
import { Loader2, PenSquare } from "lucide-react";

export default function FeedPage({ initialScope = "my_world" }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const conceptId = searchParams.get("concept_id");
  const conceptName = searchParams.get("concept_name");

  const [scope, setScope] = useState(initialScope); // "my_world" | "wider_world"
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // In-memory feed cache by scope key to make scope switching immediate
  const feedCache = useRef({});

  const fetchFeed = useCallback(async (targetScope, pageNum = 1, append = false) => {
    const cacheKey = `${targetScope}_${conceptId || "all"}`;
    
    // If initial fetch and we have cached posts, use them immediately for instantaneous switch
    if (pageNum === 1 && !append && feedCache.current[cacheKey]) {
      setPosts(feedCache.current[cacheKey].posts);
      setHasMore(feedCache.current[cacheKey].hasMore);
      setLoading(false);
    } else if (pageNum === 1) {
      setLoading(true);
    } else {
      setFetchingMore(true);
    }

    try {
      const params = {
        scope: targetScope,
        page: pageNum,
        page_size: 10,
      };
      if (conceptId) {
        params.concept_id = conceptId;
      }

      const res = await socialApi.getPosts(params);
      const data = res.data;
      const newPosts = data.posts || [];
      const more = data.has_more ?? false;

      if (append) {
        setPosts((prev) => {
          const updated = [...prev, ...newPosts];
          feedCache.current[cacheKey] = { posts: updated, hasMore: more };
          return updated;
        });
      } else {
        setPosts(newPosts);
        feedCache.current[cacheKey] = { posts: newPosts, hasMore: more };
      }
      setHasMore(more);
    } catch (err) {
      console.error("Error fetching feed:", err);
      if (!append && !feedCache.current[cacheKey]) setPosts([]);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  }, [conceptId]);

  useEffect(() => {
    setPage(1);
    fetchFeed(scope, 1, false);
  }, [scope, conceptId, fetchFeed]);

  const handleLoadMore = () => {
    if (fetchingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(scope, nextPage, true);
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const clearConceptFilter = () => {
    const updated = new URLSearchParams(searchParams);
    updated.delete("concept_id");
    updated.delete("concept_name");
    setSearchParams(updated);
  };

  return (
    <div className="space-y-4 select-none">
      {/* 1. Scope Switcher & Top Action */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setScope("my_world")}
            className={`text-xs sm:text-sm font-bold pb-2 transition-all cursor-pointer relative ${
              scope === "my_world"
                ? "text-[var(--color-gold-dark)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <span>My World</span>
            {scope === "my_world" && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-gold)] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setScope("wider_world")}
            className={`text-xs sm:text-sm font-bold pb-2 transition-all cursor-pointer relative ${
              scope === "wider_world"
                ? "text-[var(--color-gold-dark)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <span>Wider World</span>
            {scope === "wider_world" && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-gold)] rounded-full" />
            )}
          </button>
        </div>

        {/* Share Action */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-gold px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <PenSquare size={13} />
          <span>Share</span>
        </button>
      </div>

      {/* 2. Quiet Active Concept Filter Header (Section 11) */}
      {conceptId && (
        <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)] text-xs">
          <span className="font-semibold text-[var(--color-text-primary)]">
            {conceptName || "Concept"}
          </span>
          <button
            onClick={clearConceptFilter}
            className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer font-medium"
          >
            × Clear filter
          </button>
        </div>
      )}

      {/* Create Post Modal Drawer */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Share Learner Experience">
        <CreatePost
          onPostCreated={(newPost) => {
            handlePostCreated(newPost);
            setShowCreateModal(false);
          }}
        />
      </Modal>

      {/* 3. Feed Stream */}
      <div className="min-h-[250px]">
        {loading && posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-2">
            <Loader2 size={18} className="animate-spin text-[var(--color-gold)]" />
            <p className="text-xs text-[var(--color-mid-gray)]">Gathering learner experiences...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            {conceptId ? (
              <>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  No notes shared yet for {conceptName || "this concept"}.
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
                  Be the first learner to share an insight or reflection for this concept.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer mt-2"
                >
                  <span>Share first takeaway</span>
                </button>
              </>
            ) : scope === "my_world" ? (
              <>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Your learning world is still quiet.
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
                  Follow people you find useful, or keep learning and your world will grow with you.
                </p>
                <button
                  onClick={() => navigate("/learn")}
                  className="text-xs font-bold text-[var(--color-gold-dark)] hover:underline inline-flex items-center gap-1 cursor-pointer mt-3"
                >
                  <span>Continue learning →</span>
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  There's more to discover.
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
                  Explore what other learners are building, learning, and figuring out.
                </p>
              </>
            )}
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {hasMore && (
              <div className="py-6 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={fetchingMore}
                  className="text-xs font-bold text-[var(--color-gold-dark)] hover:underline inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {fetchingMore ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span>Loading more...</span>
                    </>
                  ) : (
                    <span>Load more updates ↓</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
