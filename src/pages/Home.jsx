// src/pages/Home.jsx
// Home = The Studio — "I know what to do."
// 100% strict real data from backend API with info tooltips & multiple continuous concepts support.

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import progressApi from "../api/progressApi";
import syllabusApi from "../api/syllabusApi";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import InfoTooltip from "../components/ui/InfoTooltip";
import LandingPage from "../components/home/LandingPage";
import ServerStatusChecker from "../components/home/ServerStatusChecker";
import OnboardingGate from "../components/onboarding/OnboardingGate";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Globe, MapPin, Layers, Target } from "lucide-react";

import { useSessionEngine } from "../hooks/useSessionEngine";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { activeSession } = useSessionEngine();
  const [dashboard, setDashboard] = useState(null);
  const [exams, setExams] = useState([]);
  const [syllabusTree, setSyllabusTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isServerReady, setIsServerReady] = useState(false);
  const [selectedConceptIdx, setSelectedConceptIdx] = useState(0);

  useEffect(() => {
    if (!user || !isServerReady) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashData, treeData] = await Promise.all([
          progressApi.getDashboard(),
          syllabusApi.getTree().catch(() => null),
        ]);
        setDashboard(dashData);
        setSyllabusTree(treeData);
        setExams(treeData?.exams || []);
      } catch (err) {
        console.error("Home data fetch failed:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isServerReady]);

  if (!user) return <LandingPage />;
  if (!isServerReady) return <ServerStatusChecker onReady={() => setIsServerReady(true)} />;

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 space-y-6 text-center">
        <SkeletonLoader lines={2} />
        <SkeletonLoader lines={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-[var(--color-text-secondary)] mb-4">Something went wrong connecting to your study room.</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-gold px-6 py-2.5 rounded-xl text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  const activeGoal = dashboard?.goal;
  const recentActivity = dashboard?.recent_activity;
  const lastActive = dashboard?.last_active_concept;
  const recentConcepts = dashboard?.recent_concepts || [];
  const decayAlerts = dashboard?.decay_alerts || [];

  // Daily target telemetry
  const todayGrowth = dashboard?.today_growth ?? dashboard?.target?.completed_growth ?? 0;
  const targetGrowth = dashboard?.target_growth ?? dashboard?.target?.target_growth ?? 1.0;

  // Assemble ALL active continuous concepts
  const continuousConceptsMap = new Map();

  if (activeSession) {
    continuousConceptsMap.set(activeSession.conceptId, {
      id: activeSession.conceptId,
      name: activeSession.conceptTitle,
      status: "ACTIVE SESSION",
      prev_concept: recentActivity?.prev_concept || "Prerequisite Review",
      next_concept: recentActivity?.next_concept || "Advanced Application",
    });
  }

  if (lastActive) {
    continuousConceptsMap.set(lastActive.id, {
      id: lastActive.id,
      name: lastActive.name,
      status: "IN PROGRESS",
      subtopic_name: lastActive.subtopic_name,
      mastery: lastActive.mastery,
    });
  }

  recentConcepts.forEach((c) => {
    if (c && c.id && !continuousConceptsMap.has(c.id)) {
      continuousConceptsMap.set(c.id, {
        id: c.id,
        name: c.name,
        status: "RECENT",
        subtopic_name: c.subtopic_name,
        mastery: c.mastery,
      });
    }
  });

  decayAlerts.forEach((da) => {
    if (da && da.concept_id && !continuousConceptsMap.has(da.concept_id)) {
      continuousConceptsMap.set(da.concept_id, {
        id: da.concept_id,
        name: da.concept_name || da.concept,
        status: "NEEDS REVISION",
        subtopic_name: da.subtopic_name,
      });
    }
  });

  if (continuousConceptsMap.size === 0) {
    let fallback = null;
    if (syllabusTree?.exams?.[0]?.subjects?.[0]?.topics?.[0]?.subtopics?.[0]?.concepts?.[0]) {
      fallback = syllabusTree.exams[0].subjects[0].topics[0].subtopics[0].concepts[0];
    } else if (syllabusTree?.subjects?.[0]?.topics?.[0]?.subtopics?.[0]) {
      fallback = { id: syllabusTree.subjects[0].topics[0].subtopics[0].id, name: syllabusTree.subjects[0].topics[0].subtopics[0].name };
    }
    if (fallback) {
      continuousConceptsMap.set(fallback.id, {
        id: fallback.id,
        name: fallback.name,
        status: "START PATHWAY",
      });
    }
  }

  const continuousConceptsList = Array.from(continuousConceptsMap.values());
  const activeConceptItem = continuousConceptsList[selectedConceptIdx] || continuousConceptsList[0];

  let ctaLabel = "Continue Journey";
  let ctaAction = () => navigate(activeConceptItem?.id ? `/learn/${activeConceptItem.id}` : "/learn");

  if (!activeGoal) {
    ctaLabel = "Set Target Goal";
    ctaAction = () => navigate("/map");
  } else if (!activeConceptItem) {
    ctaLabel = "Explore Learning Space";
    ctaAction = () => navigate("/learn");
  }

  // Greeting
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const userName = user?.first_name || user?.username || "Learner";

  return (
    <OnboardingGate
      dashboard={dashboard}
      exams={exams}
      onComplete={() => {
        setLoading(true);
        progressApi.getDashboard().then(setDashboard).finally(() => setLoading(false));
      }}
    >
      <div className="max-w-xl mx-auto px-5 py-10 space-y-8 select-none">

        {/* ── 1. GREETING & CALM STATEMENT ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
              {timeGreeting}, {userName}.
            </h1>
            {activeGoal && (
              <span className="text-[10px] font-bold text-[var(--color-gold-dark)] bg-[var(--color-gold-pale)] px-2.5 py-1 rounded-full border border-[var(--color-gold)]/20 flex items-center gap-1">
                <Target size={11} />
                +{todayGrowth.toFixed(2)}% / +{targetGrowth.toFixed(2)}% Target
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal">
            You don't need to figure everything out today. Let's take the next step.
          </p>
        </motion.div>

        {/* ── 2. MULTIPLE CONTINUOUS CONCEPTS SELECTOR ────────── */}
        {continuousConceptsList.length > 1 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-caption tracking-widest text-[var(--color-text-primary)] font-bold flex items-center gap-1.5">
                <Layers size={13} className="text-[var(--color-gold)]" />
                Active Continuous Pathways ({continuousConceptsList.length})
              </span>
              <InfoTooltip
                title="Multiple Continuous Concepts"
                meaning="DakshAI allows you to study multiple concepts concurrently across different subjects without forcing a rigid linear sequence."
                formula="Active Pathways = Ongoing Sessions + Recent In-Progress Topics + Decay Alerts"
                howToIncrease="Switch between pathways freely. Your memory engine tracks retention independently for each concept."
              />
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {continuousConceptsList.map((cItem, i) => (
                <button
                  key={cItem.id}
                  onClick={() => setSelectedConceptIdx(i)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                    selectedConceptIdx === i
                      ? "bg-[var(--color-gold-pale)] border-[var(--color-gold)] text-[var(--color-gold-dark)] shadow-xs font-bold"
                      : "bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {cItem.name}
                  {cItem.status === "ACTIVE SESSION" && " ⚡"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. TODAY CARD (Selected Continuous Concept) ─────────── */}
        <motion.div
          key={activeConceptItem?.id || selectedConceptIdx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="daksh-card p-6 sm:p-7 space-y-6 relative border-t-2 border-t-[var(--color-gold)]"
        >
          {/* Section label */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-caption tracking-widest text-[var(--color-gold)] font-bold">
                Today
              </span>
              <InfoTooltip
                title="Daily Pathway Logic"
                meaning="Presents your current active concept or highest-priority retrieval step for today."
                formula="Priority = Active Session > Decay Slippage > Recent Unfinished Topic"
                howToIncrease="Complete your active retrieval session to advance mastery from Understanding to Applying."
              />
            </div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">
              {activeConceptItem?.name || "Your Learning Pathway"}
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] font-normal">
              {activeConceptItem?.status === "ACTIVE SESSION"
                ? "You have an active session in progress. Pick up right where you paused."
                : activeConceptItem?.status === "NEEDS REVISION"
                ? "Memory recall stability slipping. A short 5-minute retrieval check is recommended today."
                : activeGoal
                ? `Target exam: ${activeGoal.name || activeGoal.title || 'Selected Syllabus'}`
                : "Configure your target exam to initialize your exact daily trajectory."}
            </p>
          </div>

          {/* Primary CTA Button */}
          <button
            onClick={ctaAction}
            className="w-full py-3.5 rounded-xl btn-gold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>{ctaLabel}</span>
            <ArrowRight size={16} />
          </button>

          {/* Continuity Pathway: Yesterday → Today → Tomorrow */}
          {activeConceptItem && (
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-[var(--color-border)] text-left">
              <div className="space-y-1">
                <span className="text-[10px] text-[var(--color-mid-gray)] font-semibold uppercase block">Yesterday</span>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] truncate flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-[var(--color-success)] shrink-0" />
                  {activeConceptItem.prev_concept || "Prerequisites"}
                </p>
              </div>
              <div className="space-y-1 border-x border-[var(--color-border)] px-3">
                <span className="text-[10px] text-[var(--color-gold-dark)] font-bold uppercase block">Today</span>
                <p className="text-xs font-bold text-[var(--color-text-primary)] truncate">{activeConceptItem.name}</p>
              </div>
              <div className="space-y-1 pl-1">
                <span className="text-[10px] text-[var(--color-mid-gray)] font-semibold uppercase block">Tomorrow</span>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] truncate">{activeConceptItem.next_concept || "Next Chapter"}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── 4. WHY THIS MATTERS ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="daksh-card p-5 space-y-2 border-l-2 border-l-[var(--color-gold)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-[var(--color-gold)] shrink-0" />
              <span className="text-caption tracking-wider text-[var(--color-text-primary)]">Why This Matters</span>
            </div>
            <InfoTooltip
              title="Real-World Relevance"
              meaning="Connects textbook formulas directly to real engineering, physics, and computational systems."
              formula="Relevance = Concept Domain -> Industry Applications (EV Powertrains, Robotics, Algorithms)"
              howToIncrease="Understanding real-world applications enhances long-term memory retrieval."
            />
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            {activeGoal
              ? `Mastering ${activeConceptItem?.name || 'this concept'} builds real problem-solving competence for ${activeGoal.name || activeGoal.title}.`
              : "Connecting textbook principles to real engineering, physics, and computational systems."}
          </p>
        </motion.div>

        {/* ── 5. MAP ANCHOR ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-center pt-2"
        >
          <button
            onClick={() => navigate("/map")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-gold-dark)] transition-colors cursor-pointer"
          >
            <MapPin size={13} className="text-[var(--color-gold)]" />
            See where I stand on my map →
          </button>
        </motion.div>

      </div>
    </OnboardingGate>
  );
}
