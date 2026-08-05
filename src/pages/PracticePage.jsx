import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import progressApi from "../api/progressApi";
import syllabusApi from "../api/syllabusApi";
import GlassCard from "../components/ui/GlassCard";
import ProgressRing from "../components/ui/ProgressRing";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import StatusBadge from "../components/ui/StatusBadge";
import { motion } from "framer-motion";
import { Swords, RotateCcw, BookOpen, Brain, Target, Timer } from "lucide-react";

import MemoryRing from "../components/ui/MemoryRing";
import EmptyState from "../components/ui/EmptyState";

const MODES = [
  {
    id: "revision",
    icon: RotateCcw,
    label: "Revision",
    desc: "Concepts losing mastery",
    color: "from-amber-500 to-orange-500",
    bgGlow: "bg-amber-500/10",
    quizType: "PYQS",
  },
  {
    id: "practice",
    icon: BookOpen,
    label: "Practice",
    desc: "Strengthen what you know",
    color: "from-purple-500 to-indigo-500",
    bgGlow: "bg-purple-500/10",
    quizType: "PYQS",
  },
  {
    id: "adaptive",
    icon: Brain,
    label: "AI Challenge",
    desc: "Questions matched to your level",
    color: "from-blue-500 to-cyan-500",
    bgGlow: "bg-blue-500/10",
    quizType: "NEW",
  },
  {
    id: "pyqs",
    icon: Target,
    label: "PYQs",
    desc: "Previous year questions",
    color: "from-emerald-500 to-teal-500",
    bgGlow: "bg-emerald-500/10",
    quizType: "PYQS",
  },
];

export default function PracticePage() {
  const navigate = useNavigate();
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState(null);

  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        setLoading(true);
        const data = await syllabusApi.getConceptList();
        setConcepts(Array.isArray(data) ? data : data?.concepts || []);
      } catch (err) {
        console.error("Failed to load concepts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConcepts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <SkeletonLoader lines={2} />
        <SkeletonLoader lines={3} />
      </div>
    );
  }

  // Find concepts that need revision (mastery < 60%)
  const revisionConcepts = concepts.filter((c) => c.mastery < 60 && c.mastery > 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-black text-white">Practice Arena</h1>
        <p className="text-xs text-gray-400 mt-0.5">Select a mode and challenge your understanding.</p>
      </div>

      {/* Cognition MemoryRing */}
      <MemoryRing decayAlerts={revisionConcepts} onReview={() => navigate("/learn")} />

      {/* Mode selector grid */}
      <div className="grid grid-cols-2 gap-3">
        {MODES.map((mode, i) => {
          const Icon = mode.icon;
          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard
                hover
                onClick={() => setSelectedMode(mode.id === selectedMode ? null : mode.id)}
                glow={selectedMode === mode.id}
                padding="p-4"
                className={selectedMode === mode.id ? "border-purple-500/30" : ""}
              >
                <div className={`w-10 h-10 rounded-xl ${mode.bgGlow} flex items-center justify-center mb-3`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-sm font-bold text-white mb-0.5">{mode.label}</h3>
                <p className="text-xs text-gray-500">{mode.desc}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Start button or Actionable Empty State */}
      {selectedMode ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-2"
        >
          <p className="text-xs text-gray-300 mb-3 font-medium">
            Select a concept from the Learning Space to start a {MODES.find(m => m.id === selectedMode)?.label} session.
          </p>
          <button
            onClick={() => navigate("/learn")}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl cursor-pointer"
          >
            Pick a Concept →
          </button>
        </motion.div>
      ) : (
        <EmptyState
          title="Practice Session Ready"
          description="Select any mode above to start an active retrieval challenge."
          actionText="Pick a Concept"
          onAction={() => navigate("/learn")}
        />
      )}
    </div>
  );
}
