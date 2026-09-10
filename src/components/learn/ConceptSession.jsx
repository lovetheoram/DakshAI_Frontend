// src/components/learn/ConceptSession.jsx
// Concept & Formula Study Instrument — 100% Ivory + Ink + Antique Gold identity.

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import progressApi from "../../api/progressApi";
import syllabusApi from "../../api/syllabusApi";
import socialApi from "../../api/socialApi";
import SkeletonLoader from "../ui/SkeletonLoader";
import { getMasteryPercent } from "../../pages/LearnPage";
import EventTracker from "../../intelligence/events/EventTracker";

import ConceptHeaderHero from "./ConceptHeaderHero";
import ConceptTabNav from "./ConceptTabNav";
import ConceptLearnSection from "./ConceptLearnSection";
import ConceptPracticeSection from "./ConceptPracticeSection";
import ConceptProgressSection from "./ConceptProgressSection";
import BeyondConceptSection from "./BeyondConceptSection";

export default function ConceptSession({ conceptId }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("learn");
  const [concept, setConcept] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formulas, setFormulas] = useState([]);
  const [rules, setRules] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [aiMeta, setAiMeta] = useState({});
  const [subtopicId, setSubtopicId] = useState(null);

  const fetchConceptData = async () => {
    try {
      setLoading(true);
      const [progressData, detailedConceptRes, conceptList] = await Promise.all([
        progressApi.getConcept(conceptId).catch(() => ({})),
        syllabusApi.getConceptDetail(conceptId).catch(() => null),
        syllabusApi.getConceptList().catch(() => []),
      ]);

      const foundMeta = (Array.isArray(conceptList) ? conceptList : conceptList?.concepts || []).find(
        (c) => c.id === Number(conceptId)
      );

      const targetConcept = detailedConceptRes || foundMeta;

      if (targetConcept) {
        let meta = targetConcept.ai_meta || {};
        let desc = targetConcept.description || "";
        let sId = targetConcept.subtopic_id;
        let conceptPyqs = targetConcept.pyqs || [];

        setAiMeta(meta);
        setFormulas(meta.layer_1_hard_formulas || []);
        setRules(meta.layer_2_rule_based_logics || []);
        setPyqs(conceptPyqs);
        if (sId) setSubtopicId(sId);

        const examReadiness = typeof progressData?.exam_readiness === "number"
          ? progressData.exam_readiness
          : typeof targetConcept?.raw_mastry?.[0] === "number"
          ? targetConcept.raw_mastry[0]
          : 0;

        const chapterUnderstanding = typeof progressData?.chapter_understanding === "number"
          ? progressData.chapter_understanding
          : typeof targetConcept?.raw_mastry?.[1] === "number"
          ? targetConcept.raw_mastry[1]
          : 0;

        const masteryArray = progressData?.mastery || targetConcept?.mastery || [examReadiness, chapterUnderstanding];

        const conceptObj = {
          name: targetConcept.name || "Concept",
          chapter_name: targetConcept.subtopic_name || targetConcept.topic_name || targetConcept.subject_name || "Syllabus Topic",
          exam_readiness: examReadiness,
          chapter_understanding: chapterUnderstanding,
          mastery: masteryArray,
          last_practiced: progressData?.last_practiced || targetConcept?.last_practiced || null,
          total_questions_solved: progressData?.total_questions_solved || 0,
          description: desc || `${targetConcept.name} is a key concept under ${targetConcept.subtopic_name || "this topic"}.`,
        };
        setConcept(conceptObj);
        EventTracker.conceptStarted(conceptId, conceptObj.name, conceptObj.chapter_name);

      } else {
        setConcept({
          name: "Concept Space",
          chapter_name: "Syllabus Topic",
          exam_readiness: 0,
          chapter_understanding: 0,
          mastery: [0, 0],
          last_practiced: null,
          total_questions_solved: 0,
          description: "Concept details loading from syllabus database...",
        });
      }
    } catch (err) {
      console.error("Failed to fetch concept progress:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConceptData();
    socialApi.pingSession("reading", conceptId).catch(() => {});

    return () => {
      socialApi.pingSession(null).catch(() => {});
    };
  }, [conceptId]);

  const handleStartQuiz = (numQuestions = 5, quizType = "PYQS") => {
    navigate(`/quiz/${conceptId}?q=${numQuestions}&type=${quizType}`);
  };

  if (loading) {
    return <SkeletonLoader lines={6} avatar />;
  }

  const masteryPercent = concept ? getMasteryPercent(concept.mastery) : 0;

  return (
    <div className="space-y-6 select-none pb-12">
      {/* 1. Header Hero */}
      <ConceptHeaderHero
        conceptName={concept?.name}
        chapterName={concept?.chapter_name}
        masteryPercent={masteryPercent}
        onContinue={() => setActiveTab("practice")}
      />

      {/* 2. Sleek Tab Navigation */}
      <ConceptTabNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* 3. Main Views */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === "learn" && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <ConceptLearnSection
                conceptName={concept?.name}
                chapterName={concept?.chapter_name}
                description={concept?.description}
                formulas={formulas}
                rules={rules}
                pyqs={pyqs}
                aiMeta={aiMeta}
                onStartPractice={() => setActiveTab("practice")}
              />
            </motion.div>
          )}

          {activeTab === "practice" && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <ConceptPracticeSection onStartQuiz={handleStartQuiz} />
            </motion.div>
          )}

          {activeTab === "progress" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <ConceptProgressSection
                examMastery={concept?.exam_readiness ?? 0}
                chapterMastery={concept?.chapter_understanding ?? 0}
                lastPracticed={concept?.last_practiced}
                questionsSolved={concept?.total_questions_solved}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Beyond This Concept */}
      <BeyondConceptSection conceptName={concept?.name} chapterName={concept?.chapter_name} />
    </div>
  );
}
