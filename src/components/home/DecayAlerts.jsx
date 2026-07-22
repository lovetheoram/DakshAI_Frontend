import { useNavigate } from "react-router-dom";
import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";
import { TrendingDown, ChevronRight, AlertTriangle } from "lucide-react";

export default function DecayAlerts({ decayAlerts = [] }) {
  const navigate = useNavigate();

  if (!decayAlerts || decayAlerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <GlassCard className="relative overflow-hidden" accent accentColor="amber">
        {/* Warm glow blob */}
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/25 to-orange-500/15 border border-amber-500/25 flex items-center justify-center shadow-md">
              <TrendingDown size={16} className="text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-black text-amber-300">Memory Fading</p>
                <span className="text-[10px] font-black bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/25">
                  {decayAlerts.length}
                </span>
              </div>
              <p className="text-[10px] text-gray-500">
                Revise now to lock in your knowledge before it slips
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {decayAlerts.map((alert, i) => {
              const retention = Math.round(alert.retention_pct);
              const urgencyColor =
                retention < 40
                  ? "from-red-500 to-rose-400"
                  : "from-amber-500 to-orange-400";
              const urgencyText =
                retention < 40 ? "text-rose-400" : "text-amber-400";

              return (
                <motion.button
                  key={alert.concept_id}
                  onClick={() => navigate(`/learn/${alert.concept_id}`)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/15 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all group text-left"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.1 }}
                >
                  {/* Retention ring */}
                  <div className="relative flex-shrink-0 w-10 h-10">
                    <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                      <motion.circle
                        cx="18" cy="18" r="14"
                        fill="none"
                        stroke={retention < 40 ? "#f43f5e" : "#f59e0b"}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 14}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 14 * (1 - retention / 100) }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.7 }}
                      />
                    </svg>
                    <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-black ${urgencyText}`}>
                      {retention}%
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{alert.concept_name}</p>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">{alert.subtopic_name}</p>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors whitespace-nowrap">
                    Revise
                    <ChevronRight size={11} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
