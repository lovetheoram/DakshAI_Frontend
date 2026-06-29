import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GlassCard from "../components/ui/GlassCard";
import StatusBadge from "../components/ui/StatusBadge";
import { motion } from "framer-motion";
import {
  User,
  Settings,
  LogOut,
  Award,
  BarChart3,
  BookOpen,
  ChevronRight,
  Bell,
} from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const menuItems = [
    { icon: BarChart3, label: "My Growth", to: "/growth" },
    { icon: BookOpen, label: "Learning History", to: "/learn" },
    { icon: Bell, label: "Notifications", to: "/notifications" },
    { icon: Settings, label: "Settings", to: "/settings" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Identity card */}
      <GlassCard glow className="text-center py-8">
        <motion.div
          className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-purple-500/30 mb-5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {user?.username?.[0]?.toUpperCase() || "U"}
        </motion.div>

        <h2 className="text-heading text-white">{user?.username || "Learner"}</h2>
        <p className="text-body text-sm mt-1">{user?.email || ""}</p>

        <div className="flex items-center justify-center gap-3 mt-4">
          <StatusBadge variant="accent" icon="⚡">Learner</StatusBadge>
        </div>
      </GlassCard>

      {/* Menu */}
      <div className="space-y-2">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              onClick={() => navigate(item.to)}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-purple-500/15 transition-all text-left group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center">
                <Icon size={16} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
              </div>
              <span className="flex-1 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                {item.label}
              </span>
              <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
            </motion.button>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border border-red-500/10 hover:bg-red-500/5 transition-all text-left group"
      >
        <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
          <LogOut size={16} className="text-red-400" />
        </div>
        <span className="text-sm font-medium text-red-400 group-hover:text-red-300 transition-colors">
          Sign Out
        </span>
      </button>
    </div>
  );
}
