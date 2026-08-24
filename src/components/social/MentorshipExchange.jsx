// src/components/social/MentorshipExchange.jsx
// Peer Q&A & Mentorship Exchange — 100% Strict Ivory + Ink + Antique Gold styling.

import { useEffect, useState } from "react";
import socialApi from "../../api/socialApi";
import syllabusApi from "../../api/syllabusApi";
import InfoTooltip from "../ui/InfoTooltip";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, MessageCircle, Check, Loader2, Sparkles, HelpCircle } from "lucide-react";
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
        setConcepts(Array.isArray(data) ? data : data?.concepts || []);
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
      setActionMessage("Help ticket opened! Peers with high concept mastery will be notified.");
      setSelectedConcept("");
      await loadTickets();
      setTimeout(() => setActionMessage(""), 5000);
    } catch (err) {
      console.error(err);
      setActionMessage("Failed to open ticket. You may already have an active ticket for this concept.");
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
    <div className="space-y-6 select-none">
      {/* Introduction Card */}
      <div className="daksh-card p-5 space-y-2 border-l-2 border-l-[var(--color-gold)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle size={15} className="text-[var(--color-gold)] shrink-0" />
            <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
              Peer Q&A Exchange
            </h3>
          </div>
          <InfoTooltip
            title="Peer Q&A Exchange"
            meaning="Connects learners who need clarification on a specific concept with peers who have high mastery."
            formula="Mentor Matching = Higher Peer Mastery Score on Target Concept"
            howToIncrease="Ask questions when stuck or help peers to reinforce your own long-term retention."
          />
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          Open a help ticket on any concept you're working on. Peers who have mastered that concept will be alerted to assist.
        </p>
      </div>

      {/* Apprentice Area: Open help ticket */}
      <div className="daksh-card p-6 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Need Peer Help?</h3>
          <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">Raise a ticket for a concept you want to clarify.</p>
        </div>

        <form onSubmit={handleCreateTicket} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <select
              className="input-field py-2 text-xs"
              value={selectedConcept}
              onChange={(e) => setSelectedConcept(e.target.value)}
              required
            >
              <option value="">Select Concept to Ask About</option>
              {concepts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={submittingTicket}
            className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 flex items-center justify-center gap-1.5"
          >
            <span>Create Ticket</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {actionMessage && (
          <p className="text-xs text-[var(--color-gold-dark)] font-medium">{actionMessage}</p>
        )}
      </div>

      {/* Mentor Lounge Area: Open struggle tickets from peers */}
      <div className="daksh-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div>
            <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Open Peer Help Queue</h3>
            <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">Browse questions raised by peers</p>
          </div>

          <button
            onClick={() => setFilterEligible(!filterEligible)}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
              filterEligible
                ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border-[var(--color-gold)]/30 font-bold"
                : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {filterEligible ? "Show Mastered Matches Only" : "Show All Tickets"}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={18} className="animate-spin text-[var(--color-gold)]" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-6 text-center text-xs text-[var(--color-text-secondary)]">
            No open help tickets found right now.
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-[var(--color-gold)]" />
                    <h4 className="text-xs font-bold text-[var(--color-text-primary)]">
                      Question on {ticket.concept_name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    Raised by <strong className="text-[var(--color-text-primary)]">{ticket.apprentice?.username}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {ticket.status === "open" && (
                    <button
                      onClick={() => handleAction(ticket.id, "accept")}
                      className="btn-gold px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle size={13} />
                      Help Peer
                    </button>
                  )}

                  {ticket.status === "active" && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--color-gold-dark)] font-bold">Active Discussion</span>
                      <button
                        onClick={() => handleAction(ticket.id, "resolve")}
                        className="px-3 py-1.5 rounded-lg border border-[var(--color-success)] bg-[var(--color-success-light)] text-[var(--color-success)] text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Check size={13} />
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
