// src/components/Analysis/AnalysisModal.jsx
import React, { useEffect, useState } from "react";
import progressApi from "../../api/progressApi";
import MasteryGraph from "./MasteryGraph";
import QuestionReview from "./QuestionReview";

const AnalysisModal = ({ conceptId, onClose }) => {
  const [progress, setProgress] = useState(null);
  const [history, setHistory] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    fetchData();
  }, [conceptId]);

  const fetchData = async () => {
    try {
      const prog = await progressApi.getConceptProgress(conceptId);
      const hist = await progressApi.getConceptHistory(conceptId);
      setProgress(prog);
      setHistory(hist);
      if (hist?.sessions?.length) setSelectedSession(hist.sessions[0]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!progress || !history) return <div>Loading analysis...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Concept Analysis</h2>

        <div className="mb-4">
          <p>
            <strong>Current Mastery:</strong>{" "}
            {(progress.computed_mastery * 100).toFixed(1)}%
          </p>
          <p>
            <strong>Last Practiced:</strong>{" "}
            {new Date(progress.last_practiced).toLocaleString()}
          </p>
        </div>

        <MasteryGraph history={history.records} />

        <h3 className="mt-6 mb-2 font-semibold">Quiz Sessions</h3>
        <div className="flex space-x-2 overflow-x-auto mb-4">
          {history.sessions.map((s) => (
            <button
              key={s.session_id}
              className={`px-3 py-1 rounded border ${
                selectedSession?.session_id === s.session_id
                  ? "bg-blue-200 border-blue-500"
                  : "bg-gray-100"
              }`}
              onClick={() => setSelectedSession(s)}
            >
              {new Date(s.created_at).toLocaleDateString()}
            </button>
          ))}
        </div>

        {selectedSession && (
          <QuestionReview session={selectedSession} />
        )}
      </div>
    </div>
  );
};

export default AnalysisModal;
