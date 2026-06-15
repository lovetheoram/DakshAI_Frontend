// src/components/Analysis/QuestionReview.jsx
import React from "react";

const QuestionReview = ({ session }) => {
  return (
    <div>
      <h4 className="font-semibold mb-2">Session Review</h4>
      {session.questions.map((q) => (
        <div
          key={q.question_id}
          className="p-3 border rounded mb-2 bg-gray-50"
        >
          <p className="font-medium">{q.text}</p>
          <p>
            <strong>Your Answer:</strong> {q.marked_option}{" "}
            {q.is_correct ? (
              <span className="text-green-600 font-bold">✔</span>
            ) : (
              <span className="text-red-600 font-bold">✘</span>
            )}
          </p>
          {!q.is_correct && (
            <p>
              <strong>Correct Answer:</strong> {q.correct_option}
            </p>
          )}
          <p className="text-sm text-gray-600 mt-1">{q.explanation}</p>
        </div>
      ))}
    </div>
  );
};

export default QuestionReview;
