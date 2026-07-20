import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, HelpCircle, Users, MessageSquare } from "lucide-react";
import FeedPage from "../components/social/FeedPage";
import MentorshipExchange from "../components/social/MentorshipExchange";

export default function CommunityPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("discover"); // 'discover' | 'ask' | 'people'

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] overflow-x-hidden text-white">
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* Page Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.04] mb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              🌍 Community
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              What other learners are building, asking, and discovering around the world.
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

        {/* 3 Core Tabs: Discover | Ask & Help | People */}
        <div className="flex gap-2 border-b border-white/[0.02] pb-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab("discover")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              activeTab === "discover"
                ? "bg-purple-600/15 text-purple-300 border-purple-500/30 shadow-lg shadow-purple-500/5"
                : "bg-white/[0.02] text-gray-400 border-white/5 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Compass size={14} className="text-purple-400" />
            Discover
          </button>
          
          <button
            onClick={() => setActiveTab("ask")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              activeTab === "ask"
                ? "bg-gradient-to-r from-purple-600/15 to-indigo-600/15 text-purple-300 border-purple-500/30 shadow-lg shadow-purple-500/5"
                : "bg-white/[0.02] text-gray-400 border-white/5 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <HelpCircle size={14} className="text-indigo-400" />
            Ask & Help
          </button>

          <button
            onClick={() => setActiveTab("people")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              activeTab === "people"
                ? "bg-gradient-to-r from-emerald-600/15 to-teal-600/15 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/5"
                : "bg-white/[0.02] text-gray-400 border-white/5 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Users size={14} className="text-emerald-400" />
            People
          </button>
        </div>

        {/* Tab Contents */}
        <div>
          {activeTab === "discover" && <FeedPage initialTab="projects" />}
          {activeTab === "ask" && <MentorshipExchange />}
          {activeTab === "people" && <FeedPage initialTab="suggestions" />}
        </div>
      </div>
    </div>
  );
}
