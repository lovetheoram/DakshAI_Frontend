import { motion } from "framer-motion";
import StatusBadge from "../ui/StatusBadge";
import { Flame } from "lucide-react";

export default function HeroHeader({ user, streak }) {
  const hours = new Date().getHours();
  const greeting =
    hours < 12 ? "Good morning" : hours < 17 ? "Good afternoon" : "Good evening";

  const streakDays = streak?.current_streak || 0;

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
            <p className="text-caption mb-1">{greeting}</p>
            <h1 className="text-heading text-white">
              {user?.username || "Learner"}
            </h1>
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
