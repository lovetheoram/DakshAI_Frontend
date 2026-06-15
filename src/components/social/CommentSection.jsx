// src/components/social/CommentSection.jsx
import { useEffect, useState } from "react";
import socialApi from "../../api/socialApi";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await socialApi.getComments(postId);
      setComments(data.comments);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddComment = async () => {
    if (!text.trim()) return;
    try {
      await socialApi.addComment({ postId, content: text });
      setText("");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="mt-2 border-t pt-2">
      {loading ? (
        <div className="text-gray-500">Loading comments...</div>
      ) : (
        <div className="space-y-1">
          {comments.map((c) => (
            <div key={c.id} className="text-sm">
              <span className="font-semibold">{c.user.username}: </span>
              {c.content}
            </div>
          ))}
        </div>
      )}
      <div className="flex mt-2 gap-2">
        <input
          type="text"
          className="border rounded px-2 py-1 flex-1"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
