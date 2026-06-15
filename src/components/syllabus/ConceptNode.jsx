// src/components/Syllabus/ConceptNode.jsx
import React from "react";

const ConceptNode = ({ concept }) => {
  const { name, mastery } = concept;

  return (
    <div className="border-l-2 border-gray-200 pl-4 my-1 flex justify-between items-center">
      <div className="text-gray-700 hover:text-green-500 cursor-pointer">
        {name}
      </div>
      <div className="text-sm text-gray-500">
        Mastery: {(mastery * 100).toFixed(0)}%
      </div>
    </div>
  );
};

export default ConceptNode;
