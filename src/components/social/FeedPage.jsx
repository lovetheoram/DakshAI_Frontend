

// // FeedPage.jsx
// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import socialApi from "../../api/socialApi";
// import syllabusApi from "../../api/syllabusApi";
// import PostCard from "./PostCard";
// import CreatePost from "./CreatePost";
// import SuggestedUsers from "./SuggestedUsersPage";

// export default function FeedPage() {
//   const [posts, setPosts] = useState([]);
//   const [concepts, setConcepts] = useState([]);
//   const [selectedConcept, setSelectedConcept] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [feedScore, setFeedScore] = useState(1250);
//   const [streak, setStreak] = useState(7);
//   const [dailyGoal, setDailyGoal] = useState({ current: 3, target: 5 });

//   // Fetch concepts for filter
//   useEffect(() => {
//     const fetchConcepts = async () => {
//       try {
//         const data = await syllabusApi.getConceptList();
//         setConcepts(data);
//       } catch (err) {
//         console.error("Error fetching concepts:", err);
//         setConcepts([]);
//       }
//     };
//     fetchConcepts();
//   }, []);

//   // Fetch posts whenever filter changes
//   useEffect(() => {
//     const fetchPosts = async () => {
//       setLoading(true);
//       try {
//         console.log("Fetching posts for concept:", selectedConcept);
//         const filters = selectedConcept ? { concept_id: selectedConcept } : {};
//         const res = await socialApi.getPosts(filters);
//         console.log("Posts response:", res.data);
//         setPosts(res.data?.posts || []);
//       } catch (err) {
//         console.error("Error fetching posts:", err);
//         setPosts([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPosts();
//   }, [selectedConcept]);

//   const handlePostCreated = (newPost) => {
//     setPosts((prev) => [newPost, ...prev]);
//     setFeedScore(prev => prev + 50);
//     setDailyGoal(prev => ({ ...prev, current: Math.min(prev.current + 1, prev.target) }));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       <div className="flex gap-6 max-w-7xl mx-auto p-6">
//         {/* MAIN FEED */}
//         <div className="w-2/3 space-y-6">
//           {/* GAMIFICATION DASHBOARD */}
          

//           {/* CREATE POST */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.2 }}
//           >
//             <CreatePost onPostCreated={handlePostCreated} />
//           </motion.div>

//           {/* FILTER SECTION */}
//           <motion.div 
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.3 }}
//             className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
//           >
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-xl font-bold text-gray-800 flex items-center">
//                 <motion.span 
//                   animate={{ rotate: [0, 10, -10, 0] }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                   className="mr-3 text-2xl"
//                 >
//                   🎯
//                 </motion.span>
//                 Smart Filters
//               </h3>
//               <AnimatePresence>
//                 {selectedConcept && (
//                   <motion.div
//                     initial={{ scale: 0, rotate: -180 }}
//                     animate={{ scale: 1, rotate: 0 }}
//                     exit={{ scale: 0, rotate: 180 }}
//                     className="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold"
//                   >
//                     <span className="mr-2">📌</span>
//                     Filter Active
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
            
//             <div className="flex items-center gap-4">
//               <label className="text-gray-700 font-semibold flex items-center text-lg">
//                 <span className="mr-3 text-xl">📚</span>
//                 Concept:
//               </label>
//               <div className="relative flex-1 max-w-md">
//                 <select
//                   className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-6 py-4 pr-12 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-200 w-full font-medium"
//                   value={selectedConcept || ""}
//                   onChange={(e) =>
//                     setSelectedConcept(e.target.value ? Number(e.target.value) : null)
//                   }
//                 >
//                   <option value="">✨ All Concepts</option>
//                   {concepts.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       🎓 {c.name}
//                     </option>
//                   ))}
//                 </select>
//                 <motion.div 
//                   animate={{ rotate: selectedConcept ? 180 : 0 }}
//                   className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none"
//                 >
//                   <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </motion.div>
//               </div>
              
//               <motion.div 
//                 layout
//                 className="flex items-center space-x-3"
//               >
//                 <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl px-4 py-3 text-sm">
//                   <span className="text-gray-600 mr-2">📊 Posts:</span>
//                   <motion.span 
//                     key={posts.length}
//                     initial={{ scale: 1.2 }}
//                     animate={{ scale: 1 }}
//                     className="font-bold text-gray-800 text-lg"
//                   >
//                     {posts.length}
//                   </motion.span>
//                 </div>
//               </motion.div>
//             </div>
//           </motion.div>

