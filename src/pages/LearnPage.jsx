import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import syllabusApi from "../api/syllabusApi";
import progressApi from "../api/progressApi";
import GlassCard from "../components/ui/GlassCard";
import ProgressBar from "../components/ui/ProgressBar";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import ConceptSession from "../components/learn/ConceptSession";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, ArrowLeft, Network, List, RefreshCw } from "lucide-react";

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
// SubtopicNode: large animated water bubble
// ==========================================
function SubtopicNode({ subtopic, themeIdx, isOpen, onToggle, onSelectConcept, conceptsCache, conceptsLoading, loadConcepts }) {
  const [efficiency, setEfficiency] = useState(0);

  // Theme colors
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

  const handleToggle = () => {
    onToggle();
    if (!isOpen) {
      loadConcepts(subtopic.id);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Node Bubble */}
      <motion.div
        onClick={handleToggle}
        className="relative cursor-pointer w-28 h-28 sm:w-32 sm:h-32 select-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className="w-full h-full rounded-full border-2 relative overflow-hidden"
          style={{
            borderColor: activeTheme.secondary,
            boxShadow: `0 0 20px ${activeTheme.glow}40`,
            background: `radial-gradient(circle at 50% 50%, ${activeTheme.primary}15, #00000020)`,
          }}
        >
          {/* Efficiency Liquid Fill */}
          <motion.div
            className="absolute bottom-0 left-0 w-full rounded-b-full pointer-events-none"
            style={{
              height: `${efficiency * 100}%`,
              background: `linear-gradient(to top, ${activeTheme.glow}80, ${activeTheme.primary}40)`,
            }}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Label HUD */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 p-1">
            <span className="text-lg">🔮</span>
            <h4 className="font-bold text-white text-[10px] sm:text-xs leading-tight mt-1 px-1">
              {subtopic.name}
            </h4>
            <span className="text-[8px] text-gray-400 mt-0.5">
              {Math.round(efficiency * 100)}% COMPLETE
            </span>
          </div>
        </div>
      </motion.div>

      {/* Concept branching branches */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full overflow-hidden mt-4"
          >
            <div className="flex flex-wrap gap-3 justify-center py-2 border-t border-white/[0.04] mt-2">
              {conceptsLoading[subtopic.id] ? (
                <div className="text-[10px] text-gray-500 flex items-center gap-1.5 py-2 animate-pulse">
                  <RefreshCw size={10} className="animate-spin" />
                  Syncing concepts...
                </div>
              ) : (conceptsCache[subtopic.id] || []).length === 0 ? (
                <span className="text-[10px] text-gray-600 py-1">No concepts found</span>
              ) : (
                (conceptsCache[subtopic.id] || []).map((concept, cIdx) => (
                  <ConceptOrb
                    key={concept.id}
                    concept={concept}
                    theme={activeTheme}
                    index={cIdx}
                    onClick={() => onSelectConcept(concept.id)}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// ConceptOrb: smaller branching sub-bubble
// ==========================================
function ConceptOrb({ concept, theme, index, onClick }) {
  const [current, setCurrent] = useState(0);
  const [peak, setPeak] = useState(0);

  useEffect(() => {
    const mastery = concept.mastery?.length ? concept.mastery.reduce((a, b) => a + b, 0) / concept.mastery.length : 0;
    const raw = concept.raw_mastry?.length ? concept.raw_mastry.reduce((a, b) => a + b, 0) / concept.raw_mastry.length : 0;
    setCurrent(Math.max(0, Math.min(1, mastery)));
    setPeak(Math.max(0, Math.min(1, raw)));
  }, [concept]);

  return (
    <motion.div
      onClick={onClick}
      className="relative cursor-pointer w-16 h-16 sm:w-20 sm:h-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 120 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className="w-full h-full rounded-full border relative overflow-hidden"
        style={{
          borderColor: "rgba(136,136,136,0.3)",
          boxShadow: `0 0 10px rgba(136,136,136,0.15)`,
          background: `radial-gradient(circle at 50% 50%, ${theme.primary}30 0%, ${theme.primary}10 80%, transparent 100%)`
        }}
      >
        {/* Peak Gray Fills */}
        <div
          className="absolute bottom-0 left-0 w-full rounded-b-full pointer-events-none"
          style={{
            height: `${peak * 100}%`,
            background: "linear-gradient(to top, rgba(136,136,136,0.4), rgba(204,204,204,0.15))"
          }}
        />

        {/* Current Colored Fills */}
        <div
          className="absolute bottom-0 left-0 w-full rounded-b-full pointer-events-none"
          style={{
            height: `${current * 100}%`,
            background: `linear-gradient(to top, ${theme.glow}aa, ${theme.primary}50)`
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-0.5 z-10">
          <span className="text-[10px] sm:text-xs">💎</span>
          <span className="text-[7px] sm:text-[9px] font-bold text-white leading-tight mt-0.5 px-0.5 text-center line-clamp-2">
            {concept.name}
          </span>
        </div>
      </div>
    </motion.div>
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
  const [viewMode, setViewMode] = useState("mindmap"); // default to tech-tree mindmap

  // List View states
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);

  // Tech Tree Mind Map states
  const [activeSubjectIndex, setActiveSubjectIndex] = useState(0);
  const [activeChapterId, setActiveChapterId] = useState(null);

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
        console.error("Failed to load syllabus tree:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTree();
  }, []);

  // Fetch concepts for a subtopic/chapter if not cached
  const loadConcepts = async (subtopicId) => {
    if (conceptsCache[subtopicId] || conceptsLoading[subtopicId]) return;

    try {
      setConceptsLoading(prev => ({ ...prev, [subtopicId]: true }));
      const data = await syllabusApi.getSubtopicConcepts(subtopicId);
      setConceptsCache(prev => ({ ...prev, [subtopicId]: data || [] }));
    } catch (err) {
      console.error(`Failed to load concepts for subtopic ${subtopicId}:`, err);
    } finally {
      setConceptsLoading(prev => ({ ...prev, [subtopicId]: false }));
    }
  };

  // If a concept is selected, show the concept session
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

  // Robust Subject Extraction
  const subjects = [];
  if (tree?.exams) {
    tree.exams.forEach(exam => {
      exam.subjects?.forEach(s => {
        if (!subjects.find(sub => sub.id === s.id)) {
          subjects.push(s);
        }
      });
    });
  } else if (tree?.subjects) {
    subjects.push(...tree.subjects);
  } else if (Array.isArray(tree)) {
    subjects.push(...tree);
  } else if (tree) {
    subjects.push(tree);
  }

  const currentSubject = subjects[activeSubjectIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-heading text-white">Learning Space</h1>
          <p className="text-body text-sm mt-1">Explore your pathways.</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
          <button
            onClick={() => setViewMode("mindmap")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === "mindmap"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/15"
                : "text-gray-400 hover:text-white"
              }`}
          >
            <Network size={14} />
            Mind Map
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === "list"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/15"
                : "text-gray-400 hover:text-white"
              }`}
          >
            <List size={14} />
            List
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ================= FUTURISTIC BRANCHED TECH TREE MIND MAP ================= */}
        {viewMode === "mindmap" && (
          <motion.div
            key="mindmap"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 animate-fade-in"
          >
            {/* Subject Selector Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {subjects.map((subject, idx) => (
                <button
                  key={subject.id || idx}
                  onClick={() => {
                    setActiveSubjectIndex(idx);
                    setActiveChapterId(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${activeSubjectIndex === idx
                      ? "bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-md shadow-purple-500/10"
                      : "bg-white/[0.02] border-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                >
                  {subject.name}
                </button>
              ))}
            </div>

            {/* Topics Tech Tree pipeline */}
            {currentSubject && (
              <div className="space-y-8">
                {(currentSubject.topics || []).map((topic, topicIdx) => (
                  <GlassCard key={topic.id || topicIdx} className="relative overflow-hidden" padding="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-caption tracking-wider text-purple-300 font-black">{topic.name}</span>
                      <span className="text-[10px] text-gray-600">{topic.subtopics?.length || 0} chapters</span>
                    </div>

                    {/* Pathways container */}
                    <div className="relative py-4 flex items-center justify-center min-h-[140px]">
                      {/* Connection track running behind bubbles */}
                      <div className="absolute left-12 right-12 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent pointer-events-none" />

                      {/* Radiating subtopic nodes */}
                      <div className="relative z-10 flex flex-wrap justify-center gap-12 sm:gap-16 w-full">
                        {(topic.subtopics || []).map((subtopic, subIdx) => {
                          const isActive = activeChapterId === subtopic.id;
                          return (
                            <SubtopicNode
                              key={subtopic.id || subIdx}
                              subtopic={subtopic}
                              themeIdx={subIdx}
                              isOpen={isActive}
                              onToggle={() => setActiveChapterId(isActive ? null : subtopic.id)}
                              onSelectConcept={(id) => navigate(`/learn/${id}`)}
                              conceptsCache={conceptsCache}
                              conceptsLoading={conceptsLoading}
                              loadConcepts={loadConcepts}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ================= LIST VIEW ================= */}
        {viewMode === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {subjects.map((subject, si) => (
              <motion.div
                key={subject.id || si}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: si * 0.06 }}
              >
                <GlassCard
                  hover
                  onClick={() => setExpandedSubject(expandedSubject === si ? null : si)}
                  padding="p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                        <BookOpen size={18} className="text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{subject.name}</h3>
                        <p className="text-xs text-gray-500">
                          {subjects[si]?.topics?.reduce((acc, t) => acc + (t.subtopics?.length || 0), 0) || 0} chapters
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`text-gray-500 transition-transform duration-200 ${expandedSubject === si ? "rotate-90" : ""
                        }`}
                    />
                  </div>

                  {subject.mastery !== undefined && (
                    <ProgressBar
                      value={subject.mastery ?? 0}
                      className="mt-3"
                      color="from-purple-500 to-indigo-500"
                    />
                  )}
                </GlassCard>

                {/* Chapters list */}
                {expandedSubject === si && (
                  <motion.div
                    className="ml-4 mt-2 space-y-2 border-l-2 border-purple-500/10 pl-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    {subjects[si].topics?.flatMap((topic) => topic.subtopics || []).map((chapter, ci) => (
                      <div key={chapter.id || ci}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const isOpen = expandedChapter === `${si}-${ci}`;
                            setExpandedChapter(isOpen ? null : `${si}-${ci}`);
                            if (!isOpen) loadConcepts(chapter.id);
                          }}
                          className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-purple-500/15 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white">
                              {chapter.name}
                            </span>
                            <span className="text-xs text-gray-600">
                              Concepts
                            </span>
                          </div>
                        </button>

                        {/* Concepts */}
                        {expandedChapter === `${si}-${ci}` && (
                          <motion.div
                            className="ml-4 mt-1.5 space-y-1.5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {conceptsLoading[chapter.id] ? (
                              <div className="flex items-center gap-2 text-xs text-gray-500 py-2 pl-4">
                                <RefreshCw size={12} className="animate-spin" />
                                Loading concepts...
                              </div>
                            ) : (conceptsCache[chapter.id] || []).length === 0 ? (
                              <div className="text-xs text-gray-600 py-2 pl-4">No concepts found in this chapter.</div>
                            ) : (
                              (conceptsCache[chapter.id] || []).map((concept) => (
                                <button
                                  key={concept.id}
                                  onClick={() => navigate(`/learn/${concept.id}`)}
                                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-purple-300 hover:bg-purple-500/5 transition-all flex items-center justify-between group"
                                >
                                  <span>{concept.name}</span>
                                  {concept.mastery !== undefined && (
                                    <span className="text-xs text-gray-600 group-hover:text-purple-400">
                                      {getMasteryPercent(concept.mastery)}%
                                    </span>
                                  )}
                                </button>
                              ))
                            )}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
