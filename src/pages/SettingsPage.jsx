// src/pages/SettingsPage.jsx
// Premium Settings Page aligned with Ivory + Ink + Antique Gold identity.
// Includes Default Speech Speed & Voice Language Preferences for Audio Notes.

import { useState, useEffect } from "react";
import { ArrowLeft, Moon, Sun, Bell, Volume2, BookOpen, Shield, Gauge, Mic } from "lucide-react";
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

  const handleSpeechRateChange = (rate) => {
    const updated = PreferenceStore.updatePreferences({ speechRate: rate });
    setPrefs(updated);
  };

  const handleVoiceLangChange = (lang) => {
    const updated = PreferenceStore.updatePreferences({ speechVoiceLang: lang });
    setPrefs(updated);
  };

  return (
    <div className="max-w-md mx-auto px-5 py-8 space-y-5 select-none text-[var(--color-text-primary)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-lg font-bold tracking-tight">Settings</h1>
          <p className="text-xs text-[var(--color-text-secondary)]">Preferences & audio speech defaults.</p>
        </div>
      </div>

      {/* 1. Environment Mode (Night / Day) */}
      <div className="daksh-card p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center">
            {theme === "night" ? <Moon size={18} /> : <Sun size={18} />}
          </div>
          <div>
            <p className="text-xs font-bold">Sanctuary Mode</p>
            <p className="text-[10px] text-[var(--color-text-secondary)]">
              {theme === "night" ? "Night Sanctuary (Dark Obsidian)" : "Daylight Sanctuary (Warm Ivory)"}
            </p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="px-3.5 py-1.5 rounded-xl btn-gold text-xs font-bold transition-all cursor-pointer"
        >
          {theme === "night" ? "Switch to Day" : "Switch to Night"}
        </button>
      </div>

      {/* 2. Vocal Learning Speech Settings */}
      <div className="daksh-card p-5 space-y-4 border-t-2 border-t-[var(--color-gold)]">
        <div className="flex items-center gap-2 text-xs font-bold">
          <Volume2 size={16} className="text-[var(--color-gold)]" />
          <span>Vocal Learning Speech Settings</span>
        </div>
        <p className="text-[11px] text-[var(--color-text-secondary)]">
          Configure default playback speed and voice language for concept vocal explanations.
        </p>

        {/* Speed Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
            Default Speech Speed
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => handleSpeechRateChange(rate)}
                className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  (prefs.speechRate || 1.0) === rate
                    ? "bg-[var(--color-gold-pale)] border-[var(--color-gold)] text-[var(--color-gold-dark)]"
                    : "bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Voice Language Selector */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
            Preferred Voice Language
          </label>
          <select
            value={prefs.speechVoiceLang || "en-US"}
            onChange={(e) => handleVoiceLangChange(e.target.value)}
            className="input-field py-2 text-xs"
          >
            <option value="en-US">English (US)</option>
            <option value="en-IN">English (India)</option>
            <option value="hi-IN">Hindi (hi-IN)</option>
          </select>
        </div>
      </div>

      {/* 3. Companion Guidance Level */}
      <div className="daksh-card p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold">
          <Shield size={16} className="text-[var(--color-gold)]" />
          <span>Companion Guidance Level</span>
        </div>
        <p className="text-[11px] text-[var(--color-text-secondary)]">
          Controls how often Daksh offers learning hints or friction support.
        </p>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {["low", "balanced", "guided"].map((level) => (
            <button
              key={level}
              onClick={() => handleMentorChange(level)}
              className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all cursor-pointer ${
                prefs.mentorIntensity === level
                  ? "bg-[var(--color-gold-pale)] border-[var(--color-gold)] text-[var(--color-gold-dark)]"
                  : "bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Target Syllabus */}
      <div className="daksh-card p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold">
          <BookOpen size={16} className="text-[var(--color-gold)]" />
          <span>Target Syllabus</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {["JEE Main", "NEET", "Placement Prep", "State PCS"].map((exam) => (
            <button
              key={exam}
              onClick={() => setSelectedExam(exam)}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                selectedExam === exam
                  ? "bg-[var(--color-gold-pale)] border-[var(--color-gold)] text-[var(--color-gold-dark)]"
                  : "bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {exam}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Notification & Sound Preferences */}
      <div className="daksh-card p-5 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Bell size={16} className="text-[var(--color-gold)]" />
            <span className="font-bold">Push Notifications</span>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
              notifications ? "bg-[var(--color-gold)]" : "bg-[var(--color-border)]"
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs pt-3 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <Volume2 size={16} className="text-[var(--color-gold)]" />
            <span className="font-bold">Sound Effects</span>
          </div>
          <button
            onClick={() => setSoundEffects(!soundEffects)}
            className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
              soundEffects ? "bg-[var(--color-gold)]" : "bg-[var(--color-border)]"
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${soundEffects ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
