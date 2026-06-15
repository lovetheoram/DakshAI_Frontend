import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Determine styling configuration based on exam_type
  const getExamConfig = (type) => {
    switch (type?.toLowerCase()) {
      case "jee":
        return {
          title: "JEE Main",
          badgeBg: "from-emerald-500 to-green-600",
          shadowColor: "shadow-emerald-500/20",
          borderColor: "border-emerald-500/30",
          icon: "🚀",
          label: "Engineering Pathway"
        };
      case "neet":
        return {
          title: "NEET",
          badgeBg: "from-cyan-500 to-blue-600",
          shadowColor: "shadow-cyan-500/20",
          borderColor: "border-cyan-500/30",
          icon: "🩺",
          label: "Medical Pathway"
        };
      case "placement":
        return {
          title: "Placement Prep",
          badgeBg: "from-purple-500 to-pink-600",
          shadowColor: "shadow-purple-500/20",
          borderColor: "border-purple-500/30",
          icon: "💻",
          label: "Software Career Pathway"
        };
      default:
        return {
          title: "General Explorer",
          badgeBg: "from-slate-500 to-gray-600",
          shadowColor: "shadow-slate-500/20",
          borderColor: "border-slate-500/30",
          icon: "🌌",
          label: "Standard Syllabus"
        };
    }
  };

  const examType = user.selected_exam?.exam_type;
  const examConfig = getExamConfig(examType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className={`relative max-w-lg w-full bg-slate-900/80 backdrop-blur-xl border ${examConfig.borderColor} rounded-3xl p-8 shadow-2xl ${examConfig.shadowColor} transition-all duration-300 hover:scale-[1.01]`}>
        
        {/* Header decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none" />

        {/* User Avatar & Pathway Icon */}
        <div className="flex justify-between items-start mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg">
              {user.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-slate-900"></div>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${examConfig.badgeBg} text-white font-bold text-sm tracking-wide shadow-md`}>
            <span>{examConfig.icon}</span>
            <span>{examConfig.title}</span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-white leading-tight">
              {user.username}
            </h2>
            <p className="text-gray-400 text-sm font-semibold mt-1 uppercase tracking-wider">
              {examConfig.label}
            </p>
          </div>

          <div className="border-t border-slate-800 pt-6 space-y-4">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-bold text-sm tracking-wider uppercase">User ID</span>
              <span className="text-gray-200 font-mono text-sm">{user.id}</span>
            </div>
            
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-bold text-sm tracking-wider uppercase">Email Address</span>
              <span className="text-gray-200 font-medium text-sm">{user.email || "N/A"}</span>
            </div>

            {user.selected_exam && (
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500 font-bold text-sm tracking-wider uppercase">Active Syllabus</span>
                <span className="text-gray-200 font-bold text-sm bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
                  {user.selected_exam.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Interactive Accent */}
        <div className="mt-8 flex justify-center">
          <div className="h-1.5 w-24 rounded-full bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
