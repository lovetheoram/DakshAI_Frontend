// src/components/ui/ThemeCustomizerModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Palette, CheckCircle2, Sparkles, Sun, Moon, Sparkle, Compass, HeartHandshake, Award, Clock } from "lucide-react";
import { useExperience } from "../../context/ThemeContext";
import { useEmotionEngine } from "../../context/EmotionEngineContext";

// Safe wrapper to handle potential context being unavailable
function safeUseEmotionEngine() {
  try {
    const ctx = useEmotionEngine();
    return ctx || { IDENTITY_TITLES: [], unlockedTitleIds: [] };
  } catch {
    return { IDENTITY_TITLES: [], unlockedTitleIds: [] };
  }
}

const THEME_ICONS = {
  classic: Compass,
  sunrise: Sun,
  forest: Sparkles,
  galaxy: Sparkle,
  candy: HeartHandshake,
  midnight: Moon,
};

export default function ThemeCustomizerModal() {
  const {
    theme,
    setTheme,
    autoAdapt,
    setAutoAdapt,
    THEMES,
    isCustomizerOpen,
    closeCustomizer,
  } = useExperience();

  const { IDENTITY_TITLES = [], unlockedTitleIds = [] } = safeUseEmotionEngine();

  if (!isCustomizerOpen) return null;

  const handleSelectTheme = (themeId) => {
    if (autoAdapt) {
      setAutoAdapt(false);
    }
    setTheme(themeId);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-slate-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Palette size={22} />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                  Choose Your Study Environment
                  <Sparkles size={16} className="text-amber-400" />
                </h2>
                <p className="text-xs text-gray-400">
                  Click any environment below to immediately switch your learning space.
                </p>
              </div>
            </div>

            <button
              onClick={closeCustomizer}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">

            {/* Smart Auto-Adapt Mode Switcher Ribbon */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900 border border-purple-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>Smart Time-of-Day Auto-Adaptation</span>
                    {autoAdapt && <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Auto-switches environment based on time (Morning 🌅 Sunrise, Afternoon ⚡ Classic, Evening 🍃 Forest, Night 🌙 Midnight).
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAutoAdapt(!autoAdapt)}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 shrink-0 ${
                  autoAdapt ? "bg-purple-600" : "bg-white/10"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    autoAdapt ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Identity Titles Badge Ribbon */}
            {IDENTITY_TITLES.length > 0 && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                    <Award size={16} className="text-amber-400" />
                    <span>Earned Growth Badges & Identities</span>
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400">
                    {unlockedTitleIds.length} / {IDENTITY_TITLES.length + 1} Earned
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-center">
                    <span className="text-lg block">🎓</span>
                    <span className="text-xs font-bold text-white block">Novice</span>
                    <span className="text-[9px] text-emerald-400 font-semibold block">Unlocked</span>
                  </div>

                  {IDENTITY_TITLES.map((idItem) => {
                    const isEarned = unlockedTitleIds.includes(idItem.id);
                    return (
                      <div
                        key={idItem.id}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isEarned
                            ? "bg-slate-900 border-amber-500/40 shadow-sm"
                            : "bg-slate-950/60 border-white/10 opacity-60"
                        }`}
                      >
                        <span className="text-lg block">{idItem.icon}</span>
                        <span className="text-xs font-bold text-white block">{idItem.title}</span>
                        <span className={`text-[9px] font-semibold block ${isEarned ? "text-amber-400" : "text-gray-400"}`}>
                          {isEarned ? "Earned" : "Locked"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Grid of 6 Study Environments - 100% Unlocked & Selectable */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {THEMES.map((item) => {
                const isActive = theme === item.id;
                const IconComponent = THEME_ICONS[item.id] || Palette;

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTheme(item.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between text-left cursor-pointer ${
                      isActive
                        ? "bg-slate-900 border-purple-500 shadow-xl shadow-purple-500/20 ring-2 ring-purple-500/40"
                        : "bg-slate-900/60 border-white/10 hover:border-purple-500/40 hover:bg-slate-900/90"
                    }`}
                  >
                    {/* Background accent glow */}
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.previewGradient} opacity-25 blur-2xl pointer-events-none`}
                    />

                    <div>
                      {/* Top bar: Icon & Active Checkmark */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="p-2.5 rounded-xl text-white shadow-md flex items-center justify-center"
                            style={{ backgroundColor: item.accentColor }}
                          >
                            <IconComponent size={20} />
                          </div>
                          <div>
                            <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                              <span>{item.name}</span>
                              <span className="text-sm">{item.badge}</span>
                            </h3>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                              {item.feeling}
                            </span>
                          </div>
                        </div>

                        {isActive && (
                          <div className="p-1 rounded-full bg-emerald-500 text-slate-950 font-bold shadow-md">
                            <CheckCircle2 size={20} />
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    {/* Color Swatch Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10 w-full">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                        {item.audience.split("&")[0]}
                      </span>

                      <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/40 border border-white/10">
                        {item.palette.map((color, cIdx) => (
                          <div
                            key={cIdx}
                            className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-4 border-t border-white/10 bg-slate-950 flex items-center justify-end gap-3">
            <button
              onClick={closeCustomizer}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-purple-500/20"
            >
              Done / Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
