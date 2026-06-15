// src/components/Analysis/MasteryGraph.jsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const MasteryGraph = ({ history }) => {
  // Transform API records to graph data
  const data = history.map((rec) => ({
    date: new Date(rec.timestamp).toLocaleDateString(),
    mastery: rec.score * 100, // convert to %
  }));

  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="mastery" stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MasteryGraph;
