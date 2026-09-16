// src/components/onboarding/DakshOnboarding.jsx
// The first-time onboarding experience — Daksh the alien companion introduces itself,
// collects exam + daily hours, then launches the user into the app.
//
// State machine: transmission → introduction → exam_select → time_select → launch
// No LLM. No backend calls during animation. Pure frontend state + copy.

import { useEffect, useRef, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import progressApi from "../../api/progressApi";
import EventTracker from "../../intelligence/events/EventTracker";

// ── Script ───────────────────────────────────────────────────────────────────
const SCRIPT = {
  transmission: [
    { text: "Transmission received...", delay: 0 },
    { text: "Hello, explorer 👽", delay: 1800 },
  ],
  introduction: "I am Daksh.\n\nI have been waiting for someone who wants to upgrade their mind.\n\nBefore we begin — I need to understand your mission.",
  examQuestion: "What universe are you preparing for?",
  timeQuestion: "How much time does your daily mission have?",
  launch: ["Interesting...", "Your journey begins."],
};

const EXAM_OPTIONS = [
  { icon: "🚀", label: "JEE", sublabel: "Joint Entrance Exam", value: "jee" },
  { icon: "🧬", label: "NEET", sublabel: "National Eligibility", value: "neet" },
  { icon: "💻", label: "Placement", sublabel: "Coding Interviews", value: "placement" },
  { icon: "🏛️", label: "State PCS", sublabel: "BPSC, UPPCS, etc.", value: "pcs" },
];

const TIME_OPTIONS = [
  { label: "30 min", value: 0.5 },
  { label: "1 hour", value: 1 },
  { label: "2 hours", value: 2 },
  { label: "4+ hours", value: 4 },
];

// ── Typing line component ─────────────────────────────────────────────────────
function TypedLine({ text, speed = 30, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        if (onDone) onDone();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && <span className="inline-block w-0.5 h-4 bg-purple-400 ml-0.5 animate-pulse align-middle" />}
    </span>
  );
}

