

// // PostCard.jsx
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { Heart, MessageCircle, Share2, Bookmark, TrendingUp, FileText } from "lucide-react";
// import Comments from "./Comments";
// import socialApi from "../../api/socialApi";

// export default function PostCard({ post, onConceptClick }) {
//   const navigate = useNavigate();

//   // ======== SAFE DEFAULTS ========
//   const [showComments, setShowComments] = useState(false);
//   const [liked, setLiked] = useState(post.is_liked ?? false);
//   const [likes, setLikes] = useState(Number(post.likes_count) || 0);
//   const [isFollowing, setIsFollowing] = useState(post.user?.is_following ?? false);
//   const [bookmarked, setBookmarked] = useState(false);
//   const isOwnPost = post.user?.is_self ?? false;

//   // ================= ACTIONS =================
//   const toggleLike = async () => {
//     try {
//       if (liked) {
//         await socialApi.unlikePost(post.id);
//         setLikes((l) => Math.max(0, l - 1));
//       } else {
//         await socialApi.likePost(post.id);
//         setLikes((l) => l + 1);
//       }
//       setLiked(!liked);
//     } catch (err) {
//       console.error("Like error", err);
//     }
//   };

//   const toggleFollow = async () => {
//     try {
//       if (isFollowing) {
//         await socialApi.unfollowUser(post.user.id);
//       } else {
//         await socialApi.followUser(post.user.id);
//       }
//       setIsFollowing(!isFollowing);
//     } catch (err) {
//       console.error("Follow error", err);
//     }
//   };

//   const toggleBookmark = () => setBookmarked(!bookmarked);

//   const goToChat = () => navigate(`/messages/${post.user.id}`);

//   return (
//     <motion.div 
//       layout
//       className="bg-white border border-gray-200 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative"
//     >
//       {/* Trending Badge */}
//       {likes > 10 && (
//         <motion.div
//           initial={{ scale: 0, rotate: -45 }}
//           animate={{ scale: 1, rotate: 0 }}
//           className="absolute top-4 right-4 z-10 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center"
//         >
//           <TrendingUp size={12} className="mr-1" />
//           Trending
//         </motion.div>
//       )}

//       <div className="p-6">
//         {/* Header */}
//         <div className="flex justify-between items-start mb-4">
//           <div className="flex items-center space-x-3">
//             <motion.div 
//               whileHover={{ scale: 1.1, rotate: 5 }}
//               className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg"
//             >
//               {post.user?.username?.charAt(0)?.toUpperCase() || "U"}
//             </motion.div>
//             <div>
//               <h4 className="font-bold text-gray-800 text-lg">{post.user?.username}</h4>
//               {post.concept_name && (
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   onClick={() => onConceptClick?.(post.concept_id)}
//                   className="inline-flex items-center text-sm bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded-full font-semibold transition-colors mt-1"
//                 >
//                   <span className="mr-1">#</span>
//                   {post.concept_name}
//                 </motion.button>
//               )}
//             </div>
//           </div>

