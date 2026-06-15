// src/components/Syllabus/ExamNode.jsx
import React, { useState } from "react";
import SubjectNode from "./SubjectNode";

const ExamNode = ({ exam }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <div className="border-l-2 border-gray-300 pl-4 my-2">
      <div
        className="cursor-pointer font-bold text-lg hover:text-blue-500"
        onClick={toggleExpand}
      >
        {expanded ? "▼ " : "▶ "} {exam.name}
      </div>

      {expanded && exam.subjects?.length > 0 && (
        <div className="ml-4">
          {exam.subjects.map((subject) => (
            <SubjectNode key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamNode;
