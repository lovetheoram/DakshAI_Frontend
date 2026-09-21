// src/pages/PracticePage.jsx
// PRACTICE — "What do I want to test?"
// Clean, uncluttered 3-pillar testing room: Concept Practice, Chapter PYQs, Full Exam Simulation.
// 100% strict real data from backend syllabus & quiz APIs.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import syllabusApi from "../api/syllabusApi";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Target,
  Award,
  Search,
  CheckCircle2,
  Clock,
  Play,
  Layers,
  ChevronRight
} from "lucide-react";

export default function PracticePage() {
  const navigate = useNavigate();
  const [syllabusTree, setSyllabusTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tree = await syllabusApi.getTree().catch(() => null);
        setSyllabusTree(tree);

        const subjects = tree?.exams?.[0]?.subjects || tree?.subjects || [];
        if (subjects.length > 0) {
          setSelectedSubjectId(subjects[0].id);
        }
      } catch (err) {
        console.error("Failed to load practice data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-5 py-12 space-y-4">
        <SkeletonLoader lines={2} />
        <SkeletonLoader lines={4} />
      </div>
    );
  }

  const subjects = syllabusTree?.exams?.[0]?.subjects || syllabusTree?.subjects || [];
  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  // Flatten subtopics for the selected subject
  const subtopics = [];
  if (currentSubject?.topics) {
    currentSubject.topics.forEach((t) => {
      if (t.subtopics) {
        t.subtopics.forEach((st) => {
          subtopics.push({
            ...st,
            topicName: t.name,
          });
        });
      }
    });
  }

  // Filter subtopics by search query
  const filteredSubtopics = subtopics.filter((st) =>
    st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    st.topicName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto px-5 py-8 sm:py-12 space-y-9 select-none text-left font-sans">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="space-y-1 border-b border-[var(--color-border)] pb-4">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-gold-dark)] block">
          Practice Room
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight uppercase">
          What do you want to test?
        </h1>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Select how you want to challenge your retrieval memory today.
        </p>
      </div>

      {/* ── PILLAR 1: CONCEPT PRACTICE ──────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="daksh-card p-5 sm:p-6 space-y-3.5 border-l-4 border-l-[var(--color-gold)]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-bold">
            <BookOpen size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
              Concept Practice
            </h2>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Test whether you actually understand a concept while learning.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/learn")}
          className="w-full py-2.5 px-4 rounded-xl btn-gold text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span>Open Learn</span>
          <ArrowRight size={14} />
        </button>
      </motion.section>

      {/* ── PILLAR 2: CHAPTER PYQS (SUBTOPIC-WISE) ──────────── */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="daksh-card p-5 sm:p-6 space-y-4 border-l-4 border-l-sky-500"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <Target size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                Chapter PYQs
              </h2>
              <p className="text-[11px] text-[var(--color-text-secondary)]">
                Test yourself against real exam questions chapter by chapter.
              </p>
            </div>
          </div>
        </div>

        {/* Subject Filter Tabs */}
        {subjects.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pt-1 pb-1">
            {subjects.map((subj) => (
              <button
                key={subj.id}
                onClick={() => setSelectedSubjectId(subj.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  selectedSubjectId === subj.id
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs font-bold"
                    : "bg-white dark:bg-slate-900 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {subj.name}
              </button>
            ))}
          </div>
        )}

        {/* Search Filter */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-mid-gray)]" />
          <input
            type="text"
            placeholder="Search chapter or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-8.5 py-1.5 text-xs"
          />
        </div>

        {/* Subtopic / Chapter List */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {filteredSubtopics.length > 0 ? (
            filteredSubtopics.map((st) => (
              <div
                key={st.id}
                className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-gold)] transition-all flex items-center justify-between gap-3"
              >
                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                    {st.name}
                  </h3>
                  <p className="text-[10px] text-[var(--color-text-secondary)] truncate">
                    {st.pyqs_count ? `${st.pyqs_count} PYQs available` : "Verified exam questions"}
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(`/quiz?subtopic_id=${st.id}&type=PYQS&title=${encodeURIComponent(st.name + " PYQs")}`)
                  }
                  className="px-3 py-1.5 rounded-lg btn-gold text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <span>Start PYQs</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-[var(--color-text-secondary)] text-center py-4">
              No chapters found matching "{searchQuery}".
            </p>
          )}
        </div>
      </motion.section>

      {/* ── PILLAR 3: FULL EXAM SIMULATION ──────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="daksh-card p-5 sm:p-6 space-y-4 border-l-4 border-l-emerald-500"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Award size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
              Full Exam Simulation
            </h2>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Test your exam readiness under realistic timed conditions.
            </p>
          </div>
        </div>

        {/* Exam Conditions Summary */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--color-text-secondary)] p-3 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)]">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-[var(--color-gold-dark)] shrink-0" />
            <span>20 Timed questions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers size={12} className="text-[var(--color-gold-dark)] shrink-0" />
            <span>Mixed subjects</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/quiz?type=FULL_EXAM&q=20&title=Full+Exam+Simulation")}
          className="w-full py-2.5 px-4 rounded-xl btn-gold text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Play size={13} />
          <span>Start Full Exam Simulation</span>
        </button>
      </motion.section>

    </div>
  );
}
