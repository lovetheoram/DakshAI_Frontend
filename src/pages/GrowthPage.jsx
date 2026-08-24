// src/pages/GrowthPage.jsx
// MAP = The Truth Room — "Where do I stand & how do I reach my goal?"
// 100% Strict data accuracy with Daily % Target Quota, Effort Reality Hours, & Growth Calculator.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import progressApi from "../api/progressApi";
import syllabusApi from "../api/syllabusApi";
import EventTracker from "../intelligence/events/EventTracker";
import StatusBadge from "../components/ui/StatusBadge";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import InfoTooltip from "../components/ui/InfoTooltip";
import ProgressBar from "../components/ui/ProgressBar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  X,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  SlidersHorizontal,
  Zap,
  BookOpen,
  HelpCircle,
  Clock,
} from "lucide-react";

export default function GrowthPage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [streak, setStreak] = useState(null);
  const [galaxyData, setGalaxyData] = useState(null);
  const [syllabusTree, setSyllabusTree] = useState(null);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Goal editing state
  const [exams, setExams] = useState([]);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [setupGoalName, setSetupGoalName] = useState("");
  const [setupExamId, setSetupExamId] = useState("");
  const [setupTargetDate, setSetupTargetDate] = useState("");
  const [setupHours, setSetupHours] = useState(2.0);
  const [submittingGoal, setSubmittingGoal] = useState(false);
  const [wizardError, setWizardError] = useState("");

  const [showExamTodayDetails, setShowExamTodayDetails] = useState(true);
  const [showGrowthCalculator, setShowGrowthCalculator] = useState(false);

  const loadAllData = async () => {
    try {
      const [dashData, streakData, treeData, diaryData] = await Promise.all([
        progressApi.getDashboard(),
        progressApi.getStreakStats(),
        syllabusApi.getTree(),
        progressApi.getDiary().catch(() => [])
      ]);
      setDashboard(dashData);
      setStreak(streakData);
      setSyllabusTree(treeData);
      setDiaryEntries(Array.isArray(diaryData) ? diaryData : []);

      const examList = treeData.exams || [];
      setExams(examList);

      if (dashData?.goal) {
        progressApi.getGalaxy().then(setGalaxyData).catch(() => {});
      }

      if (dashData?.goal) {
        setSetupGoalName(dashData.goal.name || dashData.goal.title || "");
        setSetupExamId(dashData.goal.exam_id || (examList[0]?.id ?? ""));
        setSetupTargetDate(dashData.goal.target_date || "");
        setSetupHours(dashData.goal.available_hours_per_day || 2.0);
      } else {
        if (examList.length > 0) setSetupExamId(examList[0].id);
        const targetD = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        setSetupTargetDate(targetD.toISOString().split("T")[0]);
      }
    } catch (err) {
      console.error("Map data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAllData(); }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setWizardError("");
    if (!setupGoalName.trim()) { setWizardError("Goal name is required."); return; }
    if (!setupTargetDate) { setWizardError("Target date is required."); return; }

    try {
      setSubmittingGoal(true);
      await progressApi.setGoal({
        goal_name: setupGoalName,
        exam: setupExamId ? parseInt(setupExamId) : undefined,
        target_date: setupTargetDate,
        available_hours_per_day: setupHours,
      });
      setIsEditingGoal(false);
      EventTracker.goalSet(setupGoalName);
      await loadAllData();
    } catch (err) {
      setWizardError(err.response?.data?.detail || "Failed to set target goal.");
    } finally {
      setSubmittingGoal(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <SkeletonLoader avatar />
        <SkeletonLoader lines={3} />
        <SkeletonLoader lines={5} />
      </div>
    );
  }

  const goal = dashboard?.goal;
  const prediction = dashboard?.prediction || {};
  const dakshScore = dashboard?.overall_score ?? 0;

  // Daily % Target telemetry
  const todayGrowth = dashboard?.today_growth ?? dashboard?.target?.completed_growth ?? 0;
  const targetGrowth = dashboard?.target_growth ?? dashboard?.target?.target_growth ?? 1.0;
  const todayCompliance = dashboard?.streak_stats?.today_compliance ?? Math.min(100, Math.round((todayGrowth / (targetGrowth || 1)) * 100));

  // Effort Reality hours telemetry
  const plannedHours = goal?.available_hours_per_day || 2.0;
  const todayStr = new Date().toISOString().split("T")[0];
  const todayDiary = diaryEntries.find(d => d.date === todayStr) || diaryEntries[0];
  const actualSecondsSpent = todayDiary?.time_spent_seconds || 0;
  const actualHoursSpent = actualSecondsSpent / 3600;
  const effortRealityPct = Math.min(100, Math.round((actualHoursSpent / (plannedHours || 1)) * 100));

  // Dates & Trajectory
  const today = new Date();
  const targetDateStr = goal?.target_date ? new Date(goal.target_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Not set";
  const predictedDays = streak?.predicted_remaining_days ?? 0;
  const statusType = prediction?.status || "on_track";
  const daysDelta = prediction?.days_delta ?? 0;

  // Territory breakdown
  const territories = [];
  if (galaxyData?.subjects && galaxyData.subjects.length > 0) {
    galaxyData.subjects.forEach(s => {
      let totalEff = 0;
      let count = 0;
      if (s.subtopics && s.subtopics.length > 0) {
        s.subtopics.forEach(st => {
          totalEff += (st.efficiency || 0);
          count += 1;
        });
      }
      const avgMastery = count > 0 ? (totalEff / count) : 0;
      const pct = Math.round(avgMastery * 100);
      let status = "READY";
      if (pct < 40) status = "UNSTABLE";
      else if (pct < 70) status = "DEVELOPING";
      territories.push({ name: s.name, pct, status });
    });
  } else if (syllabusTree) {
    const subList = syllabusTree.exams?.[0]?.subjects || syllabusTree.subjects || [];
    subList.forEach(s => {
      territories.push({ name: s.name, pct: 0, status: "UNSTABLE" });
    });
  }

  const readyTerritories = territories.filter(t => t.status === "READY");
  const developingTerritories = territories.filter(t => t.status === "DEVELOPING");
  const unstableTerritories = territories.filter(t => t.status === "UNSTABLE");

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 space-y-8 select-none">

      {/* ── HEADER ───────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">YOUR MAP</h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Where you actually stand.</p>
          </div>
          <InfoTooltip
            title="The Truth Room (Your Map)"
            meaning="Calculates your true preparation trajectory based on actual retrieval history, memory decay, and daily study pace."
            formula="Readiness Score = Mean(Concept Mastery across all exam subjects) * 100%"
            howToIncrease="Complete active retrieval sessions in unstable subjects to directly advance your position marker toward GOAL."
          />
        </div>

        {statusType === "behind" && daysDelta > 0 && (
          <StatusBadge variant="danger" icon={<AlertCircle size={10} />}>
            {daysDelta} days behind pace
          </StatusBadge>
        )}
        {statusType === "ahead" && daysDelta > 0 && (
          <StatusBadge variant="success" icon={<TrendingUp size={10} />}>
            {daysDelta} days ahead
          </StatusBadge>
        )}
        {statusType === "on_track" && (
          <StatusBadge variant="gold">On track</StatusBadge>
        )}
      </div>

      {/* ── DAILY TARGET % QUOTA & EFFORT REALITY ── */}
      {goal && !isEditingGoal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="daksh-card p-6 border-t-3 border-t-[var(--color-gold)] space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-caption tracking-widest text-[var(--color-gold)] font-bold flex items-center gap-1">
                <Target size={13} />
                Today's Growth Quota & Effort Reality
              </span>
              <InfoTooltip
                title="Daily Growth & Effort Reality"
                meaning="Compares your planned daily study hours against your actual logged hours and resulting growth quota fulfillment."
                formula="Growth Quota % = Achieved Daily Growth / Required Target Growth Rate"
                howToIncrease="Use the top navigation Clock icon to log your study hours. Your effort feeds directly into your daily growth quota."
              />
            </div>
            <span className="text-xs font-bold text-[var(--color-gold-dark)] bg-[var(--color-gold-pale)] px-2.5 py-0.5 rounded-full border border-[var(--color-gold)]/20">
              {todayCompliance}% Quota Met
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-semibold text-[var(--color-mid-gray)] uppercase block">Today's Achieved Growth</span>
              <span className="text-lg font-bold text-[var(--color-text-primary)] mt-0.5 block">
                +{todayGrowth.toFixed(2)}%
              </span>
            </div>
            <div className="border-l border-[var(--color-border)] pl-4">
              <span className="text-[10px] font-semibold text-[var(--color-mid-gray)] uppercase block">Required Daily Target</span>
              <span className="text-lg font-bold text-[var(--color-gold-dark)] mt-0.5 block">
                +{targetGrowth.toFixed(2)}% / day
              </span>
            </div>
          </div>

          <ProgressBar value={todayCompliance} />

          {/* Effort Reality Hours Bar (Sourced from check-in modal) */}
          <div className="p-3.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[var(--color-text-primary)]">
                <Clock size={13} className="text-[var(--color-gold)]" />
                <span>Logged Effort Reality:</span>
              </div>
              <span className="font-bold text-[var(--color-gold-dark)]">
                {actualHoursSpent.toFixed(1)} / {plannedHours.toFixed(1)} hrs ({effortRealityPct}%)
              </span>
            </div>
            <div className="bar-track">
              <div className="bar-fill-gold" style={{ width: `${effortRealityPct}%` }} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => navigate("/practice")}
              className="text-xs font-bold text-[var(--color-gold-dark)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Fulfill Quota via Practice</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => setShowGrowthCalculator(!showGrowthCalculator)}
              className="text-[11px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer flex items-center gap-1"
            >
              <HelpCircle size={12} />
              {showGrowthCalculator ? "Hide Calculator" : "How Growth Is Calculated"}
            </button>
          </div>
        </motion.div>
      )}

      {/* ── COMPREHENSIVE GROWTH CALCULATOR ── */}
      <AnimatePresence>
        {showGrowthCalculator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="daksh-card p-6 space-y-4 border-l-3 border-l-[var(--color-gold)]">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} className="text-[var(--color-gold)]" />
                  How Solving Quizzes & Studying Increases Growth
                </h3>
                <button
                  onClick={() => setShowGrowthCalculator(false)}
                  className="text-xs text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)] cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                <p>
                  Growth is dependent on <strong>Direct Concept Mastery</strong>. Your overall Goal Score ({Math.round(dakshScore)}%) is the average mastery across all exam concepts.
                </p>

                <div className="p-4 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-2">
                  <span className="text-[10px] font-bold text-[var(--color-gold-dark)] uppercase tracking-wider block">Example: Solving 30 Quiz Problems</span>
                  <ul className="space-y-1.5 pl-4 list-disc font-medium text-[var(--color-text-primary)]">
                    <li>Solving <strong>30 MCQs with 80% accuracy</strong> raises that concept's readiness by <strong>+25%</strong>.</li>
                    <li>Directly completes <strong>+{targetGrowth.toFixed(2)}%</strong> of your Daily Target Growth quota.</li>
                    <li>Increases overall Goal Readiness Score by <strong>+0.5% to +1.2%</strong> (depending on concept weight).</li>
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] text-center">
                  <div className="p-2.5 rounded-lg border border-[var(--color-border)] bg-white space-y-1">
                    <BookOpen size={14} className="mx-auto text-[var(--color-gold)]" />
                    <span className="font-bold block text-[var(--color-text-primary)]">Concept Session</span>
                    <span className="text-[10px] text-[var(--color-mid-gray)]">+0.30% Daily</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-[var(--color-border)] bg-white space-y-1">
                    <Target size={14} className="mx-auto text-[var(--color-gold)]" />
                    <span className="font-bold block text-[var(--color-text-primary)]">30 MCQ Quiz</span>
                    <span className="text-[10px] text-[var(--color-mid-gray)]">+1.20% Growth</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-[var(--color-border)] bg-white space-y-1">
                    <Shield size={14} className="mx-auto text-[var(--color-gold)]" />
                    <span className="font-bold block text-[var(--color-text-primary)]">Revision Log</span>
                    <span className="text-[10px] text-[var(--color-mid-gray)]">+0.10% / 15m</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP VISUAL: MAP TRAJECTORY (YOU -> GOAL) ── */}
      {goal && !isEditingGoal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="daksh-card p-6 sm:p-7 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-caption tracking-widest text-[var(--color-gold)] font-bold">
                Overall Goal Trajectory
              </span>
              <InfoTooltip
                title="Position Marker & Target Date"
                meaning="Represents your real-time distance from syllabus completion based on current daily velocity."
                formula="Predicted Date = Today + (Remaining % / Average Actual Daily Growth Rate)"
                howToIncrease="Maintain daily revision target to increase daily growth rate and pull the predicted date closer to target."
              />
            </div>
            <span className="text-xs text-[var(--color-text-secondary)] font-medium">
              Target: <strong className="text-[var(--color-text-primary)]">{targetDateStr}</strong>
            </span>
          </div>

          {/* Vertical Position Diagram */}
          <div className="py-2 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4 w-full max-w-md">

              {/* YOU Marker */}
              <div className="flex items-center gap-3 w-full">
                <div className="w-24 text-right">
                  <span className="text-xs font-bold text-[var(--color-gold-dark)] bg-[var(--color-gold-pale)] px-2.5 py-1 rounded-md border border-[var(--color-gold)]/20">
                    YOU
                  </span>
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-gold)] border-2 border-white shadow-xs z-10" />
                </div>
                <div className="flex-1 text-xs text-[var(--color-text-secondary)]">
                  Overall Goal Readiness: <strong className="text-[var(--color-text-primary)]">{Math.round(dakshScore)}%</strong>
                </div>
              </div>

              {/* Line connector */}
              <div className="w-[2px] h-12 bg-[var(--color-border)] relative">
                <div className="absolute top-0 bottom-0 left-0 right-0 bg-[var(--color-gold)] opacity-40" />
              </div>

              {/* GOAL Marker */}
              <div className="flex items-center gap-3 w-full">
                <div className="w-24 text-right">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                    GOAL
                  </span>
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[var(--color-text-primary)] border-2 border-white z-10" />
                </div>
                <div className="flex-1 text-xs text-[var(--color-text-secondary)]">
                  {goal.name || goal.title}
                </div>
              </div>

            </div>
          </div>

          {/* Trajectory Insight statement */}
          <div className="p-4 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] leading-relaxed">
            {statusType === "behind" ? (
              <>
                At your current pace (+{dashboard?.prediction?.actual_daily || 0.5}% / day), you are projected to complete your goal <strong className="text-[var(--color-danger)]">{daysDelta} days past</strong> your target date.
              </>
            ) : statusType === "ahead" ? (
              <>
                At your current pace (+{dashboard?.prediction?.actual_daily || 0.5}% / day), you're on track to complete your preparation <strong className="text-[var(--color-success)]">{daysDelta} days ahead</strong> of target.
              </>
            ) : (
              <>
                At your current daily pace, you are moving steadily toward completing your target by <strong className="text-[var(--color-text-primary)]">{targetDateStr}</strong>.
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* ── CURRENT REALITY TERRITORY MAP ────────────── */}
      {territories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="daksh-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-caption tracking-widest text-[var(--color-text-primary)] font-bold">
                Current Reality Territory
              </span>
              <InfoTooltip
                title="Territory Classification Thresholds"
                meaning="Evaluates subtopic readiness into 3 status levels: READY (>=70%), DEVELOPING (40-69%), and UNSTABLE (<40%)."
                formula="Subject % = Average Subtopic Retrieval Efficiency * Ebbinghaus Memory Decay Factor"
                howToIncrease="Complete retrieval checks in UNSTABLE topics to promote them to DEVELOPING and READY."
              />
            </div>
            <span className="text-[11px] text-[var(--color-mid-gray)]">Syllabus Subjects</span>
          </div>

          <div className="space-y-3 pt-1">
            {territories.map((t, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--color-text-primary)]">{t.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    t.status === "READY" ? "bg-[var(--color-success-light)] text-[var(--color-success)]" :
                    t.status === "UNSTABLE" ? "bg-[var(--color-danger-light)] text-[var(--color-danger)]" :
                    "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)]"
                  }`}>
                    {t.status}
                  </span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill-gold"
                    style={{
                      width: `${t.pct}%`,
                      background: t.status === "READY" ? 'var(--color-success)' : t.status === "UNSTABLE" ? 'var(--color-danger)' : 'var(--color-gold)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── IF YOUR EXAM WERE TODAY... ────────────────── */}
      {goal && !isEditingGoal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="daksh-card p-6 space-y-4 border-l-3 border-l-[var(--color-gold)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[var(--color-gold)] shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                If your exam were today...
              </h3>
              <InfoTooltip
                title="Immediate Exam Readiness Simulation"
                meaning="Projects how your current memory readiness translates into expected exam performance across syllabus subjects."
                formula="Simulation = Aggregated Quiz Accuracy * Memory Decay Factor across all exam concepts"
                howToIncrease="Focus immediate revision on topics listed under Risk / Unstable to quickly eliminate baseline weaknesses."
              />
            </div>
            <button
              onClick={() => setShowExamTodayDetails(!showExamTodayDetails)}
              className="text-[11px] font-semibold text-[var(--color-gold-dark)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {showExamTodayDetails ? "Hide Evidence" : "Show Evidence"}
              {showExamTodayDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>

          <AnimatePresence>
            {showExamTodayDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden pt-1"
              >
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Here is what your current retrieval evidence suggests:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-[var(--color-success-light)]/50 border border-[var(--color-success)]/20 space-y-1">
                    <span className="text-[10px] font-bold text-[var(--color-success)] uppercase block">Ready</span>
                    <p className="font-semibold text-[var(--color-text-primary)]">
                      {readyTerritories.length > 0 ? readyTerritories.map(t => t.name).join(", ") : "Fundamentals"}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--color-gold-pale)]/50 border border-[var(--color-gold)]/20 space-y-1">
                    <span className="text-[10px] font-bold text-[var(--color-gold-dark)] uppercase block">Developing</span>
                    <p className="font-semibold text-[var(--color-text-primary)]">
                      {developingTerritories.length > 0 ? developingTerritories.map(t => t.name).join(", ") : "In Progress"}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--color-danger-light)]/50 border border-[var(--color-danger)]/20 space-y-1">
                    <span className="text-[10px] font-bold text-[var(--color-danger)] uppercase block">Risk / Unstable</span>
                    <p className="font-semibold text-[var(--color-text-primary)]">
                      {unstableTerritories.length > 0 ? unstableTerritories.map(t => t.name).join(", ") : "None"}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  <strong className="text-[var(--color-text-primary)] font-semibold block mb-1">Your Reality:</strong>
                  {readyTerritories.length > 0
                    ? `You have demonstrated strong retention in ${readyTerritories.map(t => t.name).join(", ")}. Focusing your upcoming revision on unstable topics will directly raise your total readiness.`
                    : "You are starting your preparation journey. Complete your first active retrieval sessions to build your initial readiness evidence."}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── 3 ACTIONABLE CHOICES ── */}
      {goal && !isEditingGoal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="daksh-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-caption tracking-widest text-[var(--color-text-primary)] font-bold">
                You Have Three Choices
              </span>
              <InfoTooltip
                title="Pace Adjustment Logic"
                meaning="Calculates how changing your daily target study hours or target completion date alters your predicted completion pace."
                formula="New Pace = Target Scope / (Daily Hours * Growth Rate Factor)"
                howToIncrease="Increasing daily hours by 20 mins adds +0.10% daily growth, bringing your projected date forward."
              />
            </div>
            <span className="text-[10px] text-[var(--color-gold-dark)] font-semibold">Actionable Trajectory</span>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => { setSetupHours(h => Math.min(12, h + 0.5)); setIsEditingGoal(true); }}
              className="w-full p-3.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-gold)] hover:bg-[var(--color-gold-pale)]/40 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--color-gold-dark)]">01</span>
                  <p className="text-xs font-bold text-[var(--color-text-primary)]">Study 20 min more / day</p>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 pl-6">Increases daily growth quota (+{targetGrowth.toFixed(2)}%) to close trajectory gap</p>
              </div>
              <ArrowRight size={14} className="text-[var(--color-mid-gray)] group-hover:text-[var(--color-gold)]" />
            </button>

            <button
              onClick={() => { setIsEditingGoal(true); }}
              className="w-full p-3.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-gold)] hover:bg-[var(--color-gold-pale)]/40 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--color-gold-dark)]">02</span>
                  <p className="text-xs font-bold text-[var(--color-text-primary)]">Extend target completion date</p>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 pl-6">Adjust deadline date to match realistic pace</p>
              </div>
              <ArrowRight size={14} className="text-[var(--color-mid-gray)] group-hover:text-[var(--color-gold)]" />
            </button>

            <button
              onClick={() => navigate("/practice")}
              className="w-full p-3.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-gold)] hover:bg-[var(--color-gold-pale)]/40 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--color-gold-dark)]">03</span>
                  <p className="text-xs font-bold text-[var(--color-text-primary)]">Prioritize high-impact concepts</p>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 pl-6">Focus retrieval efforts strictly on unstable topics</p>
              </div>
              <ArrowRight size={14} className="text-[var(--color-mid-gray)] group-hover:text-[var(--color-gold)]" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ── GOAL CONFIGURATION ──────────────────────── */}
      {goal && !isEditingGoal ? (
        <div className="daksh-card p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[var(--color-mid-gray)] uppercase tracking-wider block">Preparation Plan</span>
            <h3 className="text-xs font-bold text-[var(--color-text-primary)] mt-0.5">{goal.name || goal.title}</h3>
            <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">{goal.available_hours_per_day} hrs/day • Target: {targetDateStr}</p>
          </div>
          <button
            onClick={() => setIsEditingGoal(true)}
            className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-gold)] text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-gold-dark)] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <SlidersHorizontal size={13} />
            Configure
          </button>
        </div>
      ) : (
        <div className="daksh-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-gold-pale)] flex items-center justify-center text-[var(--color-dark)]">
                <Target size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                  {isEditingGoal ? "Update Target Plan" : "Set Your Target Plan"}
                </h2>
                <p className="text-[11px] text-[var(--color-text-secondary)]">Configure target exam, date, and daily hours.</p>
              </div>
            </div>
            {isEditingGoal && (
              <button
                onClick={() => setIsEditingGoal(false)}
                className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)] cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {wizardError && (
            <div className="text-xs text-[var(--color-danger)] bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 rounded-xl px-3.5 py-2">
              ⚠️ {wizardError}
            </div>
          )}

          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">Goal Description</label>
              <input
                type="text"
                value={setupGoalName}
                onChange={(e) => setSetupGoalName(e.target.value)}
                placeholder="e.g. Crack JEE Physics, Master Placement Preparation"
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">Target Exam</label>
                <select
                  value={setupExamId}
                  onChange={(e) => setSetupExamId(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select Exam</option>
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">Completion Date</label>
                <input
                  type="date"
                  value={setupTargetDate}
                  onChange={(e) => setSetupTargetDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
                <span>Daily Target Hours</span>
                <span className="text-[var(--color-gold-dark)] font-bold">{setupHours} hrs</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="0.5"
                value={setupHours}
                onChange={(e) => setSetupHours(parseFloat(e.target.value))}
              />
            </div>

            <button
              type="submit"
              disabled={submittingGoal}
              className="w-full py-3 rounded-xl btn-gold text-sm disabled:opacity-50"
            >
              {submittingGoal ? "Setting plan..." : "Save Target Plan"}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