//           {!isOwnPost && (
//             <div className="flex items-center gap-3">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={toggleFollow}
//                 className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
//                   isFollowing
//                     ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                     : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
//                 }`}
//               >
//                 {isFollowing ? "Following" : "Follow"}
//               </motion.button>
//               {/* Chat */}
//     <motion.button
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//       onClick={goToChat}
//       className="px-4 py-2 rounded-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
//     >
//       Chat
//     </motion.button>
//               {/* <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={toggleBookmark}
//                 className={`p-2 rounded-full transition-colors ${
//                   bookmarked ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                 }`}
//               >
//                 <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
//               </motion.button> */}
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         {post.content && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
//             <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
//               {post.content}
//             </p>
//           </motion.div>
//         )}

//         {/* Media */}
//         <AnimatePresence>
//           {post.media?.length > 0 && (
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 space-y-4">
//               {post.media.map((m, idx) => {
//                 if (m.type === "image") {
//                   return (
//                     <motion.div key={idx} whileHover={{ scale: 1.02 }} className="overflow-hidden rounded-2xl border border-gray-200">
//                       <img src={m.url} alt="post media" className="w-full object-cover max-h-96" />
//                     </motion.div>
//                   );
//                 }
//                 if (m.type === "video") {
//                   return (
//                     <motion.div key={idx} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="aspect-video rounded-2xl overflow-hidden border border-gray-200">
//                       <iframe src={m.url} title="video" className="w-full h-full" allowFullScreen />
//                     </motion.div>
//                   );
//                 }
//                 if (m.type === "doc") {
//                   return (
//                     <motion.a key={idx} whileHover={{ scale: 1.02, x: 4 }} href={m.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors">
//                       <div className="p-2 bg-blue-100 rounded-lg">
//                         <FileText size={20} className="text-blue-600" />
//                       </div>
//                       <span className="text-blue-600 font-medium">Open Document</span>
//                     </motion.a>
//                   );
//                 }
//                 return null;
//               })}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Action Bar */}
//         <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//           <div className="flex items-center gap-6">
//             <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleLike} className="flex items-center gap-2 group">
//               <div className={`p-2 rounded-full transition-all duration-200 ${liked ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 group-hover:bg-red-100 group-hover:text-red-600"}`}>
//                 <Heart size={18} fill={liked ? "currentColor" : "none"} />
//               </div>
//               <motion.span key={likes} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className={`font-semibold ${liked ? "text-red-600" : "text-gray-600"}`}>
//                 {likes}
//               </motion.span>
//             </motion.button>

//             <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 group">
//               <div className="p-2 bg-gray-100 text-gray-600 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-all duration-200">
//                 <MessageCircle size={18} />
//               </div>
//               <span className="text-gray-600 group-hover:text-blue-600 font-semibold transition-colors">
//                 Comments
//               </span>
//             </motion.button>

//             <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex items-center gap-2 group">
//               <div className="p-2 bg-gray-100 text-gray-600 rounded-full group-hover:bg-green-100 group-hover:text-green-600 transition-all duration-200">
//                 <Share2 size={18} />
//               </div>
//               <span className="text-gray-600 group-hover:text-green-600 font-semibold transition-colors">
//                 Share
//               </span>
//             </motion.button>
//           </div>

//           {/* Engagement Score */}
//           <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="flex items-center bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full font-semibold text-sm text-purple-700">
//             <TrendingUp size={16} className="mr-1" />
//             {likes > 10 ? "Hot Post!" : "New Post"}
//           </motion.div>
//         </div>

//         {/* Comments Section */}
//         <AnimatePresence>
//           {showComments && (
//             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 border-t border-gray-100 pt-4">
//               <Comments postId={post.id} />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </motion.div>
//   );
// }



// PostCard.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, Bookmark, TrendingUp, FileText, X, Send } from "lucide-react";
import Comments from "./Comments";
import socialApi from "../../api/socialApi";

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes('youtube.com/embed/')) {
    return url.replace('youtube.com', 'youtube-nocookie.com');
  }
  if (url.includes('youtube-nocookie.com/embed/')) return url;
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  const long = url.match(/v=([a-zA-Z0-9_-]+)/);
  const id = short?.[1] || long?.[1];
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
};

