import React, { useState, useEffect } from "react";
import quizApi from "../../api/quizApi";
import { motion, AnimatePresence } from "framer-motion";

const OPTIONS = ["A", "B", "C", "D"];
const MAIN = "__main__";

// Animated background particles
const BackgroundParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
          }}
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -100, 100, 0],
            opacity: [particle.opacity, 0.8, 0.2, particle.opacity],
          }}
          transition={{
            duration: particle.speed * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Glowing button component
const GlowButton = ({ children, onClick, disabled, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/50",
    secondary: "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 shadow-purple-500/50",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-green-500/50",
    danger: "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 shadow-red-500/50",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-8 py-4 rounded-xl font-bold text-white
        ${variants[variant]}
        shadow-lg hover:shadow-xl
        transform transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
};

// Animated progress bar
const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className="w-full bg-gray-800/50 rounded-full h-3 mb-6 overflow-hidden border border-cyan-500/30">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full relative"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
      </motion.div>
    </div>
  );
};

// Gaming-style loader
const GameLoader = ({ text = "Loading..." }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="text-cyan-400 font-semibold text-lg"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
};

// Enhanced error display
const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <motion.div
      className="bg-red-900/50 border border-red-500/50 rounded-xl p-6 mb-6 backdrop-blur-sm"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center mb-4">
        <motion.div
          className="w-6 h-6 bg-red-500 rounded-full mr-3"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <h3 className="text-red-400 font-bold text-lg">Oops! Something went wrong</h3>
      </div>
      <p className="text-red-200 mb-4">{error}</p>
      {onRetry && (
        <GlowButton variant="danger" onClick={onRetry} className="text-sm">
          Try Again
        </GlowButton>
      )}
    </motion.div>
  );
};

