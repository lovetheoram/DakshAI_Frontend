import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// Static insights based on dashboard data patterns
function generateInsight(dashboard) {
  const knowledge = dashboard?.brain_stats?.knowledge ?? 0;
  const memory = dashboard?.brain_stats?.memory ?? 0;
  const accuracy = dashboard?.brain_stats?.accuracy ?? 0;
  const todayGrowth = dashboard?.today_growth ?? 0;

  if (memory < 40) {
    return {
      text: "Your memory retention is dropping. A 10-minute revision session now would restore 3 concepts before they fade.",
      type: "warning",
    };
  }
  if (accuracy > 80 && todayGrowth < 20) {
    return {
      text: "High accuracy, low volume. You're being careful — now push harder. Try 5 more questions to break through.",
      type: "push",
    };
  }
  if (knowledge > 60) {
    return {
      text: "You've crossed 60% knowledge coverage. The next 20% is where most students plateau. Keep going.",
      type: "motivate",
    };
  }
  if (todayGrowth > 50) {
    return {
      text: "Exceptional session today. Your brain is forming strong connections. Don't break the streak tomorrow.",
      type: "celebrate",
    };
  }
  return {
    text: "Consistency beats intensity. Even 15 minutes today keeps your neural pathways active.",
    type: "default",
  };
}

export default function AICoach({ dashboard }) {
  const insight = generateInsight(dashboard);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <GlassCard className="relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/8 rounded-full blur-2xl" />

        <div className="relative flex gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center mt-0.5">
            <Sparkles size={16} className="text-purple-400" />
          </div>

          <div className="flex-1">
            <p className="text-caption mb-1.5">AI Coach</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {insight.text}
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
