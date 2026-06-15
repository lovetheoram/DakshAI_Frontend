import { useEffect, useState } from "react";
import socialApi from "../../api/socialApi";

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [txt, setTxt] = useState("");

  useEffect(() => {
    socialApi.getComments(postId).then((res) => {
      // backend returns { post, comments: [...] }
      setComments(res.data.comments || []);
    });
  }, [postId]);

  const addComment = async () => {
    if (!txt.trim()) return;

    const res = await socialApi.addComment(postId, txt);

    // backend returns { message, data: {...comment...} }
    const newComment = res.data.data;

    setComments((prev) => [newComment, ...prev]);
    setTxt("");
  };

  return (
    <div className="mt-3 space-y-2.5">
      <div className="max-h-[240px] overflow-y-auto pr-1 space-y-2">
        {comments.map((c) => (
          <div key={c.id} className="bg-slate-950/40 border border-white/5 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-300">
            <span className="font-extrabold text-purple-400 mr-2">{c.user.username}</span>
            <span className="leading-relaxed whitespace-pre-wrap">{c.content}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3 pt-2 border-t border-white/5">
        <input
          className="flex-1 bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-all duration-200"
          placeholder="Write a comment…"
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
        />
        <button
          onClick={addComment}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm px-4 rounded-xl shadow-lg transition active:scale-[0.98]"
        >
          Send
        </button>
      </div>
    </div>
  );
}
