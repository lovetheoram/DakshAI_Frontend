import { useNavigate } from "react-router-dom";
import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";
import { TrendingDown, ChevronRight } from "lucide-react";

export default function DecayAlerts({ decayAlerts = [] }) {
  const navigate = useNavigate();

  if (!decayAlerts || decayAlerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
    >
      <GlassCard className="relative overflow-hidden border-amber-500/15">
        {/* Warm ambient glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/8 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <TrendingDown size={16} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-400">Memory Fading</p>
              <p className="text-[10px] text-gray-500">
                {decayAlerts.length} concept{decayAlerts.length > 1 ? "s" : ""} slipping from memory
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {decayAlerts.map((alert, i) => (
              <motion.button
                key={alert.concept_id}
                onClick={() => navigate(`/learn/${alert.concept_id}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06] hover:border-amber-500/20 transition-all group text-left"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.1 }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {alert.concept_name}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {alert.subtopic_name}
                  </p>
                  {/* Retention bar */}
                  <div className="mt-2 w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${alert.retention_pct}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-600 mt-1">
                    Recall: {Math.round(alert.retention_pct)}%
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Revise
                  <ChevronRight size={12} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
