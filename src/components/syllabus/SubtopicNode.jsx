// src/components/Syllabus/SubtopicNode.jsx
import React, { useState } from "react";
import ConceptNode from "./ConceptNode";

const SubtopicNode = ({ subtopic }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-l-2 border-gray-200 pl-4 my-1">
      <div
        className="cursor-pointer hover:text-blue-200"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "▼ " : "▶ "} {subtopic.name}
      </div>

      {expanded &&
        subtopic.concepts?.map((concept) => (
          <ConceptNode key={concept.id} concept={concept} />
        ))}
    </div>
  );
};

export default SubtopicNode;
