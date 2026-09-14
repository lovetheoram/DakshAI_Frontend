// src/components/home/ServerStatusChecker.jsx
// Health & Telemetry Status Checker aligned with Warm Ivory + Ink + Antique Gold identity.

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Wifi, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ServerStatusChecker({ onReady }) {
  const [status, setStatus] = useState("checking"); // 'checking' | 'sleeping' | 'connected'
  const [showWarning, setShowWarning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  
  const startTimeRef = useRef(Date.now());
  const timerIntervalRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  const ESTIMATED_WAKE_TIME = 60; 
  const progressPercent = Math.min(Math.round((elapsed / ESTIMATED_WAKE_TIME) * 100), 98);

  useEffect(() => {
    let active = true;

    const warningTimeoutId = setTimeout(() => {
      if (active) {
        setShowWarning(true);
        startTimeRef.current = Date.now();
        timerIntervalRef.current = setInterval(() => {
          setElapsed(Math.round((Date.now() - startTimeRef.current) / 1000));
        }, 1000);
      }
    }, 1500);

    const checkServer = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch("https://dakshai.onrender.com/api/health/", {
          signal: controller.signal,
          mode: "cors",
        });
        clearTimeout(timeoutId);

        if (res.ok && active) {
          clearTimeout(warningTimeoutId);
          clearInterval(timerIntervalRef.current);
          setStatus("connected");
          
          setTimeout(() => {
            if (active) onReady();
          }, 950);
          return;
        }
      } catch (err) {
        console.log("Server health check ping failed, retrying in 3s...", err);
      }

      if (active) {
        setStatus("sleeping");
        retryTimeoutRef.current = setTimeout(checkServer, 3000);
      }
    };

    checkServer();

    return () => {
      active = false;
      clearTimeout(warningTimeoutId);
      clearInterval(timerIntervalRef.current);
      clearTimeout(retryTimeoutRef.current);
    };
  }, [onReady]);

  if (!showWarning && status !== "connected") {
    return (
      <div className="max-w-xl mx-auto px-5 py-12 space-y-6 animate-pulse select-none">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-[var(--color-border)] rounded-2xl" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-[var(--color-border)] rounded w-1/4" />
            <div className="h-3 bg-[var(--color-border)] rounded w-1/3" />
          </div>
        </div>
        <div className="h-28 bg-white border border-[var(--color-border)] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-5 py-8 relative select-none">
      <AnimatePresence mode="wait">
        {status !== "connected" ? (
          <motion.div
            key="waking-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md daksh-card p-7 flex flex-col items-center text-center relative border-t-3 border-t-[var(--color-gold)]"
          >
            {/* Status badge */}
            <div className="absolute top-0 right-0 bg-[var(--color-gold-pale)] border-b border-l border-[var(--color-gold)]/20 px-3.5 py-1 rounded-bl-xl text-[10px] font-bold text-[var(--color-gold-dark)] tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] animate-ping" />
              Initializing Backend Server
            </div>

            {/* Icon Group */}
            <div className="relative w-16 h-16 my-4 flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30 flex items-center justify-center">
                <Server className="w-7 h-7 text-[var(--color-gold-dark)] animate-bounce" style={{ animationDuration: "3s" }} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center shadow-xs">
                <Loader2 className="w-3.5 h-3.5 text-[var(--color-gold)] animate-spin" />
              </div>
            </div>

            {/* Header */}
            <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] mb-1">
              Waking Up Study Server
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] px-2 leading-relaxed mb-5">
              Connecting to your study environment. Free tier servers spin up in ~30–50 seconds. Hang tight!
            </p>

            {/* Progress Bar Container */}
            <div className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl p-4 mb-5 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[var(--color-text-primary)]">
                <span>Initialization Progress</span>
                <span className="text-[var(--color-gold-dark)]">{progressPercent}%</span>
              </div>
              <div className="bar-track">
                <motion.div
                  className="bar-fill-gold"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ ease: "easeOut", duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-[var(--color-mid-gray)] pt-1">
                <span className="flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-[var(--color-gold)]" />
                  Connecting to API...
                </span>
                <strong className="text-[var(--color-text-primary)]">{elapsed}s elapsed</strong>
              </div>
            </div>

            {/* Tip banner */}
            <div className="flex gap-2.5 p-3.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-left text-xs text-[var(--color-text-secondary)] leading-relaxed">
              <AlertCircle className="w-4 h-4 text-[var(--color-gold)] shrink-0 mt-0.5" />
              <span>
                Render cloud services spin down after periods of inactivity. Your progress and goal telemetry remain 100% saved.
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm daksh-card p-7 border-t-3 border-t-[var(--color-success)] text-center flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-success-light)] border border-[var(--color-success)]/30 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8 text-[var(--color-success)]" />
            </div>

            <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-0.5">
              Connected Successfully
            </h2>
            <p className="text-xs font-bold text-[var(--color-success)] tracking-wide uppercase mb-3">
              Server Online
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Syncing telemetry data and launching study room...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
