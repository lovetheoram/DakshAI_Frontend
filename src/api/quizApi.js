// src/api/quizApi.js
// Clean Quiz API service

import axiosClient from "./axiosClient";

const API_BASE = axiosClient.defaults.baseURL;

const quizApi = {
  // ===================================
  // START QUIZ (NORMAL - NON STREAMING)
  // ===================================
  start: async ({
    concept_id,
    subtopic_id,
    num_questions = 5,
    quiz_type = "PYQS",
  }) => {
    const res = await axiosClient.post("/api/quiz/start/", {
      concept_id,
      subtopic_id,
      num_questions,
      quiz_type,
    });

    return res.data;
  },

  // ===================================
  // START QUIZ (STREAMING - AI)
  // ===================================
  startStreaming: ({
    concept_id,
    num_questions = 2,
    quiz_type = "NEW",
    onEvent,
    onError,
    onClose,
  }) => {
    const token = localStorage.getItem("access_token");

    const params = new URLSearchParams({
      concept_id,
      num_questions,
      quiz_type,
      token,
    });

    const url = `${API_BASE}/api/quiz/startAI/?${params.toString()}`;
    const es = new EventSource(url);

    es.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        onEvent?.(event);

        if (event.type === "done") {
          es.close();
          onClose?.();
        }
      } catch (err) {
        console.error("[SSE] Failed to parse event:", e.data);
      }
    };

    es.onerror = (err) => {
      console.error("[SSE] Error", err);
      es.close();
      onError?.(err);
    };

    return () => {
      es.close();
    };
  },

  // ===================================
  // SUBMIT QUIZ
  // ===================================
  submit: async ({
    session_id,
    duration_seconds,
    answers,
  }) => {
    const res = await axiosClient.post("/api/quiz/submit/", {
      session_id,
      duration_seconds,
      answers,
    });

    return res.data;
  },
};

export default quizApi;
