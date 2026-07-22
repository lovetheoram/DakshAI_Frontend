import { useNavigate } from "react-router-dom";
import ProgressBar from "../ui/ProgressBar";
import { motion } from "framer-motion";
import { PlayCircle, ChevronRight, RefreshCw, CheckCircle, Sparkles } from "lucide-react";

// Subject → gradient mapping for concept cards
const SUBJECT_GRADIENTS = {
  physics: "from-blue-600/30 to-indigo-700/20",
  chemistry: "from-emerald-600/30 to-teal-700/20",
  math: "from-orange-600/30 to-amber-700/20",
  biology: "from-green-600/30 to-emerald-700/20",
  default: "from-purple-600/30 to-violet-700/20",
};

function getSubjectGradient(name = "") {
  const n = name.toLowerCase();
  if (n.includes("physics") || n.includes("electric")) return SUBJECT_GRADIENTS.physics;
  if (n.includes("chem")) return SUBJECT_GRADIENTS.chemistry;
  if (n.includes("math") || n.includes("alge") || n.includes("calcul")) return SUBJECT_GRADIENTS.math;
  if (n.includes("bio") || n.includes("cell") || n.includes("plant")) return SUBJECT_GRADIENTS.biology;
  return SUBJECT_GRADIENTS.default;
}

export default function ContinueLearning({ dashboard }) {
  const navigate = useNavigate();

  const lastConcept = dashboard?.last_active_concept;
  const recentConcepts = dashboard?.recent_concepts || [];
  const decayAlerts = dashboard?.decay_alerts || [];

  const primaryDecay = decayAlerts.length > 0 ? decayAlerts[0] : null;
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
        transition={{ delay: 0.1 }}
      >
        <button
          onClick={() => navigate("/learn")}
          className="w-full p-8 rounded-3xl bg-gradient-to-br from-purple-950/60 via-slate-900/80 to-indigo-950/40 border border-purple-500/20 text-center hover:border-purple-500/40 hover:from-purple-950/80 transition-all group relative overflow-hidden"
        >
          {/* Top shimmer */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
            <PlayCircle size={30} className="text-white" />
          </div>
          <p className="text-lg font-black text-white mb-2">Start Your Journey</p>
          <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed mb-6">
            Pick your first concept and begin building deep mastery.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/30 transition-all">
            Explore Syllabus
            <ChevronRight size={14} />
          </div>
        </button>
      </motion.div>
    );
  }

  const isStable = primaryConcept && primaryConcept.mastery >= 70;
  const mastery = Math.round(primaryConcept?.mastery ?? 0);
  const bg = getSubjectGradient(primaryConcept?.name || "");

  // Mastery color
  const masteryColor =
    mastery >= 70
      ? "text-emerald-400"
      : mastery >= 40
      ? "text-amber-400"
      : "text-rose-400";

  const barColor = showDecayPrimary
    ? "from-amber-500 to-red-500"
    : mastery >= 70
    ? "from-emerald-500 to-teal-400"
    : mastery >= 40
    ? "from-purple-500 to-violet-400"
    : "from-rose-500 to-pink-400";

  const ctaLabel = showDecayPrimary ? "Revise Now" : mastery === 0 ? "Start Learning" : "Continue Practice";
  const ctaGradient = showDecayPrimary
    ? "from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
    : "from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500";
  const ctaShadow = showDecayPrimary ? "shadow-amber-500/25" : "shadow-purple-500/25";

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {primaryConcept && (
        <div className={`relative rounded-3xl overflow-hidden border border-white/[0.07] bg-gradient-to-br ${bg} bg-slate-900/70 group`}>
          {/* Top shimmer */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          {/* Ambient glow blob */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.03] rounded-full blur-2xl pointer-events-none" />

          <div className="relative p-6">
            {/* Label row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                {showDecayPrimary ? (
                  <>
                    <RefreshCw size={11} className="text-amber-400" />
                    <p className="text-[10px] font-black tracking-[0.12em] text-amber-400 uppercase">
                      Review before you forget
                    </p>
                  </>
                ) : (
                  <>
                    <Sparkles size={11} className="text-purple-400" />
                    <p className="text-[10px] font-black tracking-[0.12em] text-purple-300 uppercase">
                      Pick up where you left off
                    </p>
                  </>
                )}
              </div>
              {isStable && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle size={9} />
                  Stable
                </div>
              )}
            </div>

            {/* Concept name */}
            <h3 className="text-xl font-black text-white tracking-tight mt-1 mb-0.5">
              {primaryConcept.name}
            </h3>
            <p className="text-xs text-gray-400 mb-4 font-medium">
              {primaryConcept.chapter || primaryConcept.subtopic_name || ""}
            </p>

            {/* Mastery display */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mastery</span>
              <span className={`text-sm font-black tabular-nums ${masteryColor}`}>{mastery}%</span>
            </div>
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/[0.04] mb-5">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${mastery}%` }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate(`/learn/${primaryConcept.id}`)}
              className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${ctaGradient} text-white text-sm font-black shadow-xl ${ctaShadow} hover:shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2`}
            >
              {ctaLabel}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Recent concept chips */}
      {recentConcepts.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {recentConcepts.slice(0, 5).map((concept, i) => (
            <motion.button
              key={concept.id}
              onClick={() => navigate(`/learn/${concept.id}`)}
              className="flex-shrink-0 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] hover:border-purple-500/30 text-xs text-gray-300 hover:text-white transition-all font-medium"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
            >
              {concept.name}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
