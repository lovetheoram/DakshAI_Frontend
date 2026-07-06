import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Users, Sparkles, GraduationCap } from "lucide-react";
import LiveLobby from "../components/social/LiveLobby";
import MentorshipExchange from "../components/social/MentorshipExchange";
import FeedPage from "../components/social/FeedPage";

export default function CommunityPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("live"); // 'live' | 'exchange' | 'feed'

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] overflow-x-hidden text-white">
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* Page Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.04] mb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              🌍 Community World
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Participate in live lobbies, sprint together, and swap concept knowledge.
            </p>
          </div>
          <button
            onClick={() => navigate("/messages")}
            className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all"
            title="Open Inbox"
          >
            <MessageSquare size={18} />
          </button>
        </div>

        {/* Community Navigation Tabs */}
        <div className="flex gap-2 border-b border-white/[0.02] pb-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              activeTab === "live"
                ? "bg-purple-600/15 text-purple-300 border-purple-500/30 shadow-lg shadow-purple-500/5"
                : "bg-white/[0.02] text-gray-400 border-white/5 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Sparkles size={12} className="text-purple-400" />
            Live Lobby
          </button>
          
          <button
            onClick={() => setActiveTab("exchange")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              activeTab === "exchange"
                ? "bg-gradient-to-r from-purple-600/15 to-indigo-600/15 text-purple-300 border-purple-500/30 shadow-lg shadow-purple-500/5"
                : "bg-white/[0.02] text-gray-400 border-white/5 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <GraduationCap size={12} className="text-indigo-400" />
            Knowledge Exchange
          </button>

          <button
            onClick={() => setActiveTab("feed")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              activeTab === "feed"
                ? "bg-gradient-to-r from-emerald-600/15 to-teal-600/15 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/5"
                : "bg-white/[0.02] text-gray-400 border-white/5 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Users size={12} className="text-emerald-400" />
            Peers & Feed
          </button>
        </div>

        {/* Tab Contents */}
        <div>
          {activeTab === "live" && <LiveLobby />}
          {activeTab === "exchange" && <MentorshipExchange />}
          {activeTab === "feed" && <FeedPage />}
        </div>
      </div>
    </div>
  );
}