export default function FullScreenQuiz({ conceptId,concept, onClose }) {
  const [stage, setStage] = useState("SETUP");
  const [quizType, setQuizType] = useState("PYQS");
  const [numQuestions,setNumQuestions]=useState(3);
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  /* ---------------- REVISION META ---------------- */
const meta = concept?.ai_meta;
const formulas = meta?.layer_1_hard_formulas || [];
const rules = meta?.layer_2_rule_based_logics || [];
const consequences = meta?.layer_3_derived_consequences || [];


  
  const startQuiz = async () => {
 
  setError(null);

  setSession(null);
  setAnswers([]);
  setCurrentIndex(0);

  try {
    // =========================
    // DB MODE (PYQS)
    // =========================
    if (quizType === "PYQS") {
       setLoading(true);
      const res = await quizApi.start({
        concept_id: conceptId,
        num_questions: 5,
        quiz_type: "PYQS",
      });

      // setSession({
      //   session_id: res.session_id,
      //   questions: res.questions.map(normalizeDBQuestion),
      // });
      setSession(res);
      setAnswers([]);
      setCurrentIndex(0);

      setStartTime(Date.now());
      setStage("QUIZ");
      setLoading(false);
      
    }

   


if (quizType === "NEW") {
  setLoading(true);
  console.log("[AI] Starting AI streaming quiz");

  const stopStream = quizApi.startStreaming({
    concept_id: conceptId,
    num_questions: 3,
    quiz_type: "NEW",

    onEvent: (event) => {
      // 🟢 FIRST QUESTION ARRIVES
      if (event.type === "question") {
        setLoading(false); // ✅ THIS WAS MISSING

        setSession((prev) => ({
          session_id: prev?.session_id ?? null,
          total_questions: prev?.total_questions ?? null,
          questions: [...(prev?.questions || []), event.question],
        }));

        setStage((s) => (s === "SETUP" ? "QUIZ" : s));
        setStartTime((t) => t ?? Date.now());
      }

      // 🟡 STREAM DONE (metadata only)
      if (event.type === "done") {
        setSession((prev) => ({
          ...prev,
          session_id: event.session_id,
          total_questions: event.total_questions,
        }));
      }
    },

    onError: () => {
      setLoading(false);
      setError("AI streaming failed");
    },

    onClose: () => {
      // optional
    },
  });

  return () => stopStream();
}



  } 
  catch (err) {
    console.error(err);
    setError("Failed to start quiz");
    setLoading(false);
  }
  finally {
    }
};





  /* ---------------- ANSWER HELPERS ---------------- */
  const getSelected = (qid, type = MAIN) =>
    answers.find(
      (a) => a.question_id === qid && a.sub_question_type === type
    )?.marked_option;

  const saveAnswer = (qid, option, type = MAIN) => {
    setAnswers((prev) => {
      const filtered = prev.filter(
        (a) => !(a.question_id === qid && a.sub_question_type === type)
      );
      return [...filtered, { question_id: qid, sub_question_type: type, marked_option: option }];
    });
  };

  /* ---------------- SUBMIT QUIZ ---------------- */
  const submitQuiz = async () => {
    setLoading(true);
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

      setResult(res);
      setStage("RESULT");
    } catch (err) {
      console.error(err);
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };





  /* ---------------- ENHANCED OPTION BUTTON ---------------- */
  const Option = ({ label, text, selected, onClick }) => (
    <motion.button
      onClick={onClick}
      className={`
        relative w-full text-left p-4 rounded-xl mb-3 font-medium
        backdrop-blur-sm border-2 transition-all duration-300
        ${selected
          ? "bg-gradient-to-r from-green-500/20 to-emerald-600/20 border-green-400 shadow-lg shadow-green-400/25"
          : "bg-gray-800/30 border-gray-600/50 hover:bg-gray-700/40 hover:border-cyan-400/70"
        }
      `}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="flex items-center">
        <motion.div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold text-sm
            ${selected
              ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
              : "bg-gray-700 text-gray-300 border border-gray-600"
            }
          `}
          animate={selected ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.div>
        <span className={selected ? "text-green-100" : "text-gray-200"}>
          {text}
        </span>
      </div>
      {selected && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/10 to-emerald-500/10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );

  /* ================= SETUP SCREEN ================= */
  if (stage === "SETUP") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <BackgroundParticles />
        
        <motion.div
          className="relative z-10 max-w-md w-full"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.h1
            className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            QUIZ ARENA
          </motion.h1>

          {error && <ErrorDisplay error={error} onRetry={startQuiz} />}

          {loading ? (
            <GameLoader text="Initializing Quiz..." />
          ) : (
            <>
              <motion.div
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-cyan-500/30"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">
                  Choose Your Challenge
                </h2>

                <div className="space-y-4">
                  {[
                    { value: "PYQS", label: "Revision Questions", desc: "Test your knowledge with real exam questions" },
                    // { value: "NEW", label: "AI Generated", desc: "Face fresh challenges created by AI" }
                  ].map((option) => (
                    <motion.label
                      key={option.value}
                      className={`
                        block p-4 rounded-xl cursor-pointer border-2 transition-all duration-300
                        ${quizType === option.value
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-400 shadow-lg shadow-cyan-400/25"
                          : "bg-gray-700/30 border-gray-600/50 hover:border-cyan-400/70"
                        }
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <motion.div
                          className={`
                            w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center
                            ${quizType === option.value ? "border-cyan-400" : "border-gray-500"}
                          `}
                        >
                          {quizType === option.value && (
                            <motion.div
                              className="w-3 h-3 bg-cyan-400 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          )}
                        </motion.div>
                        <div>
                          <div className="font-semibold text-lg">{option.label}</div>
                          <div className="text-gray-400 text-sm">{option.desc}</div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={quizType === option.value}
                        onChange={() => setQuizType(option.value)}
                        className="hidden"
                      />
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <GlowButton
                  onClick={startQuiz}
                  variant="primary"
                  className="text-xl px-12 py-4"
                >
                  🚀 Launch Quiz
                </GlowButton>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  /* ================= RESULT SCREEN ================= */
  if (stage === "RESULT") {
    const score = result ? (result.score * 100).toFixed(1) : 0;
    const isHighScore = score >= 80;
    
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <BackgroundParticles />
        
        <motion.div
          className="relative z-10 max-w-4xl w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-center mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.h1
              className={`text-6xl font-bold mb-4 ${
                isHighScore
                  ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
                  : "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
              } bg-clip-text text-transparent`}
              animate={isHighScore ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isHighScore ? "🏆 VICTORY!" : "🎯 COMPLETE!"}
            </motion.h1>
            
            {result && (
              <>
                <motion.div
                  className="text-5xl font-bold mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                >
                  {score}%
                </motion.div>
                <motion.p
                  className="text-xl text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Completed in {result.duration_seconds} seconds
                </motion.p>
              </>
            )}
          </motion.div>

          {result ? (
            <motion.div
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 max-h-96 overflow-auto border border-purple-500/30"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-purple-400">Detailed Results</h3>
              <div className="space-y-4">
                {result.answers.map((a, idx) => (
                  <motion.div
                    key={idx}
                    className={`p-4 rounded-xl border-l-4 ${
                      a.is_correct
                        ? "bg-green-900/30 border-l-green-400"
                        : "bg-red-900/30 border-l-red-400"
                    }`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium">{a.question_text}</p>
                      <motion.div
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          a.is_correct ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}
                        animate={a.is_correct ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {a.is_correct ? "✓ Correct" : "✗ Wrong"}
                      </motion.div>
                    </div>
                    
                    {a.sub_question_type && (
                      <p className="ml-4 text-gray-400 text-sm mb-2">
                        <span className="bg-purple-600 px-2 py-1 rounded text-xs">
                          {a.sub_question_type.toUpperCase()}
                        </span>
                      </p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Your Answer: </span>
                        <span className={a.is_correct ? "text-green-400" : "text-red-400"}>
                          {a.marked_option}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Correct Answer: </span>
                        <span className="text-green-400">{a.correct_option}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <GameLoader text="Calculating Results..." />
          )}

          <motion.div
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <GlowButton
              onClick={onClose}
              variant={isHighScore ? "success" : "secondary"}
              className="text-xl px-12 py-4"
            >
              🏠 Back to Home
            </GlowButton>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  /* ================= QUIZ SCREEN ================= */
  const q = session?.questions[currentIndex];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-indigo-900 to-cyan-900 text-white p-6 overflow-auto relative">
      <BackgroundParticles />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-cyan-500/30"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-cyan-400 font-bold">
              Question {currentIndex + 1} / {session?.questions?.length}
            </span>
          </motion.div>
          
          <div className="flex gap-3">
  {/* INFO BUTTON */}
  <motion.button
    onClick={() => setShowInfo(true)}
    className="w-12 h-12 bg-cyan-500/20 hover:bg-cyan-500/40 rounded-xl border border-cyan-500/50 flex items-center justify-center text-xl"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    ℹ️
  </motion.button>

  {/* CLOSE BUTTON */}
  <motion.button
    onClick={onClose}
    className="w-12 h-12 bg-red-500/20 hover:bg-red-500/40 rounded-xl border border-red-500/50 flex items-center justify-center text-2xl"
    whileHover={{ scale: 1.1, rotate: 90 }}
    whileTap={{ scale: 0.9 }}
  >
    ✕
  </motion.button>
</div>

        </motion.div>

        {/* Progress Bar */}
        <ProgressBar current={currentIndex + 1} total={session?.questions?.length || 1} />

        {/* Error Display */}
        {error && <ErrorDisplay error={error} />}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <GameLoader />
          </div>
        )}

        {/* Question Content */}
        {q && (
          <AnimatePresence mode="wait">
            <motion.div
              key={q.qid}
              initial={{ opacity: 0, x: 100, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -100, rotateY: 15 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-cyan-500/30"
            >
              <motion.h2
                className="text-2xl font-bold mb-6 text-cyan-100"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {q.question}
              </motion.h2>

              {/* Main Question Options */}
              <motion.div
                className="space-y-3 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {OPTIONS.map((k, index) => (
                  <motion.div
                    key={k}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Option
                      label={k}
                      text={q[`option_${k.toLowerCase()}`]}
                      selected={getSelected(q.qid) === k}
                      onClick={() => saveAnswer(q.qid, k)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Sub Questions */}
              {q.sub_questions?.map((sq, sqIndex) => (
                <motion.div
                  key={sq.sub_id}
                  className="mt-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border-l-4 border-l-purple-400"
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + sqIndex * 0.2 }}
                >
                  <motion.div
                    className="flex items-center mb-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 + sqIndex * 0.2 }}
                  >
                    <div className="bg-purple-600 px-3 py-1 rounded-full text-sm font-bold mr-4">
                      {sq.type.toUpperCase()}
                    </div>
                    <div className="h-px bg-gradient-to-r from-purple-400 to-transparent flex-1" />
                  </motion.div>
                  
                  <motion.p
                    className="mb-4 text-purple-100 font-medium"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.0 + sqIndex * 0.2 }}
                  >
                    {sq.question}
                  </motion.p>
                  
                  <div className="space-y-3 ml-4">
                    {OPTIONS.map((k, optIndex) => (
                      <motion.div
                        key={k}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.1 + sqIndex * 0.2 + optIndex * 0.05 }}
                      >
                        <Option
                          label={k}
                          text={sq[`option_${k.toLowerCase()}`]}
                          selected={getSelected(q.qid, sq.type) === k}
                          onClick={() => saveAnswer(q.qid, k, sq.type)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Navigation */}
        {session && (
          <motion.div
            className="flex justify-between items-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <GlowButton
              disabled={currentIndex === 0 || loading}
              onClick={() => setCurrentIndex((i) => i - 1)}
              variant="secondary"
              className="px-8 py-3"
            >
              ← Previous
            </GlowButton>

            {currentIndex === session.questions.length - 1 ? (
              <GlowButton
                onClick={submitQuiz}
                disabled={loading}
                variant="success"
                className="px-8 py-3 text-lg"
              >
                {loading ? "🔄 Submitting..." : "🎯 Submit Quiz"}
              </GlowButton>
            ) : (
              <GlowButton
                onClick={() => setCurrentIndex((i) => i + 1)}
                disabled={loading}
                variant="primary"
                className="px-8 py-3"
              >
                Next →
              </GlowButton>
            )}
          </motion.div>
        )}
      </div>
      

{/* <AnimatePresence>
  {showInfo && (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-auto border border-cyan-500/40"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-400">
            📘 Concept Raw JSON
          </h2>
          <button
            onClick={() => setShowInfo(false)}
            className="text-red-400 text-xl"
          >
            ✕
          </button>
        </div>

        <pre className="bg-gray-800 p-4 rounded-lg text-sm text-green-300 overflow-auto">
          {JSON.stringify(meta, null, 2)}
        </pre>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence> */}
<AnimatePresence>
  {showInfo && (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                   rounded-3xl p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto 
                   border border-cyan-500/30 shadow-2xl shadow-cyan-500/20"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-cyan-400 tracking-wide">
              🧬 Intelligence Matrix
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {meta?.meta?.chapter} • {meta?.meta?.syllabus_level}
            </p>
          </div>
          <button
            onClick={() => setShowInfo(false)}
            className="text-red-400 text-2xl hover:scale-110 transition"
          >
            ✕
          </button>
        </div>

        {/* Concept Description */}
        {meta?.meta?.concept && (
          <div className="mb-8 p-5 rounded-xl bg-gray-800 border border-cyan-500/20">
            <h3 className="text-lg text-cyan-300 font-semibold mb-2">
              🌌 Concept Overview
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {meta.meta.concept}
            </p>
          </div>
        )}

        {/* Dynamic Layers */}
        {Object.entries(meta || {})
          .filter(([key, value]) => key !== "meta" && Array.isArray(value))
          .map(([key, value], index) => {
            const colors = [
              "border-purple-500/30 text-purple-300",
              "border-yellow-500/30 text-yellow-300",
              "border-green-500/30 text-green-300",
              "border-pink-500/30 text-pink-300",
              "border-blue-500/30 text-blue-300",
            ];

            const colorClass = colors[index % colors.length];

            const formattedTitle = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase());

            return (
              <div key={key} className="mb-8">
                <h3 className={`text-xl font-bold mb-4 ${colorClass.split(" ")[1]}`}>
                  ✨ {formattedTitle}
                </h3>

                <div className="grid gap-4">
                  {value.map((item, i) => (
                    <div
                      key={i}
                      className={`bg-gray-800 p-4 rounded-xl border ${colorClass.split(" ")[0]}`}
                    >
                      {Object.entries(item).map(([k, v]) => (
                        <p
                          key={k}
                          className="text-gray-300 text-sm mb-1"
                        >
                          <span className="text-gray-500 capitalize">
                            {k.replace(/_/g, " ")}:
                          </span>{" "}
                          {v}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
}
