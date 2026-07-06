import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";
import { Sparkles, Trophy, Zap, Flame, Star } from "lucide-react";

function computeDiscoveries(dashboard, streak) {
  const events = [];

  // 1. Concept became stable (mastery ≥ 70%)
  const allConcepts = [
    dashboard?.last_active_concept,
    ...(dashboard?.recent_concepts || []),
  ].filter(Boolean);
  const stableConcepts = allConcepts.filter((c) => c.mastery >= 70);
  if (stableConcepts.length > 0) {
    events.push({
      emoji: <Star size={14} className="text-emerald-400" />,
      text: (
        <>
          <span className="text-white font-semibold">"{stableConcepts[0].name}"</span>{" "}
          became stable
        </>
      ),
      type: "achievement",
    });
  }

  // 2. Streak milestone
  const streakVal = streak?.current_streak ?? 0;
  if ([3, 7, 14, 21, 30, 50, 100].includes(streakVal)) {
    events.push({
      emoji: <Flame size={14} className="text-orange-400" />,
      text: (
        <>
          <span className="text-white font-semibold">{streakVal}-day streak!</span>{" "}
          Keep the fire burning.
        </>
      ),
      type: "streak",
    });
  }

  // 3. Close to unlocking achievement
  const achievements = dashboard?.achievements || [];
  const nextBadge = achievements.find((a) => !a.unlocked);
  if (nextBadge) {
    events.push({
      emoji: <Trophy size={14} className="text-amber-400" />,
      text: (
        <>
          Getting close to{" "}
          <span className="text-white font-semibold">"{nextBadge.label}"</span>
        </>
      ),
      type: "progress",
    });
  }

  // 4. Weekly momentum high
  const weekComp = streak?.week_compliance ?? 0;
  if (weekComp >= 80) {
    events.push({
      emoji: <Zap size={14} className="text-purple-400" />,
      text: (
        <>
          Weekly momentum at{" "}
          <span className="text-white font-semibold">{Math.round(weekComp)}%</span>{" "}
          — you're on fire this week
        </>
      ),
      type: "milestone",
    });
  }

  return events.slice(0, 3);
}

export default function DiscoveryFeed({ dashboard, streak }) {
  const events = computeDiscoveries(dashboard, streak);

  if (events.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <GlassCard>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-purple-400" />
          <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
            What's New
          </p>
        </div>

        <div className="space-y-2.5">
          {events.map((event, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-2.5 text-sm text-gray-400 leading-relaxed"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <div className="mt-0.5 w-6 h-6 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                {event.emoji}
              </div>
              <p className="text-xs">{event.text}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
