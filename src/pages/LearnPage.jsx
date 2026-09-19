// src/pages/LearnPage.jsx
// Learning Space — Mind Map + List View with Vibrant Architecture & High Contrast Theme.

import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import syllabusApi from "../api/syllabusApi";
import progressApi from "../api/progressApi";
import GlassCard from "../components/ui/GlassCard";
import ProgressBar from "../components/ui/ProgressBar";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import ConceptSession from "../components/learn/ConceptSession";
import ExamReadinessDreamPage, { DEFAULT_AI_ENGINEERING_SERIES } from "../components/learn/ExamReadinessDreamPage";
import aiEngineeringScenes from "../data/ai_engineering_vocal_scenes.json";
import SubjectPassModal from "../components/learn/SubjectPassModal";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, ArrowLeft, Network, List, RefreshCw, Sparkles, Layers, Zap, Headphones, Play, Lock } from "lucide-react";
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

export const getLessonsForSubject = (subject) => {
  const fullPdfScenes = (aiEngineeringScenes && Array.isArray(aiEngineeringScenes.scenes) && aiEngineeringScenes.scenes.length > 0)
    ? aiEngineeringScenes.scenes
    : DEFAULT_AI_ENGINEERING_SERIES;

  if (!subject) return fullPdfScenes;
  const name = (subject.name || "").toLowerCase();
  if (name.includes("ai engineering") || name.includes("ai eng") || name.includes("generative ai")) {
    return fullPdfScenes;
  }

  const generatedLessons = [];
  const topics = subject.topics || [];
  let lessonCounter = 1;

  topics.forEach((topic) => {
    const subtopics = topic.subtopics || [];
    subtopics.forEach((sub) => {
      generatedLessons.push({
        id: sub.id || `gen-${lessonCounter}`,
        module: topic.name || subject.name,
        title: `Scene ${lessonCounter}: ${sub.name}`,
        narration: [
          `Suno, imagine karo kal tumhara ${subject.name} ka exam hai, aur topic hai ${sub.name}. Pehle isko intuitively samajhte hain ki ye kaam kaise karta hai.`,
          `Agar ${sub.name} ke core concepts clear nahi honge, toh exam ke pressure me options choose karne me confusion hoga. Isliye real intuition build karte hain.`,
          `Direct exam question: What are the essential principles, key facts, and analytical takeaways of ${sub.name}?`,
          `High-yield takeaways: Pehla, ${sub.name} ka core definition. Doosra, standard parameters and analytical framework. Teesra, high-probability points jo kal paper me pooche jaenge.`
        ]
      });
      lessonCounter++;
    });
  });

  if (generatedLessons.length === 0) {
    return [
      {
        id: `fallback-1-${subject.name}`,
        module: `${subject.name} Core`,
        title: `Scene 1: Foundations of ${subject.name}`,
        narration: [
          `Suno, exam se ek din pehle ${subject.name} ko understand karna bilkul relaxed experience hona chahiye. Main tumko step-by-step clear karungi.`,
          `Core syllabus me sabse zyaada weightage wale questions direct foundation aur key analytical framework se aate hain.`,
          `Is subject ke 3 key pillars mind me rakho: Base definitions, exam facts, aur high-frequency PYQs.`
        ]
      }
    ];
  }

  return generatedLessons;
};

