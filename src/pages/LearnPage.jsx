// src/pages/LearnPage.jsx
// Learning Space — Mind Map + List View with White+Gold visual identity

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
import { getConceptIcon } from "../components/learn/ConceptVisualTheme";

export const getMasteryPercent = (mastery) => {
  if (Array.isArray(mastery)) {
    return Math.round(((mastery[0] + (mastery[1] ?? mastery[0])) / 2) * 100);
  }
  if (typeof mastery === "number") {
    if (mastery <= 1.0) return Math.round(mastery * 100);
    return Math.round(mastery);
  }
  return 0;
};

// ==========================================
// SubtopicNode: Clean circle with gold fill
// ==========================================
function SubtopicNode({ subtopic, themeIdx, isOpen, onToggle, onSelectConcept, conceptsCache, conceptsLoading, loadConcepts }) {
  const [efficiency, setEfficiency] = useState(0);

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
    if (!isOpen) loadConcepts(subtopic.id);
  };

  const fillPct = Math.round(efficiency * 100);

  return (
    <div className="flex flex-col items-center">
      {/* Node Circle */}
      <motion.div
        onClick={handleToggle}
        className="relative cursor-pointer w-24 h-24 sm:w-28 sm:h-28 select-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className="w-full h-full rounded-full border-2 relative overflow-hidden"
          style={{
            borderColor: isOpen ? 'var(--color-gold)' : 'var(--color-border)',
            boxShadow: isOpen ? '0 4px 12px rgba(197, 165, 90, 0.2)' : 'none',
            background: '#FFFFFF',
          }}
        >
          {/* Gold fill from bottom */}
          <div
            className="absolute bottom-0 left-0 w-full rounded-b-full pointer-events-none transition-all duration-700"
            style={{
              height: `${fillPct}%`,
              background: 'var(--color-gold)',
              opacity: 0.25,
            }}
          />

          {/* Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 p-2">
            <h4 className="font-bold text-[var(--color-text-primary)] text-[10px] sm:text-xs leading-tight">
              {subtopic.name}
            </h4>
            <span className="text-[8px] text-[var(--color-gold-dark)] mt-0.5 font-bold">
              {fillPct}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Concepts list */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full overflow-hidden mt-4"
          >
            <div className="flex flex-wrap gap-3 justify-center py-2 border-t border-[var(--color-border)] mt-2">
              {conceptsLoading[subtopic.id] ? (
                <div className="text-[10px] text-[var(--color-mid-gray)] flex items-center gap-1.5 py-2 animate-pulse">
                  <RefreshCw size={10} className="animate-spin" />
                  Loading concepts...
                </div>
              ) : (conceptsCache[subtopic.id] || []).length === 0 ? (
                <span className="text-[10px] text-[var(--color-mid-gray)] py-1">No concepts found</span>
              ) : (
                (conceptsCache[subtopic.id] || []).map((concept, cIdx) => (
                  <ConceptOrb
                    key={concept.id}
                    concept={concept}
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
// ConceptOrb: Smaller concept bubble
// ==========================================
function ConceptOrb({ concept, index, onClick }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const mastery = concept.mastery?.length ? concept.mastery.reduce((a, b) => a + b, 0) / concept.mastery.length : 0;
    setCurrent(Math.max(0, Math.min(1, mastery)));
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
        className="w-full h-full rounded-full border relative overflow-hidden bg-white"
        style={{
          borderColor: current > 0.5 ? 'var(--color-gold)' : 'var(--color-border)',
        }}
      >
        {/* Gold fill */}
        <div
          className="absolute bottom-0 left-0 w-full rounded-b-full pointer-events-none"
          style={{
            height: `${current * 100}%`,
            background: 'var(--color-gold)',
            opacity: 0.3,
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-0.5 z-10">
          <span className="text-[10px] sm:text-xs">{getConceptIcon(concept.name, concept.id)}</span>
          <span className="text-[7px] sm:text-[9px] font-bold text-[var(--color-text-primary)] leading-tight mt-0.5 px-0.5 text-center line-clamp-2">
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
  const [viewMode, setViewMode] = useState("mindmap");

  const [expandedSubject, setExpandedSubject] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [activeSubjectIndex, setActiveSubjectIndex] = useState(0);
  const [activeChapterId, setActiveChapterId] = useState(null);

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

  // Concept detail view
  if (conceptId) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-6">
        <button
          onClick={() => navigate("/learn")}
          className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6 cursor-pointer"
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

  // Subject extraction
  const subjects = [];
  if (tree?.exams) {
    tree.exams.forEach(exam => {
      exam.subjects?.forEach(s => {
        if (!subjects.find(sub => sub.id === s.id)) subjects.push(s);
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
    <div className="max-w-2xl mx-auto px-5 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Learning Space</h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">Explore your pathways.</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white border border-[var(--color-border)] rounded-xl p-1">
          <button
            onClick={() => setViewMode("mindmap")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === "mindmap"
              ? "bg-[var(--color-gold)] text-white shadow-sm font-bold"
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Network size={14} />
            Mind Map
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === "list"
              ? "bg-[var(--color-gold)] text-white shadow-sm font-bold"
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <List size={14} />
            List
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══ MIND MAP ═══ */}
        {viewMode === "mindmap" && (
          <motion.div key="mindmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Subject Tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {subjects.map((subject, idx) => (
                <button
                  key={subject.id || idx}
                  onClick={() => { setActiveSubjectIndex(idx); setActiveChapterId(null); }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${activeSubjectIndex === idx
                    ? "bg-[var(--color-gold-pale)] border-[var(--color-gold)]/30 text-[var(--color-gold-dark)] font-bold"
                    : "bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {subject.name}
                </button>
              ))}
            </div>

            {/* Topics */}
            {currentSubject && (
              <div className="space-y-8">
                {(currentSubject.topics || []).map((topic, topicIdx) => (
                  <GlassCard key={topic.id || topicIdx} padding="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-caption tracking-wider text-[var(--color-gold)] font-bold">{topic.name}</span>
                      <span className="text-[10px] text-[var(--color-mid-gray)]">{topic.subtopics?.length || 0} chapters</span>
                    </div>

                    <div className="relative py-4 flex items-center justify-center min-h-[140px]">
                      {/* Connection track */}
                      <div className="absolute left-12 right-12 top-1/2 -translate-y-1/2 h-[1px] bg-[var(--color-border)] pointer-events-none" />

                      <div className="relative z-10 flex flex-wrap justify-center gap-10 sm:gap-14 w-full">
                        {(topic.subtopics || []).map((subtopic, subIdx) => (
                          <SubtopicNode
                            key={subtopic.id || subIdx}
                            subtopic={subtopic}
                            themeIdx={subIdx}
                            isOpen={activeChapterId === subtopic.id}
                            onToggle={() => setActiveChapterId(activeChapterId === subtopic.id ? null : subtopic.id)}
                            onSelectConcept={(id) => navigate(`/learn/${id}`)}
                            conceptsCache={conceptsCache}
                            conceptsLoading={conceptsLoading}
                            loadConcepts={loadConcepts}
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

        {/* ═══ LIST VIEW ═══ */}
        {viewMode === "list" && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {subjects.map((subject, si) => (
              <motion.div
                key={subject.id || si}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: si * 0.06 }}
              >
                <GlassCard hover onClick={() => setExpandedSubject(expandedSubject === si ? null : si)} padding="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-gold-pale)] flex items-center justify-center">
                        <BookOpen size={18} className="text-[var(--color-gold)]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{subject.name}</h3>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          {subjects[si]?.topics?.reduce((acc, t) => acc + (t.subtopics?.length || 0), 0) || 0} chapters
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`text-[var(--color-mid-gray)] transition-transform duration-200 ${expandedSubject === si ? "rotate-90" : ""}`}
                    />
                  </div>

                  {subject.mastery !== undefined && (
                    <ProgressBar value={subject.mastery ?? 0} className="mt-3" />
                  )}
                </GlassCard>

                {/* Chapters */}
                {expandedSubject === si && (
                  <motion.div
                    className="ml-4 mt-2 space-y-2 border-l-2 border-[var(--color-gold)]/20 pl-4"
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
                          className="w-full text-left px-4 py-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-gold)]/30 hover:bg-[var(--color-gold-pale)]/30 transition-all group cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
                              {chapter.name}
                            </span>
                            <span className="text-xs text-[var(--color-mid-gray)]">Concepts</span>
                          </div>
                        </button>

                        {expandedChapter === `${si}-${ci}` && (
                          <motion.div className="ml-4 mt-1.5 space-y-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {conceptsLoading[chapter.id] ? (
                              <div className="flex items-center gap-2 text-xs text-[var(--color-mid-gray)] py-2 pl-4">
                                <RefreshCw size={12} className="animate-spin" />
                                Loading concepts...
                              </div>
                            ) : (conceptsCache[chapter.id] || []).length === 0 ? (
                              <div className="text-xs text-[var(--color-mid-gray)] py-2 pl-4">No concepts found.</div>
                            ) : (
                              (conceptsCache[chapter.id] || []).map((concept) => (
                                <button
                                  key={concept.id}
                                  onClick={() => navigate(`/learn/${concept.id}`)}
                                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-gold-dark)] hover:bg-[var(--color-gold-pale)] transition-all flex items-center justify-between group cursor-pointer"
                                >
                                  <span>{concept.name}</span>
                                  {concept.mastery !== undefined && (
                                    <span className="text-xs text-[var(--color-mid-gray)] group-hover:text-[var(--color-gold)]">
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
