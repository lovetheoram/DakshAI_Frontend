import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import progressApi from "../../api/progressApi";
import syllabusApi from "../../api/syllabusApi";
import GlassCard from "../ui/GlassCard";
import ProgressRing from "../ui/ProgressRing";
import SkeletonLoader from "../ui/SkeletonLoader";
import { getMasteryPercent } from "../../pages/LearnPage";
import { BookOpen, Swords, FileText, LineChart, Shield, ChevronDown, ChevronUp, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function ConceptSession({ conceptId }) {
  const navigate = useNavigate();
  const [concept, setConcept] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Formulas lazy loading
  const [formulas, setFormulas] = useState([]);
  const [rules, setRules] = useState([]);
  const [consequences, setConsequences] = useState([]);
  const [loadingFormulas, setLoadingFormulas] = useState(false);
  const [formulasLoaded, setFormulasLoaded] = useState(false);
  const [isFormulasExpanded, setIsFormulasExpanded] = useState(false);
  const [subtopicId, setSubtopicId] = useState(null);

  // History lazy loading
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [openSessionId, setOpenSessionId] = useState(null);

  // Expandable description toggle
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const fetchConceptData = async () => {
    try {
      setLoading(true);
      // Fetch only progress and concept list initially (lazy formulas & history)
      const [progressData, list] = await Promise.all([
        progressApi.getConcept(conceptId),
        syllabusApi.getConceptList(),
      ]);

      const conceptMetaShort = (Array.isArray(list) ? list : list?.concepts || []).find(
        (c) => c.id === Number(conceptId)
      );

      setConcept({
        name: conceptMetaShort?.name || "Concept",
        chapter_name: conceptMetaShort?.subtopic_name || "Chapter",
        exam_readiness: progressData.exam_readiness || 0,
        chapter_understanding: progressData.chapter_understanding || 0,
        mastery: [progressData.exam_readiness || 0, progressData.chapter_understanding || 0],
      });

      if (conceptMetaShort?.subtopic_id) {
        setSubtopicId(conceptMetaShort.subtopic_id);
      }
    } catch (err) {
      console.error("Failed to fetch initial concept progress:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConceptData();
    // Reset load flags when conceptId changes
    setFormulasLoaded(false);
    setFormulas([]);
    setRules([]);
    setConsequences([]);
    setIsFormulasExpanded(false);

    setHistoryLoaded(false);
    setHistory([]);
    setSummary(null);
    setIsHistoryExpanded(false);
    setOpenSessionId(null);
  }, [conceptId]);

  // Load detailed formulas from backend on expand
  const handleToggleFormulas = async () => {
    const nextState = !isFormulasExpanded;
    setIsFormulasExpanded(nextState);

    if (nextState && !formulasLoaded && subtopicId) {
      try {
        setLoadingFormulas(true);
        const subConcepts = await syllabusApi.getSubtopicConcepts(subtopicId);
        const detailedConcept = subConcepts.find((c) => c.id === Number(conceptId));
        
        if (detailedConcept?.ai_meta) {
          const meta = detailedConcept.ai_meta;
          setFormulas(meta.layer_1_hard_formulas || []);
          setRules(meta.layer_2_rule_based_logics || []);
          setConsequences(meta.layer_3_derived_consequences || []);
        }
        
        // Update main description if available
        if (detailedConcept?.description) {
          setConcept((prev) => ({ ...prev, description: detailedConcept.description }));
        }

        setFormulasLoaded(true);
      } catch (err) {
        console.error("Failed to load formulas details:", err);
      } finally {
        setLoadingFormulas(false);
      }
    }
  };

  // Load detailed history attempts from backend on expand
  const handleToggleHistory = async () => {
    const nextState = !isHistoryExpanded;
    setIsHistoryExpanded(nextState);

    if (nextState && !historyLoaded) {
      try {
        setLoadingHistory(true);
        const res = await progressApi.getHistory(conceptId);
        
        setSummary(res.summary || {
          total_attempts: 0,
          best_exam_score: 0,
          best_chapter_score: 0,
          average_exam_score: 0,
          average_chapter_score: 0,
        });

        setHistory(res.records || res.history || []);
        setHistoryLoaded(true);
      } catch (err) {
        console.error("Failed to load history details:", err);
      } finally {
        setLoadingHistory(false);
      }
    }
  };

  if (loading) {
    return <SkeletonLoader lines={5} avatar />;
  }

  if (!concept) {
    return (
      <div className="text-center py-10 text-gray-500">
        Concept not found.
      </div>
    );
  }

  const examMastery = Math.round((concept.exam_readiness || 0) * 100);
  const chapterMastery = Math.round((concept.chapter_understanding || 0) * 100);

  const fullDescription = concept.description || "Launch a quiz challenge to begin testing your understanding.";
  const shouldTruncateDesc = fullDescription.length > 250;
  const truncatedDescription = shouldTruncateDesc ? fullDescription.slice(0, 250) + "..." : fullDescription;

  // Render question answer details for history review
  const renderHistoryAnswers = (answers) => {
    if (!answers || answers.length === 0) return <p className="text-xs text-gray-600">No question details stored for this attempt.</p>;

    return (
      <div className="space-y-4 mt-3 pt-3 border-t border-white/[0.04] pl-2">
        {answers.map((ans, idx) => (
          <div key={idx} className="space-y-2 pb-3 border-b border-white/[0.02] last:border-0 last:pb-0">
            <div className="flex items-start gap-2.5">
              <span className="text-xs font-bold text-gray-500">Q{idx + 1}.</span>
              <p className="text-xs font-medium text-white flex-1">{ans.question_text}</p>
              {ans.is_correct ? (
                <CheckCircle2 size={14} className="text-emerald-400 mt-0.5" />
              ) : (
                <XCircle size={14} className="text-red-400 mt-0.5" />
              )}
            </div>

            {ans.options && (
              <div className="grid grid-cols-2 gap-1.5 pl-6">
                {Object.entries(ans.options).map(([k, v]) => {
                  const isCorrect = k === ans.correct_option;
                  const isSelected = k === ans.marked_option;
                  let borderStyle = "border-white/[0.04] bg-white/[0.01]";
                  let textStyle = "text-gray-400";
                  
                  if (isCorrect) {
                    borderStyle = "border-emerald-500/20 bg-emerald-500/5";
                    textStyle = "text-emerald-300 font-semibold";
                  } else if (isSelected) {
                    borderStyle = "border-red-500/20 bg-red-500/5";
                    textStyle = "text-red-300";
                  }

                  return (
                    <div key={k} className={`p-2 rounded-lg border text-[10px] ${borderStyle} ${textStyle}`}>
                      <span className="font-bold mr-1.5">{k}.</span>
                      {v}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header Info */}
      <GlassCard className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
        
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="text-caption">Concept Space</span>
            <h2 className="text-heading text-white mt-1">{concept.name}</h2>
            <p className="text-body text-sm mt-1">{concept.chapter_name}</p>
          </div>
          <ProgressRing value={getMasteryPercent(concept.mastery)} size={70} strokeWidth={6} />
        </div>

        <button
          onClick={() => navigate(`/quiz/${conceptId}`)}
          className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 transition-all flex items-center justify-center gap-2"
        >
          <Swords size={16} />
          Challenge Concept (Quiz)
        </button>
      </GlassCard>

      {/* Neural Matrix Analyzer Dashboard */}
      <GlassCard padding="p-5" className="border-purple-500/20 shadow-lg shadow-purple-500/5">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-purple-400" />
          <h3 className="text-caption">Neural Matrix Analyzer</h3>
        </div>

        {/* Double Quantum Mastery Orbs */}
        <div className="grid grid-cols-2 gap-4 text-center my-4 py-2 border-b border-white/[0.04]">
          <div className="space-y-1.5">
            <ProgressRing
              value={examMastery}
              size={90}
              strokeWidth={8}
              color="var(--color-accent)"
              bgColor="rgba(255,255,255,0.03)"
              sublabel="EXAM"
            />
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Exam Readiness</p>
          </div>

          <div className="space-y-1.5">
            <ProgressRing
              value={chapterMastery}
              size={90}
              strokeWidth={8}
              color="#3b82f6"
              bgColor="rgba(255,255,255,0.03)"
              sublabel="CHAPTER"
            />
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Chapter understanding</p>
          </div>
        </div>

        {/* Dynamic Stats Summary (once history is loaded) */}
        {summary ? (
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-2.5 text-center">
              <span className="text-xs font-bold text-purple-400">{summary.total_attempts}</span>
              <span className="text-[8px] text-gray-500 uppercase block mt-0.5">Attempts</span>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-2.5 text-center">
              <span className="text-xs font-bold text-emerald-400">
                {Math.round((summary.best_exam_score || 0) * 100)}%
              </span>
              <span className="text-[8px] text-gray-500 uppercase block mt-0.5">Best Exam</span>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-2.5 text-center">
              <span className="text-xs font-bold text-blue-400">
                {Math.round((summary.average_exam_score || 0) * 100)}%
              </span>
              <span className="text-[8px] text-gray-500 uppercase block mt-0.5">Avg Exam</span>
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-gray-500 text-center pt-2">
            Expand the History tab below to load performance metrics summary.
          </p>
        )}
      </GlassCard>

      {/* Study Materials */}
      <GlassCard padding="p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} className="text-purple-400" />
          <h3 className="text-caption">Study Material</h3>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed transition-all">
          {isDescExpanded ? fullDescription : truncatedDescription}
        </p>
        {shouldTruncateDesc && (
          <button
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="text-xs text-purple-400 hover:text-purple-300 font-bold mt-3 transition-colors flex items-center gap-1"
          >
            {isDescExpanded ? (
              <>
                Read Less <ChevronUp size={12} />
              </>
            ) : (
              <>
                Read More <ChevronDown size={12} />
              </>
            )}
          </button>
        )}
      </GlassCard>

      {/* Expandable Formulas, Logics & Consequences (Loaded on Demand) */}
      <GlassCard padding="p-5" className="transition-all">
        <button
          onClick={handleToggleFormulas}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-purple-400" />
            <h3 className="text-caption">Core Concepts & Formulas</h3>
          </div>
          <div className="flex items-center gap-2">
            {loadingFormulas && <Loader2 size={12} className="animate-spin text-purple-400" />}
            {isFormulasExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </div>
        </button>

        <AnimatePresence>
          {isFormulasExpanded && !loadingFormulas && formulasLoaded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 mt-4 pt-3 border-t border-white/[0.04]"
            >
              {formulas.length === 0 && rules.length === 0 && consequences.length === 0 ? (
                <p className="text-xs text-gray-500">No formula data found for this concept.</p>
              ) : (
                <>
                  {formulas.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-purple-300 mb-1.5">Formulas</p>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-gray-300">
                        {formulas.map((item, i) => (
                          <li key={i}>
                            <span className="font-mono text-white">{item.formula}</span>
                            {item.used_for && <span className="text-[10px] text-gray-500 block mt-0.5">Used for: {item.used_for}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rules.length > 0 && (
                    <div className="pt-2 border-t border-white/[0.04]">
                      <p className="text-xs font-bold text-blue-300 mb-1.5">Rule Based Logics</p>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-gray-300">
                        {rules.map((item, i) => (
                          <li key={i}>
                            <span className="text-white font-medium">{item.rule}</span>
                            {item.applied_when && <span className="text-[10px] text-gray-500 block mt-0.5">Applied when: {item.applied_when}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {consequences.length > 0 && (
                    <div className="pt-2 border-t border-white/[0.04]">
                      <p className="text-xs font-bold text-emerald-300 mb-1.5">Derived Consequences</p>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-gray-300">
                        {consequences.map((item, i) => (
                          <li key={i}>
                            <span className="text-white">{item.consequence}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* Expandable History Attempts (Loaded on Demand) */}
      <GlassCard padding="p-5">
        <button
          onClick={handleToggleHistory}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <LineChart size={16} className="text-purple-400" />
            <h3 className="text-caption">Attempts History</h3>
          </div>
          <div className="flex items-center gap-2">
            {loadingHistory && <Loader2 size={12} className="animate-spin text-purple-400" />}
            {isHistoryExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </div>
        </button>

        <AnimatePresence>
          {isHistoryExpanded && !loadingHistory && historyLoaded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-3 border-t border-white/[0.04]"
            >
              {history.length === 0 ? (
                <p className="text-xs text-gray-500">No attempts yet. Complete a quiz to see your performance history.</p>
              ) : (
                <div className="space-y-3">
                  {history.slice(0, 5).map((attempt, i) => {
                    const attemptScore = attempt.score ?? attempt.points ?? 0;
                    const isSessionOpen = openSessionId === attempt.quiz_session;
                    return (
                      <div key={i} className="py-2.5 border-b border-white/[0.03] last:border-0">
                        <div
                          onClick={() => setOpenSessionId(isSessionOpen ? null : attempt.quiz_session)}
                          className="flex justify-between items-center text-xs cursor-pointer select-none"
                        >
                          <div>
                            <p className="font-semibold text-white">Score / Accuracy: {Math.round(attemptScore * 100)}%</p>
                            <p className="text-[9px] text-gray-500 mt-0.5">
                              {attempt.created_at ? new Date(attempt.created_at).toLocaleDateString() : `Attempt ${i + 1}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold ${attemptScore >= 0.8 ? "text-emerald-400" : "text-gray-500"}`}>
                              {attemptScore >= 0.8 ? "✓ Mastered" : "• Attempted"}
                            </span>
                            {isSessionOpen ? <ChevronUp size={12} className="text-gray-500" /> : <ChevronDown size={12} className="text-gray-500" />}
                          </div>
                        </div>

                        {/* Expandable answers review details */}
                        <AnimatePresence>
                          {isSessionOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              {renderHistoryAnswers(attempt.answers)}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}