//           {/* POSTS SECTION */}
//           <AnimatePresence mode="wait">
//             {loading ? (
//               <motion.div
//                 key="loading"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="flex flex-col items-center justify-center py-20 space-y-6"
//               >
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                   className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full"
//                 />
//                 <motion.p 
//                   animate={{ opacity: [0.5, 1, 0.5] }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                   className="text-gray-600 font-semibold text-lg"
//                 >
//                   Loading amazing content...
//                 </motion.p>
//                 <div className="flex space-x-2">
//                   {[...Array(3)].map((_, i) => (
//                     <motion.div
//                       key={i}
//                       animate={{ scale: [1, 1.2, 1] }}
//                       transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
//                       className="w-3 h-3 bg-purple-400 rounded-full"
//                     />
//                   ))}
//                 </div>
//               </motion.div>
//             ) : posts.length === 0 ? (
//               <motion.div
//                 key="empty"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 className="bg-white rounded-3xl p-16 text-center shadow-xl border border-slate-200"
//               >
//                 <motion.div 
//                   animate={{ scale: [1, 1.1, 1] }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                   className="text-8xl mb-6"
//                 >
//                   🌟
//                 </motion.div>
//                 <h3 className="text-2xl font-bold text-gray-800 mb-3">No posts yet</h3>
//                 <p className="text-gray-500 mb-8 text-lg">Be the first to share something amazing!</p>
//                 <motion.button
//                   whileHover={{ scale: 1.05, rotate: 1 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center mx-auto"
//                 >
//                   <span className="mr-3">✨</span>
//                   Create First Post
//                 </motion.button>
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="posts"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="space-y-6"
//               >
//                 {posts.map((post, index) => (
//                   <motion.div
//                     key={post.id}
//                     initial={{ opacity: 0, y: 50 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     whileHover={{ y: -4, scale: 1.01 }}
//                   >
//                     <PostCard
//                       post={post}
//                       onConceptClick={(id) => setSelectedConcept(id)}
//                     />
//                   </motion.div>
//                 ))}
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* SUGGESTED USERS SIDEBAR */}
//         <motion.div 
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.4 }}
//           className="w-1/3"
//         >
//           {/* <SuggestedUsers /> */}
//         </motion.div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import socialApi from "../../api/socialApi";
import syllabusApi from "../../api/syllabusApi";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import SuggestedUsers from "./SuggestedUsersPage";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [loading, setLoading] = useState(true);

  const [feedScore, setFeedScore] = useState(1250);
  const [streak, setStreak] = useState(7);
  const [dailyGoal, setDailyGoal] = useState({ current: 3, target: 5 });

  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        const data = await syllabusApi.getConceptList();
        setConcepts(data);
      } catch (err) {
        console.error("Error fetching concepts:", err);
        setConcepts([]);
      }
    };
    fetchConcepts();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const filters = selectedConcept ? { concept_id: selectedConcept } : {};
        const res = await socialApi.getPosts(filters);
        setPosts(res.data?.posts || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [selectedConcept]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setFeedScore((prev) => prev + 50);
    setDailyGoal((prev) => ({ ...prev, current: Math.min(prev.current + 1, prev.target) }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 overflow-x-hidden text-white">
      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto p-4 md:p-6">
        {/* MAIN FEED */}
        <div className="flex-1 space-y-6">
          {/* CREATE POST */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <CreatePost onPostCreated={handlePostCreated} />
          </motion.div>

          {/* FILTER SECTION */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <h3 className="text-xl font-bold text-white flex items-center">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mr-3 text-2xl"
                >
                  🎯
                </motion.span>
                Smart Filters
              </h3>
              <AnimatePresence>
                {selectedConcept && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="flex items-center bg-purple-500/20 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    <span className="mr-2">📌</span>
                    Filter Active
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
              <label className="text-gray-300 font-semibold flex items-center text-lg">
                <span className="mr-3 text-xl">📚</span>
                Concept:
              </label>
              <div className="relative flex-1 max-w-full">
                <select
                  className="appearance-none bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 w-full font-medium text-sm sm:text-base text-white"
                  value={selectedConcept || ""}
                  onChange={(e) =>
                    setSelectedConcept(e.target.value ? Number(e.target.value) : null)
                  }
                >
                  <option value="" className="bg-slate-900 text-white">✨ All Concepts</option>
                  {concepts.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                      🎓 {c.name}
                    </option>
                  ))}
                </select>
                <motion.div
                  animate={{ rotate: selectedConcept ? 180 : 0 }}
                  className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>

              <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm flex items-center">
                  <span className="text-gray-400 mr-2">📊 Posts:</span>
                  <motion.span
                    key={posts.length}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="font-bold text-white text-lg"
                  >
                    {posts.length}
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* POSTS SECTION */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 space-y-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-white/10 border-t-purple-500 rounded-full"
                />
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-gray-400 font-semibold text-lg"
                >
                  Loading amazing content...
                </motion.p>
                <div className="flex space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      className="w-3 h-3 bg-purple-500 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            ) : posts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-12 sm:p-16 text-center shadow-2xl"
              >
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl sm:text-8xl mb-6">
                  🌟
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">No posts yet</h3>
                <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-lg">Be the first to share something amazing!</p>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-lg flex items-center mx-auto shadow-lg"
                >
                  <span className="mr-2 sm:mr-3">✨</span>
                  Create First Post
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                  >
                    <PostCard post={post} onConceptClick={(id) => setSelectedConcept(id)} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SUGGESTED USERS SIDEBAR */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full md:w-1/3 mt-6 md:mt-0"
        >
          <SuggestedUsers />
        </motion.div>
      </div>
    </div>
  );
}
