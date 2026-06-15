// import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
// import PostCard from './PostCard'
// import NotificationsPanel from './NotificationsPanel'
// import socialApi from '../../api/socialApi'

// export default function SocialFeedPage({ userId }) {
//   const [posts, setPosts] = useState([])
//   const [loading, setLoading] = useState(true)

//   const fetch = async () => {
//     setLoading(true)
//     try {
//       const data = await socialApi.listPosts()
//       setPosts(Array.isArray(data) ? data : data.posts || [])
//     } catch (e) { console.error(e); setPosts([]) }
//     finally { setLoading(false) }
//   }

//   const handleLikeToggle = (postId, newLiked) => {
//     setPosts(prev => prev.map(p => p.id===postId ? {...p, liked:!!newLiked, likes_count: Math.max(0, (p.likes_count||0) + (newLiked?1:-1))} : p))
//   }

//   useEffect(()=>{ fetch() }, [])

//   return (
//     <div className="flex gap-6 p-4">
//       <div className="flex-1">
//         <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Social Feed</h1>
//         {loading ? <p>Loading posts...</p> :
//           posts.length===0 ? <p>No posts yet.</p> :
//           posts.map(p => <PostCard key={p.id} post={p} onLikeToggle={handleLikeToggle} />)
//         }
//       </div>

//       <NotificationsPanel userId={userId} />
//     </div>
//   )
// }

// SocialFeedPage.propTypes = { userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) }


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
