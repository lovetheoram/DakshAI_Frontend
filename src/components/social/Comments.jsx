import { useEffect, useState } from "react";
import socialApi from "../../api/socialApi";
import Modal from "../ui/Modal";
import { Send, Loader2 } from "lucide-react";

export default function Comments({ postId, post, isOpen, onClose }) {
  const [comments, setComments] = useState([]);
  const [txt, setTxt] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      socialApi.getComments(postId)
        .then((res) => {
          setComments(res.data.comments || []);
        })
        .catch(() => setComments([]))
        .finally(() => setLoading(false));
    }
  }, [postId, isOpen]);

  const addComment = async () => {
    if (!txt.trim()) return;

    try {
      const res = await socialApi.addComment(postId, txt);
      const newComment = res.data.data;
      setComments((prev) => [newComment, ...prev]);
      setTxt("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Comments" maxWidth="max-w-lg">
      <div className="flex flex-col h-[480px]">
        
        {/* Parent Post Context (Instagram-style) */}
        {post && (
          <div className="pb-3 mb-3.5 border-b border-white/[0.06] flex gap-3 items-start">
            <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              {post.user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-white text-xs mr-2">{post.user?.username}</span>
              <p className="text-xs text-gray-300 whitespace-pre-line leading-relaxed mt-0.5">{post.content}</p>
            </div>
          </div>
        )}

        {/* Scrollable Comments List */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
          {loading ? (
            <div className="flex items-center justify-center py-10 gap-2">
              <Loader2 size={16} className="animate-spin text-purple-400" />
              <span className="text-xs text-gray-500">Loading comments...</span>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-12">No comments yet. Start the conversation!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  {c.user?.username?.charAt(0).toUpperCase() || "C"}
                </div>
                <div className="flex-1 bg-white/[0.02] border border-white/[0.04] rounded-2xl px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-300 text-[10px]">{c.user?.username}</span>
                    <span className="text-[8px] text-gray-600">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="text-xs text-gray-200 mt-0.5 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pinned Input Toolbar (Instagram-style) */}
        <div className="flex gap-2 mt-3.5 pt-3 border-t border-white/[0.06]">
          <input
            className="flex-1 bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-purple-500 transition-all duration-200"
            placeholder="Add a comment..."
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addComment()}
          />
          <button
            onClick={addComment}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-4 rounded-xl shadow-lg transition active:scale-[0.98] flex items-center gap-1"
          >
            <Send size={10} />
            Post
          </button>
        </div>
      </div>
    </Modal>
  );
}
