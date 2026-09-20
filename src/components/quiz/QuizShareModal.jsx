// src/components/quiz/QuizShareModal.jsx
// Premium, tactile quiz attempt reflection & post modal — 100% Ivory + Ink + Antique Gold

import React, { useState } from "react";
import Modal from "../ui/Modal";
import socialApi from "../../api/socialApi";
import { Award, AlertCircle, Image as ImageIcon, X, Send, Sparkles, CheckCircle2, Lightbulb, Zap, HelpCircle } from "lucide-react";

const QUICK_CHIPS = [
  "💡 Draw diagram before solving",
  "⏱️ Watch time per question",
  "📐 Revise formula application",
  "⚡ Double check calculation",
  "📚 Re-read core theory notes",
];

export default function QuizShareModal({
  isOpen,
  onClose,
  conceptId,
  conceptName = "Concept Quiz",
  correctCount = 0,
  totalCount = 0,
  answersList = [],
  onPostCreated,
}) {
  const [takeaway, setTakeaway] = useState("");
  const [showMedia, setShowMedia] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const incorrectCount = totalCount - correctCount;
  const incorrectItems = answersList.filter((a) => !a.is_correct);
  const scorePct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  // Extract short struggled topic snippets cleanly
  const struggledTopics = incorrectItems.slice(0, 3).map((item, idx) => {
    if (item.question_text) {
      return item.question_text.length > 45
        ? item.question_text.substring(0, 42) + "..."
        : item.question_text;
    }
    return `Question ${idx + 1}`;
  });

  const handleChipClick = (chipText) => {
    setTakeaway((prev) => {
      if (!prev.trim()) return chipText;
      return `${prev}\n• ${chipText}`;
    });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleShare = async () => {
    if (!takeaway.trim() && images.length === 0) return;

    try {
      setSubmitting(true);
      setError(null);

      let uploadedImageUrls = [];
      if (images.length > 0) {
        for (const file of images) {
          const formData = new FormData();
          formData.append("file", file);
          const uploadRes = await socialApi.uploadMedia(formData);
          if (uploadRes && uploadRes.url) {
            uploadedImageUrls.push(uploadRes.url);
          }
        }
      }

      await socialApi.createPost({
        content: takeaway.trim(),
        concept: conceptId || null,
        source: "quiz",
        content_type: "learning",
        images: uploadedImageUrls,
        post_metadata: {
          score: `${correctCount} / ${totalCount}`,
          concept_name: conceptName,
          struggled_topics: struggledTopics,
          accuracy_pct: scorePct,
        },
      });

      if (onPostCreated) onPostCreated();
      setTakeaway("");
      setImages([]);
      setImagePreviews([]);
      setShowMedia(false);
      onClose();
    } catch (err) {
      console.error("Failed to share quiz takeaway:", err);
      setError("Failed to share post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Score color badge theme logic
  const getBadgeTheme = () => {
    if (scorePct >= 80) return "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300";
    if (scorePct >= 50) return "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300";
    return "bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Quiz Learning & Strategy" maxWidth="max-w-md">
      <div className="p-5 space-y-4 text-left">
        {/* Luxury Performance Header Summary Card */}
        <div className="p-4 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--color-gold-pale)] to-[var(--color-gold)]/20 text-[var(--color-gold-dark)] flex items-center justify-center shrink-0 border border-[var(--color-gold)]/30 shadow-xs">
                <Award size={20} />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black text-[var(--color-text-primary)] block truncate">
                  {conceptName}
                </span>
                <span className="text-[10px] text-[var(--color-mid-gray)] font-extrabold uppercase tracking-wider block">
                  Practice Attempt Metrics
                </span>
              </div>
            </div>

            {/* Score Ring / Pill */}
            <div className={`px-3 py-1.5 rounded-xl border text-right font-black shrink-0 ${getBadgeTheme()}`}>
              <span className="text-sm block leading-tight">{correctCount} / {totalCount}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider block opacity-80">{scorePct}% Accuracy</span>
            </div>
          </div>

          {/* Progress Bar Visual */}
          <div className="w-full bg-[var(--color-border)]/50 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] h-full transition-all duration-500"
              style={{ width: `${scorePct}%` }}
            />
          </div>

          {/* Struggled topics tags */}
          {struggledTopics.length > 0 && (
            <div className="pt-2 border-t border-[var(--color-border)] space-y-2">
              <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle size={13} className="text-amber-500" />
                Struggling key points from attempt:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {struggledTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 text-[11px] font-semibold leading-tight"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{topic}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reflection Input Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
              <Lightbulb size={14} className="text-[var(--color-gold-dark)]" />
              What did this attempt teach you?
            </label>
            <span className="text-[10px] text-[var(--color-mid-gray)] font-medium">
              Auto-attaches score & concept
            </span>
          </div>

          <textarea
            rows={3}
            value={takeaway}
            onChange={(e) => setTakeaway(e.target.value)}
            placeholder="Write a takeaway... (e.g. Next time I will draw FBD before solving force pairs...)"
            className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] focus:border-[var(--color-gold)] rounded-2xl p-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-mid-gray)] outline-none resize-none transition-all shadow-xs leading-relaxed"
          />

          {/* Quick Strategy Suggestion Chips */}
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-bold text-[var(--color-mid-gray)] uppercase tracking-wider block">
              Tap to add quick takeaway:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-primary)] hover:bg-[var(--color-gold-pale)]/50 border border-[var(--color-border)] hover:border-[var(--color-gold)]/40 text-[10px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Media Drawer Toggle */}
        {!showMedia ? (
          <button
            type="button"
            onClick={() => setShowMedia(true)}
            className="text-[11px] font-bold text-[var(--color-gold-dark)] hover:underline flex items-center gap-1.5 cursor-pointer pt-1"
          >
            <ImageIcon size={13} />
            <span>+ Attach diagram / screenshot (optional)</span>
          </button>
        ) : (
          <div className="p-3 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text-secondary)]">
              <span>Attached Diagrams & Images</span>
              <button
                type="button"
                onClick={() => setShowMedia(false)}
                className="text-[10px] text-rose-500 hover:underline cursor-pointer"
              >
                Hide
              </button>
            </div>

            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--color-border)] hover:border-[var(--color-gold)] rounded-xl text-xs font-semibold text-[var(--color-text-secondary)] cursor-pointer shadow-xs">
              <ImageIcon size={14} className="text-[var(--color-gold-dark)]" />
              <span>Choose Image</span>
              <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
            </label>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-1">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden aspect-square border border-[var(--color-border)]">
                    <img src={src} className="w-full h-full object-cover" alt="Preview" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full cursor-pointer hover:bg-rose-600 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {error && <p className="text-xs text-rose-500 font-bold">{error}</p>}

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleShare}
            disabled={submitting || (!takeaway.trim() && images.length === 0)}
            className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-40 cursor-pointer shadow-xs hover:brightness-105 active:scale-[0.98] transition-all"
          >
            <Send size={13} />
            <span>{submitting ? "Sharing..." : "Post Reflection"}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
