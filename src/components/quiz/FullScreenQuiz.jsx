// src/components/quiz/FullScreenQuiz.jsx
// Strict real-data focus mode quiz experience

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizApi from "../../api/quizApi";
import socialApi from "../../api/socialApi";
import syllabusApi from "../../api/syllabusApi";
import QuizShareModal from "./QuizShareModal";
import { useMindModel } from "../../context/MindModelContext";
import { ArrowLeft, RefreshCw, ArrowRight, CheckCircle2, HelpCircle, XCircle, Award, Check, X, Share2, Sparkles } from "lucide-react";

const OPTIONS = ["A", "B", "C", "D"];
const MAIN = "__main__";

export default function FullScreenQuiz({ conceptId: propConceptId, concept: propConcept, onClose: propOnClose }) {
  const { conceptId: routeConceptId } = useParams();
  const navigate = useNavigate();

  const conceptId = propConceptId || routeConceptId;
  const onClose = propOnClose || (() => navigate(`/learn/${conceptId}`));
  const { refreshCatalyst } = useMindModel();

  const [conceptDetail, setConceptDetail] = useState(propConcept || null);
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    socialApi.pingSession("quiz", conceptId).catch(() => {});
    return () => { socialApi.pingSession(null).catch(() => {}); };
  }, [conceptId]);

  useEffect(() => {
    if (!conceptDetail && conceptId) {
      syllabusApi.getConceptDetail(conceptId)
        .then((data) => setConceptDetail(data))
        .catch(() => {});
    }
  }, [conceptId, conceptDetail]);

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        let res = null;
        try {
          res = await quizApi.start({
            concept_id: conceptId,
            num_questions: 5,
            quiz_type: "PYQS",
          });
        } catch (apiErr) {
          console.warn("Backend quiz start endpoint error:", apiErr);
        }

        if (res && res.questions && res.questions.length > 0) {
          setSession(res);
          setStartTime(Date.now());
        } else {
          setError("No practice questions found for this concept yet.");
        }
      } catch (err) {
        console.error("Quiz init failed:", err);
        setError("Failed to load questions for this concept.");
      } finally {
        setLoading(false);
      }
    };

    if (conceptId) {
      initializeQuiz();
    }
  }, [conceptId, conceptDetail]);

  const getSelected = (qid, type = MAIN) =>
    answers.find((a) => a.question_id === qid && a.sub_question_type === type)?.marked_option;

  const saveAnswer = (qid, option, type = MAIN) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => !(a.question_id === qid && a.sub_question_type === type));
      return [...filtered, { question_id: qid, sub_question_type: type, marked_option: option }];
    });
  };

  const submitQuiz = async () => {
    if (!session) return;
    try {
      setSubmitting(true);
      const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
      const res = await quizApi.submit({
        session_id: session.session_id || session.id,
        duration_seconds: duration,
        answers: answers,
      });

      setResult(res);
      refreshCatalyst();
    } catch (err) {
      console.error(err);
      setError("Failed to submit answers.");
    } finally {
      setSubmitting(false);
    }
  };

  const [sharedStrategy, setSharedStrategy] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  /* ═══ RESULT & QUESTION REVIEW SCREEN ═══ */
  if (result) {
    const answersList = result.answers || [];
    const scorePct = Math.round((result.score || 0) * 100);
    const correctCount = answersList.filter(a => a.is_correct).length;
    const totalCount = answersList.length || session?.questions?.length || 0;

    return (
      <div className="fixed inset-0 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] z-50 overflow-y-auto p-4 sm:p-8 select-none">
        <div className="max-w-2xl mx-auto space-y-6 pb-16">
          
          {/* Top Performance Header Card */}
          <div className="daksh-card p-6 sm:p-8 text-center space-y-4 border-t-4 border-t-[var(--color-gold)]">
            <div className="w-16 h-16 rounded-full bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center mx-auto shadow-xs">
              <Award size={32} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Quiz Review & Results</h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-medium">
                {conceptDetail?.name || result.concept_name || "Concept Mastery Practice"}
              </p>
            </div>

            {/* Score Ring & Metrics */}
            <div className="flex items-center justify-center gap-8 py-3 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)]">
              <div className="text-center">
                <span className="text-3xl font-black text-[var(--color-gold-dark)] block">{scorePct}%</span>
                <span className="text-[10px] text-[var(--color-mid-gray)] uppercase font-extrabold tracking-wider block">Accuracy Score</span>
              </div>
              <div className="h-8 w-px bg-[var(--color-border)]" />
              <div className="text-center">
                <span className="text-3xl font-black text-emerald-600 block">{correctCount} / {totalCount}</span>
                <span className="text-[10px] text-[var(--color-mid-gray)] uppercase font-extrabold tracking-wider block">Correct Solved</span>
              </div>
            </div>

            {/* Share Learning & Strategy Hero Card */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-gold)]/30 hover:border-[var(--color-gold)]/60 transition-all shadow-xs">
              <div className="flex items-center gap-3 text-left min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-gold-pale)] to-[var(--color-gold)]/20 text-[var(--color-gold-dark)] flex items-center justify-center font-bold shrink-0 border border-[var(--color-gold)]/30 shadow-xs">
                  <Sparkles size={18} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black text-[var(--color-text-primary)] block truncate">
                    Share Learning & Strategy
                  </span>
                  <span className="text-[10px] text-[var(--color-text-secondary)] font-medium block truncate">
                    Post your score ({correctCount}/{totalCount}) & takeaways to World feed
                  </span>
                </div>
              </div>
              {sharedStrategy ? (
                <span className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs">
                  <Check size={14} className="stroke-[3]" /> Shared ✓
                </span>
              ) : (
                <button
                  onClick={() => setShowShareModal(true)}
                  className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer shadow-xs hover:brightness-105 active:scale-[0.98] transition-all"
                >
                  <Share2 size={13} />
                  <span>Share Strategy</span>
                </button>
              )}
            </div>

            {/* Action Buttons Header */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => { setResult(null); setCurrentIndex(0); setAnswers([]); setStartTime(Date.now()); }}
                className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5 hover:border-[var(--color-gold)] transition-all cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Return to Learning Space
              </button>
            </div>
          </div>

          {/* Detailed Question Review Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[var(--color-gold)]" />
              Question & Answer Breakdown ({answersList.length})
            </h3>

            {answersList.map((item, idx) => {
              const opts = item.options || {};
              const optionKeys = ["A", "B", "C", "D"];
              const userMarked = item.marked_option;
              const correctOpt = item.correct_option;
              const isUserCorrect = item.is_correct;

              return (
                <div
                  key={idx}
                  className={`daksh-card p-5 sm:p-6 space-y-4 border-l-4 ${
                    isUserCorrect ? "border-l-emerald-500 bg-emerald-50/20" : "border-l-rose-500 bg-rose-50/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">
                      Question {idx + 1}
                    </span>
                    {isUserCorrect ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1 border border-emerald-300">
                        <CheckCircle2 size={13} /> Correct (+10 XP)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold flex items-center gap-1 border border-rose-300">
                        <XCircle size={13} /> Incorrect
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)] leading-relaxed">
                    {item.question_text || `Question ${idx + 1}`}
                  </h4>

                  {/* Options List */}
                  <div className="space-y-2">
                    {optionKeys.map((key) => {
                      const text = opts[key];
                      if (!text) return null;

                      const isSelectedByUser = userMarked === key;
                      const isOptionCorrect = correctOpt === key;

                      let styleClasses = "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]";
                      let badge = null;

                      if (isSelectedByUser && isOptionCorrect) {
                        styleClasses = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs";
                        badge = (
                          <span className="ml-auto text-emerald-700 text-xs font-black flex items-center gap-1">
                            <Check size={14} className="stroke-[3]" /> Your Answer (Correct)
                          </span>
                        );
                      } else if (isSelectedByUser && !isOptionCorrect) {
                        styleClasses = "border-rose-400 bg-rose-50 text-rose-950 font-bold shadow-xs";
                        badge = (
                          <span className="ml-auto text-rose-700 text-xs font-black flex items-center gap-1">
                            <X size={14} className="stroke-[3]" /> Your Answer (Incorrect)
                          </span>
                        );
                      } else if (isOptionCorrect) {
                        styleClasses = "border-emerald-400 bg-emerald-50/60 text-emerald-900 font-semibold";
                        badge = (
                          <span className="ml-auto text-emerald-700 text-xs font-bold flex items-center gap-1">
                            <Check size={14} /> Correct Answer
                          </span>
                        );
                      }

                      return (
                        <div
                          key={key}
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center gap-3 ${styleClasses}`}
                        >
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                            isOptionCorrect ? "bg-emerald-600 text-white" : isSelectedByUser ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-700"
                          }`}>
                            {key}
                          </span>
                          <span className="flex-1">{text}</span>
                          {badge}
                        </div>
                      );
                    })}
                  </div>

                  {/* Solution Explanation Box */}
                  {item.explanation && (
                    <div className="p-4 rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-gold-pale)]/50 text-xs space-y-1">
                      <span className="font-bold text-[var(--color-gold-dark)] block">💡 Verified Explanation:</span>
                      <p className="text-[var(--color-text-primary)] leading-relaxed">{item.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        {/* Tailored Quiz Attempt Share Modal */}
        <QuizShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          conceptId={conceptId || conceptDetail?.id}
          conceptName={conceptDetail?.name || result?.concept_name || "Concept Quiz"}
          correctCount={correctCount}
          totalCount={totalCount}
          answersList={answersList}
          onPostCreated={() => setSharedStrategy(true)}
        />

        </div>
      </div>
    );
  }

  /* ═══ LOADING ═══ */
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white text-[var(--color-text-primary)] flex items-center justify-center z-50">
        <div className="text-center space-y-3">
          <RefreshCw className="animate-spin text-[var(--color-gold)] mx-auto" size={28} />
          <p className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wider">Loading Session...</p>
        </div>
      </div>
    );
  }

  /* ═══ NO QUESTIONS / ERROR ═══ */
  if ((error || !session || !session.questions || session.questions.length === 0)) {
    return (
      <div className="fixed inset-0 bg-white text-[var(--color-text-primary)] flex items-center justify-center z-50 p-4">
        <div className="max-w-md w-full text-center space-y-4 daksh-card p-8">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center mx-auto">
            <HelpCircle size={22} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">
              {conceptDetail?.name || "Concept Session"}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {error || "No practice questions available for this concept yet."}
            </p>
          </div>
          <button onClick={onClose} className="btn-gold px-6 py-2.5 text-xs font-bold w-full rounded-xl">
            Return to Learning Space
          </button>
        </div>
      </div>
    );
  }

  /* ═══ QUIZ SCREEN ═══ */
  const q = session.questions[currentIndex];
  return (
    <div className="fixed inset-0 bg-white text-[var(--color-text-primary)] z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-xl w-full border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[520px] shadow-[var(--shadow-lg)]">

        {/* Top Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[var(--color-border)] text-xs font-semibold">
          <button onClick={onClose} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1.5 cursor-pointer">
            <ArrowLeft size={14} /> Exit
          </button>
          <span className="px-3 py-1 rounded-full bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/30">
            {currentIndex + 1} / {session.questions.length}
          </span>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col justify-center py-6 space-y-5">
          {q && (
            <h2 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] leading-relaxed">
              {q.question}
            </h2>
          )}

          {q && (
            <div className="space-y-2.5">
              {OPTIONS.map((k) => {
                const optionText = q[`option_${k.toLowerCase()}`];
                if (!optionText) return null;
                const isSelected = getSelected(q.qid) === k;

                return (
                  <button
                    key={k}
                    onClick={() => saveAnswer(q.qid, k)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-[var(--color-gold-pale)] border-[var(--color-gold)] text-[var(--color-text-primary)] font-semibold"
                        : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-hover)]"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? "bg-[var(--color-gold)] text-white"
                        : "bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-mid-gray)]"
                    }`}>
                      {k}
                    </div>
                    <span className="flex-1">{optionText}</span>
                    {isSelected && <CheckCircle2 size={16} className="text-[var(--color-gold)] shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Nav */}
        <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
          <button
            disabled={currentIndex === 0 || submitting}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Previous
          </button>

          {currentIndex === session.questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              disabled={submitting}
              className="btn-gold px-6 py-3 rounded-xl text-xs font-bold"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              disabled={submitting}
              className="btn-gold px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              Next <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
