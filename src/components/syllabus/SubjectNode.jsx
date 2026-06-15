// src/components/Syllabus/SubjectNode.jsx
import React, { useState } from "react";
import TopicNode from "./TopicNode";

const SubjectNode = ({ subject }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-l-2 border-gray-200 pl-4 my-1">
      <div
        className="cursor-pointer font-semibold hover:text-blue-400"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "▼ " : "▶ "} {subject.name}
      </div>

      {expanded &&
        subject.topics?.map((topic) => (
          <TopicNode key={topic.id} topic={topic} />
        ))}
    </div>
  );
};

export default SubjectNode;
