// src/components/learn/ExamReadinessDreamPage.jsx
// DakshAI Student Vocal Learning Content Engine
// Voice-first presentation with text reveal, live equalizer, interactive timebar, and mobile-optimized controls.

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  Clock,
  Sliders,
  X,
  Volume2,
} from "lucide-react";

export const DEFAULT_VOCAL_LEARNING_SERIES = [
  {
    id: "l-1",
    module: "LLM Architecture",
    title: "Why Transformers Replaced RNNs",
    narration: [
      "Why did Transformer architectures replace Recurrent Neural Networks for processing long context sequences in deep learning?",
      "In traditional RNNs, hidden state updates occurred sequentially token-by-token, causing vanishing gradients over long sequences.",
      "Transformers introduced Scaled Dot-Product Self-Attention, allowing every token to compute attention weights with all other tokens simultaneously."
    ],
    key_takeaway: "Transformers replaced RNNs by using self-attention to compute long-range token relationships in parallel on GPUs."
  }
];

export const DEFAULT_AI_ENGINEERING_SERIES = DEFAULT_VOCAL_LEARNING_SERIES;

export function prepareCompanionStory(rawLessons) {
  let list = rawLessons;
  if (rawLessons && !Array.isArray(rawLessons) && Array.isArray(rawLessons.scenes)) {
    list = rawLessons.scenes;
  }
  if (!Array.isArray(list) || list.length === 0) {
    return DEFAULT_VOCAL_LEARNING_SERIES;
  }
  return list.map((item, idx) => {
    const rawNarration = Array.isArray(item.narration)
      ? item.narration
      : typeof item.narration === "string"
        ? [item.narration]
        : Array.isArray(item.persona_female)
          ? item.persona_female
          : Array.isArray(item.persona_male)
            ? item.persona_male
            : [];

    const titleText = item.title || `Scene ${item.scene_number || idx + 1}`;

    const fullNarration = [
      `Do you have any idea about ${titleText}? Let's deep dive into it!`,
      ...rawNarration
    ];

    return {
      id: item.id || `scene-${item.scene_number || idx + 1}`,
      module: item.module || "Core Material",
      title: titleText,
      teaching_intent: item.teaching_intent || item.necessity || "",
      narration: fullNarration,
      key_takeaway: item.key_takeaway || item.takeaway || ""
    };
  });
}

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
};

