import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { Sparkles, Brain, Check, AlertTriangle, FileJson, Eye, RefreshCw } from "lucide-react";
import Modal from "../ui/Modal";

export default function ConceptGenerator() {
  const [concepts, setConcepts] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [selectedConcept, setSelectedConcept] = useState("");

  const [loadingMeta, setLoadingMeta] = useState(false);
  const [loadingQ, setLoadingQ] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState(false);
  const [showMetaModal, setShowMetaModal] = useState(false);

  const fetchConcepts = async () => {
    try {
      const res = await adminApi.getConceptList();
      setConcepts(Array.isArray(res) ? res : res?.concepts || []);
    } catch (err) {
      console.error("Failed to load concepts:", err);
    }
  };

  useEffect(() => {
    fetchConcepts();
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

  const hasMeta = Boolean(
    selectedConceptObj &&
    selectedConceptObj.ai_meta &&
    typeof selectedConceptObj.ai_meta === "object" &&
    Object.keys(selectedConceptObj.ai_meta).length > 0
  );

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedTopic("");
    setSelectedSubtopic("");
    setSelectedConcept("");
    setStatusMessage("");
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    setSelectedSubtopic("");
    setSelectedConcept("");
    setStatusMessage("");
  };

  const handleSubtopicChange = (e) => {
    setSelectedSubtopic(e.target.value);
    setSelectedConcept("");
    setStatusMessage("");
  };

  const handleConceptChange = (e) => {
    setSelectedConcept(e.target.value);
    setStatusMessage("");
  };

  const handleMeta = async () => {
    if (!selectedConceptObj) return;

    try {
      setLoadingMeta(true);
      setStatusError(false);
      setStatusMessage("Generating concept meta via LLM...");
      await adminApi.generateMeta(
        selectedConceptObj.id,
        selectedConceptObj.topic_name
      );
      setStatusMessage("Meta generation started in background. Refreshing concept status...");
      
      // Wait briefly for task initiation then refresh concept data
      await new Promise((r) => setTimeout(r, 1500));
      await fetchConcepts();
      setStatusMessage("Concept meta generation complete!");
    } catch (err) {
      setStatusError(true);
      setStatusMessage("Meta generation failed. Check backend logs.");
    } finally {
      setLoadingMeta(false);
    }
  };

  const handleQuestions = async () => {
    if (!selectedConceptObj) return;

    if (!hasMeta) {
      setStatusError(true);
      setStatusMessage("There is no metadata for this concept. Please generate concept metadata first!");
      return;
    }

    try {
      setLoadingQ(true);
      setStatusError(false);
      setStatusMessage("Generating practice questions...");
      await adminApi.generateQuestions(selectedConceptObj.id);
      setStatusMessage("Practice questions generated successfully!");
    } catch (err) {
      const errMsg = err.response?.data?.error || "Question generation failed.";
      setStatusError(true);
      setStatusMessage(`Question generation failed: ${errMsg}`);
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
            onChange={handleConceptChange}
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

      {/* Concept Metadata Status Badge */}
      {selectedConceptObj && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Metadata Status:</span>
            {hasMeta ? (
              <button
                onClick={() => setShowMetaModal(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all cursor-pointer"
                title="Click to view concept metadata JSON"
              >
                <FileJson size={14} />
                <span>Metadata Available (Click to View)</span>
                <Eye size={12} className="ml-1 opacity-70" />
              </button>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                <AlertTriangle size={14} />
                <span>No Metadata ({`{}`})</span>
              </span>
            )}
          </div>

          <button
            onClick={fetchConcepts}
            className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Refresh concept data"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      )}

      {/* Status Alert Message */}
      {statusMessage && (
        <div
          className={`p-3 rounded-xl text-xs font-bold flex items-start gap-2 border ${
            statusError
              ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
              : "bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30 text-[var(--color-gold-dark)]"
          }`}
        >
          {statusError ? (
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          ) : (
            <Check size={16} className="shrink-0 mt-0.5" />
          )}
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
            className={`px-5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
              hasMeta
                ? "border-[var(--color-border)] bg-white dark:bg-gray-800 hover:border-[var(--color-gold)] text-[var(--color-text-primary)]"
                : "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Brain size={14} className={hasMeta ? "text-[var(--color-gold)]" : "text-gray-400"} />
            <span>{loadingQ ? "Generating Questions..." : "Generate Practice Questions"}</span>
          </button>
        </div>
      )}

      {/* Metadata JSON Modal */}
      <Modal
        isOpen={showMetaModal}
        onClose={() => setShowMetaModal(false)}
        title={`Concept Metadata: ${selectedConceptObj?.name || ""}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-3 select-text">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] border-b border-[var(--color-border)] pb-2">
            <span>Concept ID: #{selectedConceptObj?.id}</span>
            <span>Subject: {selectedConceptObj?.subject_name}</span>
          </div>

          <div className="max-h-[60vh] overflow-auto rounded-xl bg-slate-950 p-4 border border-slate-800">
            <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap break-words leading-relaxed">
              {selectedConceptObj?.ai_meta
                ? JSON.stringify(selectedConceptObj.ai_meta, null, 2)
                : "{}"}
            </pre>
          </div>
        </div>
      </Modal>
    </div>
  );
}