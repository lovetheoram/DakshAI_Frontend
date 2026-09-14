// src/components/admin/AdminDashboard.jsx
// Admin Dashboard aligned with Warm Ivory + Ink + Antique Gold identity.

import React from "react";
import ConceptGenerator from "./ConceptGenerator";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-8 space-y-6 select-none">
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30 text-[var(--color-gold-dark)] flex items-center justify-center">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">Admin Console</h1>
          <p className="text-xs text-[var(--color-text-secondary)]">Manage concept metadata & automated quiz question generation.</p>
        </div>
      </div>

      {/* SECTION 1 */}
      <div className="daksh-card p-6 space-y-4 border-t-3 border-t-[var(--color-gold)]">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[var(--color-gold)]" />
          <h2 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
            Concept Meta & Question Generation
          </h2>
        </div>

        <ConceptGenerator />
      </div>
    </div>
  );
}