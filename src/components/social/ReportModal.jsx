import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, X, Check, Loader2 } from "lucide-react";
import socialApi from "../../api/socialApi";

const REASONS = [
  "Spam, commercial promotion, or automated bots",
  "Harassment, hate speech, or bullying",
  "Incorrect or dangerous information",
  "Exposure of private personal information",
  "Plagiarism or intellectual property violation",
  "Other policy violation",
];

export default function ReportModal({ isOpen, onClose, targetType, targetId, targetTitle }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await socialApi.submitReport({
        target_type: targetType,
        target_id: targetId,
        reason,
        details: details.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setDetails("");
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Failed to submit report:", err);
      setError(err.response?.data?.detail || "Could not submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
        <div className="fixed inset-0" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative max-w-md w-full bg-white dark:bg-zinc-900 border border-[var(--color-border)] rounded-3xl p-6 shadow-2xl z-10 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <ShieldAlert size={20} />
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Report Content</h3>
            </div>
            <button onClick={onClose} className="text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)]">
              <X size={16} />
            </button>
          </div>

          {error && <div className="p-2.5 rounded-xl bg-red-500/10 text-xs text-red-600">{error}</div>}
          {success ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-2">
              <Check size={16} /> Report submitted. Our moderation team will review this promptly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <p className="text-xs text-[var(--color-text-secondary)]">
                Reporting: <strong className="text-[var(--color-text-primary)]">{targetTitle || `${targetType} #${targetId}`}</strong>
              </p>

              <div>
                <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
                  Reason for report
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-transparent text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)]"
                >
                  {REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
                  Additional Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide context for our review team..."
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-transparent text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors shadow-xs flex items-center gap-1.5"
                >
                  {submitting ? <Loader2 size={13} className="animate-spin" /> : "Submit Report"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
