// src/pages/PracticePage.jsx
// Practice — Practice Modes & Topic Selector
// 100% Strict real data from backend API with Info Tooltips.
// Home handles active ongoing concepts; Practice is the dedicated mode & topic hub.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import syllabusApi from "../api/syllabusApi";
import socialApi from "../api/socialApi";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import InfoTooltip from "../components/ui/InfoTooltip";
import { motion } from "framer-motion";
import { ArrowRight, Globe, BookOpen, Target, Award, Layers, Search, ChevronRight } from "lucide-react";

export default function PracticePage() {
  const navigate = useNavigate();
  const [concepts, setConcepts] = useState([]);
  const [syllabusTree, setSyllabusTree] = useState(null);
  const [lobbyData, setLobbyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [conceptData, treeData, lobbyRes] = await Promise.all([
          syllabusApi.getConceptList().catch(() => []),
          syllabusApi.getTree().catch(() => null),
          socialApi.getLobby().catch(() => null),
        ]);
        setConcepts(Array.isArray(conceptData) ? conceptData : conceptData?.concepts || []);
        setSyllabusTree(treeData);
        if (lobbyRes?.lobby) {
          setLobbyData(lobbyRes.lobby);
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
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <SkeletonLoader lines={2} />
        <SkeletonLoader lines={4} />
      </div>
    );
  }

  const totalOnline = lobbyData?.total_online || 0;
  const focusConceptId = concepts[0]?.id || null;

  const PRACTICE_MODES = [
    {
      id: "formula",
      icon: BookOpen,
      title: "Formula & Concept Space",
      desc: "Deep conceptual reading & active recall in Learning Space.",
      actionLabel: "Open Learning Space",
      onSelect: () => navigate("/learn"),
      badge: "Concept Space",
    },
    {
      id: "pyqs",
      icon: Target,
      title: "PYQs & Active Retrieval",
      desc: "Timed previous year questions & MCQ recall checks.",
      actionLabel: "Start PYQ Quiz",
      onSelect: () => navigate(focusConceptId ? `/quiz/${focusConceptId}` : "/learn"),
      badge: "Exam PYQs",
    },
    {
      id: "world",
      icon: Globe,
      title: "World Peer Challenge",
      desc: "Compare speed & accuracy against real online learners.",
      actionLabel: "Enter World Room",
      onSelect: () => navigate("/world"),
      badge: `${totalOnline} Learners`,
    },
    {
      id: "mock",
      icon: Award,
      title: "Full Mock Exam",
      desc: "Full-length exam simulation for timed test endurance.",
      actionLabel: "Full Exam Simulation",
      onSelect: () => navigate("/map"),
      badge: "Simulated Test",
    },
  ];

  // Filter concepts based on search query
  const filteredConcepts = concepts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 space-y-8 select-none">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">PRACTICE ROOM</h1>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Select your preferred practice mode or choose a specific syllabus topic.</p>
      </div>

      {/* ── 1. PRACTICE MODES GRID ────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-caption tracking-widest text-[var(--color-text-primary)] font-bold flex items-center gap-1.5">
            <Layers size={13} className="text-[var(--color-gold)]" />
            Practice Modes & Test Formats
          </span>
          <InfoTooltip
            title="Practice Modes"
            meaning="Switch between Formula Reading in Learning Space, PYQ Quiz checks, World Calibration, and Mock Exam simulations."
            formula="Mastery = Formula Comprehension (Space) + MCQ Recall (PYQs) + Calibration (World)"
            howToIncrease="Combine Formula checks with PYQ Quizzes to achieve 100% stable concept readiness."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRACTICE_MODES.map((mode) => {
            const IconComp = mode.icon;
            return (
              <div
                key={mode.id}
                onClick={mode.onSelect}
                className="daksh-card p-5 space-y-3 border hover:border-[var(--color-gold)] hover:bg-[var(--color-gold-pale)]/30 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center">
                      <IconComp size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-[var(--color-gold-dark)] bg-[var(--color-gold-pale)] px-2 py-0.5 rounded-md">
                      {mode.badge}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-gold-dark)] transition-colors">
                    {mode.title}
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                    {mode.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-bold text-[var(--color-gold-dark)]">
                  <span>{mode.actionLabel}</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2. TOPIC & CHAPTER SELECTOR ──────────────────────── */}
      <div className="daksh-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-caption tracking-widest text-[var(--color-text-primary)] font-bold flex items-center gap-1.5">
            <BookOpen size={14} className="text-[var(--color-gold)]" />
            Pick Syllabus Topic to Practice
          </span>
          <span className="text-[10px] text-[var(--color-mid-gray)]">{concepts.length} Available Topics</span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-mid-gray)]" />
          <input
            type="text"
            placeholder="Search topic or concept name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 py-2 text-xs"
          />
        </div>

        {/* Concept / Topic List */}
        <div className="space-y-2 pt-1 max-h-80 overflow-y-auto pr-1">
          {filteredConcepts.length > 0 ? (
            filteredConcepts.map((concept) => (
              <div
                key={concept.id}
                className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-gold)] transition-all flex items-center justify-between group"
              >
                <div className="space-y-0.5 min-w-0 pr-3">
                  <h4 className="text-xs font-bold text-[var(--color-text-primary)] truncate">{concept.name}</h4>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">PYQs & Formula checks available</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/learn/${concept.id}`)}
                    className="px-2.5 py-1 rounded-lg border border-[var(--color-border)] bg-white hover:border-[var(--color-gold)] text-[11px] font-semibold text-[var(--color-text-secondary)] transition-all cursor-pointer"
                  >
                    Formula Space
                  </button>
                  <button
                    onClick={() => navigate(`/quiz/${concept.id}`)}
                    className="px-2.5 py-1 rounded-lg btn-gold text-[11px] font-bold cursor-pointer flex items-center gap-1"
                  >
                    <span>PYQs Quiz</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-[var(--color-text-secondary)] text-center py-6">
              No topics found matching "{searchQuery}".
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