export default function ExamReadinessDreamPage({
  subjectName = "AI Engineering",
  lessons = DEFAULT_VOCAL_LEARNING_SERIES,
  onBack,
}) {
  const [personaMode, setPersonaMode] = useState("male");
  const story = prepareCompanionStory(lessons);

  const storageKey = `daksh_vocal_engine_${subjectName.replace(/\s+/g, "_").toLowerCase()}_saved_pos`;
  const savedSceneIdx = parseInt(localStorage.getItem(storageKey) || "0", 10);
  const initialScene = savedSceneIdx >= 0 && savedSceneIdx < story.length ? savedSceneIdx : 0;

  const [sceneIdx, setSceneIdx] = useState(initialScene);
  const [paragraphIdx, setParagraphIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [revealedChars, setRevealedChars] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  const [voices, setVoices] = useState([]);
  const [isSwitchingVoice, setIsSwitchingVoice] = useState(false);

  const activeUtteranceRef = useRef(null);

  const activeScene = story[sceneIdx] || story[0];
  const activeNarration = activeScene.narration || [];
  const activeText = activeNarration[paragraphIdx] || activeNarration[0] || "";

  // Dynamic duration calculation based on active speechRate
  const fullSceneText = activeNarration.join(" ");
  const totalSeconds = Math.max(3, Math.round((fullSceneText.length * 0.072) / speechRate));
  const sceneProgressPct = Math.min(100, Math.round((elapsedSeconds / Math.max(1, totalSeconds)) * 100));

  // Audio unlock helper for mobile browsers (iOS / Android)
  const unlockAudioEngine = () => {
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.resume();
      } catch (e) {}
    }
  };

  useEffect(() => {
    setElapsedSeconds(0);
  }, [sceneIdx]);

  useEffect(() => {
    let timer = null;
    if (isSpeaking && !isPaused) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => (prev < totalSeconds ? prev + 1 : prev));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSpeaking, isPaused, totalSeconds]);

  useEffect(() => {
    const updateVoices = () => {
      if ("speechSynthesis" in window) {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          setVoices(available);
        }
      }
    };
    updateVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, sceneIdx.toString());
  }, [sceneIdx, storageKey]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Character reveal animation
  useEffect(() => {
    let interval = null;
    if (isSpeaking && !isPaused && !isSwitchingVoice && activeText) {
      setRevealedChars(0);
      const speedMs = Math.max(10, Math.floor(32 / speechRate));
      interval = setInterval(() => {
        setRevealedChars((prev) => {
          if (prev < activeText.length) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, speedMs);
    } else if (!isSpeaking && !isPaused && !isSwitchingVoice) {
      setRevealedChars(activeText.length);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sceneIdx, paragraphIdx, isSpeaking, isPaused, activeText, speechRate, personaMode, isSwitchingVoice]);

  const speakText = (
    text,
    onComplete,
    modeOverride = personaMode,
    rateOverride = speechRate
  ) => {
    if (!("speechSynthesis" in window)) return;
    unlockAudioEngine();
    window.speechSynthesis.cancel();

    setIsSpeaking(true);
    setIsPaused(false);
    setRevealedChars(0);

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtteranceRef.current = utterance;
    
    // Clamp speech rate between 0.6 and 1.6 for clear audio playback
    utterance.rate = Math.max(0.6, Math.min(1.6, rateOverride * 0.95));

    const isFemale = modeOverride === "female";
    // Safe clamped pitch values for iOS Safari & Android WebSpeech engines
    utterance.pitch = isFemale ? 1.1 : 0.95;

    const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    const eligibleVoices = availableVoices.filter(
      (v) => v.lang.toLowerCase().includes("hi") || v.lang.toLowerCase().includes("in") || v.lang.toLowerCase().includes("en")
    );
    const pool = eligibleVoices.length > 0 ? eligibleVoices : availableVoices;

    let targetVoice = null;
    if (pool.length > 0) {
      if (isFemale) {
        targetVoice = pool.find((v) => {
          const name = v.name.toLowerCase();
          return (
            name.includes("female") ||
            name.includes("woman") ||
            name.includes("swara") ||
            name.includes("kalpana") ||
            name.includes("zira") ||
            name.includes("aria") ||
            name.includes("jenny") ||
            name.includes("sangeeta")
          );
        }) || pool.find((v) => !v.name.toLowerCase().includes("male") && !v.name.toLowerCase().includes("david")) || pool[pool.length - 1];
      } else {
        targetVoice = pool.find((v) => {
          const name = v.name.toLowerCase();
          return (
            name.includes("male") ||
            name.includes("man") ||
            name.includes("david") ||
            name.includes("mark") ||
            name.includes("hemant") ||
            name.includes("guy")
          );
        }) || pool[0];
      }
    }

    if (targetVoice) {
      utterance.voice = targetVoice;
      utterance.lang = targetVoice.lang || "en-US";
    } else {
      utterance.lang = "en-US";
    }

    utterance.onend = () => {
      if (activeUtteranceRef.current !== utterance) return;
      if (onComplete) {
        onComplete();
      } else {
        setIsSpeaking(false);
        setIsPaused(false);
      }
    };

    utterance.onerror = () => {
      if (activeUtteranceRef.current !== utterance) return;
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const speakCurrentParagraph = (
    sIdx = sceneIdx,
    pIdx = paragraphIdx,
    rate = speechRate,
    modeOverride = personaMode
  ) => {
    const currentScene = story[sIdx];
    if (!currentScene) return;

    const currentNarration = currentScene.narration || [];
    const textToSpeak = currentNarration[pIdx];
    if (!textToSpeak) return;

    setSceneIdx(sIdx);
    setParagraphIdx(pIdx);

    speakText(textToSpeak, () => {
      if (pIdx < currentNarration.length - 1) {
        speakCurrentParagraph(sIdx, pIdx + 1, rate, modeOverride);
      } else {
        setIsSpeaking(false);
        setIsPaused(false);
      }
    }, modeOverride, rate);
  };

  const handleVoiceSwitch = (targetMode) => {
    unlockAudioEngine();
    setIsSwitchingVoice(true);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setRevealedChars(0);
    setPersonaMode(targetMode);

    setTimeout(() => {
      setIsSwitchingVoice(false);
      speakCurrentParagraph(sceneIdx, paragraphIdx, speechRate, targetMode);
    }, 250);
  };

  const handleRateChange = (newRate) => {
    unlockAudioEngine();
    setSpeechRate(newRate);
    if (isSpeaking || isPaused) {
      setIsSpeaking(true);
      setIsPaused(false);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      speakCurrentParagraph(sceneIdx, paragraphIdx, newRate, personaMode);
    }
  };

  const handlePlayPause = () => {
    unlockAudioEngine();
    if (!("speechSynthesis" in window)) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    } else if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
    } else {
      speakCurrentParagraph(sceneIdx, paragraphIdx, speechRate, personaMode);
    }
  };

  const handleReplay = () => {
    unlockAudioEngine();
    setElapsedSeconds(0);
    speakCurrentParagraph(sceneIdx, 0);
  };

  const handleNextScene = () => {
    unlockAudioEngine();
    if (sceneIdx < story.length - 1) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      speakCurrentParagraph(sceneIdx + 1, 0);
    }
  };

  const handlePrevScene = () => {
    unlockAudioEngine();
    if (sceneIdx > 0) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      speakCurrentParagraph(sceneIdx - 1, 0);
    }
  };



  const isFinalParagraph = paragraphIdx === activeNarration.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between overflow-hidden select-none font-sans">

      {/* Background Aura */}
      <div className={`absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] transition-all duration-700 opacity-70 ${
        personaMode === "female"
          ? "from-purple-950/40 via-black to-black"
          : "from-sky-950/40 via-black to-black"
      }`} />

      {/* Top Header Bar */}
      <div className="relative z-20 shrink-0 px-3 py-2.5 border-b border-white/10 bg-black/80 backdrop-blur-md flex items-center justify-between gap-2">
        {/* Left: Exit Engine */}
        <button
          onClick={() => {
            if ("speechSynthesis" in window) window.speechSynthesis.cancel();
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-xl border border-white/10 shrink-0"
          title="Exit Scene View"
        >
          <ArrowLeft size={16} />
          <span className="hidden xs:inline">Exit</span>
        </button>

        {/* Center: Subject Name Only */}
        <div className="text-center truncate px-2 min-w-0 flex-1">
          <h1 className="text-xs sm:text-sm font-black text-gray-100 tracking-wide truncate">
            {subjectName}
          </h1>
        </div>

        {/* Right: Scene Badge & Options Dropdown Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-extrabold text-amber-300 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 whitespace-nowrap">
            {sceneIdx + 1}/{story.length}
          </span>

          <button
            onClick={() => setShowOptions(!showOptions)}
            className={`p-1.5 rounded-xl transition-all cursor-pointer border ${
              showOptions
                ? "bg-amber-400 text-slate-950 border-amber-300"
                : "bg-white/10 hover:bg-white/20 text-gray-200 border-white/10"
            }`}
            title="Audio & Voice Options"
          >
            <Sliders size={16} />
          </button>
        </div>
      </div>

      {/* Options Dropdown Popover */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-14 right-3 z-30 w-72 p-4 rounded-2xl bg-zinc-900/95 border border-white/20 shadow-2xl backdrop-blur-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Volume2 size={14} />
                Audio Settings
              </span>
              <button
                onClick={() => setShowOptions(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X size={14} />
              </button>
            </div>

            {/* Voice Selection */}
            <div>
              <label className="text-[10px] font-extrabold uppercase text-gray-400 block mb-1.5 tracking-wider">
                Voice Persona
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleVoiceSwitch("male")}
                  disabled={isSwitchingVoice}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    personaMode === "male"
                      ? "bg-sky-500 text-white shadow-md ring-2 ring-sky-400/30"
                      : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  Male 👦
                </button>
                <button
                  onClick={() => handleVoiceSwitch("female")}
                  disabled={isSwitchingVoice}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    personaMode === "female"
                      ? "bg-purple-500 text-white shadow-md ring-2 ring-purple-400/30"
                      : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  Female 👧
                </button>
              </div>
            </div>

            {/* Playback Speed */}
            <div>
              <label className="text-[10px] font-extrabold uppercase text-gray-400 block mb-1.5 tracking-wider">
                Playback Speed
              </label>
              <div className="flex items-center justify-between gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                {[0.5, 0.75, 1.0, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleRateChange(rate)}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                      speechRate === rate
                        ? personaMode === "female"
                          ? "bg-purple-400 text-slate-950 shadow-md"
                          : "bg-sky-400 text-slate-950 shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene Title Block Below Header */}
      <div className="relative z-10 shrink-0 w-full px-4 pt-3 pb-1 text-center bg-black/40">
        <h2 className="text-sm sm:text-base font-black text-amber-300 tracking-wide leading-snug max-w-xl mx-auto line-clamp-2">
          {activeScene.title}
        </h2>
      </div>

      {/* Main Spoken Text & Soundwave Stage */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 py-4 flex flex-col items-center justify-between max-w-3xl mx-auto w-full my-auto">
        
        {/* Spoken Text Reveal */}
        <AnimatePresence mode="wait">
          {isSwitchingVoice ? (
            <div key="loader" className="flex items-center gap-2 text-xs font-bold text-amber-400 py-6 my-auto">
              <RefreshCw size={18} className="animate-spin" />
              <span>Switching Voice Engine...</span>
            </div>
          ) : (
            <motion.div
              key={`${sceneIdx}-${paragraphIdx}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-center space-y-4 max-h-[240px] overflow-y-auto w-full px-2 py-2 my-auto"
            >
              <p className={`text-base sm:text-lg font-medium leading-relaxed tracking-wide select-text ${
                paragraphIdx === 0
                  ? "text-amber-300 font-bold"
                  : paragraphIdx === 1
                  ? "text-cyan-200 italic text-sm sm:text-base"
                  : "text-gray-100"
              }`}>
                {activeText.slice(0, revealedChars)}
                {revealedChars < activeText.length && (
                  <span className={`inline-block w-1.5 h-4 ml-1 animate-pulse align-middle ${
                    personaMode === "female" ? "bg-purple-400" : "bg-sky-400"
                  }`} />
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Soundwave Equalizer */}
        <div className="flex items-center justify-center gap-1.5 h-8 mt-4 mb-2 shrink-0">
          {[40, 75, 100, 65, 95, 50, 85, 60, 90, 45, 70].map((h, i) => (
            <motion.div
              key={i}
              className={`w-1 rounded-full ${
                personaMode === "female"
                  ? "bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.6)]"
                  : "bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.6)]"
              }`}
              animate={{
                height: isSpeaking && !isPaused ? [`${h * 0.25}%`, `${h}%`, `${h * 0.35}%`] : "6px",
              }}
              transition={{
                duration: 0.55,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.06,
              }}
            />
          ))}
        </div>

        {/* End of Scene Check-In */}
        <AnimatePresence>
          {isFinalParagraph && !isSpeaking && !isPaused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-900 border border-amber-500/30 shadow-2xl text-center space-y-3 w-full max-w-md mx-auto shrink-0"
            >
              <div className="flex items-center justify-center gap-2 text-amber-300 font-extrabold text-xs sm:text-sm">
                <span>❓ Did you understand this concept?</span>
              </div>
              <p className="text-[11px] text-gray-300 font-medium">
                Choose an action to continue your learning path:
              </p>
              <div className="flex items-center justify-center gap-2.5 pt-1">
                <button
                  onClick={handleNextScene}
                  className={`w-full py-2.5 px-4 rounded-xl font-black text-xs transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5 ${
                    personaMode === "female"
                      ? "bg-purple-500 hover:bg-purple-400 text-white"
                      : "bg-sky-500 hover:bg-sky-400 text-slate-950"
                  }`}
                >
                  <span>Continue to Next Scene →</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Control Bar with Audio Progress Time Bar */}
      <div className="relative z-10 shrink-0 px-4 py-3 bg-black/95 backdrop-blur-xl border-t border-white/10 flex flex-col items-center gap-2 max-w-3xl mx-auto w-full rounded-t-2xl shadow-2xl">
        
          {/* Visual Audio Time Progress Bar */}
          <div className="w-full">
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1">
              <span className="flex items-center gap-1">
                <Clock size={10} className={isSpeaking && !isPaused ? "animate-spin text-amber-400" : "text-amber-400"} />
                {formatTime(elapsedSeconds)}
              </span>
              <span className="text-amber-300/80 font-bold">{formatTime(totalSeconds)}</span>
            </div>
            <div
              className="relative w-full h-2 rounded-full bg-white/15 overflow-hidden"
            >
            <div
              className={`h-full transition-all duration-200 ${
                personaMode === "female"
                  ? "bg-gradient-to-r from-purple-500 via-pink-400 to-amber-300 shadow-[0_0_8px_rgba(232,121,249,0.8)]"
                  : "bg-gradient-to-r from-sky-500 via-cyan-400 to-amber-300 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
              }`}
              style={{ width: `${sceneProgressPct}%` }}
            />
          </div>
        </div>

        {/* Centralized Traversal & Play Controls */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 w-full pt-1">
          {/* Previous Scene Button */}
          <button
            onClick={handlePrevScene}
            disabled={sceneIdx === 0}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 disabled:opacity-30 transition-all cursor-pointer border border-white/10 flex items-center justify-center"
            title="Previous Scene"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Main Play / Pause Button */}
          <button
            onClick={handlePlayPause}
            className={`px-6 py-2.5 rounded-2xl text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl transition-all hover:scale-105 cursor-pointer min-w-[130px] justify-center ${
              personaMode === "female"
                ? "bg-purple-400 hover:bg-purple-300"
                : "bg-sky-400 hover:bg-sky-300"
            }`}
          >
            {isSpeaking ? (
              <>
                <Pause size={18} className="fill-current" />
                <span>Pause</span>
              </>
            ) : isPaused ? (
              <>
                <Play size={18} className="fill-current ml-0.5" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Play size={18} className="fill-current ml-0.5" />
                <span>Listen</span>
              </>
            )}
          </button>

          {/* Next Scene Button */}
          <button
            onClick={handleNextScene}
            disabled={sceneIdx === story.length - 1}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 disabled:opacity-30 transition-all cursor-pointer border border-white/10 flex items-center justify-center"
            title="Next Scene"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
