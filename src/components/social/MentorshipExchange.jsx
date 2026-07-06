import { useEffect, useState } from "react";
import socialApi from "../../api/socialApi";
import syllabusApi from "../../api/syllabusApi";
import GlassCard from "../ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ArrowRight, MessageCircle, Check, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MentorshipExchange() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEligible, setFilterEligible] = useState(true);
  const [selectedConcept, setSelectedConcept] = useState("");
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const loadTickets = async () => {
    try {
      const res = await socialApi.getTickets(filterEligible);
      setTickets(res.data || []);
    } catch (err) {
      console.error("Error loading help tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [filterEligible]);

  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        const data = await syllabusApi.getConceptList();
        setConcepts(data);
      } catch (err) {
        console.error("Error loading concepts:", err);
      }
    };
    fetchConcepts();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!selectedConcept) return;
    setSubmittingTicket(true);
    setActionMessage("");
    try {
      await socialApi.createTicket(selectedConcept);
      setActionMessage("Help ticket opened successfully! peers matching this concept will be notified.");
      setSelectedConcept("");
      await loadTickets();
      setTimeout(() => setActionMessage(""), 5000);
    } catch (err) {
      console.error(err);
      setActionMessage("Failed to open ticket. You might already have an open ticket for this topic.");
    } finally {
      setSubmittingTicket(false);
    }
  };

  const handleAction = async (ticketId, action) => {
    try {
      setLoading(true);
      await socialApi.performTicketAction(ticketId, action);
      await loadTickets();
      if (action === "accept") {
        navigate(`/messages`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-3xl bg-purple-500/5 border border-purple-500/10 text-xs text-gray-300 leading-relaxed"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-purple-400" />
          <strong className="text-white font-extrabold">Peer Mentorship Matchmaking</strong>
        </div>
        Struggling with a concept? Open a struggle ticket below. High-mastery peers are automatically matched and alerted. Mastered a concept? Browse the mentor queue to help peers and earn weekly reputation points.
      </motion.div>

      {/* Apprentice Area: Open help ticket */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm">🙋</span>
          <div>
            <p className="text-xs font-bold text-white">Need Peer Help?</p>
            <p className="text-[10px] text-gray-500">Raise a ticket to match with expert tutors</p>
          </div>
        </div>

        <form onSubmit={handleCreateTicket} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <select
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition"
              value={selectedConcept}
              onChange={(e) => setSelectedConcept(e.target.value)}
              required
            >
              <option value="" className="bg-slate-900">Select Fading Concept</option>
              {concepts.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={submittingTicket}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-[0.97]"
          >
            Create Ticket
            <ArrowRight size={14} />
          </button>
        </form>

        {actionMessage && (
          <p className="text-[10px] text-purple-400 mt-2.5 font-medium animate-pulse">{actionMessage}</p>
        )}
      </GlassCard>

      {/* Mentor Lounge Area: Open struggle tickets from peers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white">Mentor Lounge</p>
            <p className="text-[10px] text-gray-500">Open struggle tickets from the community</p>
          </div>
          
          <button
            onClick={() => setFilterEligible(!filterEligible)}
            className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all ${
              filterEligible
                ? "bg-purple-600/15 text-purple-300 border-purple-500/30 shadow-lg"
                : "bg-white/[0.02] text-gray-400 border-white/5 hover:text-white"
            }`}
          >
            {filterEligible ? "Show Mastered Matches Only" : "Show All Open Tickets"}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={18} className="animate-spin text-purple-400" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center text-xs text-gray-500 leading-relaxed">
            No struggle tickets found. 
            {filterEligible && " Try toggling to 'Show All Open Tickets'."}
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-purple-400" />
                    <h4 className="text-xs font-bold text-white">
                      Struggling with {ticket.concept_name}
                    </h4>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Raised by <strong className="text-gray-300">{ticket.apprentice?.username}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {ticket.status === "open" && (
                    <button
                      onClick={() => handleAction(ticket.id, "accept")}
                      className="px-3.5 py-1.5 bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 border border-purple-500/20 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-[0.97]"
                    >
                      <MessageCircle size={12} />
                      Mentor Peer
                    </button>
                  )}

                  {ticket.status === "active" && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-amber-400 font-bold">Active Match</span>
                      <button
                        onClick={() => handleAction(ticket.id, "resolve")}
                        className="px-3 py-1 bg-emerald-600/15 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-600/25 transition flex items-center gap-1"
                      >
                        <Check size={12} />
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
