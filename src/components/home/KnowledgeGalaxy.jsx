import { useNavigate } from "react-router-dom";
import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function KnowledgeGalaxy({ galaxyData }) {
  const navigate = useNavigate();
  const subjects = galaxyData?.subjects || [];
  const mastered = galaxyData?.mastered_count ?? 0;
  const total = galaxyData?.total_concepts ?? 0;

  if (subjects.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
    >
      <GlassCard className="relative overflow-hidden">
        {/* Subtle cosmic glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-base">🌌</span>
              <p className="text-xs font-bold text-white">Your Knowledge Galaxy</p>
            </div>
            <button
              onClick={() => navigate("/learn")}
              className="flex items-center gap-1 text-[10px] font-bold text-purple-400 hover:text-purple-300 transition-colors"
            >
              Explore
              <ChevronRight size={12} />
            </button>
          </div>

          {/* Dot constellations per subject */}
          <div className="space-y-3 mb-4">
            {subjects.map((subject, si) => (
              <div key={si} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-500 w-20 truncate flex-shrink-0">
                  {subject.name}
                </span>
                <div className="flex flex-wrap gap-1">
                  {subject.subtopics.map((st, i) => {
                    // strong (≥ 0.5), fading (0.01–0.49), untouched (0)
                    const isStrong = st.efficiency >= 0.5;
                    const isFading = st.efficiency > 0 && st.efficiency < 0.5;
                    const isUntouched = st.efficiency === 0;

                    return (
                      <motion.div
                        key={st.id}
                        className={`w-2.5 h-2.5 rounded-full cursor-default ${
                          isStrong
                            ? "bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.5)]"
                            : isFading
                            ? "bg-amber-400/70 animate-pulse"
                            : "bg-white/[0.08]"
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + si * 0.05 + i * 0.02 }}
                        title={`${st.name} — ${Math.round(st.efficiency * 100)}%`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer stat in human language */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
            <p className="text-xs text-gray-400">
              <span className="text-white font-bold">{mastered}</span> of{" "}
              <span className="text-gray-300">{total}</span> concepts mastered
            </p>
            <div className="flex items-center gap-2 text-[9px] text-gray-600">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400" /> strong
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400/70" /> fading
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white/[0.08]" /> new
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
