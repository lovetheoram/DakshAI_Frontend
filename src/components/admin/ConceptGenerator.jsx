import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

export default function ConceptGenerator() {
  const [concepts, setConcepts] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [selectedConcept, setSelectedConcept] = useState("");

  const [loadingMeta, setLoadingMeta] = useState(false);
  const [loadingQ, setLoadingQ] = useState(false);

  useEffect(() => {
    adminApi.getConceptList().then(setConcepts);
  }, []);

  // ✅ Unique Subjects
  const subjects = [
    ...new Map(
      concepts.map((c) => [
        c.subject_id,
        { id: c.subject_id, name: c.subject_name },
      ])
    ).values(),
  ];

  // ✅ Unique Topics (filtered by subject)
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

  // ✅ Unique Subtopics (filtered by topic)
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

  // ✅ Concepts filtered by subtopic (already unique by id)
  const filteredConcepts = concepts.filter(
    (c) => c.subtopic_id === Number(selectedSubtopic)
  );

  const selectedConceptObj = concepts.find(
    (c) => c.id === Number(selectedConcept)
  );

  // ✅ Reset lower selections when parent changes
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
      await adminApi.generateMeta(
        selectedConceptObj.id,
        selectedConceptObj.topic_name
      );
      alert("Meta generated");
    } catch (err) {
      alert("Meta generation failed");
    } finally {
      setLoadingMeta(false);
    }
  };

  const handleQuestions = async () => {
    if (!selectedConceptObj) return;

    try {
      setLoadingQ(true);
      await adminApi.generateQuestions(selectedConceptObj.id);
      alert("Questions generated");
    } catch (err) {
      alert("Question generation failed");
    } finally {
      setLoadingQ(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        {/* Subject */}
        <select
          value={selectedSubject}
          onChange={handleSubjectChange}
          className="border p-2"
        >
          <option value="">Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Topic */}
        <select
          value={selectedTopic}
          onChange={handleTopicChange}
          className="border p-2"
          disabled={!selectedSubject}
        >
          <option value="">Topic</option>
          {topics.map((t) => (
            <option key={t.topic_id} value={t.topic_id}>
              {t.topic_name}
            </option>
          ))}
        </select>

        {/* Subtopic */}
        <select
          value={selectedSubtopic}
          onChange={handleSubtopicChange}
          className="border p-2"
          disabled={!selectedTopic}
        >
          <option value="">Subtopic</option>
          {subtopics.map((s) => (
            <option key={s.subtopic_id} value={s.subtopic_id}>
              {s.subtopic_name}
            </option>
          ))}
        </select>

        {/* Concept */}
        <select
          value={selectedConcept}
          onChange={(e) => setSelectedConcept(e.target.value)}
          className="border p-2"
          disabled={!selectedSubtopic}
        >
          <option value="">Concept</option>
          {filteredConcepts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      {selectedConceptObj && (
        <div className="flex gap-4">
          <button
            onClick={handleMeta}
            disabled={loadingMeta}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loadingMeta ? "Generating..." : "Generate Meta"}
          </button>

          <button
            onClick={handleQuestions}
            disabled={loadingQ}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loadingQ ? "Generating..." : "Generate Questions"}
          </button>
        </div>
      )}
    </div>
  );
}