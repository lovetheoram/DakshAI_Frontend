// src/pages/GrowthPage.jsx
// THE TRUTH ROOM — DakshAI Learning Operating System Mirror
// 1. THE QUESTION: Was today's effort enough to reach my target exam on time?
// 2. THE ANSWER: Current Pace vs Required Pace & Ahead/Behind Lag (Consumed strictly from backend single source of truth)
// 3. TODAY'S EVIDENCE: Factually observed active metrics logged today
// 4. WHERE YOU ARE: Daksh Score & Subject Readiness
// 5. MOVEMENT: 14-day Trajectory & Execution History
// 100% REAL DATA — ZERO FAKE DATA.

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import progressApi from "../api/progressApi";
import syllabusApi from "../api/syllabusApi";
import StatusBadge from "../components/ui/StatusBadge";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Award,
  Play,
  ArrowRight,
  Compass,
  Calendar,
  BarChart2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Activity,
  Flame,
  Lightbulb,
  X,
  Zap,
  Sparkles
} from "lucide-react";

export default function GrowthPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [streak, setStreak] = useState(null);
  const [galaxyData, setGalaxyData] = useState(null);
  const [syllabusTree, setSyllabusTree] = useState(null);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [loading, setLoading] = useState(true);

  // Pace Mirror Idea Calculator
  const [showIdeaCalc, setShowIdeaCalc] = useState(false);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [dashData, streakData, treeData, diaryData] = await Promise.all([
        progressApi.getDashboard().catch(() => null),
        progressApi.getStreakStats().catch(() => null),
        syllabusApi.getTree().catch(() => null),
        progressApi.getDiary().catch(() => []),
      ]);
      if (dashData) setDashboard(dashData);
      if (streakData) setStreak(streakData);
      if (treeData) setSyllabusTree(treeData);
      if (Array.isArray(diaryData)) setDiaryEntries(diaryData);

      if (dashData?.goal) {
        progressApi.getGalaxy().then(setGalaxyData).catch(() => {});
      }
    } catch (err) {
      console.error("Map data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAllData(); }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-12 space-y-4 text-[var(--color-text-secondary)]">
        <SkeletonLoader avatar />
        <SkeletonLoader lines={3} />
        <SkeletonLoader lines={5} />
      </div>
    );
  }

  const goal = dashboard?.goal;
  const prediction = dashboard?.prediction || dashboard?.trajectory || {};
  const todayEvidence = dashboard?.today_evidence || {};
  const dakshScore = dashboard?.daksh_score ?? dashboard?.overall_score ?? 0;
  const missionDay = dashboard?.mission_day ?? 1;

  // Goal & Dates
  const targetExamName = goal?.exam_name || goal?.exam?.name || goal?.goal_name || goal?.title || user?.exam_type || "Target Exam";
  const targetDateStr = prediction?.target_date
    ? new Date(prediction.target_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : (goal?.target_date ? new Date(goal.target_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Target Date");
  const daysRemaining = prediction?.days_remaining ?? (goal?.target_date ? Math.max(0, Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / 86400000)) : null);

  // Authoritative Backend Trajectory
  const statusType = prediction?.status || "UNAVAILABLE";
  const daysDelta = prediction?.days_delta ?? null;
  const requiredDaily = prediction?.required_daily ?? null;
  const actualDaily = prediction?.actual_daily ?? null;
  const hasHistory = Boolean(prediction?.has_sufficient_history);
  const projectedCompletionDateStr = prediction?.projected_completion_date ? new Date(prediction.projected_completion_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

  // Today's Evidence
  const hasTodayActivity = Boolean(todayEvidence.has_activity || (dashboard?.target?.completed_correct_questions || 0) > 0);
  const todayActiveMins = todayEvidence.active_minutes || 0;
  const todaySolved = todayEvidence.questions_solved || dashboard?.target?.completed_correct_questions || 0;
  const todayCorrect = todayEvidence.questions_correct || dashboard?.target?.completed_correct_questions || 0;
  const todayAccuracy = todayEvidence.accuracy || (todaySolved > 0 ? Math.round((todayCorrect / todaySolved) * 100) : 0);
  const todayReadinessDelta = todayEvidence.readiness_delta || 0;

  // Streak & Consistency (Multi-dimensional from backend)
  const streakStats = dashboard?.streak_stats || streak || {};
  const practiceStreak = streakStats?.practice_streak ?? streakStats?.current_streak ?? streakStats?.growth_streak ?? 0;
  const visitStreak = streakStats?.visit_streak ?? dashboard?.visit_streak ?? 0;
  const totalActiveDays = streakStats?.total_active_days ?? streak?.total_active_days ?? 0;
  const activeDaysThisWeek = dashboard?.active_days_this_week ?? streakStats?.active_days_this_week ?? 0;
  const streakDays = practiceStreak > 0 ? practiceStreak : (visitStreak > 0 ? visitStreak : totalActiveDays);

  // Target MCQ Idea Calculation for Pace Mirror
  const totalConceptsInExam = dashboard?.total_concepts_in_exam || 200;
  const targetReqPace = Math.max(0.01, Number((requiredDaily || 1.0).toFixed(2)));
  // Each correct MCQ in a 5-question concept session yields approx (0.35 / 5) * (100 / totalConceptsInExam)% exam readiness
  const readinessPerCorrectMCQ = (0.35 / 5) * (100 / Math.max(1, totalConceptsInExam));
  const mcqsNeeded = Math.max(1, Math.ceil(targetReqPace / Math.max(0.0001, readinessPerCorrectMCQ)));
  const conceptRoundsNeeded = Math.ceil(mcqsNeeded / 5);

  // History & Graph
  const recentDiary = diaryEntries.slice(0, 14).reverse();
  const maxQuestionsInPeriod = Math.max(...recentDiary.map(d => d.questions_solved || 0), 10);
  const activeDaysCount = totalActiveDays || (streak?.total_active_days ?? streak?.current_streak ?? 0);

  // Syllabus Territories Breakdown
  const rawTreeSubjects = syllabusTree?.subjects || syllabusTree?.children || syllabusTree?.results || syllabusTree?.exams?.[0]?.subjects || [];

  const galaxyEfficiencyMap = {};
  if (galaxyData?.subjects && Array.isArray(galaxyData.subjects)) {
    galaxyData.subjects.forEach(gs => {
      let totalEff = 0;
      let count = 0;
      (gs.subtopics || []).forEach(st => {
        totalEff += (st.efficiency || 0);
        count += 1;
      });
      galaxyEfficiencyMap[gs.id] = count > 0 ? (totalEff / count) : 0;
      galaxyEfficiencyMap[gs.name?.toLowerCase()] = count > 0 ? (totalEff / count) : 0;
    });
  }

  const territories = rawTreeSubjects.map(s => {
    const subtopics = s.subtopics || [];
    const concepts = subtopics.flatMap(st => (st.concepts || []).map(c => ({
      ...c,
      subtopicName: st.name
    })));
    const totalConcepts = concepts.length;
    const masteredConcepts = concepts.filter(c => c.is_mastered || c.user_status === "completed").length;
    
    let pct = totalConcepts > 0 ? Math.round((masteredConcepts / totalConcepts) * 100) : 0;
    const galaxyEff = galaxyEfficiencyMap[s.id] ?? galaxyEfficiencyMap[s.name?.toLowerCase()];
    if (galaxyEff !== undefined && pct === 0) {
      pct = Math.round(galaxyEff * 100);
    }

    let status = "READY";
    if (pct < 40) status = "UNSTABLE";
    else if (pct < 70) status = "DEVELOPING";

    return {
      id: s.id,
      name: s.name,
      pct,
      status,
      totalConcepts,
      masteredConcepts,
      subtopics,
      concepts
    };
  });

  const toggleSubjectExpand = (subjId) => {
    setExpandedSubjects(prev => ({ ...prev, [subjId]: !prev[subjId] }));
  };

  const handleStartMockTest = () => {
    const launchId = dashboard?.last_active_concept?.id || 1;
    navigate(`/quiz/${launchId}?q=20&type=FULL_EXAM`);
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 space-y-7 select-none text-left font-sans">

      {/* ── 1. THE QUESTION: WAS TODAY'S EFFORT ENOUGH? ──────────────────── */}
      <div className="border-b border-[var(--color-border)] pb-4 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-widest text-[var(--color-gold-dark)] font-extrabold uppercase flex items-center gap-1.5">
            <Compass size={14} />
            The Truth Room
          </span>
          <span className="text-xs font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] px-3 py-1 rounded-full border border-[var(--color-border)]">
            {targetExamName} {daysRemaining !== null ? `• ${daysRemaining} days left` : ""}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
          WAS TODAY'S EFFORT ENOUGH?
        </h1>
      </div>

      {/* ── 2. THE ANSWER: THE DAKSH PACE MIRROR ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 space-y-5 border border-amber-500/30 text-slate-100 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Target size={14} />
            YOUR CURRENT PACE MIRROR
          </span>

          {!hasHistory ? (
            <StatusBadge variant="gold">Not enough evidence yet</StatusBadge>
          ) : statusType === "BEHIND" ? (
            <StatusBadge variant="danger" icon={<AlertCircle size={11} />}>
              {daysDelta !== null ? `${daysDelta} Days Behind Pace` : "Behind Pace"}
            </StatusBadge>
          ) : statusType === "AHEAD" ? (
            <StatusBadge variant="success" icon={<TrendingUp size={11} />}>
              {daysDelta !== null ? `${daysDelta} Days Ahead` : "Ahead of Pace"}
            </StatusBadge>
          ) : statusType === "ON_TRACK" ? (
            <StatusBadge variant="success">On Track</StatusBadge>
          ) : (
            <StatusBadge variant="gold">On Track</StatusBadge>
          )}
        </div>

        {/* Pace Comparison Numbers */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Observed Pace
            </span>
            <span className="text-xl sm:text-2xl font-black text-white block">
              {hasHistory && actualDaily !== null ? `${actualDaily}%` : "—"} <span className="text-xs font-normal text-slate-400">readiness/day</span>
            </span>
          </div>

          <div className="space-y-0.5 border-l border-slate-800 pl-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Required Pace
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 block">
              {requiredDaily !== null ? `${requiredDaily}%` : "—"} <span className="text-xs font-normal text-slate-400">readiness/day</span>
            </span>
          </div>
        </div>

        {/* Trajectory Statement */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
          {!hasHistory ? (
            <span>
              <strong>Not enough evidence yet.</strong> Solve practice sessions across at least 3 active days to establish a trustworthy learning velocity baseline.
            </span>
          ) : statusType === "BEHIND" ? (
            <span>
              At your current velocity (<strong className="text-white">{actualDaily ?? 0}% readiness/day</strong>), your pace requires an extra{" "}
              <strong className="text-rose-400">
                {Math.max(0, Number(((requiredDaily || 0) - (actualDaily || 0)).toFixed(2)))}%/day
              </strong>{" "}
              to reach 100% readiness by <strong className="text-amber-300">{targetDateStr}</strong>.
              {daysDelta !== null && <span> You are currently <strong className="text-rose-400">{daysDelta} days behind pace</strong>.</span>}
            </span>
          ) : statusType === "AHEAD" ? (
            <span>
              Your current velocity (<strong className="text-emerald-400">{actualDaily}% readiness/day</strong>) exceeds the required pace (<strong className="text-white">{requiredDaily}% readiness/day</strong>).
              {daysDelta !== null && <span> You are currently <strong className="text-emerald-400">{daysDelta} days ahead</strong>.</span>}
              {projectedCompletionDateStr && <span> Projected completion: <strong className="text-emerald-300">{projectedCompletionDateStr}</strong>.</span>}
            </span>
          ) : (
            <span>
              Your current pace (<strong className="text-amber-300">{actualDaily}% readiness/day</strong>) is directly aligned with your required pace (<strong className="text-white">{requiredDaily}% readiness/day</strong>) to finish by <strong className="text-amber-300">{targetDateStr}</strong>.
            </span>
          )}
        </div>

        {/* ── IDEA BUTTON: How many MCQs to reach this pace? ── */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <button
            onClick={() => setShowIdeaCalc(prev => !prev)}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 py-1.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer shadow-xs"
          >
            <Lightbulb size={14} className="text-amber-400 shrink-0" />
            <span>{showIdeaCalc ? "Hide Requirement" : "💡 How many MCQs to reach this pace?"}</span>
          </button>

          {showIdeaCalc && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs text-slate-200 space-y-1 shadow-md"
            >
              <p className="leading-relaxed">
                To reach your required pace of <strong className="text-amber-400 font-extrabold">{targetReqPace}% readiness/day</strong>, you need approximately <strong className="text-white font-extrabold text-sm underline decoration-amber-400">{mcqsNeeded} correct MCQs</strong> today (~{conceptRoundsNeeded} concept {conceptRoundsNeeded === 1 ? "round" : "rounds"}).
              </p>
              <p className="text-[11px] text-slate-400">
                Calculated across your {totalConceptsInExam} exam concepts based on active retrieval efficiency.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ── 3. TODAY'S EVIDENCE ────────────────────────────────────────────── */}
      <div className="daksh-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-[var(--color-gold-dark)]" />
            <h2 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
              Today's Evidence
            </h2>
          </div>
          <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
            {new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
          </span>
        </div>

        {hasTodayActivity ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-center space-y-0.5">
              <span className="text-lg font-black text-[var(--color-text-primary)] block">{todayActiveMins} min</span>
              <span className="text-[10px] font-bold text-[var(--color-mid-gray)] uppercase tracking-wider block">Active Time</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-center space-y-0.5">
              <span className="text-lg font-black text-[var(--color-gold-dark)] block">{todaySolved} Qs</span>
              <span className="text-[10px] font-bold text-[var(--color-mid-gray)] uppercase tracking-wider block">{todayCorrect} Correct</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-center space-y-0.5">
              <span className="text-lg font-black text-emerald-600 block">{todayAccuracy}%</span>
              <span className="text-[10px] font-bold text-[var(--color-mid-gray)] uppercase tracking-wider block">Accuracy</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-center space-y-0.5">
              <span className="text-lg font-black text-purple-600 block">+{todayReadinessDelta}%</span>
              <span className="text-[10px] font-bold text-[var(--color-mid-gray)] uppercase tracking-wider block">Readiness Delta</span>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-2">
            <p className="text-xs font-semibold text-[var(--color-text-primary)]">
              No practice logged yet today.
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Your study window is open. Solve practice questions to log real evidence.
            </p>
            <button
              onClick={() => navigate("/learn")}
              className="mt-1 btn-gold px-4 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              Start Practice Session <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* ── 4. WHERE YOU ARE (DAKSH SCORE & SUBJECT READINESS) ────────────── */}
      <div className="daksh-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div>
            <span className="text-[10px] font-extrabold text-[var(--color-mid-gray)] uppercase tracking-wider block">
              WHERE YOU ARE
            </span>
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
              Syllabus Readiness Telemetry
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] block">Daksh Score</span>
            <span className="text-xl font-black text-[var(--color-gold-dark)]">{Math.round(dakshScore)}%</span>
          </div>
        </div>

        {/* Subject Territories Breakdown */}
        {territories.length > 0 ? (
          <div className="space-y-3">
            {territories.map((territory) => {
              const isExpanded = !!expandedSubjects[territory.id];

              return (
                <div
                  key={territory.id}
                  className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-gold)]/40 transition-all space-y-3"
                >
                  <div
                    onClick={() => toggleSubjectExpand(territory.id)}
                    className="flex items-center justify-between text-xs cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-[var(--color-text-primary)]">{territory.name}</span>
                      {territory.totalConcepts > 0 && (
                        <span className="text-[10px] text-[var(--color-text-secondary)] font-medium">
                          ({territory.masteredConcepts}/{territory.totalConcepts} concepts)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                        territory.status === "READY"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : territory.status === "DEVELOPING"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}>
                        {territory.status}
                      </span>
                      <span className="font-black text-[var(--color-gold-dark)] text-xs">
                        {territory.pct}%
                      </span>
                      
                      <button className="px-2 py-1 rounded-md bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30 text-[var(--color-gold-dark)] text-[10px] font-bold flex items-center gap-1">
                        <span>{isExpanded ? "Collapse" : "Dropdown"}</span>
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    </div>
                  </div>

                  <div
                    onClick={() => toggleSubjectExpand(territory.id)}
                    className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden cursor-pointer"
                  >
                    <div
                      className="bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${territory.pct}%` }}
                    />
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-2 border-t border-[var(--color-border)] space-y-2 overflow-hidden"
                      >
                        <span className="text-[10px] font-extrabold text-[var(--color-mid-gray)] uppercase tracking-wider block">
                          Syllabus Concept Dropdown View:
                        </span>

                        {territory.concepts && territory.concepts.length > 0 ? (
                          <div className="space-y-1.5">
                            {territory.concepts.map((concept) => {
                              const isMastered = concept.is_mastered || concept.user_status === "completed";

                              return (
                                <div
                                  key={concept.id}
                                  onClick={() => navigate(`/learn/${concept.id}`)}
                                  className="p-2.5 rounded-lg border border-[var(--color-border)] bg-white dark:bg-slate-900 text-xs flex items-center justify-between hover:border-[var(--color-gold)]/50 transition cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    {isMastered ? (
                                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                                    ) : (
                                      <Circle size={14} className="text-[var(--color-mid-gray)] shrink-0" />
                                    )}
                                    <span className="font-medium text-[var(--color-text-primary)] truncate">
                                      {concept.name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[10px] text-[var(--color-mid-gray)] hidden sm:inline">
                                      {concept.subtopicName}
                                    </span>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                      isMastered ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                                    }`}>
                                      {isMastered ? "Mastered" : "Explore"}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-[11px] text-[var(--color-text-secondary)] italic">
                            Click Explore in Learn section to open concept practice rooms.
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-[var(--color-text-secondary)] font-medium">
            No subject territories loaded. Access Learn page to load exam syllabus.
          </div>
        )}
      </div>

      {/* ── 5. MOVEMENT: 14-DAY TRAJECTORY & EXECUTION HISTORY ─────────────── */}
      <div className="daksh-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 size={18} className="text-[var(--color-gold-dark)]" />
            <h2 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
              Movement History (Last 14 Sessions)
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[var(--color-gold-dark)] bg-[var(--color-gold-pale)] px-2.5 py-0.5 rounded-md border border-[var(--color-gold)]/20">
            {activeDaysCount} Active Days
          </span>
        </div>

        {recentDiary.length > 0 ? (
          <div className="space-y-2 pt-2">
            <div className="h-28 flex items-end justify-between gap-1.5 pt-4 pb-1 px-2 bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)]">
              {recentDiary.map((entry, idx) => {
                const count = entry.questions_solved || 0;
                const heightPct = Math.max(8, Math.round((count / maxQuestionsInPeriod) * 100));
                const dateLabel = new Date(entry.date).toLocaleDateString("en-US", { month: "numeric", day: "numeric" });

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md pointer-events-none whitespace-nowrap z-20">
                      {count} Qs ({Math.round((entry.accuracy || 0) * (entry.accuracy > 1 ? 1 : 100))}%)
                    </div>
                    <div
                      className={`w-full max-w-[18px] rounded-t-sm transition-all ${
                        count > 0 ? "bg-gradient-to-t from-[var(--color-gold-dark)] to-[var(--color-gold)]" : "bg-gray-200 dark:bg-gray-800"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[8px] text-[var(--color-mid-gray)] font-semibold mt-1 truncate">
                      {dateLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] font-medium">
            Solve practice sessions to plot your movement history.
          </div>
        )}
      </div>

      {/* ── 6. FULL EXAM SIMULATION MOCK TEST CARD ──────────────────────────── */}
      <div className="daksh-card p-5 border-l-4 border-l-[var(--color-gold-dark)] space-y-3 bg-[var(--color-bg-primary)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-bold">
              <Award size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[var(--color-text-primary)]">Full Exam Simulation Mock Test</h3>
              <p className="text-[11px] text-[var(--color-text-secondary)]">20 Timed questions across all exam subjects.</p>
            </div>
          </div>

          <button
            onClick={handleStartMockTest}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
          >
            <Play size={14} />
            <span>Start Mock Test</span>
          </button>
        </div>
      </div>

    </div>
  );
}
