// src/pages/CommunityPage.jsx
// WORLD — "See what other people are learning, discovering, improving, and doing."

import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import FeedPage from "../components/social/FeedPage";

export default function CommunityPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-5 py-6 space-y-4 select-none">
      {/* ── HEADER (Compact Editorial) ───────────────────── */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
            WORLD
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            See what other people are learning, discovering, improving, and doing.
          </p>
        </div>

        <button
          onClick={() => navigate("/messages")}
          className="w-8 h-8 rounded-xl border border-[var(--color-border)] bg-white flex items-center justify-center text-[var(--color-gold-dark)] hover:border-[var(--color-gold)] transition-all cursor-pointer shadow-xs"
          title="Direct Messages"
        >
          <MessageSquare size={16} />
        </button>
      </div>

      {/* ── FEED ACTIVITY STREAM ───────────────────────── */}
      <FeedPage initialScope="my_world" />
    </div>
  );
}
