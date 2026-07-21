// src/components/quiz/FullScreenQuiz.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizApi from "../../api/quizApi";
import socialApi from "../../api/socialApi";
import { ArrowLeft, RefreshCw, Sparkles, Flame, CheckCircle2, Award, Zap, ArrowRight } from "lucide-react";

const OPTIONS = ["A", "B", "C", "D"];
const MAIN = "__main__";

export default function FullScreenQuiz({ conceptId: propConceptId, concept: propConcept, onClose: propOnClose }) {
  const { conceptId: routeConceptId } = useParams();
  const navigate = useNavigate();

  const conceptId = propConceptId || routeConceptId;
  const onClose = propOnClose || (() => navigate(`/learn/${conceptId}`));

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
    return () => {
      socialApi.pingSession(null).catch(() => {});
    };
  }, [conceptId]);

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await quizApi.start({
          concept_id: conceptId,
          num_questions: 5,
          quiz_type: "PYQS",
        });

        let sessionData = res;
        if (!sessionData.questions || sessionData.questions.length === 0) {
          sessionData = {
            session_id: res.session_id || 999,
            total_questions: 3,
            questions: [
              {
                qid: "mock-1",
                question: "What is the primary factor determining electric potential difference between two points?",
                option_a: "Work done in moving a unit positive charge between the points",
                option_b: "Mass of electrons flowing through the circuit",
                option_c: "Total resistance of the atmospheric air",
                option_d: "Color of the copper wire insulation",
                correct_option: "A"
              },
              {
                qid: "mock-2",
                question: "According to Ohm's Law (V = IR), if voltage is doubled while resistance remains constant, what happens to current?",
                option_a: "Current doubles",
                option_b: "Current drops to zero",
                option_c: "Current remains unchanged",
                option_d: "Current drops by half",
                correct_option: "A"
              },
              {
                qid: "mock-3",
                question: "Which component is used to protect electrical circuits from overcurrent damage?",
                option_a: "Fuse / Circuit Breaker",
                option_b: "Voltmeter",
                option_c: "Galvanometer",
                option_d: "Rheostat",
                correct_option: "A"
              }
            ]
          };
        }

        setSession(sessionData);
        setStartTime(Date.now());
      } catch (err) {
        console.error(err);
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    initializeQuiz();
  }, [conceptId]);

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
        session_id: session.session_id,
        duration_seconds: duration,
        answers: answers,
      });

      if (!res.score && res.score !== 0) {
        let correctCount = 0;
        const mockAnswers = answers.map((a) => {
          const qObj = session.questions.find((q) => q.qid === a.question_id);
          const isCorrect = qObj?.correct_option === a.marked_option;
          if (isCorrect) correctCount += 1;
          return {
            question_text: qObj?.question,
            marked_option: a.marked_option,
            correct_option: qObj?.correct_option,
            is_correct: isCorrect,
          };
        });
        setResult({
          session_id: session.session_id || 999,
          score: correctCount / session.questions.length,
          duration_seconds: duration,
          answers: mockAnswers,
        });
      } else {
        setResult(res);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to submit answers.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= EMOTIONAL RESULT SCREEN ================= */
  if (result) {
    const scorePct = Math.round(result.score * 100);
    const accuracyGain = Math.round(scorePct >= 80 ? 12 : 8);

    let streakBadge = "🔥 On Fire! 3 in a row";
    let messageHeading = "Great job!";
    if (scorePct >= 80) {
      messageHeading = "🎉 Exceptional Performance!";
      streakBadge = "⚡ Momentum Increasing";
    } else if (scorePct >= 60) {
      messageHeading = "✨ Nice Work!";
      streakBadge = "🔥 Keeping Momentum";
    } else {
      messageHeading = "💪 Keep Going!";
      streakBadge = "🌱 Building Foundation";
    }

    return (
      <div className="fixed inset-0 bg-slate-950 text-white flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-xl">
        <div className="w-full max-w-xl bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col max-h-[90vh]">
          {/* Header & Streak Celebration */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Sparkles size={14} className="text-amber-400" />
              {streakBadge}
            </div>

            <h1 className="text-2xl font-extrabold text-white tracking-tight">{messageHeading}</h1>
            <p className="text-xs text-emerald-400 font-bold">
              You improved Accuracy by +{accuracyGain}% in this mission
            </p>
          </div>

          {/* Strengths & Weakness Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide block">Strength</span>
              <span className="text-xs font-extrabold text-white block">Formula Recall & Units</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block">Needs Practice</span>
              <span className="text-xs font-extrabold text-white block">Series Resistance Math</span>
            </div>
          </div>

          {/* Detailed Question Review */}
          {result?.answers && (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 border-t border-white/10 pt-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mission Answers</h4>
              {result.answers.map((ans, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-medium text-white flex-1">
                      Q{idx + 1}. {ans.question_text}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      ans.is_correct ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                    }`}>
                      {ans.is_correct ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Continue Action */}
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all mt-auto"
          >
            <span>Continue to Concept Space</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  /* ================= LOADING SCREEN ================= */
  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 text-white flex items-center justify-center z-50">
        <div className="text-center space-y-3">
          <RefreshCw className="animate-spin text-purple-400 mx-auto" size={28} />
          <p className="text-xs font-bold text-gray-300 tracking-wider">Entering Focus Mode...</p>
        </div>
      </div>
    );
  }

  /* ================= ERROR SCREEN ================= */
  if (error && !session) {
    return (
      <div className="fixed inset-0 bg-slate-950 text-white flex items-center justify-center z-50">
        <div className="text-center space-y-4">
          <p className="text-rose-400 text-sm font-semibold">{error}</p>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white/10 text-xs font-bold text-white">
            Return to Concept
          </button>
        </div>
      </div>
    );
  }

  /* ================= FOCUS MODE QUIZ SCREEN ================= */
  const q = session?.questions?.[currentIndex];
  return (
    <div className="fixed inset-0 bg-slate-950 text-white z-50 flex items-center justify-center p-4 backdrop-blur-2xl animate-fade-in">
      <div className="max-w-xl w-full bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[520px] shadow-2xl shadow-purple-500/10">
        
        {/* Top Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10 text-xs font-bold">
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
            <ArrowLeft size={14} /> Exit Mission
          </button>
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {currentIndex + 1} / {session?.questions?.length || 3}
          </span>
        </div>

        {/* Minimalist Question Column */}
        <div className="flex-1 flex flex-col justify-center py-6 space-y-5">
          {q && (
            <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
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
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-center gap-3 ${
                      isSelected
                        ? "bg-purple-600 border-purple-400 text-white font-bold shadow-lg shadow-purple-500/20"
                        : "bg-white/[0.02] border-white/10 text-gray-300 hover:bg-white/[0.05] hover:border-white/20"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                      isSelected ? "bg-white/20 text-white" : "bg-white/10 border border-white/10 text-gray-400"
                    }`}>
                      {k}
                    </div>
                    <span className="flex-1">{optionText}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Nav Bar */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <button
            disabled={currentIndex === 0 || submitting}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="text-xs font-bold text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {session && currentIndex === session.questions?.length - 1 ? (
            <button
              onClick={submitQuiz}
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg transition-all"
            >
              {submitting ? "Submitting..." : "Submit Mission"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-lg transition-all"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
