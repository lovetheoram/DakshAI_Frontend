// src/components/learn/ConceptHistorySection.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, ChevronDown, ChevronUp, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function ConceptHistorySection({ historyRecords = [], summary = null, loading = false, onLoadHistory }) {
  const [expandedSessionId, setExpandedSessionId] = useState(null);

  const toggleSession = (id) => {
    setExpandedSessionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <History size={18} className="text-emerald-400" />
            Quiz Sessions & History
          </h3>
          <p className="text-xs text-gray-400">Records of past practice sessions</p>
        </div>

        {!historyRecords.length && !loading && (
          <button
            onClick={onLoadHistory}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            Load History
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-white/10 text-center space-y-3">
          <Loader2 size={24} className="mx-auto text-emerald-400 animate-spin" />
          <p className="text-xs text-gray-400 font-medium">Fetching quiz history records...</p>
        </div>
      ) : historyRecords.length === 0 ? (
        <GlassCard padding="p-8" className="text-center space-y-3">
          <p className="text-sm font-semibold text-gray-300">No quiz history recorded for this concept yet.</p>
          <button
            onClick={onLoadHistory}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg"
          >
            Fetch Recorded Sessions
          </button>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {historyRecords.map((item, idx) => {
            const isExpanded = expandedSessionId === (item.session_id || idx);
            const scoreDisplay = `${item.score ?? item.correct_count ?? 0}/${item.total_questions ?? 5}`;
            const timeAgo = item.created_at
              ? new Date(item.created_at).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
              : `Session #${idx + 1}`;

            return (
              <div
                key={item.session_id || idx}
                className="rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden transition-all"
              >
                {/* Collapsed Bar */}
                <div
                  onClick={() => toggleSession(item.session_id || idx)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                      <Clock size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{timeAgo}</h4>
                      <span className="text-xs text-gray-400">
                        Accuracy: {Math.round(((item.score ?? 0) / (item.total_questions || 5)) * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-extrabold text-xs">
                      {scoreDisplay}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Session Breakdown */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10 p-5 bg-black/40 space-y-4"
                    >
                      <h5 className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                        Question Breakdown & Answers
                      </h5>

                      {item.answers && item.answers.length > 0 ? (
                        <div className="space-y-3">
                          {item.answers.map((ans, aIdx) => (
                            <div key={aIdx} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-xs font-bold text-gray-300">Q{aIdx + 1}. {ans.question_text}</span>
                                {ans.is_correct ? (
                                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                                ) : (
                                  <XCircle size={15} className="text-rose-400 shrink-0" />
                                )}
                              </div>
                              <div className="flex gap-4 text-[11px]">
                                <span className="text-gray-400">
                                  Marked: <strong className="text-white">{ans.marked_option}</strong>
                                </span>
                                <span className="text-emerald-400">
                                  Correct: <strong>{ans.correct_option}</strong>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">
                          Recorded session summary: {scoreDisplay} questions answered.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
