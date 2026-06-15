



// src/components/layout/Home.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Sparkles, Trophy, Users } from "lucide-react";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 px-4 py-10">
      <div className="w-full max-w-5xl rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl px-6 py-10 sm:px-10 text-center">
        
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Welcome to <span className="text-purple-400">Nimides</span>
        </h1>

        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {user
            ? `Welcome back, ${user.username}. Continue leveling up your knowledge.`
            : "A gamified learning + social platform to master concepts and grow consistently."}
        </p>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          
          <Link
            to="/feed"
            className="group rounded-2xl p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg active:scale-[0.98] hover:scale-[1.03] transition"
          >
            <Users className="mx-auto mb-3 opacity-90 group-hover:scale-110 transition" size={34} />
            <h3 className="font-semibold text-lg mb-1">Social Feed</h3>
            <p className="text-sm text-white/80">
              Learn socially, share insights.
            </p>
          </Link>

          <Link
            to="/syllabus"
            className="group rounded-2xl p-6 bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-lg active:scale-[0.98] hover:scale-[1.03] transition"
          >
            <Sparkles className="mx-auto mb-3 opacity-90 group-hover:scale-110 transition" size={34} />
            <h3 className="font-semibold text-lg mb-1">Skill Tree</h3>
            <p className="text-sm text-white/80">
              Unlock concepts visually.
            </p>
          </Link>

          {user && (
            <Link
              to="/profile"
              className="group rounded-2xl p-6 bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg active:scale-[0.98] hover:scale-[1.03] transition"
            >
              <Trophy className="mx-auto mb-3 opacity-90 group-hover:scale-110 transition" size={34} />
              <h3 className="font-semibold text-lg mb-1">Your Progress</h3>
              <p className="text-sm text-white/80">
                Track stats & achievements.
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
