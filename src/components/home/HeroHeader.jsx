import { motion } from "framer-motion";
import StatusBadge from "../ui/StatusBadge";
import { Flame } from "lucide-react";

export default function HeroHeader({ user, streak, dashboard }) {
  const hours = new Date().getHours();
  const greeting =
    hours < 12 ? "Good morning" : hours < 17 ? "Good afternoon" : "Good evening";

  const streakDays = streak?.current_streak ?? 0;
  const missionDay = dashboard?.mission_day ?? null;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ambient gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-slate-900/60 to-indigo-900/20" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative px-6 py-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-caption mb-0.5">{greeting}</p>
            <h1 className="text-heading text-white">
              {user?.username || "Learner"}
            </h1>
            {/* Mission Day — shown only once goal is active */}
            {missionDay && (
              <motion.p
                className="text-[11px] text-purple-400/80 font-semibold mt-1 tracking-wide"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Mission Day {missionDay}
              </motion.p>
            )}
          </div>

          {streakDays > 0 && (
            <StatusBadge variant="warning" icon={<Flame size={12} />} pulse={streakDays >= 7}>
              {streakDays}d streak
            </StatusBadge>
          )}
        </div>

        <p className="text-body mt-3 max-w-sm">
          Every question answered is a neuron strengthened.
        </p>
      </div>
    </motion.div>
  );
}
