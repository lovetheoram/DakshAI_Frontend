import { useEffect, useState } from "react";
import socialApi from "../../api/socialApi";
import syllabusApi from "../../api/syllabusApi";
import GlassCard from "../ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Zap, Award, BookOpen, Clock, Loader2, CheckCircle2 } from "lucide-react";

export default function LiveLobby() {
  const [lobbyData, setLobbyData] = useState(null);
  const [mySession, setMySession] = useState(null);
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingCheckIn, setSubmittingCheckIn] = useState(false);

  // Check-in Form states
  const [selectedConcept, setSelectedConcept] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("reading");

  const fetchLobby = async () => {
    try {
      const res = await socialApi.getLobby();
      setLobbyData(res.data?.lobby || null);
      setMySession(res.data?.my_session || null);
    } catch (err) {
      console.error("Error fetching lobby data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLobby();
    const fetchConcepts = async () => {
      try {
        const data = await syllabusApi.getConceptList();
        setConcepts(Array.isArray(data) ? data : data?.concepts || []);
      } catch (err) {
        console.error("Error fetching concept list:", err);
      }
    };
    fetchConcepts();
  }, []);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setSubmittingCheckIn(true);
    try {
      const res = await socialApi.pingSession(selectedStatus, selectedConcept || null);
      setMySession(res.data);
      await fetchLobby();
    } catch (err) {
      console.error("Check-in failed:", err);
    } finally {
      setSubmittingCheckIn(false);
    }
  };

  const handleClearSession = async () => {
    setSubmittingCheckIn(true);
    try {
      await socialApi.pingSession(null); // passing null clears the session
      setMySession(null);
      await fetchLobby();
    } catch (err) {
      console.error("Clearing session failed:", err);
    } finally {
      setSubmittingCheckIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 size={24} className="animate-spin text-amber-500" />
        <p className="text-xs text-slate-400">Syncing live learning matrix...</p>
      </div>
    );
  }

  const onlineCount = lobbyData?.total_online ?? 0;
  const subjects = lobbyData?.by_subject || {};
  const sprints = lobbyData?.active_sprints || [];
  const leaderboard = lobbyData?.leaderboard || [];

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-500/20 text-center relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
            <Users className="text-amber-400 animate-pulse" size={24} />
          </div>
          <h2 className="text-3xl font-black text-slate-100 tracking-tight">
            {onlineCount} studying now
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 max-w-sm">
            You are not studying alone. Join a subject room or list your focus to let peers sync with your momentum.
          </p>
        </div>
      </motion.div>

      {/* Check In Action Card */}
      <GlassCard className="relative overflow-hidden border-amber-500/20 bg-slate-950/80">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-base">📍</span>
          <div>
            <p className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              {mySession ? "You are Checked In" : "Declare Your Focus"}
            </p>
            <p className="text-[10px] text-slate-400">
              {mySession 
                ? `Active in: ${mySession.concept_name || "General Study"}` 
                : "Checking in places you in the live room index"}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mySession ? (
            <motion.div
              key="active-session"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-slate-300">
                    Studying <strong className="text-white">{mySession.concept_name || "General Concept"}</strong> ({mySession.status})
                  </span>
                </div>
                <button
                  onClick={handleClearSession}
                  disabled={submittingCheckIn}
                  className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Leave Room
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="checkin-form"
              onSubmit={handleCheckIn}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Concept Topic
                  </label>
                  <select
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 transition"
                    value={selectedConcept}
                    onChange={(e) => setSelectedConcept(e.target.value)}
                    required
                  >
                    <option value="" className="bg-slate-900">Select Concept</option>
                    {concepts.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Study Activity
                  </label>
                  <select
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 transition"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="reading" className="bg-slate-900">Reading notes 📚</option>
                    <option value="quiz" className="bg-slate-900">Solving Quiz 🎯</option>
                    <option value="revision" className="bg-slate-900">Revising concept 🔄</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingCheckIn}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold shadow-md hover:shadow-amber-500/20 transition active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {submittingCheckIn ? "Checking in..." : "Enter Study Lobby ⚡"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* Grid: Lobbies per Subject & Active Sprints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lobbies List */}
        <GlassCard className="bg-slate-950/80 border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm">🏛️</span>
            <p className="text-xs font-bold text-slate-100 uppercase tracking-wider">Subject Lobbies</p>
          </div>

          <div className="space-y-2.5">
            {["Physics", "Chemistry", "Math", "Programming"].map((subj) => {
              const cnt = subjects[subj] ?? 0;
              return (
                <div
                  key={subj}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs hover:border-amber-500/30 transition-colors"
                >
                  <span className="font-semibold text-slate-300">{subj} Lobby</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${cnt > 0 ? "bg-amber-400 animate-pulse" : "bg-slate-700"}`} />
                    <span className="font-bold text-slate-200">{cnt} active</span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Active Sprints */}
        <GlassCard className="bg-slate-950/80 border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={14} className="text-amber-400" />
            <p className="text-xs font-bold text-slate-100 uppercase tracking-wider">Active Sprints</p>
          </div>

          {sprints.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 leading-relaxed">
              No active group sprints. Check in above to declare your sprint and start the topic room!
            </div>
          ) : (
            <div className="space-y-2.5">
              {sprints.map((sp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs"
                >
                  <span className="font-semibold text-slate-200 truncate max-w-[180px]">{sp.concept_name}</span>
                  <span className="text-[10px] font-bold text-amber-400">{sp.count} in sprint</span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Top Mentors Leaderboard */}
      {leaderboard.length > 0 && (
        <GlassCard className="bg-slate-950/80 border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} className="text-amber-400" />
            <p className="text-xs font-bold text-slate-100 uppercase tracking-wider">Weekly Mentor Leaderboard</p>
          </div>

          <div className="space-y-2.5">
            {leaderboard.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-black text-slate-500 w-4">#{idx + 1}</span>
                  <span className="font-semibold text-slate-200">{item.username}</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-amber-400">
                  <Zap size={12} />
                  <span>{item.points} pts</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

