// src/pages/Home.jsx
// HOME — "The Reassurance Contract"
// Ultra-clean, iconic, zero description paragraphs.
// Big typography, visual cards, and authoritative evidence.
// Always displays the calculated required pace from Day 1 based on exam target date.

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import progressApi from "../api/progressApi";
import syllabusApi from "../api/syllabusApi";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import LandingPage from "../components/home/LandingPage";
import ServerStatusChecker from "../components/home/ServerStatusChecker";
import OnboardingGate from "../components/onboarding/OnboardingGate";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Target,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isServerReady, setIsServerReady] = useState(false);

  // Progressive Disclosure for Diagnostic
  const [showWhy, setShowWhy] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashData, treeData] = await Promise.all([
        progressApi.getDashboard(),
        syllabusApi.getTree().catch(() => null),
      ]);
      setDashboard(dashData);
      setExams(treeData?.exams || []);
    } catch (err) {
      console.error("Home data fetch failed:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !isServerReady) return;
    fetchData();
  }, [user, isServerReady]);

  if (!user) return <LandingPage />;
  if (!isServerReady) return <ServerStatusChecker onReady={() => setIsServerReady(true)} />;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 space-y-8 text-left">
        <SkeletonLoader lines={2} />
        <SkeletonLoader lines={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-24 text-left space-y-4">
        <h2 className="text-xl font-black text-[var(--color-text-primary)]">
          Could not connect to your study room.
        </h2>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Let's reconnect your study session.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer shadow-xs"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── Authoritative Data From Backend ──
  const goal = dashboard?.goal;
  const prediction = dashboard?.prediction || dashboard?.trajectory || {};
  const bottleneck = dashboard?.bottleneck;
  const subjectBreakdown = dashboard?.subject_breakdown || [];

  // Target & Days
  const targetExamName = goal?.exam_name || goal?.exam?.name || goal?.title || "Target Exam";
  const daysRemaining = prediction?.days_remaining ?? (
    goal?.target_date
      ? Math.max(0, Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / 86400000))
      : null
  );

  // Authoritative Velocity & Status
  const statusType = prediction?.status || "UNAVAILABLE";
  const hasHistory = Boolean(prediction?.has_sufficient_history);

  // Calculate Required Daily Pace from target date
  const requiredDaily = prediction?.required_daily !== null && prediction?.required_daily !== undefined
    ? Number(prediction.required_daily).toFixed(1)
    : (daysRemaining && daysRemaining > 0 ? (100 / daysRemaining).toFixed(1) : "1.5");

  const actualDaily = prediction?.actual_daily !== null && prediction?.actual_daily !== undefined
    ? Number(prediction.actual_daily).toFixed(1)
    : "0.0";

  return (
    <OnboardingGate
      dashboard={dashboard}
      exams={exams}
      onComplete={fetchData}
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-12 sm:py-16 space-y-12 sm:space-y-14 select-none text-left font-sans">

        {/* ── 1. THE CONTRACT (HERO) ─────────────────────────── */}
        <section className="space-y-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30 text-xs font-bold text-[var(--color-gold-dark)] shadow-2xs">
              <span>{targetExamName}</span>
              {daysRemaining !== null && (
                <>
                  <span className="opacity-40">·</span>
                  <span>{daysRemaining} days left</span>
                </>
              )}
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight leading-[1.12]">
            You do the studying.{" "}
            <span className="text-[var(--color-gold)]">We'll help you know if it's enough.</span>
          </h1>
        </section>

        {/* ── 2. THE THREE PLACES ─────────────────────────────── */}
        <section className="space-y-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-mid-gray)]">
              When you need us
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* PLACE 1: LEARN */}
            <div
              onClick={() => navigate("/learn")}
              className="p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-gold)] hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[var(--color-text-primary)] group-hover:text-[var(--color-gold)] transition-colors">
                  Understand something.
                </h3>
              </div>
              <div className="text-xs font-bold text-[var(--color-gold)] flex items-center gap-1.5 pt-1">
                <span>Enter Learn</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* PLACE 2: PRACTICE */}
            <div
              onClick={() => navigate("/practice")}
              className="p-5 rounded-2xl bg-[var(--color-bg-card)] border-2 border-[var(--color-gold)]/40 hover:border-[var(--color-gold)] hover:shadow-gold/10 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-bold">
                  <Target size={20} />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[var(--color-gold-dark)]">
                  Test what you know.
                </h3>
              </div>
              <div className="text-xs font-black text-[var(--color-gold-dark)] flex items-center gap-1.5 pt-1">
                <span>Enter Practice</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* PLACE 3: WORLD */}
            <div
              onClick={() => navigate("/world")}
              className="p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-gold)] hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Globe size={20} />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[var(--color-text-primary)] group-hover:text-[var(--color-gold)] transition-colors">
                  See what's happening.
                </h3>
              </div>
              <div className="text-xs font-bold text-[var(--color-gold)] flex items-center gap-1.5 pt-1">
                <span>Enter World</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </section>

        {/* ── 3. YOUR WORK SHOWS US (EVIDENCE HUD) ─────────────── */}
        <section className="space-y-3 pt-2 border-t border-[var(--color-border)]">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[var(--color-gold-dark)] block">
              Your work shows us
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] space-y-4 shadow-2xs">
            <div className="flex items-baseline justify-between flex-wrap gap-4">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
                {statusType === "BEHIND" && (
                  <span className="text-rose-600 dark:text-rose-400">You're behind pace.</span>
                )}
                {statusType === "AHEAD" && (
                  <span className="text-emerald-600 dark:text-emerald-400">You're ahead of pace.</span>
                )}
                {statusType === "ON_TRACK" && (
                  <span className="text-[var(--color-gold)]">You're on pace.</span>
                )}
                {(statusType === "UNAVAILABLE" || !hasHistory) && (
                  <span className="text-[var(--color-gold)]">Calibrating your pace.</span>
                )}
              </h3>

              <div className="flex items-center gap-6 text-xs font-bold">
                <div>
                  <span className="text-[10px] text-[var(--color-mid-gray)] uppercase block">Recent</span>
                  <span className="text-base font-black text-[var(--color-text-primary)]">
                    {hasHistory && actualDaily !== "0.0" ? `${actualDaily}%` : "0.0%"}
                  </span>
                  <span className="text-[10px] font-normal text-[var(--color-mid-gray)]">/day</span>
                </div>
                <div className="h-6 w-px bg-[var(--color-border)]" />
                <div>
                  <span className="text-[10px] text-[var(--color-gold-dark)] uppercase block">Required</span>
                  <span className="text-base font-black text-[var(--color-gold)]">{requiredDaily}%</span>
                  <span className="text-[10px] font-normal text-[var(--color-mid-gray)]">/day</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Button */}
            <div className="pt-1">
              <button
                onClick={() => setShowWhy((prev) => !prev)}
                className="text-xs font-bold text-[var(--color-gold-dark)] hover:text-[var(--color-gold)] transition-colors cursor-pointer flex items-center gap-1.5 py-1"
              >
                <span>{showWhy ? "Hide Breakdown" : "How do we know?"}</span>
                {showWhy ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <AnimatePresence>
                {showWhy && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-4 border-t border-[var(--color-border)] overflow-hidden mt-2"
                  >
                    <span className="text-[11px] font-bold text-[var(--color-mid-gray)] uppercase tracking-wider block">
                      Your Verified Evidence
                    </span>

                    {/* Subject Bars */}
                    {subjectBreakdown.length > 0 ? (
                      <div className="space-y-2.5">
                        {subjectBreakdown.map((subj) => (
                          <div key={subj.id} className="space-y-1 text-xs">
                            <div className="flex justify-between font-bold">
                              <span className="text-[var(--color-text-primary)]">{subj.name}</span>
                              <span className="text-[var(--color-gold-dark)]">{subj.readiness_pct}%</span>
                            </div>
                            <div className="w-full bg-[var(--color-bg-secondary)] rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-[var(--color-gold)] h-full rounded-full transition-all duration-500"
                                style={{ width: `${subj.readiness_pct}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        Solve questions in Practice to establish your subject readiness baseline.
                      </p>
                    )}

                    {/* Bottleneck Observation */}
                    {bottleneck && (
                      <div className="p-4 rounded-xl bg-[var(--color-bg-secondary)] text-xs">
                        <p className="font-bold text-[var(--color-text-primary)]">
                          Largest gap: <span className="text-[var(--color-gold)]">{bottleneck.subject_name}</span> ({bottleneck.subtopic_name})
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </section>

      </div>
    </OnboardingGate>
  );
}
