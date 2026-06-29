import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizApi from "../../api/quizApi";
import { ArrowLeft, RefreshCw } from "lucide-react";

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
        // Fallback mock questions if DB is empty
        if (!sessionData.questions || sessionData.questions.length === 0) {
          sessionData = {
            session_id: res.session_id || 999,
            total_questions: 3,
            questions: [
              {
                qid: "mock-1",
                question: "What is the primary condition for Hydrogen bonding to occur?",
                option_a: "H must be covalently bonded to a highly electronegative atom (F, O, or N)",
                option_b: "H must be bonded to a large transition metal",
                option_c: "Any covalent compound containing hydrogen",
                option_d: "Ionic compounds in aqueous solutions",
                correct_option: "A"
              },
              {
                qid: "mock-2",
                question: "Which of the following molecules exhibits intramolecular Hydrogen bonding?",
                option_a: "Water (H2O)",
                option_b: "Ortho-nitrophenol",
                option_c: "Ethanol (C2H5OH)",
                option_d: "Ammonia (NH3)",
                correct_option: "B"
              },
              {
                qid: "mock-3",
                question: "Why does ice float on water?",
                option_a: "H-bonding forms a dense crystal lattice",
                option_b: "H-bonding creates an open cage-like structure with voids",
                option_c: "Covalent bonds in ice are longer",
                option_d: "Ice absorbs oxygen from the air",
                correct_option: "B"
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
    setSubmitting(true);
    setError(null);
    try {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const payload = answers.map((a) => ({
        ...a,
        sub_question_type: a.sub_question_type === MAIN ? null : a.sub_question_type,
      }));

      const res = await quizApi.submit({
        session_id: session.session_id,
        duration_seconds: duration,
        answers: payload,
      });

      // Handle mock fallback score computation
      if (session.session_id === 999) {
        let correctCount = 0;
        const mockAnswers = payload.map((a) => {
          const qObj = session.questions.find((x) => x.qid === a.question_id);
          const isCorrect = qObj?.correct_option === a.marked_option;
          if (isCorrect) correctCount++;
          return {
            question_text: qObj?.question,
            marked_option: a.marked_option,
            correct_option: qObj?.correct_option,
            is_correct: isCorrect,
          };
        });
        setResult({
          session_id: 999,
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

  /* ================= RESULT SCREEN ================= */
  if (result) {
    const scorePct = Math.round(result.score * 100);
    return (
      <div className="fixed inset-0 bg-slate-950 text-white flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="w-full max-w-xl bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col max-h-[90vh]">
          <div className="text-center">
            <h1 className="text-xl font-bold">Quiz Complete</h1>
            <p className="text-xs text-gray-500 mt-1">Score: {scorePct}% • Time: {result?.duration_seconds || 0}s</p>
          </div>

          {result?.answers && (
            <div className="flex-1 overflow-y-auto space-y-5 pr-1 border-t border-white/[0.04] pt-4">
              {result.answers.map((ans, idx) => (
                <div key={idx} className="space-y-2.5 pb-4 border-b border-white/[0.04] last:border-0 last:pb-0">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xs font-bold text-gray-500">Q{idx + 1}.</span>
                    <p className="text-xs font-medium text-white flex-1 leading-relaxed">{ans.question_text}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase ${
                      ans.is_correct ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    }`}>
                      {ans.is_correct ? "Correct" : "Incorrect"}
                    </span>
                  </div>

                  {ans.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5">
                      {Object.entries(ans.options).map(([k, v]) => {
                        const isCorrect = k === ans.correct_option;
                        const isSelected = k === ans.marked_option;
                        let optionStyle = "border-white/[0.04] bg-white/[0.01] text-gray-400";
                        
                        if (isCorrect) {
                          optionStyle = "border-emerald-500/20 bg-emerald-500/5 text-emerald-300 font-semibold";
                        } else if (isSelected) {
                          optionStyle = "border-red-500/20 bg-red-500/5 text-red-300";
                        }

                        return (
                          <div key={k} className={`p-2.5 rounded-lg border text-[11px] leading-normal ${optionStyle}`}>
                            <span className="font-bold mr-1.5">{k}.</span>
                            {v}
                            {isCorrect && (
                              <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1 py-0.5 rounded ml-2 uppercase font-black tracking-wider">Correct</span>
                            )}
                            {isSelected && !isCorrect && (
                              <span className="text-[8px] bg-red-500/20 text-red-300 px-1 py-0.5 rounded ml-2 uppercase font-black tracking-wider">Your Choice</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all mt-auto"
          >
            Close Review
          </button>
        </div>
      </div>
    );
  }

  /* ================= LOADING SCREEN ================= */
  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 text-white flex items-center justify-center z-50">
        <div className="text-center space-y-2">
          <RefreshCw className="animate-spin text-purple-400 mx-auto" size={24} />
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  /* ================= ERROR SCREEN ================= */
  if (error && !session) {
    return (
      <div className="fixed inset-0 bg-slate-950 text-white flex items-center justify-center z-50">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={onClose} className="px-5 py-2 rounded-xl bg-white/[0.04] text-xs font-bold">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ================= QUIZ VIEW SCREEN (ULTRA MINIMALIST) ================= */
  const q = session?.questions?.[currentIndex];
  return (
    <div className="fixed inset-0 bg-slate-950/90 text-white z-50 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.07),transparent_60%)] bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.07),transparent_60%)] animate-fade-in">
      <div className="max-w-xl w-full bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[520px] shadow-2xl shadow-purple-500/[0.02]">
        
        {/* Top Header */}
        <div className="flex justify-between items-center pb-3 border-b border-white/[0.04] text-xs text-gray-500">
          <button onClick={onClose} className="hover:text-white transition-colors flex items-center gap-1.5">
            <ArrowLeft size={14} /> Exit
          </button>
          <span>
            {currentIndex + 1} / {session?.questions?.length || 3}
          </span>
        </div>

        {/* Minimalist Content Column */}
        <div className="flex-1 flex flex-col justify-center py-6 space-y-4">
          {q && (
            <h2 className="text-base sm:text-lg font-medium text-white leading-relaxed">
              {q.question}
            </h2>
          )}

          {q && (
            <div className="space-y-2">
              {OPTIONS.map((k) => {
                const optionText = q[`option_${k.toLowerCase()}`];
                if (!optionText) return null;
                const isSelected = getSelected(q.qid) === k;

                return (
                  <button
                    key={k}
                    onClick={() => saveAnswer(q.qid, k)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center gap-3 ${
                      isSelected
                        ? "bg-purple-600 border-purple-500 text-white font-medium"
                        : "bg-white/[0.01] border-white/[0.04] text-gray-400 hover:bg-white/[0.03] hover:border-white/[0.08]"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                      isSelected ? "bg-white/20 text-white" : "bg-white/[0.04] border border-white/10 text-gray-500"
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
        <div className="flex justify-between items-center pt-3 border-t border-white/[0.04]">
          <button
            disabled={currentIndex === 0 || submitting}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="text-xs text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {session && currentIndex === session.questions?.length - 1 ? (
            <button
              onClick={submitQuiz}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
            >
              Next
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
