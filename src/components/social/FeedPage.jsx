// src/components/social/FeedPage.jsx
// World Activity Stream — 2-Scope Text Switcher, Concept Filter & Progressive Editorial Feed.

import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import socialApi from "../../api/socialApi";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import Modal from "../ui/Modal";
import { Loader2, PenSquare, X } from "lucide-react";

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

  const fetchFeed = useCallback(async (targetScope, pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setFetchingMore(true);

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
        setPosts((prev) => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      setHasMore(more);
    } catch (err) {
      console.error("Error fetching feed:", err);
      if (!append) setPosts([]);
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
      {/* 1. Context Switcher & Top Action */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
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

        {/* Share Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-gold px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <PenSquare size={13} />
          <span>Share</span>
        </button>
      </div>

      {/* 2. Active Concept Filter Bar (if filtered from Concept Page) */}
      {conceptId && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-gold-pale)]/60 border border-[var(--color-gold)]/30 text-xs">
          <span className="font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
            <span>Filtered by concept:</span>
            <span className="text-[var(--color-gold-dark)]">{conceptName || "Concept"}</span>
          </span>
          <button
            onClick={clearConceptFilter}
            className="p-1 rounded-lg text-[var(--color-gold-dark)] hover:bg-[var(--color-gold)]/20 transition-all cursor-pointer"
            title="Clear concept filter"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 3. Create Post Modal Drawer */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Share Learner Experience">
        <CreatePost
          onPostCreated={(newPost) => {
            handlePostCreated(newPost);
            setShowCreateModal(false);
          }}
        />
      </Modal>

      {/* 4. Feed Activity Stream */}
      <div className="min-h-[250px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-2">
            <Loader2 size={18} className="animate-spin text-[var(--color-gold)]" />
            <p className="text-xs text-[var(--color-mid-gray)]">Gathering learner experiences...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-3 daksh-card p-6">
            {conceptId ? (
              <>
                <p className="text-xs text-[var(--color-text-primary)] font-bold">
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
                <p className="text-xs text-[var(--color-text-primary)] font-bold">Your learning world is quiet.</p>
                <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
                  Start studying concepts or following peers to see updates from your immediate learning circle.
                </p>
                <button
                  onClick={() => navigate("/learn")}
                  className="btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer mt-2"
                >
                  <span>Continue learning</span>
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-[var(--color-text-primary)] font-bold">No public updates found.</p>
                <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
                  Check back later or share your own experience with the community.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {hasMore && (
              <div className="pt-4 text-center">
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
