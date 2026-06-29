import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import syllabusApi from "../api/syllabusApi";
import progressApi from "../api/progressApi";
import GlassCard from "../components/ui/GlassCard";
import ProgressBar from "../components/ui/ProgressBar";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import ConceptSession from "../components/learn/ConceptSession";
import Drawer from "../components/ui/Drawer";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, ArrowLeft, Network, List, RefreshCw, Star } from "lucide-react";

export const getMasteryPercent = (mastery) => {
  if (Array.isArray(mastery)) {
    return Math.round(((mastery[0] + (mastery[1] ?? mastery[0])) / 2) * 100);
  }
  if (typeof mastery === "number") {
    if (mastery <= 1.0) {
      return Math.round(mastery * 100);
    }
    return Math.round(mastery);
  }
  return 0;
};

// ==========================================
// SubtopicNode: large animated bubble orb
// ==========================================
function SubtopicNode({ subtopic, themeIdx, onClick }) {
  const [efficiency, setEfficiency] = useState(0);

  // Theme colors for active orbs
  const themes = [
    { primary: "#a855f7", secondary: "#c084fc", glow: "#7c3aed" }, // Purple
    { primary: "#3b82f6", secondary: "#60a5fa", glow: "#2563eb" }, // Blue
    { primary: "#10b981", secondary: "#34d399", glow: "#059669" }, // Green
    { primary: "#f59e0b", secondary: "#fbbf24", glow: "#d97706" }  // Amber
  ];
  const activeTheme = themes[themeIdx % themes.length];

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await progressApi.getSubtopic(subtopic.id);
        setEfficiency(data?.efficiency ?? 0);
      } catch (err) {
        console.error("Failed to load subtopic efficiency:", err);
      }
    };
    fetchProgress();
  }, [subtopic.id]);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        onClick={onClick}
        className="relative cursor-pointer w-24 h-24 sm:w-28 sm:h-28 select-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className="w-full h-full rounded-full border-2 relative overflow-hidden"
          style={{
            borderColor: activeTheme.secondary,
            boxShadow: `0 0 20px ${activeTheme.glow}30`,
            background: `radial-gradient(circle at 50% 50%, ${activeTheme.primary}15, #00000020)`,
          }}
        >
          {/* Efficiency Liquid Fill */}
          <motion.div
            className="absolute bottom-0 left-0 w-full rounded-b-full pointer-events-none"
            style={{
              height: `${efficiency * 100}%`,
              background: `linear-gradient(to top, ${activeTheme.glow}60, ${activeTheme.primary}30)`,
            }}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Label HUD */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 p-2">
            <span className="text-base sm:text-lg">🔮</span>
            <h4 className="font-bold text-white text-[9px] sm:text-xs leading-tight mt-1 px-1">
              {subtopic.name}
            </h4>
            <span className="text-[7px] sm:text-[9px] text-gray-400 mt-0.5">
              {Math.round(efficiency * 100)}%
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// LearnPage Main Component
// ==========================================
export default function LearnPage() {
  const { conceptId } = useParams();
  const navigate = useNavigate();
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("mindmap");

  // List View states
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);

  // Tech Tree Mind Map states
  const [activeSubjectIndex, setActiveSubjectIndex] = useState(0);
  const [drawerSubtopic, setDrawerSubtopic] = useState(null);

  // Dynamic concept cache
  const [conceptsCache, setConceptsCache] = useState({});
  const [conceptsLoading, setConceptsLoading] = useState({});

  useEffect(() => {
    const fetchTree = async () => {
      try {
        setLoading(true);
        const data = await syllabusApi.getTree();
        setTree(data);
      } catch (err) {
        console.error("Failed to load tree:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTree();
  }, []);

  // Fetch concepts for a subtopic
  const loadConcepts = async (subtopicId) => {
    if (conceptsCache[subtopicId] || conceptsLoading[subtopicId]) return;

    try {
      setConceptsLoading((prev) => ({ ...prev, [subtopicId]: true }));
      const data = await syllabusApi.getSubtopicConcepts(subtopicId);
      setConceptsCache((prev) => ({ ...prev, [subtopicId]: data || [] }));
    } catch (err) {
      console.error(`Failed to load concepts for subtopic ${subtopicId}:`, err);
    } finally {
      setConceptsLoading((prev) => ({ ...prev, [subtopicId]: false }));
    }
  };

  const handleSubtopicClick = (subtopic) => {
    setDrawerSubtopic(subtopic);
    loadConcepts(subtopic.id);
  };

  if (conceptId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate("/learn")}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to subjects
        </button>
        <ConceptSession conceptId={conceptId} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <SkeletonLoader lines={2} />
        <SkeletonLoader lines={3} />
        <SkeletonLoader lines={2} />
      </div>
    );
  }

  // Extract Subjects safely
  const subjects = [];
  if (tree?.exams) {
    tree.exams.forEach((exam) => {
      exam.subjects?.forEach((s) => {
        if (!subjects.find((sub) => sub.id === s.id)) {
          subjects.push(s);
        }
      });
    });
  } else if (tree?.subjects) {
    subjects.push(...tree.subjects);
  } else if (Array.isArray(tree)) {
    subjects.push(...tree);
  }

  const currentSubject = subjects[activeSubjectIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      
      {/* Header View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Learning Space</h1>
          <p className="text-xs text-gray-500 mt-0.5">Explore your syllabus concept mapping.</p>
        </div>

        <div className="flex items-center bg-white/[0.02] border border-white/[0.06] rounded-xl p-1">
          <button
            onClick={() => setViewMode("mindmap")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "mindmap"
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Network size={12} />
            Map
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "list"
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <List size={12} />
            List
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ================= MIND MAP VIEW ================= */}
        {viewMode === "mindmap" && (
          <motion.div
            key="mindmap"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Subject selector button bar */}
            <div className="flex flex-wrap gap-2 justify-center">
              {subjects.map((subject, idx) => (
                <button
                  key={subject.id || idx}
                  onClick={() => setActiveSubjectIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    activeSubjectIndex === idx
                      ? "bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-md shadow-purple-500/10"
                      : "bg-white/[0.02] border-white/[0.04] text-gray-400 hover:text-white"
                  }`}
                >
                  {subject.name}
                </button>
              ))}
            </div>

            {/* Subtopic pipelines */}
            {currentSubject && (
              <div className="space-y-6">
                {(currentSubject.topics || []).map((topic, topicIdx) => (
                  <GlassCard key={topic.id || topicIdx} className="relative overflow-hidden" padding="p-5">
                    <div className="flex items-center justify-between mb-4 border-b border-white/[0.03] pb-2">
                      <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">
                        {topic.name}
                      </span>
                    </div>

                    <div className="relative py-2 flex items-center justify-center">
                      <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent pointer-events-none" />
                      
                      <div className="relative z-10 flex flex-wrap justify-center gap-6 sm:gap-10 w-full">
                        {(topic.subtopics || []).map((subtopic, subIdx) => (
                          <SubtopicNode
                            key={subtopic.id || subIdx}
                            subtopic={subtopic}
                            themeIdx={subIdx}
                            onClick={() => handleSubtopicClick(subtopic)}
                          />
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ================= ACCORDION LIST VIEW ================= */}
        {viewMode === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3.5"
          >
            {subjects.map((subject, si) => (
              <div key={subject.id || si} className="space-y-2">
                <GlassCard
                  hover
                  onClick={() => setExpandedSubject(expandedSubject === si ? null : si)}
                  padding="p-4"
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen size={16} className="text-purple-400" />
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-white">{subject.name}</h3>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {subject.topics?.reduce((acc, t) => acc + (t.subtopics?.length || 0), 0) || 0} chapters
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={14}
                      className={`text-gray-500 transition-transform duration-200 ${
                        expandedSubject === si ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </GlassCard>

                {expandedSubject === si && (
                  <div className="ml-3 pl-3 border-l border-white/[0.04] space-y-2">
                    {subject.topics?.flatMap((topic) => topic.subtopics || []).map((chapter, ci) => (
                      <div key={chapter.id || ci} className="space-y-1.5">
                        <button
                          onClick={() => {
                            const isOpen = expandedChapter === `${si}-${ci}`;
                            setExpandedChapter(isOpen ? null : `${si}-${ci}`);
                            if (!isOpen) loadConcepts(chapter.id);
                          }}
                          className="w-full text-left px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors flex items-center justify-between"
                        >
                          <span className="text-xs font-semibold text-gray-300">{chapter.name}</span>
                          <ChevronRight
                            size={12}
                            className={`text-gray-600 transition-transform ${
                              expandedChapter === `${si}-${ci}` ? "rotate-90" : ""
                            }`}
                          />
                        </button>

                        {expandedChapter === `${si}-${ci}` && (
                          <div className="ml-3 pl-3 border-l border-white/[0.04] space-y-1">
                            {conceptsLoading[chapter.id] ? (
                              <p className="text-[10px] text-gray-500 py-2">Loading concepts...</p>
                            ) : (conceptsCache[chapter.id] || []).length === 0 ? (
                              <p className="text-[10px] text-gray-600 py-2">No concepts found.</p>
                            ) : (
                              (conceptsCache[chapter.id] || []).map((concept) => (
                                <button
                                  key={concept.id}
                                  onClick={() => navigate(`/learn/${concept.id}`)}
                                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-purple-300 hover:bg-purple-500/5 transition-all flex items-center justify-between"
                                >
                                  <span>{concept.name}</span>
                                  <ChevronRight size={12} className="text-gray-700" />
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-Up Concept Drawer (Fully Responsive for mindmap) */}
      <Drawer
        isOpen={!!drawerSubtopic}
        onClose={() => setDrawerSubtopic(null)}
        title={drawerSubtopic?.name}
        side="right"
      >
        {drawerSubtopic && (
          <div className="space-y-5">
            {/* Header / Chapter Telemetry */}
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
              <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
                Chapter Mastery Status
              </span>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Tapping a concept card below opens active formulas, pyq analysis, and progress attempts.
              </p>
            </div>

            {/* Concepts Listing */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">
                Concepts inside Chapter
              </span>

              {conceptsLoading[drawerSubtopic.id] ? (
                <div className="flex items-center justify-center py-10 gap-2">
                  <RefreshCw size={14} className="animate-spin text-purple-400" />
                  <span className="text-xs text-gray-500">Fetching neural concepts...</span>
                </div>
              ) : (conceptsCache[drawerSubtopic.id] || []).length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-6">No concepts found in this chapter.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {(conceptsCache[drawerSubtopic.id] || []).map((concept) => (
                    <button
                      key={concept.id}
                      onClick={() => {
                        setDrawerSubtopic(null);
                        navigate(`/learn/${concept.id}`);
                      }}
                      className="w-full text-left p-4 rounded-2xl bg-[#0f172a]/60 border border-white/[0.04] hover:bg-[#0f172a] hover:border-purple-500/30 transition-all flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-4">
                        <h4 className="font-bold text-white text-xs sm:text-sm group-hover:text-purple-300 truncate">
                          {concept.name}
                        </h4>
                        <p className="text-[9px] text-gray-500 mt-1">Tap to select concept node</p>
                      </div>
                      <ChevronRight size={14} className="text-gray-600 group-hover:text-purple-300 transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
