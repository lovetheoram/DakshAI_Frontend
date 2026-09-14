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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 select-none">
      {/* ── HEADER ───────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2">
              WORLD ROOM
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
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
          className="w-10 h-10 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-center text-amber-400 hover:border-amber-500/50 hover:bg-slate-800 transition-all cursor-pointer shadow-md"
          title="Open Direct Messages"
        >
          <MessageSquare size={18} />
        </button>
      </div>

      {/* ── ROOM NAVIGATION TABS ───────────────────────── */}
      <div className="flex gap-2 border-b border-indigo-500/20 pb-3 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab("feed")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
            activeTab === "feed"
              ? "bg-amber-500/10 text-amber-300 border-amber-500/40 shadow-sm"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
        >
          <Globe size={14} className="text-amber-400" />
          Peer Feed
        </button>

        <button
          onClick={() => setActiveTab("qa")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
            activeTab === "qa"
              ? "bg-amber-500/10 text-amber-300 border-amber-500/40 shadow-sm"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
        >
          <Shield size={14} className="text-amber-400" />
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