export default function PostCard({ post, onConceptClick }) {
  const navigate = useNavigate();

  // ======== STATE ========
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(post.is_liked ?? false);
  const [likes, setLikes] = useState(Number(post.likes_count) || 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(post.user?.is_following ?? false);
  const isOwnPost = post.user?.is_self ?? false;

  // ======== ACTIONS ========
  const toggleLike = async () => {
    try {
      if (liked) {
        await socialApi.unlikePost(post.id);
        setLikes((l) => Math.max(0, l - 1));
      } else {
        await socialApi.likePost(post.id);
        setLikes((l) => l + 1);
      }
      setLiked(!liked);
    } catch (err) {
      console.error("Like error", err);
    }
  };

  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await socialApi.unfollowUser(post.user.id);
      } else {
        await socialApi.followUser(post.user.id);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow error", err);
    }
  };

  const toggleBookmark = () => setBookmarked(!bookmarked);

  const goToChat = () => {
    const targetId = post.user?.id;
    if (!targetId) {
      alert("Unable to open chat: recipient ID is missing.");
      return;
    }
    navigate(`/messages/${targetId}`);
  };

  return (
    <motion.div layout className="bg-white border rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden">
      {/* Trending Badge */}
      {likes > 10 && (
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute top-4 right-4 z-10 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center"
        >
          <TrendingUp size={12} className="mr-1" />
          Trending
        </motion.div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg"
            >
              {post.user?.username?.charAt(0)?.toUpperCase() || "U"}
            </motion.div>
            <div>
              <h4 className="font-bold text-gray-800 text-lg">{post.user?.username}</h4>
              {post.concept_name && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => onConceptClick?.(post.concept_id)}
                  className="inline-flex items-center text-sm bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded-full font-semibold transition-colors mt-1"
                >
                  <span className="mr-1">#</span>
                  {post.concept_name}
                </motion.button>
              )}
            </div>
          </div>

          {!isOwnPost && (
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFollow}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
                  isFollowing
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToChat}
                className="px-4 py-2 rounded-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
              >
                Chat
              </motion.button>
            </div>
          )}
        </div>

        {/* Content */}
        {post.content && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">{post.content}</p>
          </motion.div>
        )}

        {/* Media */}
        <AnimatePresence>
          {post.media?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 space-y-4">
              {post.media.map((m, idx) => {
                if (m.type === "image") {
                  return (
                    <motion.div key={idx} whileHover={{ scale: 1.02 }} className="overflow-hidden rounded-2xl border border-gray-200">
                      <img src={m.url} alt="post media" className="w-full object-cover max-h-96" />
                    </motion.div>
                  );
                }
                if (m.type === "video") {
                  const embedUrl = getYouTubeEmbedUrl(m.url);
                  return (
                    <motion.div key={idx} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="aspect-video rounded-2xl overflow-hidden border border-gray-200">
                      {embedUrl ? (
                        <iframe src={embedUrl} title="video" className="w-full h-full" allowFullScreen />
                      ) : (
                        <a href={m.url} target="_blank" rel="noreferrer" className="flex items-center justify-center h-full bg-gray-100 hover:bg-gray-200 text-red-500 font-bold p-4 transition-colors">
                          Watch Video Link: {m.url}
                        </a>
                      )}
                    </motion.div>
                  );
                }
                if (m.type === "doc") {
                  return (
                    <motion.a key={idx} whileHover={{ scale: 1.02, x: 4 }} href={m.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText size={20} className="text-blue-600" />
                      </div>
                      <span className="text-blue-600 font-medium">Open Document</span>
                    </motion.a>
                  );
                }
                return null;
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-6">
            {/* Like */}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleLike} className="flex items-center gap-2 group">
              <div className={`p-2 rounded-full transition-all duration-200 ${liked ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 group-hover:bg-red-100 group-hover:text-red-600"}`}>
                <Heart size={18} fill={liked ? "currentColor" : "none"} />
              </div>
              <motion.span key={likes} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className={`font-semibold ${liked ? "text-red-600" : "text-gray-600"}`}>{likes}</motion.span>
            </motion.button>

            {/* Comments */}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 group">
              <div className="p-2 bg-gray-100 text-gray-600 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-all duration-200">
                <MessageCircle size={18} />
              </div>
              <span className="text-gray-600 group-hover:text-blue-600 font-semibold transition-colors">Comments</span>
            </motion.button>

            {/* Share */}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex items-center gap-2 group">
              <div className="p-2 bg-gray-100 text-gray-600 rounded-full group-hover:bg-green-100 group-hover:text-green-600 transition-all duration-200">
                <Share2 size={18} />
              </div>
              <span className="text-gray-600 group-hover:text-green-600 font-semibold transition-colors">Share</span>
            </motion.button>

            {/* Direct DM (Chat) */}
            {post.user && !isOwnPost && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={goToChat}
                className="flex items-center gap-2 group"
              >
                <div className="p-2 bg-gray-100 text-gray-600 rounded-full group-hover:bg-purple-100 group-hover:text-purple-600 transition-all duration-200">
                  <Send size={18} className="transform -rotate-12" />
                </div>
                <span className="text-gray-600 group-hover:text-purple-600 font-semibold transition-colors">Chat</span>
              </motion.button>
            )}
          </div>

          
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 border-t border-gray-100 pt-4">
              <Comments postId={post.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
