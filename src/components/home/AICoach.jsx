import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function generateInsight(dashboard, streak) {
  const prediction = dashboard?.prediction || {};
  const decayAlerts = dashboard?.decay_alerts || [];
  const brainState = dashboard?.brain_state || {};
  const achievements = dashboard?.achievements || [];
  const totalSolved = dashboard?.total_questions_solved ?? 0;
  const activeDays = dashboard?.active_days_this_week ?? 0;
  const todayGrowth = dashboard?.today_growth ?? 0;
  const targetGrowth = dashboard?.target_growth ?? 0;
  const predictedDays = streak?.predicted_remaining_days ?? 0;

  // Priority 1: Decaying concepts — urgent
  if (decayAlerts.length > 0) {
    const alert = decayAlerts[0];
    return `Your memory of "${alert.concept_name}" has dropped to ${Math.round(alert.retention_pct)}%. A 10-minute revision session would restore it before it fades further.`;
  }

  // Priority 2: Behind pace — warning
  if (prediction.status === "behind" && prediction.days_delta > 3) {
    return `At your current pace of +${prediction.actual_daily?.toFixed(2)}%/day, you'll need about ${predictedDays} more days. You're ${prediction.days_delta} days behind your target. Try one extra session daily to close the gap.`;
  }

  // Priority 3: Achievement proximity
  const nextBadge = achievements.find((a) => !a.unlocked);
  if (nextBadge) {
    if (nextBadge.label.includes("100")) {
      const remaining = 100 - totalSolved;
      if (remaining > 0 && remaining <= 20) {
        return `You've solved ${totalSolved} questions. Just ${remaining} more to unlock the "${nextBadge.label}" badge.`;
      }
    }
  }

  // Priority 4: Low momentum
  if (activeDays <= 2) {
    return `You've only studied ${activeDays} day${activeDays !== 1 ? "s" : ""} this week. Momentum builds with consistency — even 15 minutes today keeps your neural pathways active.`;
  }

  // Priority 5: High accuracy but low volume
  if ((brainState.confidence ?? 0) > 70 && todayGrowth < targetGrowth * 0.3) {
    return "High accuracy, low volume today. You're being careful — now push harder. Try 5 more questions to break through.";
  }

  // Priority 6: Ahead of pace — celebration
  if (prediction.status === "ahead" && prediction.days_delta > 3) {
    return `You're ${prediction.days_delta} days ahead of schedule! Your consistency is paying off. Keep this pace and you'll finish earlier than planned.`;
  }

  // Priority 7: Exceptional day
  if (todayGrowth > targetGrowth * 1.5 && targetGrowth > 0) {
    return "Exceptional session today. Your brain is forming strong connections. Don't break the streak tomorrow.";
  }

  // Default
  return "Consistency beats intensity. Even 15 minutes today keeps your neural pathways active and your knowledge from fading.";
}

export default function AICoach({ dashboard, streak }) {
  const insight = generateInsight(dashboard, streak);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.5 }}
    >
      <GlassCard className="relative overflow-hidden">
        {/* Subtle gradient border */}
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-purple-500/5 to-indigo-500/5 pointer-events-none" />

        <div className="relative flex gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center mt-0.5">
            <Sparkles size={16} className="text-purple-400" />
          </div>

          <div className="flex-1">
            <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1.5">
              Daily Insight
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">{insight}</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
