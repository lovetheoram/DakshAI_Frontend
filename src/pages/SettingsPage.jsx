import { useState } from "react";
import GlassCard from "../components/ui/GlassCard";
import StatusBadge from "../components/ui/StatusBadge";
import { ArrowLeft, Moon, Sun, Bell, Shield, BookOpen, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedExam, setSelectedExam] = useState("JEE Main");

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-heading text-white">Settings</h1>
          <p className="text-body text-sm mt-0.5">Customize your learning experience.</p>
        </div>
      </div>

      {/* Preferences Section */}
      <GlassCard padding="p-5" className="space-y-4">
        <h3 className="text-caption">Preferences</h3>
        
        {/* Theme Toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={18} className="text-purple-400" /> : <Sun size={18} className="text-amber-400" />}
            <div>
              <p className="text-sm font-semibold text-white">Dark Mode</p>
              <p className="text-xs text-gray-500">Enable premium glassmorphic dark theme</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${darkMode ? "bg-purple-600" : "bg-white/[0.08]"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-gray-400" />
            <div>
              <p className="text-sm font-semibold text-white">Push Notifications</p>
              <p className="text-xs text-gray-500">Get reminders for scheduled reviews</p>
            </div>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${notifications ? "bg-purple-600" : "bg-white/[0.08]"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {/* Sound Effects Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-3">
            <Volume2 size={18} className="text-gray-400" />
            <div>
              <p className="text-sm font-semibold text-white">Sound Effects</p>
              <p className="text-xs text-gray-500">Play feedback sounds during quizzes</p>
            </div>
          </div>
          <button
            onClick={() => setSoundEffects(!soundEffects)}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${soundEffects ? "bg-purple-600" : "bg-white/[0.08]"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${soundEffects ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </GlassCard>

      {/* Target Exam Section */}
      <GlassCard padding="p-5" className="space-y-4">
        <h3 className="text-caption">Target Exam</h3>
        <div className="flex items-center gap-3">
          <BookOpen size={18} className="text-purple-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Selected Syllabus</p>
            <p className="text-xs text-gray-500">Concepts and revision cycles will adapt to this syllabus</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {["JEE Main", "JEE Advanced", "NEET", "Board Exam"].map((exam) => (
            <button
              key={exam}
              onClick={() => setSelectedExam(exam)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                selectedExam === exam
                  ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                  : "bg-white/[0.02] border-white/[0.06] text-gray-400 hover:text-white"
              }`}
            >
              {exam}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Account Info / Settings */}
      <GlassCard padding="p-5" className="space-y-3">
        <h3 className="text-caption">Account & Security</h3>
        <div className="flex items-center justify-between text-sm py-2">
          <span className="text-gray-400">Account Type</span>
          <StatusBadge variant="accent">Standard</StatusBadge>
        </div>
        <div className="flex items-center justify-between text-sm py-2 border-t border-white/[0.04]">
          <span className="text-gray-400">Version</span>
          <span className="text-white font-mono text-xs">v2.0.0-beta</span>
        </div>
      </GlassCard>
    </div>
  );
}
