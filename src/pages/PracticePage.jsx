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
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-heading text-white">Practice Arena</h1>
        <p className="text-body text-sm mt-1">Choose your mode and sharpen your mind.</p>
      </div>

      {/* Mode selector grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
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

      {/* Revision queue */}
      {revisionConcepts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-caption">Needs Revision</p>
            <StatusBadge variant="warning">{revisionConcepts.length} concepts</StatusBadge>
          </div>

          <div className="space-y-2">
            {revisionConcepts.slice(0, 5).map((concept) => (
              <button
                key={concept.id}
                onClick={() => navigate(`/learn/${concept.id}`)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-amber-500/15 transition-all text-left group"
              >
                <span className="text-sm text-gray-300 group-hover:text-white">
                  {concept.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-400 font-medium">
                    {Math.round(concept.mastery)}%
                  </span>
                  <RotateCcw size={12} className="text-gray-600 group-hover:text-amber-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Start button */}
      {selectedMode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-body text-sm mb-4">
            Select a concept from the Learning Space, then start a {MODES.find(m => m.id === selectedMode)?.label} session.
          </p>
          <button
            onClick={() => navigate("/learn")}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-shadow"
          >
            Pick a Concept →
          </button>
        </motion.div>
      )}
    </div>
  );
}
