import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { Sparkles, Brain, Check } from "lucide-react";

export default function ConceptGenerator() {
  const [concepts, setConcepts] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [selectedConcept, setSelectedConcept] = useState("");

  const [loadingMeta, setLoadingMeta] = useState(false);
  const [loadingQ, setLoadingQ] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    adminApi.getConceptList().then((res) => {
      setConcepts(Array.isArray(res) ? res : res?.concepts || []);
    }).catch(() => setConcepts([]));
  }, []);

  // Unique Subjects
  const subjects = [
    ...new Map(
      concepts.map((c) => [
        c.subject_id,
        { id: c.subject_id, name: c.subject_name },
      ])
    ).values(),
  ];

  // Unique Topics (filtered by subject)
  const topics = [
    ...new Map(
      concepts
        .filter((c) => c.subject_id === Number(selectedSubject))
        .map((c) => [
          c.topic_id,
          { topic_id: c.topic_id, topic_name: c.topic_name },
        ])
    ).values(),
  ];

  // Unique Subtopics (filtered by topic)
  const subtopics = [
    ...new Map(
      concepts
        .filter((c) => c.topic_id === Number(selectedTopic))
        .map((c) => [
          c.subtopic_id,
          { subtopic_id: c.subtopic_id, subtopic_name: c.subtopic_name },
        ])
    ).values(),
  ];

  // Concepts filtered by subtopic
  const filteredConcepts = concepts.filter(
    (c) => c.subtopic_id === Number(selectedSubtopic)
  );

  const selectedConceptObj = concepts.find(
    (c) => c.id === Number(selectedConcept)
  );

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedTopic("");
    setSelectedSubtopic("");
    setSelectedConcept("");
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    setSelectedSubtopic("");
    setSelectedConcept("");
  };

  const handleSubtopicChange = (e) => {
    setSelectedSubtopic(e.target.value);
    setSelectedConcept("");
  };

  const handleMeta = async () => {
    if (!selectedConceptObj) return;

    try {
      setLoadingMeta(true);
      setStatusMessage("");
      await adminApi.generateMeta(
        selectedConceptObj.id,
        selectedConceptObj.topic_name
      );
      setStatusMessage("Concept meta generated successfully!");
    } catch (err) {
      setStatusMessage("Meta generation failed. Check backend logs.");
    } finally {
      setLoadingMeta(false);
    }
  };

  const handleQuestions = async () => {
    if (!selectedConceptObj) return;

    try {
      setLoadingQ(true);
      setStatusMessage("");
      await adminApi.generateQuestions(selectedConceptObj.id);
      setStatusMessage("Questions generated successfully!");
    } catch (err) {
      setStatusMessage("Question generation failed.");
    } finally {
      setLoadingQ(false);
    }
  };

  return (
    <div className="space-y-4 text-[var(--color-text-primary)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Subject */}
        <div>
          <label className="block text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Subject</label>
          <select
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="input-field py-2 text-xs"
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Topic</label>
          <select
            value={selectedTopic}
            onChange={handleTopicChange}
            className="input-field py-2 text-xs"
            disabled={!selectedSubject}
          >
            <option value="">Select Topic</option>
            {topics.map((t) => (
              <option key={t.topic_id} value={t.topic_id}>
                {t.topic_name}
              </option>
            ))}
          </select>
        </div>

        {/* Subtopic */}
        <div>
          <label className="block text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Subtopic</label>
          <select
            value={selectedSubtopic}
            onChange={handleSubtopicChange}
            className="input-field py-2 text-xs"
            disabled={!selectedTopic}
          >
            <option value="">Select Subtopic</option>
            {subtopics.map((s) => (
              <option key={s.subtopic_id} value={s.subtopic_id}>
                {s.subtopic_name}
              </option>
            ))}
          </select>
        </div>

        {/* Concept */}
        <div>
          <label className="block text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Target Concept</label>
          <select
            value={selectedConcept}
            onChange={(e) => setSelectedConcept(e.target.value)}
            className="input-field py-2 text-xs"
            disabled={!selectedSubtopic}
          >
            <option value="">Select Concept</option>
            {filteredConcepts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30 text-xs font-bold text-[var(--color-gold-dark)] flex items-center gap-1.5">
          <Check size={14} />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Action Buttons */}
      {selectedConceptObj && (
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleMeta}
            disabled={loadingMeta}
            className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={14} />
            <span>{loadingMeta ? "Generating Meta..." : "Generate Concept Meta"}</span>
          </button>

          <button
            onClick={handleQuestions}
            disabled={loadingQ}
            className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-gold)] text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Brain size={14} className="text-[var(--color-gold)]" />
            <span>{loadingQ ? "Generating Questions..." : "Generate Practice Questions"}</span>
          </button>
        </div>
      )}
    </div>
  );
}