// src/components/learn/AIEngineeringDreamPage.jsx
import React from "react";
import ExamReadinessDreamPage, { DEFAULT_AI_ENGINEERING_SERIES } from "./ExamReadinessDreamPage";
import aiEngineeringScenes from "../../data/ai_engineering_vocal_scenes.json";

export default function AIEngineeringDreamPage({ onBack }) {
  const scenesList = (aiEngineeringScenes && aiEngineeringScenes.scenes && aiEngineeringScenes.scenes.length > 0)
    ? aiEngineeringScenes.scenes
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
