import { useNavigate } from "react-router-dom";
import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, ChevronRight, Flame } from "lucide-react";

// ─── Static motivation line from current state ───────────────────────────────
function generateMotivationLine(dashboard) {
  const streak = dashboard?.streak_stats?.current_streak ?? 0;
  const compliance = dashboard?.streak_stats?.today_compliance ?? 0;
  const momentum = dashboard?.brain_state?.momentum ?? 0;
  const knowledge = dashboard?.brain_state?.knowledge ?? 0;

  if (compliance >= 100) return { emoji: "✅", text: "Quota complete. Your brain is done for today." };
  if (streak >= 7)       return { emoji: "🔥", text: `${streak}-day streak. Don't break it.` };
  if (momentum >= 80)    return { emoji: "⚡", text: "You're in a strong rhythm this week." };
  if (knowledge >= 60)   return { emoji: "🧠", text: `${knowledge.toFixed(0)}% ready. The next 20% is where most plateau.` };
  if (compliance > 50)   return { emoji: "📈", text: "Past halfway on today's quota. Keep the momentum." };
  return { emoji: "🎯", text: "15 minutes of focused practice beats 3 hours of passive reading." };
}

// ─── Decay Alert Chip ─────────────────────────────────────────────────────────
function DecayChip({ alert, index }) {
  const navigate = useNavigate();
  const isLow = alert.retention_pct < 30;

  return (
    <motion.button
      onClick={() => navigate(`/learn/${alert.concept_id}`)}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left transition-all active:scale-[0.98] ${
        isLow
          ? "bg-red-500/5 border-red-500/15 hover:bg-red-500/10"
          : "bg-amber-500/5 border-amber-500/15 hover:bg-amber-500/10"
      }`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.08 }}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-sm">🔁</span>
        <div>
          <p className="text-xs font-bold text-white">{alert.concept_name}</p>
          <p className="text-[10px] text-gray-500">{alert.subtopic_name}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-[10px] font-bold ${isLow ? "text-red-400" : "text-amber-400"}`}>
          {alert.retention_pct}%
        </span>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
          <span className="text-[9px] text-gray-400 font-medium">Quick Rev</span>
          <ChevronRight size={10} className="text-gray-500" />
        </div>
      </div>
    </motion.button>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AICoach({ dashboard }) {
  const decayAlerts = dashboard?.decay_alerts || [];
  const motivationLine = generateMotivationLine(dashboard);
  const hasAlerts = decayAlerts.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <GlassCard className="relative overflow-hidden space-y-3">
        {/* Subtle glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/8 rounded-full blur-2xl" />

        {/* Header */}
        <div className="relative flex items-center gap-2.5">
          <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <Sparkles size={14} className="text-purple-400" />
          </div>
          <p className="text-caption">AI Coach</p>
        </div>

        {/* Decay Alert Chips */}
        {hasAlerts && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle size={11} className="text-amber-400" />
              <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider">
                Retention dropping
              </span>
            </div>
            {decayAlerts.map((alert, i) => (
              <DecayChip key={alert.concept_id} alert={alert} index={i} />
            ))}
          </div>
        )}

        {/* Motivation line */}
        <div className={`flex items-center gap-2 ${hasAlerts ? "pt-1 border-t border-white/[0.04]" : ""}`}>
          <span className="text-base">{motivationLine.emoji}</span>
          <p className="text-xs text-gray-400 leading-relaxed">{motivationLine.text}</p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
