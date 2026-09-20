import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socialApi from "../../api/socialApi";
import Modal from "../ui/Modal";
import { Send, Loader2, MessageSquare } from "lucide-react";

export default function Comments({ postId, post, isOpen, onClose, initialComments = [], isInline = false }) {
  const navigate = useNavigate();
  const [comments, setComments] = useState(initialComments);
  const [txt, setTxt] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (postId && (isOpen || isInline)) {
      setLoading(true);
      socialApi.getComments(postId)
        .then((res) => {
          setComments(res.data?.comments || res.data || []);
        })
        .catch((err) => {
          console.error("Error loading comments:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [postId, isOpen, isInline]);

  const addComment = async () => {
    if (!txt.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await socialApi.addComment(postId, txt);
      const newComment = res.data?.data || res.data;
      setComments((prev) => [newComment, ...prev]);
      setTxt("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderCommentsBody = () => (
    <div className="space-y-4 pt-2">
      {/* Scrollable Comments Stream */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
        {loading ? (
          <div className="flex items-center justify-center py-6 gap-2">
            <Loader2 size={16} className="animate-spin text-amber-500" />
            <span className="text-xs text-slate-400 font-medium">Loading peer discussions...</span>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4 bg-slate-950/40 rounded-xl border border-slate-800">
            No comments yet. Be the first peer to join the discussion!
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id || Math.random()} className="flex gap-3 items-start text-xs">
              <div
                onClick={() => c.user?.id && navigate(`/user/${c.user.id}`)}
                className="w-7 h-7 rounded-full bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/30 flex items-center justify-center font-bold text-[10px] shrink-0 cursor-pointer"
              >
                {c.user?.username?.charAt(0).toUpperCase() || "P"}
              </div>
              <div className="flex-1 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span
                    onClick={() => c.user?.id && navigate(`/user/${c.user.id}`)}
                    className="font-bold text-[var(--color-text-primary)] hover:text-[var(--color-gold-dark)] transition-colors cursor-pointer"
                  >
                    {c.user?.username || "Peer"}
                  </span>
                  <span className="text-[9px] text-slate-500">
                    {c.created_at ? new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                  </span>
                </div>
                <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap select-text">{c.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Input Bar */}
      <div className="flex gap-2 pt-2 border-t border-slate-800">
        <input
          className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500/60 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition"
          placeholder="Write a constructive peer comment..."
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addComment()}
        />
        <button
          onClick={addComment}
          disabled={submitting || !txt.trim()}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition active:scale-[0.97] flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
          <span>Post</span>
        </button>
      </div>
    </div>
  );

  if (isInline) {
    return renderCommentsBody();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Peer Comments" maxWidth="max-w-lg">
      <div className="flex flex-col h-[480px]">
        {post && (
          <div className="pb-3 mb-3.5 border-b border-slate-800 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {post.user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-slate-100 text-xs mr-2">{post.user?.username}</span>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed mt-0.5">{post.content}</p>
            </div>
          </div>
        )}
        {renderCommentsBody()}
      </div>
    </Modal>
  );
}