// ── Main Onboarding component ─────────────────────────────────────────────────
export default function DakshOnboarding({ exams = [], onComplete }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState("transmission");
  const [transmissionLine, setTransmissionLine] = useState(0);
  const [showOrb, setShowOrb] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [selectedExam, setSelectedExam] = useState(() => {
    if (user?.selected_exam?.exam_type) {
      const match = EXAM_OPTIONS.find((o) => o.value === user.selected_exam.exam_type);
      if (match) return match;
    }
    return null;
  });
  const [selectedHours, setSelectedHours] = useState(null);
  const [pcsSection, setPcsSection] = useState("BPSC");
  const [launching, setLaunching] = useState(false);
  const [launchLine, setLaunchLine] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Orb appears first
  useEffect(() => {
    const t = setTimeout(() => setShowOrb(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Advance transmission lines
  useEffect(() => {
    if (step !== "transmission") return;
    const delays = [0, 1800];
    delays.forEach((d, i) => {
      setTimeout(() => setTransmissionLine(i), d);
    });
    // Move to introduction after last line finishes typing
    setTimeout(() => setStep("introduction"), 4200);
  }, [step]);

  // Match exam from API list to selected value
  function getExamId() {
    if (!selectedExam) return null;
    const found = exams.find((e) =>
      e.name.toLowerCase().includes(selectedExam.value) ||
      e.exam_type === selectedExam.value
    );
    return found?.id || (exams[0]?.id ?? null);
  }

  const handleLaunch = async () => {
    if (submitted) return;
    setLaunching(true);
    setStep("launch");
    setLaunchLine(0);
    setTimeout(() => setLaunchLine(1), 2000);

    try {
      const examId = getExamId();
      const targetDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      await progressApi.setGoal({
        goal_name: `Crack ${selectedExam?.label || "Exam"}`,
        exam: examId,
        target_date: targetDate,
        available_hours_per_day: selectedHours?.value || 2,
      });

      EventTracker.onboardingCompleted(selectedExam?.label || "");
      setSubmitted(true);

      // Full-screen flash then complete
      setTimeout(() => {
        localStorage.setItem("daksh_onboarding_done", "true");
        if (onComplete) onComplete();
      }, 3200);
    } catch (err) {
      console.error("Onboarding goal set failed:", err);
      // Still proceed — don't block the user
      setTimeout(() => {
        localStorage.setItem("daksh_onboarding_done", "true");
        if (onComplete) onComplete();
      }, 3200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050810] overflow-hidden">
      {/* Skip button */}
      <button
        type="button"
        onClick={() => {
          localStorage.setItem("daksh_onboarding_done", "true");
          if (onComplete) onComplete();
        }}
        className="absolute top-5 right-5 text-xs font-semibold text-gray-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all z-50 cursor-pointer"
      >
        Skip ✕
      </button>

      {/* Galaxy background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.4 + 0.1,
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + "s",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-radial from-purple-950/20 via-transparent to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-sm px-6 flex flex-col items-center">

        {/* ── Orb ── */}
        <AnimatePresence>
          {showOrb && (
            <motion.div
              className="mb-8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "backOut" }}
            >
              <div
                className="w-16 h-16 rounded-full"
                style={{
                  background: "radial-gradient(circle at 35% 35%, #e9d5ff, #7c3aed 50%, #0891b2 100%)",
                  boxShadow: "0 0 40px rgba(139,92,246,0.6), 0 0 80px rgba(139,92,246,0.2), 0 0 12px rgba(8,145,178,0.4)",
                  animation: "pulse 2.5s ease-in-out infinite",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STEP: Transmission ── */}
        <AnimatePresence mode="wait">
          {step === "transmission" && (
            <motion.div
              key="transmission"
              className="text-center space-y-3 min-h-[80px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {SCRIPT.transmission.map((line, i) => (
                <AnimatePresence key={i}>
                  {transmissionLine >= i && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={i === 0 ? "text-xs text-gray-500 font-mono tracking-widest uppercase" : "text-2xl font-black text-white"}
                    >
                      {i === transmissionLine ? (
                        <TypedLine text={line.text} speed={i === 0 ? 50 : 35} />
                      ) : (
                        line.text
                      )}
                    </motion.p>
                  )}
                </AnimatePresence>
              ))}
            </motion.div>
          )}

          {/* ── STEP: Introduction ── */}
          {step === "introduction" && (
            <motion.div
              key="introduction"
              className="text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm text-gray-300 leading-loose whitespace-pre-line mb-8">
                {!introDone ? (
                  <TypedLine text={SCRIPT.introduction} speed={18} onDone={() => setIntroDone(true)} />
                ) : (
                  SCRIPT.introduction
                )}
              </p>
              <AnimatePresence>
                {introDone && (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setStep(selectedExam ? "time_select" : "exam_select")}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold transition-all shadow-xl shadow-purple-500/25 active:scale-[0.97]"
                  >
                    Tell me your mission
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── STEP: Exam Select ── */}
          {step === "exam_select" && (
            <motion.div
              key="exam_select"
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-center text-base font-bold text-white mb-6">
                {SCRIPT.examQuestion}
              </p>
              <div className="space-y-3">
                {EXAM_OPTIONS.map((option) => (
                  <div key={option.value} className="space-y-2">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setSelectedExam(option);
                        if (option.value !== "pcs") {
                          setTimeout(() => setStep("time_select"), 350);
                        }
                      }}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${
                        selectedExam?.value === option.value
                          ? "border-purple-500/60 bg-purple-950/40"
                          : "border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12]"
                      }`}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-white">{option.label}</p>
                        <p className="text-[10px] text-gray-500">{option.sublabel}</p>
                      </div>
                      {selectedExam?.value === option.value && (
                        <div className="ml-auto w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </motion.button>

                    {/* PCS Sub-Section Options */}
                    {option.value === "pcs" && selectedExam?.value === "pcs" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2.5 ml-2"
                      >
                        <p className="text-[11px] font-bold text-amber-300">Select State Commission (Default: BPSC):</p>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { code: "BPSC", label: "BPSC (Bihar)" },
                            { code: "UPPSC", label: "UPPSC (UP)" },
                            { code: "MPPSC", label: "MPPSC (MP)" },
                            { code: "RAS", label: "RAS (Rajasthan)" },
                            { code: "WBPSC", label: "WBPSC (WB)" }
                          ].map((pcs) => (
                            <button
                              key={pcs.code}
                              type="button"
                              onClick={() => {
                                setPcsSection(pcs.code);
                                setTimeout(() => setStep("time_select"), 300);
                              }}
                              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                                pcsSection === pcs.code
                                  ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm"
                                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                              }`}
                            >
                              {pcs.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEP: Time Select ── */}
          {step === "time_select" && (
            <motion.div
              key="time_select"
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-center text-base font-bold text-white mb-6">
                {SCRIPT.timeQuestion}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {TIME_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedHours(opt)}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      selectedHours?.value === opt.value
                        ? "border-purple-500/60 bg-purple-950/40 text-purple-300"
                        : "border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] text-gray-400"
                    }`}
                  >
                    <p className="text-base font-black text-white">{opt.label}</p>
                    <p className="text-[9px] text-gray-500 mt-0.5">daily</p>
                  </motion.button>
                ))}
              </div>
              {selectedHours && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleLaunch}
                  disabled={launching}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold transition-all shadow-xl shadow-purple-500/25 disabled:opacity-70 active:scale-[0.97]"
                >
                  {launching ? "Initializing..." : "Begin My Journey ⚡"}
                </motion.button>
              )}
            </motion.div>
          )}

          {/* ── STEP: Launch ── */}
          {step === "launch" && (
            <motion.div
              key="launch"
              className="text-center space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                className="text-sm text-gray-400 font-mono tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {SCRIPT.launch[0]}
              </motion.p>
              <AnimatePresence>
                {launchLine >= 1 && (
                  <motion.p
                    className="text-3xl font-black text-white"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "backOut" }}
                  >
                    {SCRIPT.launch[1]}
                  </motion.p>
                )}
              </AnimatePresence>
              {/* Expanding orb flash */}
              {launchLine >= 1 && (
                <motion.div
                  className="fixed inset-0 bg-purple-600/20 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.4, 0] }}
                  transition={{ duration: 1.5, delay: 1.2 }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
