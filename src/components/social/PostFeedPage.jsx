// src/pages/social/PostFeedPage.jsx
import { useEffect, useState } from "react";
import socialApi from "../../api/socialApi";
import PostCard from "../../components/social/PostCard";

export default function PostFeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await socialApi.listPosts();
      setPosts(data.posts);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading posts...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {posts.length === 0 && (
        <div className="text-gray-500 text-center">No posts yet.</div>
      )}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
      ))}
    </div>
  );
}
