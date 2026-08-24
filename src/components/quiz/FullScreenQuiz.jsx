// src/components/quiz/FullScreenQuiz.jsx
// Strict real-data focus mode quiz experience

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizApi from "../../api/quizApi";
import socialApi from "../../api/socialApi";
import syllabusApi from "../../api/syllabusApi";
import { useMindModel } from "../../context/MindModelContext";
import { ArrowLeft, RefreshCw, ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import JourneyComplete from "../learn/JourneyComplete";

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
        const res = await quizApi.start({
          concept_id: conceptId,
          num_questions: 5,
          quiz_type: "PYQS",
        });

        if (res && res.questions && res.questions.length > 0) {
          setSession(res);
          setStartTime(Date.now());
        } else {
          setSession(null);
          setError("No practice questions found for this concept.");
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

      setResult(res);
      refreshCatalyst();
    } catch (err) {
      console.error(err);
      setError("Failed to submit answers.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ═══ RESULT SCREEN ═══ */
  if (result) {
    return (
      <div className="fixed inset-0 bg-white text-[var(--color-text-primary)] z-50 overflow-y-auto">
        <JourneyComplete
          conceptName={result.concept_name || conceptDetail?.name || "Concept Mastery"}
          questionsSolved={result.total_questions || session?.questions?.length || 5}
          onCompleteSession={() => navigate("/")}
        />
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
