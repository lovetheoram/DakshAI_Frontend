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

  // Typical Render spin up takes about 60 seconds
  const ESTIMATED_WAKE_TIME = 60; 
  const progressPercent = Math.min(Math.round((elapsed / ESTIMATED_WAKE_TIME) * 100), 98);

  useEffect(() => {
    let active = true;

    // Show warning UI if the connection takes longer than 1.5 seconds
    const warningTimeoutId = setTimeout(() => {
      if (active) {
        setShowWarning(true);
        // Start counting elapsed seconds once we confirm it's taking time
        startTimeRef.current = Date.now();
        timerIntervalRef.current = setInterval(() => {
          setElapsed(Math.round((Date.now() - startTimeRef.current) / 1000));
        }, 1000);
      }
    }, 1500);

    const checkServer = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout per ping

        const res = await fetch("https://dakshai.onrender.com/api/health/", {
          signal: controller.signal,
          mode: "cors",
        });
        clearTimeout(timeoutId);

        if (res.ok && active) {
          clearTimeout(warningTimeoutId);
          clearInterval(timerIntervalRef.current);
          setStatus("connected");
          
          // Delay briefly to show the success state checkmark
          setTimeout(() => {
            if (active) onReady();
          }, 950);
          return;
        }
      } catch (err) {
        console.log("Server health check ping failed, retrying in 3s...", err);
      }

      if (active) {
        // If we failed, transition status to sleeping/waking
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

  // If the server is awake quickly (within 1.5s), we show a quiet skeleton to avoid jarring UI flashes
  if (!showWarning && status !== "connected") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-800 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-800 rounded w-1/4" />
            <div className="h-3 bg-gray-800 rounded w-1/3" />
          </div>
        </div>
        <div className="h-24 bg-gray-900/50 border border-white/[0.04] rounded-3xl" />
        <div className="space-y-3">
          <div className="h-20 bg-gray-950/40 rounded-3xl" />
          <div className="h-32 bg-gray-950/40 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-[80px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {status !== "connected" ? (
          <motion.div
            key="waking-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md p-8 rounded-3xl bg-[var(--color-bg-card)] border border-[var(--color-border)] backdrop-blur-xl shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Sleeping badge indicator */}
            <div className="absolute top-0 right-0 bg-yellow-500/10 border-b border-l border-yellow-500/20 px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold text-yellow-400 tracking-wide uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
              Render Free Tier
            </div>

            {/* Icon Group */}
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-purple-500/10 rounded-2xl blur-md animate-pulse" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 flex items-center justify-center">
                <Server className="w-8 h-8 text-purple-400 animate-bounce" style={{ animationDuration: "3s" }} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border border-white/[0.08] flex items-center justify-center">
                <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" />
              </div>
            </div>

            {/* Header */}
            <h2 className="text-xl font-bold text-white mb-2">
              Waking up Server
            </h2>
            <p className="text-sm text-gray-400 px-2 leading-relaxed mb-6">
              Our backend server is currently sleeping. It usually takes 30-50 seconds to spin up. Hang tight!
            </p>

            {/* Progress Bar Container */}
            <div className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-400 mb-2">
                <span>Progress</span>
                <span className="text-purple-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ ease: "easeOut", duration: 0.5 }}
                />
              </div>
              <div className="mt-2.5 flex justify-between items-center text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-gray-600" />
                  Pinging dakshai.onrender.com...
                </span>
                <span>{elapsed}s elapsed</span>
              </div>
            </div>

            {/* Tip banner */}
            <div className="flex gap-2.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-left text-xs text-gray-400/90 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-purple-400/70 shrink-0 mt-0.5" />
              <span>
                Render shuts down free databases and web instances after 15 mins of inactivity to conserve resources.
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm p-8 rounded-3xl bg-[var(--color-bg-card)] border border-green-500/20 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center"
          >
            {/* Green glowing circle */}
            <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-lg animate-pulse" />
              <CheckCircle2 className="w-12 h-12 text-green-400 relative z-10" />
            </div>

            <h2 className="text-lg font-bold text-white mb-1">
              Connected Successfully
            </h2>
            <p className="text-xs text-green-400 font-semibold tracking-wide uppercase mb-4">
              Server is Online
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Syncing telemetry data and launching Growth OS...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
