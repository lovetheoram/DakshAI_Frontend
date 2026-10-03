// src/components/learn/AIEngineeringDreamPage.jsx
import React from "react";
import ExamReadinessDreamPage, { DEFAULT_AI_ENGINEERING_SERIES } from "./ExamReadinessDreamPage";
import hindiInterviewData from "../../data/AI_Engineering_Interview_Bank_2026_Hindi_Interview.json";

export default function AIEngineeringDreamPage({ onBack }) {
  const scenesList = (hindiInterviewData && hindiInterviewData.scenes && hindiInterviewData.scenes.length > 0)
    ? hindiInterviewData.scenes
    : DEFAULT_AI_ENGINEERING_SERIES;

  return (
    <ExamReadinessDreamPage
      subjectName="AI Engineering"
      examTitle="GenAI Production Engineering & Architecture"
      lessons={scenesList}
      onBack={onBack}
    />
  );
}
