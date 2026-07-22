// src/components/ui/ThemeCustomizerModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Palette, CheckCircle2, Sparkles, Lock, Sun, Moon, Sparkle, Compass, HeartHandshake, Award } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useEmotionEngine } from "../../context/EmotionEngineContext";

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
    THEMES,
    isCustomizerOpen,
    closeCustomizer,
    SUBJECT_IDENTITIES,
  } = useTheme();

  const { IDENTITY_TITLES, unlockedTitleIds } = useEmotionEngine();

  if (!isCustomizerOpen) return null;

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
                  Customize Your Learning Space
                  <Sparkles size={16} className="text-amber-400" />
                </h2>
                <p className="text-xs text-gray-400">
                  Earn identity titles through learning effort to unlock mood space themes
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

            {/* Identity Titles Badge Ribbon */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                  <Award size={16} className="text-amber-400" />
                  <span>Earned Growth Identities</span>
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
            
            {/* Grid of 6 Mood Themes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {THEMES.map((item) => {
                const isActive = theme === item.id;
                const IconComponent = THEME_ICONS[item.id] || Palette;
                const matchedIdentity = IDENTITY_TITLES.find((idItem) => idItem.themeId === item.id);
                const isUnlocked = !matchedIdentity || unlockedTitleIds.includes(matchedIdentity.id);

                return (
                  <motion.div
                    key={item.id}
                    onClick={() => {
                      if (isUnlocked) setTheme(item.id);
                    }}
                    whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
                    whileTap={{ scale: isUnlocked ? 0.98 : 1 }}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                      !isUnlocked
                        ? "bg-slate-950/80 border-white/10 cursor-not-allowed opacity-75"
                        : isActive
                        ? "bg-slate-900 border-purple-500 shadow-xl shadow-purple-500/10 ring-2 ring-purple-500/30 cursor-pointer"
                        : "bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-900/90 cursor-pointer"
                    }`}
                  >
                    {/* Background accent glow */}
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.previewGradient} opacity-20 blur-2xl pointer-events-none`}
                    />

                    <div>
                      {/* Top bar: Icon & Active/Lock Status */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="p-2 rounded-xl text-white shadow-md"
                            style={{ backgroundColor: item.accentColor }}
                          >
                            <IconComponent size={18} />
                          </div>
                          <div>
                            <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                              {item.name}
                              {!isUnlocked && <Lock size={14} className="text-amber-400" />}
                            </h3>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                              {item.feeling}
                            </span>
                          </div>
                        </div>

                        {isActive && (
                          <div className="p-1 rounded-full bg-emerald-500 text-slate-950 font-bold">
                            <CheckCircle2 size={18} />
                          </div>
                        )}
                      </div>

                      {/* Description or Unlock Requirement */}
                      {!isUnlocked && matchedIdentity ? (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1 mb-4">
                          <strong className="block font-bold">Identity Unlock Requirement:</strong>
                          <span>{matchedIdentity.icon} Earn <strong>{matchedIdentity.title}</strong> — {matchedIdentity.requirement}</span>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-300 leading-relaxed mb-4">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Color Swatch Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
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
                  </motion.div>
                );
              })}
            </div>

            {/* Subject Recognition Preview Strip */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <span>Adaptive Subject Identity</span>
                  <span className="text-[10px] font-normal text-gray-400 lowercase">
                    (Consistent accents across themes)
                  </span>
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Object.values(SUBJECT_IDENTITIES).slice(0, 4).map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-center gap-2"
                  >
                    <span className="text-base">{sub.icon}</span>
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-white block truncate">
                        {sub.name}
                      </span>
                      <span
                        className="text-[9px] font-semibold uppercase block"
                        style={{ color: sub.accent }}
                      >
                        Accent
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="px-6 py-4 border-t border-white/10 bg-slate-950 flex items-center justify-end gap-3">
            <button
              onClick={closeCustomizer}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-purple-500/20"
            >
              Set My Space Theme
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
