import { useNavigate } from "react-router-dom";
import GlassCard from "../ui/GlassCard";
import ProgressBar from "../ui/ProgressBar";
import { motion } from "framer-motion";
import { PlayCircle, ChevronRight } from "lucide-react";

export default function ContinueLearning({ dashboard }) {
  const navigate = useNavigate();

  const lastConcept = dashboard?.last_active_concept;
  const recentConcepts = dashboard?.recent_concepts || [];

  if (!lastConcept && recentConcepts.length === 0) {
    return (
      <GlassCard
        hover
        onClick={() => navigate("/learn")}
        className="text-center py-10"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-500/15 flex items-center justify-center">
          <PlayCircle size={28} className="text-purple-400" />
        </div>
        <p className="text-subheading text-white mb-2">Start Your Journey</p>
        <p className="text-body text-sm">
          Pick your first concept and begin building mastery.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main resume card */}
      {lastConcept && (
        <GlassCard
          hover
          onClick={() => navigate(`/learn/${lastConcept.id}`)}
          className="group"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-caption">Continue Learning</p>
            <ChevronRight
              size={16}
              className="text-gray-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all"
            />
          </div>

          <h3 className="text-subheading text-white mb-1">
            {lastConcept.name}
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            {lastConcept.chapter || lastConcept.subtopic_name || ""}
          </p>

          <ProgressBar
            value={lastConcept.mastery ?? 0}
            color="from-purple-500 to-pink-500"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            {Math.round(lastConcept.mastery ?? 0)}% mastery
          </p>
        </GlassCard>
      )}

      {/* Recent concept pills — horizontal scroll */}
      {recentConcepts.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {recentConcepts.slice(0, 4).map((concept, i) => (
            <motion.button
              key={concept.id}
              onClick={() => navigate(`/learn/${concept.id}`)}
              className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-purple-500/20 text-sm text-gray-300 hover:text-white transition-all"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
            >
              {concept.name}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
