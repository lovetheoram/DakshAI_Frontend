// src/components/learn/SubjectPassModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Lock, ShieldCheck, ArrowRight, X, Sparkles } from "lucide-react";

export default function SubjectPassModal({ subjectName, onUnlock, onClose }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode.trim() === "cheet_sheet") {
      onUnlock();
    } else {
      setError(true);
    }
  };

  const handleUseDefault = () => {
    setPasscode("cheet_sheet");
    setError(false);
    onUnlock();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-md bg-slate-900 border border-amber-500/40 shadow-2xl rounded-3xl p-6 sm:p-7 space-y-5 relative text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Lock size={22} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
              Premium Readiness Space
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">
              Unlock {subjectName || "Subject"}
            </h3>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          The <strong>Night Before Exam Vocal Space</strong> is a premium interactive learning engine. Enter passkey to proceed.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
              <KeyRound size={14} className="text-amber-400" />
              <span>Passcode Required</span>
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(false);
              }}
              placeholder="Enter passcode (e.g. cheet_sheet)"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-amber-500/30 focus:border-amber-400 focus:outline-none text-xs font-mono text-white placeholder-gray-500"
              autoFocus
            />
            {error && (
              <p className="text-[11px] font-bold text-rose-400">
                Invalid passcode! Hint: Use default pass <code className="bg-rose-950/60 px-1 py-0.5 rounded text-amber-300">cheet_sheet</code>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="submit"
              className="btn-gold w-full py-3 rounded-xl text-xs font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Unlock & Open Dream Page</span>
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={handleUseDefault}
              className="w-full py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles size={13} />
              <span>Use Default Pass: cheet_sheet</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
