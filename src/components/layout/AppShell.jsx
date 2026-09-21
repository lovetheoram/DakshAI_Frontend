import { useContext, useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import progressApi from "../../api/progressApi";

import {
  Home,
  Map,
  BookOpen,
  Globe,
  User,
  Bell,
  Settings,
  LogOut,
  Clock,
  Check,
  X,
  Flame,
  Award,
  BarChart2,
  Calendar,
  Activity,
  Target,
} from "lucide-react";

// Core 4 Rooms: Home (Where am I?), Practice (Can I do it?), Learn (Do I understand?), World (What else exists?)
const NAV_ITEMS = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/practice", icon: Target, label: "Practice" },
  { to: "/learn", icon: BookOpen, label: "Learn" },
  { to: "/world", icon: Globe, label: "World" },
];

export default function AppShell({ children }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Multi-Streak Modal & Telemetry State
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const [streakData, setStreakData] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [customMins, setCustomMins] = useState("");
  const [loggingStatus, setLoggingStatus] = useState("");

  const hideShell = ["/login", "/signup"].includes(location.pathname) || location.pathname.startsWith("/quiz");

  const fetchTelemetry = async () => {
    if (!user) return;
    try {
      const [dash, diary, strk] = await Promise.all([
        progressApi.getDashboard().catch(() => null),
        progressApi.getDiary().catch(() => []),
        progressApi.getStreakStats().catch(() => null),
      ]);
      if (dash) setDashboard(dash);
      if (Array.isArray(diary)) setDiaryEntries(diary);
      if (strk) setStreakData(strk);
    } catch (err) {
      console.error("Failed to fetch telemetry in shell:", err);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, [user, location.pathname]);

  if (hideShell) {
    return <>{children}</>;
  }

  const showNav = !!user;

  // Streak & Consistency (Multi-dimensional from backend)
  const streakStats = dashboard?.streak_stats || streakData || {};
  const practiceStreak = streakStats?.practice_streak ?? streakStats?.current_streak ?? streakStats?.growth_streak ?? 0;
  const visitStreak = streakStats?.visit_streak ?? dashboard?.visit_streak ?? 0;
  const totalActiveDays = streakStats?.total_active_days ?? dashboard?.active_days_count ?? 0;
  const activeDaysThisWeek = dashboard?.active_days_this_week ?? streakStats?.active_days_this_week ?? 0;
  const streakDays = practiceStreak > 0 ? practiceStreak : (visitStreak > 0 ? visitStreak : totalActiveDays);

  // Target & Checkin telemetry
  const targetData = dashboard?.target || {};
  const checkedInToday = Boolean(targetData.study_checked_in || targetData.checked_in_today);
  const completedCorrect = targetData.completed_correct_questions || 0;
  const targetCorrect = targetData.target_correct_questions || 20;

  const plannedHours = dashboard?.goal?.available_hours_per_day || 2.0;
  const todayStr = new Date().toISOString().split("T")[0];
  const todayDiary = diaryEntries.find((d) => d.date === todayStr) || diaryEntries[0];
  const actualSeconds = todayDiary?.time_spent_seconds || 0;
  const actualHours = actualSeconds / 3600;
  const effortPct = Math.min(100, Math.round((actualHours / (plannedHours || 1)) * 100));

  const handleLogMinutes = async (mins) => {
    try {
      const numericMins = parseInt(mins, 10);
      if (isNaN(numericMins) || numericMins <= 0) return;

      setLoggingStatus("Logging...");
      await progressApi.logRevision(numericMins);
      setLoggingStatus(`+${numericMins} mins saved!`);
      setCustomMins("");
      await fetchTelemetry();
      setTimeout(() => {
        setLoggingStatus("");
        setStreakModalOpen(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      setLoggingStatus("Failed to log");
      setTimeout(() => setLoggingStatus(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col relative">

      {/* ============= Desktop Top Bar ============= */}
      {showNav && (
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 border-b border-[var(--color-border)] bg-white sticky top-0 z-40 shadow-xs">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-gold)] flex items-center justify-center shadow-xs">
              <span className="text-white font-black text-sm">D</span>
            </div>
            <span className="text-base font-bold text-[var(--color-text-primary)] tracking-tight">
              Daksh<span className="text-[var(--color-gold)]">AI</span>
            </span>
          </NavLink>

          {/* Center Nav */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${isActive
                    ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/20"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                  }`
                }
              >
                <Icon size={15} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Streak Header Button */}
            <button
              onClick={() => setStreakModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-xs"
              title="Click to view all streak types & stats"
            >
              <Flame size={15} className="text-amber-500 animate-pulse" />
              <span>{streakDays}d Streak</span>
            </button>

            {/* Notification Bell */}
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${isActive ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)]" : "text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                }`
              }
            >
              <Bell size={18} />
            </NavLink>

            {/* Profile menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-xl bg-[var(--color-text-primary)] flex items-center justify-center text-white text-xs font-bold hover:bg-[var(--color-gold-dark)] transition-colors cursor-pointer"
              >
                {user?.username?.[0]?.toUpperCase() || "U"}
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    className="absolute right-0 top-12 w-56 p-2 z-50 rounded-2xl bg-white border border-[var(--color-border)] shadow-lg"
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="px-3 py-2 border-b border-[var(--color-border)] mb-1">
                      <p className="text-xs font-bold text-[var(--color-text-primary)] truncate">{user?.username}</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)] truncate">{user?.email}</p>
                    </div>

                    <NavLink
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    >
                      <User size={14} />
                      My Profile
                    </NavLink>

                    <NavLink
                      to="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    >
                      <Settings size={14} />
                      Settings
                    </NavLink>

                    <button
                      onClick={logout}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors w-full text-left cursor-pointer mt-1 border-t border-[var(--color-border)]"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
      )}

      {/* ============= Mobile Top Bar ============= */}
      {showNav && (
        <header className="flex md:hidden items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-white sticky top-0 z-40">
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-[var(--color-gold)] flex items-center justify-center shadow-xs">
              <span className="text-white font-black text-xs">D</span>
            </div>
            <span className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight">
              Daksh<span className="text-[var(--color-gold)]">AI</span>
            </span>
          </NavLink>

          <div className="flex items-center gap-1.5">
            {/* Streak Mobile Button */}
            <button
              onClick={() => setStreakModalOpen(true)}
              className="px-2.5 py-1 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-105 shadow-xs"
              title="Click to view all streak types & stats"
            >
              <Flame size={13} className="text-amber-500 animate-pulse" />
              <span>{streakDays}d</span>
            </button>

            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${isActive ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)]" : "text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)]"
                }`
              }
            >
              <Bell size={18} />
            </NavLink>

            <div className="relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-8 h-8 rounded-xl bg-[var(--color-text-primary)] flex items-center justify-center text-white text-xs font-bold hover:bg-[var(--color-gold-dark)] transition-colors cursor-pointer"
              >
                {user?.username?.[0]?.toUpperCase() || "U"}
              </button>

              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    className="absolute right-0 top-11 w-48 p-2 z-50 rounded-2xl bg-white border border-[var(--color-border)] shadow-lg"
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <NavLink
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    >
                      <User size={14} />
                      My Profile
                    </NavLink>
                    <NavLink
                      to="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    >
                      <Settings size={14} />
                      Settings
                    </NavLink>
                    <hr className="border-[var(--color-border)] my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors w-full text-left"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
      )}

      {/* ============= MULTI-STREAK MODAL ============= */}
      <AnimatePresence>
        {streakModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div
              className="fixed inset-0"
              onClick={() => setStreakModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.18 }}
              className="relative max-w-lg w-full daksh-card p-6 space-y-5 shadow-2xl border-t-4 border-t-amber-500 select-none z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                    <Flame size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Consistency & Streaks</h3>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">Your active learning habits and consistency</p>
                  </div>
                </div>
                <button
                  onClick={() => setStreakModalOpen(false)}
                  className="w-8 h-8 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Main Banner / Headline Streak */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                    Current Streak
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-[var(--color-text-primary)]">{streakDays}</span>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">Active Days</span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    {practiceStreak > 0
                      ? `${practiceStreak} consecutive days solving practice questions!`
                      : "Solve a quiz today to extend your practice streak!"}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-3xl shadow-xs">
                  🔥
                </div>
              </div>

              {/* Grid of the Different Streak Types (Matching Profile Page stats) */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
                  Streak & Consistency Dimensions
                </span>
                <div className="grid grid-cols-2 gap-2.5 text-left">
                  {/* 1. Practice Streak */}
                  <div className="p-3.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-[var(--color-mid-gray)] uppercase tracking-wider">Practice Streak</span>
                      <Flame size={14} className="text-amber-500" />
                    </div>
                    <span className="text-2xl font-black text-amber-500 block">{practiceStreak}d</span>
                    <p className="text-[10px] text-[var(--color-text-secondary)] leading-tight">Consecutive days solving MCQs</p>
                  </div>

                  {/* 2. Visit / Presence Streak */}
                  <div className="p-3.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-[var(--color-mid-gray)] uppercase tracking-wider">Presence Streak</span>
                      <Calendar size={14} className="text-emerald-500" />
                    </div>
                    <span className="text-2xl font-black text-emerald-600 block">{visitStreak}d</span>
                    <p className="text-[10px] text-[var(--color-text-secondary)] leading-tight">Consecutive days on platform</p>
                  </div>

                  {/* 3. Total Active Days */}
                  <div className="p-3.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-[var(--color-mid-gray)] uppercase tracking-wider">Total Active Days</span>
                      <Award size={14} className="text-[var(--color-gold-dark)]" />
                    </div>
                    <span className="text-2xl font-black text-[var(--color-text-primary)] block">{totalActiveDays}</span>
                    <p className="text-[10px] text-[var(--color-text-secondary)] leading-tight">Lifetime verified study days</p>
                  </div>

                  {/* 4. Active Days This Week */}
                  <div className="p-3.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-[var(--color-mid-gray)] uppercase tracking-wider">This Week</span>
                      <Activity size={14} className="text-sky-500" />
                    </div>
                    <span className="text-2xl font-black text-sky-500 block">{activeDaysThisWeek}/7</span>
                    <p className="text-[10px] text-[var(--color-text-secondary)] leading-tight">Weekly momentum consistency</p>
                  </div>
                </div>
              </div>

              {/* Earned Badges & Achievements (Matching Profile Page) */}
              <div className="space-y-2 pt-1 border-t border-[var(--color-border)]">
                <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                  <Award size={13} className="text-[var(--color-gold-dark)]" />
                  <span>Streak Badges & Milestones</span>
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {[
                    { label: "1-Day Start", emoji: "🌱", req: 1, unlocked: streakDays >= 1 },
                    { label: "3-Day Sprint", emoji: "⚡", req: 3, unlocked: streakDays >= 3 },
                    { label: "7-Day Habit", emoji: "🔥", req: 7, unlocked: streakDays >= 7 },
                    { label: "14-Day Pro", emoji: "🎯", req: 14, unlocked: streakDays >= 14 },
                    { label: "21-Day Elite", emoji: "👑", req: 21, unlocked: streakDays >= 21 },
                    { label: "30-Day Master", emoji: "💎", req: 30, unlocked: streakDays >= 30 },
                  ].map((badge, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border transition-all ${
                        badge.unlocked
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold shadow-xs"
                          : "bg-[var(--color-bg-primary)] border-[var(--color-border)] text-[var(--color-mid-gray)] opacity-50"
                      }`}
                    >
                      <span className="text-base block mb-0.5">{badge.emoji}</span>
                      <span className="text-[10px] block font-bold truncate">{badge.label}</span>
                      <span className="text-[8px] uppercase tracking-wider block text-[var(--color-mid-gray)]">
                        {badge.unlocked ? "✓ Unlocked" : `${badge.req}d needed`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setStreakModalOpen(false);
                    navigate("/profile");
                  }}
                  className="text-xs font-bold text-[var(--color-gold-dark)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <User size={13} />
                  <span>View Full Profile</span>
                </button>
                <button
                  onClick={() => {
                    setStreakModalOpen(false);
                    navigate("/learn");
                  }}
                  className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <BookOpen size={13} />
                  <span>Practice Questions</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============= Page Content ============= */}
      <main className={`flex-1 ${showNav ? "mb-nav" : ""}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ============= Mobile Bottom Nav ============= */}
      {showNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[var(--color-border)] pb-safe shadow-md">
          <div className="flex items-center justify-around px-2 py-2">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
              const isActive = location.pathname === to;
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] ${isActive
                      ? "text-[var(--color-gold)]"
                      : "text-[var(--color-mid-gray)] active:text-[var(--color-text-primary)]"
                    }`}
                >
                  <div className="relative">
                    <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 w-1 h-1 bg-[var(--color-gold)] rounded-full"
                        layoutId="navDot"
                        style={{ x: "-50%" }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </div>
                  <span className="text-[10px] font-semibold">{label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
