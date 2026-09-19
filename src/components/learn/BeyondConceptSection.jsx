// src/components/learn/BeyondConceptSection.jsx
// Organic Learner Takeaways & World Bridge section for ConceptSession.

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, PenSquare } from "lucide-react";
import socialApi from "../../api/socialApi";
import CreatePost from "../social/CreatePost";
import Modal from "../ui/Modal";

export default function BeyondConceptSection({ conceptId, conceptName }) {
  const navigate = useNavigate();
  const [learnerPosts, setLearnerPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchConceptPosts = async () => {
      try {
        setLoadingPosts(true);
        let res = conceptId ? await socialApi.getPosts({ concept_id: conceptId, page_size: 4 }) : null;
        let posts = res?.data?.posts || [];
        
        // Fallback: if no posts tagged specifically to this concept ID, load recent community posts
        if (posts.length === 0) {
          const fallbackRes = await socialApi.getPosts({ page_size: 3 });
          posts = fallbackRes.data?.posts || [];
        }

        setLearnerPosts(posts);
      } catch (err) {
        console.error("Failed to load concept posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchConceptPosts();
  }, [conceptId]);

  return (
    <div className="pt-6 border-t border-[var(--color-border)] select-none">
      
      {/* ── WHAT OTHER LEARNERS FOUND (Organic Bridge to World) ── */}
      <div className="space-y-3 daksh-card p-5 border-l-2 border-l-[var(--color-gold)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare size={14} className="text-[var(--color-gold)]" />
              What Other Learners Found
            </h3>
            <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
              Real takeaways and strategies shared on {conceptName || "this concept"}.
            </p>
          </div>

          <button
            onClick={() => setShowShareModal(true)}
            className="btn-gold px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <PenSquare size={12} />
            <span>Share Insight</span>
          </button>
        </div>

        {/* Micro-prompt */}
        <p className="text-[11px] text-[var(--color-text-secondary)] italic border-l border-[var(--color-border)] pl-2.5">
          "Learned something? Share it. The more you share what you learn, the more you grow."
        </p>

        {/* Learner Experiences Stream */}
        {learnerPosts.length > 0 ? (
          <div className="space-y-2 pt-1">
            {learnerPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="p-3 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[var(--color-text-primary)]">{post.user?.username || "Learner"}</span>
                  <span className="text-[9px] font-bold text-[var(--color-gold-dark)] bg-[var(--color-gold-pale)] px-2 py-0.5 rounded-md uppercase">
                    {post.content_type === "strategy" ? "Strategy" : "Learning"}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-normal">
                  "{post.content}"
                </p>
              </div>
            ))}

            <div className="pt-1 text-right">
              <button
                onClick={() => navigate(`/world?concept_id=${conceptId}&concept_name=${encodeURIComponent(conceptName || "")}`)}
                className="text-xs font-bold text-[var(--color-gold-dark)] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>See all learner experiences in World →</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-[var(--color-mid-gray)] pt-1 flex items-center justify-between">
            <span>No learner notes shared for this concept yet. Be the first!</span>
            <button
              onClick={() => setShowShareModal(true)}
              className="text-xs font-bold text-[var(--color-gold-dark)] hover:underline cursor-pointer"
            >
              Share first takeaway →
            </button>
          </div>
        )}
      </div>

      {/* Share Insight Modal */}
      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title={`Share Learning on ${conceptName || "Concept"}`}>
        <CreatePost
          conceptId={conceptId}
          initialContentType="learning"
          onPostCreated={(newPost) => {
            setLearnerPosts((prev) => [newPost, ...prev]);
            setShowShareModal(false);
          }}
        />
      </Modal>

    </div>
  );
}
