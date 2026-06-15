// src/components/Quiz/Timer.jsx
import React, { useEffect } from "react";

const Timer = ({ duration, setDuration }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [setDuration]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return <div className="mb-2 font-mono text-gray-600">Time: {formatTime(duration)}</div>;
};

export default Timer;
