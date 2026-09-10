// src/pages/SettingsPage.jsx
// Compact, Logical Settings Page for DakshAI.

import { useState } from "react";
import { ArrowLeft, Moon, Sun, Bell, Volume2, BookOpen, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useExperience } from "../context/ThemeContext";
import PreferenceStore from "../product/preferenceStore";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useExperience();

  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [selectedExam, setSelectedExam] = useState("JEE Main");

  const [prefs, setPrefs] = useState(() => PreferenceStore.getPreferences());

  const handleMentorChange = (intensity) => {
    const updated = PreferenceStore.updatePreferences({ mentorIntensity: intensity });
    setPrefs(updated);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft size={15} />
        </button>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">Settings</h1>
          <p className="text-xs text-gray-400">Preferences & environment.</p>
        </div>
      </div>

      {/* 1. Environment Mode (Night / Day) */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {theme === "night" ? <Moon size={16} className="text-sky-400" /> : <Sun size={16} className="text-amber-400" />}
          <div>
            <p className="text-xs font-bold text-white">Sanctuary Mode</p>
            <p className="text-[10px] text-gray-400">
              {theme === "night" ? "Night Sanctuary (Dark Obsidian)" : "Daylight Sanctuary (Soft Warm)"}
            </p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-300 font-extrabold text-[11px] transition-all cursor-pointer"
        >
          {theme === "night" ? "Switch to Day" : "Switch to Night"}
        </button>
      </div>

      {/* 2. Companion Intensity (Low / Balanced / Guided) */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Shield size={14} className="text-sky-400" />
          <span>Companion Guidance Level</span>
        </div>
        <p className="text-[10px] text-gray-400">
          Controls how often Daksh offers learning hints or friction support.
        </p>

        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {["low", "balanced", "guided"].map((level) => (
            <button
              key={level}
              onClick={() => handleMentorChange(level)}
              className={`py-1.5 rounded-xl text-[10px] font-extrabold capitalize border transition-all cursor-pointer ${
                prefs.mentorIntensity === level
                  ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                  : "bg-white/[0.02] border-white/[0.06] text-gray-400 hover:text-white"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Target Exam */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <BookOpen size={14} className="text-sky-400" />
          <span>Target Syllabus</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {["JEE Main", "NEET", "Placement Prep", "State PCS"].map((exam) => (
            <button
              key={exam}
              onClick={() => setSelectedExam(exam)}
              className={`py-1.5 px-3 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer ${
                selectedExam === exam
                  ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                  : "bg-white/[0.02] border-white/[0.06] text-gray-400 hover:text-white"
              }`}
            >
              {exam}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Preferences: Notifications & Sound */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-300">
            <Bell size={14} className="text-gray-400" />
            <span className="font-semibold">Push Notifications</span>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
              notifications ? "bg-sky-500" : "bg-white/10"
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications ? "translate-x-4" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 text-gray-300">
            <Volume2 size={14} className="text-gray-400" />
            <span className="font-semibold">Sound Effects</span>
          </div>
          <button
            onClick={() => setSoundEffects(!soundEffects)}
            className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
              soundEffects ? "bg-sky-500" : "bg-white/10"
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${soundEffects ? "translate-x-4" : "translate-x-0"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
