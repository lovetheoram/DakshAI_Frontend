// src/components/learn/ConceptSession.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import progressApi from "../../api/progressApi";
import syllabusApi from "../../api/syllabusApi";
import socialApi from "../../api/socialApi";
import SkeletonLoader from "../ui/SkeletonLoader";
import { getMasteryPercent } from "../../pages/LearnPage";

import ConceptHeaderHero from "./ConceptHeaderHero";
import ConceptTabNav from "./ConceptTabNav";
import ConceptLearnSection from "./ConceptLearnSection";
import ConceptPracticeSection from "./ConceptPracticeSection";
import ConceptProgressSection from "./ConceptProgressSection";
import ConceptHistorySection from "./ConceptHistorySection";
import BeyondConceptSection from "./BeyondConceptSection";

export default function ConceptSession({ conceptId }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("practice");
  const [concept, setConcept] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lazy loaded formulas & history data
  const [formulas, setFormulas] = useState([]);
  const [rules, setRules] = useState([]);
  const [aiMeta, setAiMeta] = useState({});
  const [subtopicId, setSubtopicId] = useState(null);

  const [historyRecords, setHistoryRecords] = useState([]);
  const [historySummary, setHistorySummary] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

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

        // If formulas or rules are not in meta, try subtopic concepts endpoint
        if (!meta.layer_1_hard_formulas && sId) {
          try {
            const subConcepts = await syllabusApi.getSubtopicConcepts(sId);
            const match = subConcepts.find((c) => c.id === Number(conceptId));
            if (match) {
              if (match.ai_meta) meta = match.ai_meta;
              if (match.description) desc = match.description;
            }
          } catch (e) {
            console.error("Error fetching subtopic concepts:", e);
          }
        }

        setAiMeta(meta);
        setFormulas(meta.layer_1_hard_formulas || []);
        setRules(meta.layer_2_rule_based_logics || []);
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

        setConcept({
          name: targetConcept.name || "Concept",
          chapter_name: targetConcept.subtopic_name || targetConcept.topic_name || targetConcept.subject_name || "Syllabus Topic",
          exam_readiness: examReadiness,
          chapter_understanding: chapterUnderstanding,
          mastery: masteryArray,
          last_practiced: progressData?.last_practiced || targetConcept?.last_practiced || null,
          total_questions_solved: progressData?.total_questions_solved || 0,
          description: desc || `${targetConcept.name} is a key concept under ${targetConcept.subtopic_name || "this topic"}.`,
        });
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

  // Load history records lazily
  const handleLoadHistory = async () => {
    if (historyLoaded) return;
    try {
      setLoadingHistory(true);
      const res = await progressApi.getHistory(conceptId);
      setHistorySummary(res.summary || null);
      setHistoryRecords(res.records || res.history || []);
      setHistoryLoaded(true);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Launch quiz mode
  const handleStartQuiz = (numQuestions = 5, quizType = "PYQS") => {
    navigate(`/quiz/${conceptId}?q=${numQuestions}&type=${quizType}`);
  };

  if (loading) {
    return <SkeletonLoader lines={6} avatar />;
  }

  const masteryPercent = concept ? getMasteryPercent(concept.mastery) : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Header Hero with dynamic visual identity */}
      <ConceptHeaderHero
        conceptName={concept?.name}
        chapterName={concept?.chapter_name}
        masteryPercent={masteryPercent}
        onContinue={() => setActiveTab("practice")}
      />

      {/* 2. Sleek 4-Tab Navigation */}
      <ConceptTabNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* 3. Main Section Views */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "learn" && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ConceptLearnSection
                conceptName={concept?.name}
                chapterName={concept?.chapter_name}
                description={concept?.description}
                formulas={formulas}
                rules={rules}
                aiMeta={aiMeta}
                onStartPractice={() => setActiveTab("practice")}
              />
            </motion.div>
          )}

          {activeTab === "practice" && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ConceptPracticeSection onStartQuiz={handleStartQuiz} />
            </motion.div>
          )}

          {activeTab === "progress" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ConceptProgressSection
                examMastery={concept?.exam_readiness ?? 0}
                chapterMastery={concept?.chapter_understanding ?? 0}
                lastPracticed={concept?.last_practiced}
                questionsSolved={concept?.total_questions_solved}
                historySummary={historySummary}
              />
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ConceptHistorySection
                historyRecords={historyRecords}
                summary={historySummary}
                loading={loadingHistory}
                onLoadHistory={handleLoadHistory}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Curiosity Layer / Beyond This Concept */}
      <BeyondConceptSection conceptName={concept?.name} chapterName={concept?.chapter_name} />
    </div>
  );
}
