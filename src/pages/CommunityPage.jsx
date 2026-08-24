// src/pages/CommunityPage.jsx
// WORLD = The Peer Space — Peer Feed & Peer Q&A Exchange
// 100% strict real data from backend API with Info Tooltips & Ivory + Ink + Antique Gold identity.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Users, MessageSquare, Shield, BookOpen } from "lucide-react";
import socialApi from "../api/socialApi";
import progressApi from "../api/progressApi";
import InfoTooltip from "../components/ui/InfoTooltip";
import FeedPage from "../components/social/FeedPage";
import MentorshipExchange from "../components/social/MentorshipExchange";
import { motion } from "framer-motion";

export default function CommunityPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("feed");
  const [lobbyData, setLobbyData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorldData = async () => {
      try {
        setLoading(true);
        const [lobbyRes, insightsRes, dashRes] = await Promise.all([
          socialApi.getLobby().catch(() => null),
          socialApi.getProgressInsights().catch(() => null),
          progressApi.getDashboard().catch(() => null),
        ]);
        if (lobbyRes) setLobbyData(lobbyRes);
        if (insightsRes) setInsights(insightsRes);
        if (dashRes) setDashboard(dashRes);
      } catch (err) {
        console.error("Failed to load world data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorldData();
  }, []);

  const totalOnline = lobbyData?.lobby?.total_online || 0;
  const openTicketsCount = lobbyData?.open_tickets_count || 0;
  const dakshScore = dashboard?.overall_score ?? 0;
  const masteredCount = insights?.mastered_concepts ?? dashboard?.concepts_mastered_count ?? 0;
  const totalConcepts = insights?.total_concepts ?? dashboard?.total_concepts_in_exam ?? 0;

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 space-y-8 select-none">
      {/* ── HEADER ───────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-2">
              WORLD ROOM
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Connect with peers, share learning updates, and exchange concept Q&A.
            </p>
          </div>
          <InfoTooltip
            title="World Peer Space"
            meaning="A dedicated space for peer learning updates, concept insights, and collaborative Q&A."
            formula="Peer Exchange = Concept Insights + Mentorship Q&A"
            howToIncrease="Share concept notes or raise help tickets on topics where you need peer clarification."
          />
        </div>

        <button
          onClick={() => navigate("/messages")}
          className="w-9 h-9 rounded-xl border border-[var(--color-border)] bg-white flex items-center justify-center text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-gold)] transition-all cursor-pointer shadow-xs"
          title="Open Messages"
        >
          <MessageSquare size={16} />
        </button>
      </div>

      {/* ── PEER COMMUNITY OVERVIEW CARD ────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="daksh-card p-6 space-y-4 border-t-3 border-t-[var(--color-gold)]"
      >
        <div className="flex items-center justify-between">
          <span className="text-caption tracking-widest text-[var(--color-gold)] font-bold flex items-center gap-1.5">
            <Globe size={14} />
            Peer Community Telemetry
          </span>
          <span className="text-[10px] font-bold text-[var(--color-gold-dark)] bg-[var(--color-gold-pale)] px-2.5 py-0.5 rounded-full border border-[var(--color-gold)]/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
            {totalOnline} Learners Active Online
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-1">
            <span className="text-[10px] text-[var(--color-mid-gray)] font-semibold uppercase block">Concepts Mastered</span>
            <span className="text-base font-bold text-[var(--color-gold-dark)] block">{masteredCount} of {totalConcepts}</span>
          </div>
          <div className="p-4 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-1">
            <span className="text-[10px] text-[var(--color-mid-gray)] font-semibold uppercase block">Open Peer Q&A Tickets</span>
            <span className="text-base font-bold text-[var(--color-text-primary)] block">{openTicketsCount} Available</span>
          </div>
        </div>
      </motion.div>

      {/* ── ROOM NAVIGATION TABS ───────────────────────── */}
      <div className="flex gap-2 border-b border-[var(--color-border)] pb-3 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab("feed")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
            activeTab === "feed"
              ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border-[var(--color-gold)]/30 font-bold"
              : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          <Globe size={14} className="text-[var(--color-gold)]" />
          Peer Feed
        </button>

        <button
          onClick={() => setActiveTab("qa")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
            activeTab === "qa"
              ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border-[var(--color-gold)]/30 font-bold"
              : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          <Shield size={14} className="text-[var(--color-gold)]" />
          Peer Q&A ({openTicketsCount})
        </button>
      </div>

      {/* ── TAB CONTENTS ───────────────────────────────── */}
      <div>
        {activeTab === "feed" && <FeedPage initialTab="all" />}
        {activeTab === "qa" && <MentorshipExchange />}
      </div>
    </div>
  );
}
