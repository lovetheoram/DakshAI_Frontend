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
    <div className="mt-3">
      {comments.map((c) => (
        <div key={c.id} className="border-b py-2">
          <b>{c.user.username}</b>: {c.content}
        </div>
      ))}

      <div className="flex gap-2 mt-3">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Write a comment…"
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
        />
        <button
          onClick={addComment}
          className="bg-blue-600 text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
