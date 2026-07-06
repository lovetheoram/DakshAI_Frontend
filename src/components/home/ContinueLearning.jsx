import { useNavigate } from "react-router-dom";
import ProgressBar from "../ui/ProgressBar";
import { motion } from "framer-motion";
import { PlayCircle, ChevronRight, RefreshCw, CheckCircle } from "lucide-react";

export default function ContinueLearning({ dashboard }) {
  const navigate = useNavigate();

  const lastConcept = dashboard?.last_active_concept;
  const recentConcepts = dashboard?.recent_concepts || [];
  const decayAlerts = dashboard?.decay_alerts || [];

  // If a concept is decaying, prioritize that as the primary recommendation
  const primaryDecay = decayAlerts.length > 0 ? decayAlerts[0] : null;

  // Choose what to show as the primary action
  const showDecayPrimary = primaryDecay && (!lastConcept || lastConcept.mastery >= 70);
  const primaryConcept = showDecayPrimary
    ? {
        id: primaryDecay.concept_id,
        name: primaryDecay.concept_name,
        subtopic_name: primaryDecay.subtopic_name,
        mastery: primaryDecay.retention_pct,
      }
    : lastConcept;

  if (!primaryConcept && recentConcepts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <button
          onClick={() => navigate("/learn")}
          className="w-full p-8 rounded-3xl bg-gradient-to-br from-purple-900/40 to-indigo-900/30 border border-purple-500/15 text-center hover:border-purple-500/30 transition-all group"
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-500/15 flex items-center justify-center group-hover:bg-purple-500/25 transition-colors">
            <PlayCircle size={28} className="text-purple-400" />
          </div>
          <p className="text-base font-bold text-white mb-2">Start Your Journey</p>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            Pick your first concept and begin building mastery.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-purple-500/25">
            Explore Syllabus
            <ChevronRight size={14} />
          </div>
        </button>
      </motion.div>
    );
  }

  const isStable = primaryConcept && primaryConcept.mastery >= 70;

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >
      {/* Main action card — largest card on the page */}
      {primaryConcept && (
        <div className="relative p-6 rounded-3xl bg-[var(--color-bg-card)] border border-purple-500/15 hover:border-purple-500/25 transition-all group overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 to-indigo-500/5 pointer-events-none" />

          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                {showDecayPrimary ? (
                  <>
                    <RefreshCw size={10} className="text-amber-400" />
                    Revise before you forget
                  </>
                ) : (
                  "Pick up where you left off"
                )}
              </p>
              {isStable && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                  <CheckCircle size={10} />
                  Stable
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-white mt-2 mb-1">
              {primaryConcept.name}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {primaryConcept.chapter || primaryConcept.subtopic_name || ""}
            </p>

            <ProgressBar
              value={primaryConcept.mastery ?? 0}
              color={showDecayPrimary ? "from-amber-500 to-red-500" : "from-purple-500 to-pink-500"}
            />
            <p className="text-xs text-gray-500 mt-1.5">
              {Math.round(primaryConcept.mastery ?? 0)}% mastery
            </p>

            {/* Real CTA button */}
            <button
              onClick={() => navigate(`/learn/${primaryConcept.id}`)}
              className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Practice Now
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
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
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              {concept.name}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
