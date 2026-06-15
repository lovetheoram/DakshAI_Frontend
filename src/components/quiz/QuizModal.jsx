// src/components/Quiz/QuizModal.jsx
import React, { useState, useEffect } from "react";
import syllabusApi from "../../api/syllabusApi"; // optional if you want concept info
import axiosClient from "../../api/axiosClient";
import QuestionCard from "./QuestionCard";
import Timer from "./Timer";
import QuizSettings from "./QuizSettings";

const QuizModal = ({ conceptId, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [duration, setDuration] = useState(0); // seconds
  const [quizSession, setQuizSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startQuiz();
  }, []);

  const startQuiz = async () => {
    try {
      const resp = await axiosClient.post("/api/quiz/start/", {
        concept_id: conceptId,
        num_questions: 5,
        mode: "fresh",
      });
      setQuestions(resp.data.questions);
      setQuizSession(resp.data.session_id);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, optionIndex) => {
    const newAnswers = answers.filter((a) => a.question_id !== questionId);
    newAnswers.push({ question_id: questionId, marked_option: optionIndex });
    setAnswers(newAnswers);
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const submitQuiz = async () => {
    try {
      const resp = await axiosClient.post("/api/quiz/submit/", {
        session_id: quizSession,
        duration_seconds: duration,
        answers: answers,
      });
      alert(`Quiz submitted! Score: ${resp.data.score}`);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading quiz...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Quiz</h2>
        <Timer duration={duration} setDuration={setDuration} />
        <div className="mb-4">
          <QuestionCard
            question={questions[currentIndex]}
            onAnswer={handleAnswer}
          />
        </div>
        <div className="flex justify-between">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          {currentIndex === questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
