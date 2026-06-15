// src/components/Quiz/QuizSettings.jsx
import React, { useState } from "react";

const QuizSettings = ({ onStart }) => {
  const [numQuestions, setNumQuestions] = useState(5);
  const [mode, setMode] = useState("fresh");

  const startQuiz = () => {
    onStart({ numQuestions, mode });
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <div className="mb-2">
        <label className="mr-2">Number of Questions:</label>
        <input
          type="number"
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        />
      </div>
      <div className="mb-2">
        <label className="mr-2">Mode:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="fresh">Fresh</option>
          <option value="review">Review</option>
        </select>
      </div>
      <button
        onClick={startQuiz}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Start Quiz
      </button>
    </div>
  );
};

export default QuizSettings;
