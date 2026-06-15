

// import axiosClient from "./axiosClient";

// const quizApi = {
//   // ===================================
//   // START QUIZ (NORMAL - NON STREAMING)
//   // ===================================
//   start: async ({
//     concept_id,
//     num_questions = 2,
//     quiz_type = "PYQS", // PYQS | NEW
//   }) => {
//     const res = await axiosClient.post("/api/quiz/start/", {
//       concept_id,
//       num_questions,
//       quiz_type,
//     });

//     return res.data;
//   },

//   // ===================================
//   // START QUIZ (STREAMING - AI)
//   // ===================================
//   startStreaming: async ({
//     concept_id,
//     num_questions = 2,
//     quiz_type = "NEW",
//     onEvent, // callback(event)
//   }) => {
//     const res = await fetch("/api/quiz/start/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify({
//         concept_id,
//         num_questions,
//         quiz_type,
//       }),
//     });

//     if (!res.body) {
//       throw new Error("Streaming not supported by browser");
//     }

//     const reader = res.body.getReader();
//     const decoder = new TextDecoder("utf-8");
//     let buffer = "";

//     while (true) {
//       const { value, done } = await reader.read();
//       if (done) break;

//       buffer += decoder.decode(value, { stream: true });

//       const lines = buffer.split("\n");
//       buffer = lines.pop(); // keep incomplete line

//       for (const line of lines) {
//         if (!line.trim()) continue;

//         try {
//           const event = JSON.parse(line);
//           onEvent?.(event);
//         } catch (err) {
//           console.error("Invalid stream chunk:", line);
//         }
//       }
//     }
//   },

//   // ===================================
//   // SUBMIT QUIZ
//   // ===================================
//   submit: async ({
//     session_id,
//     duration_seconds,
//     answers,
//   }) => {
//     const res = await axiosClient.post("/api/quiz/submit/", {
//       session_id,
//       duration_seconds,
//       answers,
//     });

//     return res.data;
//   },
// };

// export default quizApi;



import axiosClient from "./axiosClient";

// ✅ reuse axios baseURL
const API_BASE = axiosClient.defaults.baseURL;

const quizApi = {
  // ===================================
  // START QUIZ (NORMAL - NON STREAMING)
  // ===================================
  start: async ({
    concept_id,
    num_questions = 2,
    quiz_type = "PYQS",
  }) => {
    const res = await axiosClient.post("/api/quiz/start/", {
      concept_id,
      num_questions,
      quiz_type,
    });

    return res.data;
  },

  // ===================================
  // START QUIZ (STREAMING - AI) ✅ FIXED
  // ===================================
  // startStreaming: async ({
  //   concept_id,
  //   num_questions = 2,
  //   quiz_type = "NEW",
  //   onEvent,
  // }) => {
  //   const token = localStorage.getItem("access_token");

  //   const res = await fetch(`${API_BASE}/api/quiz/start/`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: token ? `Bearer ${token}` : "",
  //     },
  //     body: JSON.stringify({
  //       concept_id,
  //       num_questions,
  //       quiz_type,
  //     }),
  //   });

  //   if (!res.ok) {
  //     throw new Error(`Streaming failed with status ${res.status}`);
  //   }

  //   if (!res.body) {
  //     throw new Error("Streaming not supported by browser");
  //   }

  //   const reader = res.body.getReader();
  //   const decoder = new TextDecoder("utf-8");
  //   let buffer = "";

  //   while (true) {
  //     const { value, done } = await reader.read();
  //     if (done) break;

  //     buffer += decoder.decode(value, { stream: true });

  //     const lines = buffer.split("\n");
  //     buffer = lines.pop(); // keep incomplete line

  //     for (const line of lines) {
  //       if (!line.trim()) continue;

  //       try {
  //         const event = JSON.parse(line);
  //         onEvent?.(event);
  //       } catch {
  //         // ignore partial JSON
  //       }
  //     }
  //   }
  // },

//   startStreaming: async ({
//   concept_id,
//   num_questions = 2,
//   quiz_type = "NEW",
//   onEvent,
// }) => {
//   console.log("[SSE] startStreaming called");

//   const token = localStorage.getItem("access_token");

//   const res = await fetch(`${API_BASE}/api/quiz/start/`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//     body: JSON.stringify({
//       concept_id,
//       num_questions,
//       quiz_type,
//     }),
//   });

//   if (!res.ok) {
//     throw new Error(`Streaming failed with status ${res.status}`);
//   }

//   if (!res.body) {
//     throw new Error("Streaming not supported by browser");
//   }

//   const reader = res.body.getReader();
//   const decoder = new TextDecoder("utf-8");

//   let buffer = "";
//   let eventData = "";

//   while (true) {
//     const { value, done } = await reader.read();
//     if (done) {
//       console.log("[SSE] Stream closed");
//       break;
//     }

//     buffer += decoder.decode(value, { stream: true });

//     const lines = buffer.split("\n");
//     buffer = lines.pop(); // keep incomplete line

//     for (let line of lines) {
//       line = line.trim();

//       if (!line) continue;

//       // 🔥 SSE protocol: only lines starting with "data:"
//       if (line.startsWith("data:")) {
//         const payload = line.replace(/^data:\s*/, "");
//         eventData += payload;
//       }

//       // 🔥 End of one SSE message
//       if (line === "") {
//         if (!eventData) continue;

//         try {
//           const event = JSON.parse(eventData);
//           console.log("[SSE] Parsed event:", event);
//           onEvent?.(event);
//         } catch (err) {
//           console.warn("[SSE] JSON parse failed:", eventData);
//         }

//         eventData = "";
//       }
//     }
//   }
// },


startStreaming: ({
  concept_id,
  num_questions = 2,
  quiz_type = "NEW",
  onEvent,
  onError,
  onClose,
}) => {
  console.log("[SSE] startStreaming called");

  const token = localStorage.getItem("access_token");

  const params = new URLSearchParams({
    concept_id,
    num_questions,
    quiz_type,
    token, // or session cookie
  });

  const url = `${API_BASE}/api/quiz/startAI/?${params.toString()}`;

  const es = new EventSource(url);

  es.onmessage = (e) => {
    try {
      const event = JSON.parse(e.data);
      console.log("[SSE] Event received:", event);
      onEvent?.(event);

      if (event.type === "done") {
        console.log("[SSE] Done event received");
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
    console.log("[SSE] Manually closed");
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