// Vibrant subject color palette helper
const SUBJECT_THEMES = [
  { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-700", ring: "ring-amber-400", fill: "#D97706" },
  { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-700", ring: "ring-indigo-400", fill: "#4F46E5" },
  { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-700", ring: "ring-emerald-400", fill: "#059669" },
  { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-700", ring: "ring-rose-400", fill: "#E11D48" },
  { bg: "bg-sky-500/10", border: "border-sky-500/30", text: "text-sky-700", ring: "ring-sky-400", fill: "#0284C7" },
];

function SubtopicNode({ subtopic, themeIdx, isOpen, onToggle, onSelectConcept, conceptsCache, conceptsLoading, loadConcepts }) {
  const [efficiency, setEfficiency] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const nodeRef = useRef(null);
  const theme = SUBJECT_THEMES[themeIdx % SUBJECT_THEMES.length];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" }
    );
    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }
    return () => observer.disconnect();
  }, [subtopic.id]);

  useEffect(() => {
    if (!isInView) return;
    const fetchProgress = async () => {
      try {
        const data = await progressApi.getSubtopic(subtopic.id);
        setEfficiency(data?.efficiency ?? 0);
      } catch (err) {
        console.error("Failed to load subtopic efficiency:", err);
      }
    };
    fetchProgress();
  }, [subtopic.id, isInView]);

  const handleToggle = () => {
    onToggle();
    if (!isOpen) loadConcepts(subtopic.id);
  };

  const fillPct = Math.round(efficiency * 100);

  return (
    <div ref={nodeRef} className="flex flex-col items-center">
      {/* Node Circle */}
      <motion.div
        onClick={handleToggle}
        className="relative cursor-pointer w-24 h-24 sm:w-28 sm:h-28 select-none"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className={`w-full h-full rounded-full border-2 relative overflow-hidden bg-white shadow-sm transition-all ${isOpen ? `${theme.border} ring-4 ${theme.ring}/20 shadow-md` : "border-[var(--color-border)]"
            }`}
        >
          {/* Progress fill from bottom */}
          <div
            className="absolute bottom-0 left-0 w-full rounded-b-full pointer-events-none transition-all duration-700 opacity-25"
            style={{
              height: `${fillPct}%`,
              background: theme.fill,
            }}
          />

          {/* Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 p-2">
            <h4 className="font-bold text-[var(--color-text-primary)] text-[10px] sm:text-xs leading-tight">
              {subtopic.name}
            </h4>
            <span className={`text-[9px] font-extrabold mt-1 px-2 py-0.5 rounded-full ${theme.bg} ${theme.text}`}>
              {fillPct}% Ready
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
            <div className="flex flex-wrap gap-3 justify-center py-3 border-t border-[var(--color-border)] mt-2 bg-white/50 rounded-2xl p-4">
              {conceptsLoading[subtopic.id] ? (
                <div className="text-[10px] text-[var(--color-mid-gray)] flex items-center gap-1.5 py-2 animate-pulse font-bold">
                  <RefreshCw size={12} className="animate-spin text-[var(--color-gold)]" />
                  Loading concepts...
                </div>
              ) : (conceptsCache[subtopic.id] || []).length === 0 ? (
                <span className="text-[10px] text-[var(--color-mid-gray)] py-1 font-medium">No concepts found</span>
              ) : (
                (conceptsCache[subtopic.id] || []).map((concept, cIdx) => (
                  <ConceptOrb
                    key={concept.id}
                    concept={concept}
                    index={cIdx}
                    themeIdx={themeIdx}
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

function ConceptOrb({ concept, index, themeIdx, onClick }) {
  const [current, setCurrent] = useState(0);
  const theme = SUBJECT_THEMES[themeIdx % SUBJECT_THEMES.length];

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
        className={`w-full h-full rounded-full border relative overflow-hidden bg-white shadow-xs ${current > 0.5 ? theme.border : "border-[var(--color-border)]"
          }`}
      >
        <div
          className="absolute bottom-0 left-0 w-full rounded-b-full pointer-events-none opacity-30"
          style={{
            height: `${current * 100}%`,
            background: theme.fill,
          }}
        />

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
  const [selectedExamId, setSelectedExamId] = useState(null);

  const [conceptsCache, setConceptsCache] = useState({});
  const [conceptsLoading, setConceptsLoading] = useState({});

  const [activeDreamSubject, setActiveDreamSubject] = useState(null);
  const [showPassModal, setShowPassModal] = useState(false);
  const [pendingSubject, setPendingSubject] = useState(null);
  const [unlockedSubjects, setUnlockedSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem("daksh_unlocked_subjects");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleOpenSubjectSpace = (subject) => {
    if (!subject) return;
    const isUnlocked = unlockedSubjects.includes(subject.id || subject.name);
    if (isUnlocked) {
      setActiveDreamSubject(subject);
    } else {
      setPendingSubject(subject);
      setShowPassModal(true);
    }
  };

  const handleUnlockSuccess = () => {
    if (pendingSubject) {
      const updated = [...unlockedSubjects, pendingSubject.id || pendingSubject.name];
      setUnlockedSubjects(updated);
      try {
        localStorage.setItem("daksh_unlocked_subjects", JSON.stringify(updated));
      } catch (e) {}
      setActiveDreamSubject(pendingSubject);
    }
    setShowPassModal(false);
    setPendingSubject(null);
  };

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
      const list = Array.isArray(data) ? data : data?.concepts || data?.results || [];
      setConceptsCache(prev => ({ ...prev, [subtopicId]: list }));
    } catch (err) {
      console.error(`Failed to load concepts for subtopic ${subtopicId}:`, err);
      setConceptsCache(prev => ({ ...prev, [subtopicId]: [] }));
    } finally {
      setConceptsLoading(prev => ({ ...prev, [subtopicId]: false }));
    }
  };

  if (conceptId) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-6">
        <button
          onClick={() => navigate("/learn")}
          className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6 cursor-pointer font-bold"
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

  const rawExams = Array.isArray(tree?.exams)
    ? tree.exams
    : Array.isArray(tree)
      ? tree
      : tree
        ? [tree]
        : [];

  const exams = rawExams.filter((e) => e && (e.subjects?.length > 0 || e.name));

  // Determine active exam object (defaulting to State PCS if available)
  const activeExam =
    exams.find((e) => String(e.id) === String(selectedExamId)) ||
    exams.find((e) => e.exam_type === "pcs" || e.code === "PCS" || e.name?.toLowerCase().includes("pcs")) ||
    exams[0];

  // Extract subjects STRICTLY from activeExam
  const subjects = activeExam?.subjects || (tree?.subjects ? tree.subjects : []);
  const currentSubject = subjects[activeSubjectIndex] || subjects[0];
  const activeTheme = SUBJECT_THEMES[activeSubjectIndex % SUBJECT_THEMES.length];

  if (activeDreamSubject) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-6">
        <ExamReadinessDreamPage
          subjectName={activeDreamSubject.name}
          examTitle={activeExam?.name || "State Provincial Civil Services (PCS)"}
          lessons={getLessonsForSubject(activeDreamSubject)}
          onBack={() => setActiveDreamSubject(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-2">
            LEARNING SPACE
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Explore your syllabus concepts and interactive mindmaps.</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white border border-[var(--color-border)] rounded-xl p-1 shadow-xs">
          <button
            onClick={() => setViewMode("mindmap")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === "mindmap"
                ? "bg-[var(--color-gold)] text-white shadow-xs font-bold"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
          >
            <Network size={14} />
            Mind Map
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === "list"
                ? "bg-[var(--color-gold)] text-white shadow-xs font-bold"
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
              {subjects.map((subject, idx) => {
                const t = SUBJECT_THEMES[idx % SUBJECT_THEMES.length];
                const isActive = activeSubjectIndex === idx;
                return (
                  <button
                    key={subject.id || idx}
                    onClick={() => {
                      setActiveSubjectIndex(idx);
                      setActiveChapterId(null);
                    }}
                    onDoubleClick={() => {
                      handleOpenSubjectSpace(subject);
                    }}
                    title="Single-click to view Mind Map • Double-click to open Vocal Scenes"
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${isActive
                        ? `${t.bg} ${t.border} ${t.text} ring-2 ${t.ring}/30 shadow-xs`
                        : "bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                      }`}
                  >
                    <span>{subject.name}</span>
                    {isActive && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenSubjectSpace(subject);
                        }}
                        className="ml-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 hover:bg-amber-500/30 transition-all flex items-center gap-1 border border-amber-500/30 cursor-pointer"
                        title="Open Vocal Scenes"
                      >
                        <Headphones size={11} />
                        <span>Scenes</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Topics */}
            {currentSubject && (
              <div className="space-y-6">
                {(currentSubject.topics || []).map((topic, topicIdx) => (
                  <div key={topic.id || topicIdx} className="daksh-card p-6 space-y-4 border-t-3 border-t-[var(--color-gold)]">
                    <div className="flex items-center justify-between">
                      <span className="text-caption tracking-wider text-[var(--color-gold-dark)] font-bold flex items-center gap-1.5">
                        <Sparkles size={14} />
                        {topic.name}
                      </span>
                      <span className="text-[10px] font-bold text-[var(--color-gold-dark)] bg-[var(--color-gold-pale)] px-2.5 py-0.5 rounded-full border border-[var(--color-gold)]/20">
                        {topic.subtopics?.length || 0} chapters
                      </span>
                    </div>

                    <div className="relative py-4 flex items-center justify-center min-h-[140px]">
                      <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-[var(--color-border)] pointer-events-none" />

                      <div className="relative z-10 flex flex-wrap justify-center gap-8 sm:gap-12 w-full">
                        {(topic.subtopics || []).map((subtopic, subIdx) => (
                          <SubtopicNode
                            key={subtopic.id || subIdx}
                            subtopic={subtopic}
                            themeIdx={activeSubjectIndex}
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
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ═══ LIST VIEW ═══ */}
        {viewMode === "list" && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {subjects.map((subject, si) => {
              const t = SUBJECT_THEMES[si % SUBJECT_THEMES.length];
              return (
                <motion.div
                  key={subject.id || si}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: si * 0.06 }}
                >
                  <div
                    onClick={() => setExpandedSubject(expandedSubject === si ? null : si)}
                    onDoubleClick={() => handleOpenSubjectSpace(subject)}
                    className={`daksh-card p-5 cursor-pointer hover:border-[var(--color-gold)] transition-all ${expandedSubject === si ? `border-2 ${t.border}` : ""
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${t.bg} border ${t.border} flex items-center justify-center`}>
                          <BookOpen size={18} className={t.text} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{subject.name}</h3>
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            {subjects[si]?.topics?.reduce((acc, top) => acc + (top.subtopics?.length || 0), 0) || 0} chapters available
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSubjectSpace(subject);
                          }}
                          className="text-xs font-bold text-[var(--color-gold-dark)] bg-[var(--color-gold-pale)] hover:bg-[var(--color-gold)] hover:text-white transition-all px-3.5 py-1.5 rounded-xl border border-[var(--color-gold)]/30 flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Headphones size={13} />
                          <span>Open Scenes</span>
                        </button>
                      </div>
                    </div>

                    {subject.mastery !== undefined && (
                      <ProgressBar value={subject.mastery ?? 0} className="mt-3" />
                    )}
                  </div>

                  {/* Chapters */}
                  {expandedSubject === si && (
                    <motion.div
                      className="ml-4 mt-2 space-y-2 border-l-2 border-[var(--color-gold)]/30 pl-4"
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
                            className="w-full text-left px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-gold)] hover:bg-[var(--color-gold-pale)]/30 transition-all group cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-gold-dark)]">
                                {chapter.name}
                              </span>
                              <span className="text-[10px] font-bold text-[var(--color-gold-dark)] bg-[var(--color-gold-pale)] px-2 py-0.5 rounded-md">
                                Concepts
                              </span>
                            </div>
                          </button>

                          {expandedChapter === `${si}-${ci}` && (
                            <motion.div className="ml-4 mt-1.5 space-y-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              {conceptsLoading[chapter.id] ? (
                                <div className="flex items-center gap-2 text-xs text-[var(--color-mid-gray)] py-2 pl-4">
                                  <RefreshCw size={12} className="animate-spin text-[var(--color-gold)]" />
                                  Loading concepts...
                                </div>
                              ) : (conceptsCache[chapter.id] || []).length === 0 ? (
                                <div className="text-xs text-[var(--color-mid-gray)] py-2 pl-4">No concepts found.</div>
                              ) : (
                                (conceptsCache[chapter.id] || []).map((concept) => (
                                  <button
                                    key={concept.id}
                                    onClick={() => navigate(`/learn/${concept.id}`)}
                                    className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-gold-dark)] hover:bg-[var(--color-gold-pale)] transition-all flex items-center justify-between group cursor-pointer"
                                  >
                                    <span>{concept.name}</span>
                                    {concept.mastery !== undefined && (
                                      <span className="text-[10px] text-[var(--color-mid-gray)] group-hover:text-[var(--color-gold)] font-bold">
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
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPassModal && (
          <SubjectPassModal
            subjectName={pendingSubject?.name}
            onUnlock={handleUnlockSuccess}
            onClose={() => {
              setShowPassModal(false);
              setPendingSubject(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
