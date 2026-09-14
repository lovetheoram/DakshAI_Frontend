import { useContext, useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
} from "lucide-react";

// Core Navigation Rooms: Home, Learn, World, Profile (Map POC is in top header)
const NAV_ITEMS = [
  { to: "/",        icon: Home,     label: "Home" },
  { to: "/learn",   icon: BookOpen, label: "Learn" },
  { to: "/world",   icon: Globe,    label: "World" },
  { to: "/profile", icon: User,     label: "Profile" },
];

export default function AppShell({ children }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Daily Effort Modal State
  const [effortModalOpen, setEffortModalOpen] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [customMins, setCustomMins] = useState("");
  const [loggingStatus, setLoggingStatus] = useState("");

  const hideShell = ["/login", "/signup"].includes(location.pathname) || location.pathname.startsWith("/quiz");

  const fetchTelemetry = async () => {
    if (!user) return;
    try {
      const [dash, diary] = await Promise.all([
        progressApi.getDashboard().catch(() => null),
        progressApi.getDiary().catch(() => []),
      ]);
      if (dash) setDashboard(dash);
      if (Array.isArray(diary)) setDiaryEntries(diary);
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
        setEffortModalOpen(false);
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
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive || (to === "/map" && location.pathname === "/growth")
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
            {/* Map POC Direct Shortcut */}
            <NavLink
              to="/map"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[var(--color-gold)] text-white border-[var(--color-gold)] shadow-xs"
                    : "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)] hover:text-white"
                }`
              }
              title="Map POC - Truth Trajectory"
            >
              <Map size={15} />
              <span>Map POC</span>
            </NavLink>

            {/* Daily Target Check-in Header Button */}
            <button
              onClick={() => setEffortModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                checkedInToday
                  ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                  : "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border-[var(--color-gold)]/40 hover:bg-[var(--color-gold)] hover:text-white"
              }`}
              title="Daily 50/50 Target Check-in Status"
            >
              <Clock size={15} className={checkedInToday ? "text-emerald-600" : "text-[var(--color-gold)]"} />
              <span>{checkedInToday ? "Checked In (+50%)" : "Check-in (+50%)"}</span>
            </button>

            {/* Notification Bell */}
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                  isActive ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)]" : "text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
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
            {/* Map POC Icon Mobile */}
            <NavLink
              to="/map"
              className={({ isActive }) =>
                `px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  isActive
                    ? "bg-[var(--color-gold)] text-white border-[var(--color-gold)]"
                    : "bg-[var(--color-gold-pale)] border-[var(--color-gold)]/30 text-[var(--color-gold-dark)]"
                }`
              }
              title="Map POC"
            >
              <Map size={14} />
              <span>Map POC</span>
            </NavLink>

            {/* Daily Target Check-in Mobile Button */}
            <button
              onClick={() => setEffortModalOpen(true)}
              className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                checkedInToday
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700"
                  : "bg-[var(--color-gold-pale)] border-[var(--color-gold)]/40 text-[var(--color-gold-dark)]"
              }`}
            >
              <Clock size={14} className={checkedInToday ? "text-emerald-600" : "text-[var(--color-gold)]"} />
              <span>{checkedInToday ? "✓ 50%" : "Check-in"}</span>
            </button>

            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${
                  isActive ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)]" : "text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)]"
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
                      Profile
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

      {/* ============= DAILY TARGET & STUDY CHECK-IN MODAL (50/50 Structure) ============= */}
      <AnimatePresence>
        {effortModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18 }}
              className="max-w-md w-full daksh-card p-6 space-y-5 shadow-2xl border-t-3 border-t-[var(--color-gold)] select-none"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-bold">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)]">50 / 50 Daily Target Status</h3>
                    <p className="text-[10px] text-[var(--color-text-secondary)]">Check-in (+50%) + Practice Questions (+50%)</p>
                  </div>
                </div>
                <button
                  onClick={() => setEffortModalOpen(false)}
                  className="w-8 h-8 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Overall Combined Target Card */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2.5 shadow-md">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-300">Total 50/50 Daily Target:</span>
                  <strong className="text-amber-400 font-extrabold text-sm">{Math.min(100, Math.round(dashboard?.target?.completed_growth ?? ( (checkedInToday ? 50 : 0) + (dashboard?.target?.questions_growth || 0) )))}% / 100%</strong>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round(dashboard?.target?.completed_growth ?? ( (checkedInToday ? 50 : 0) + (dashboard?.target?.questions_growth || 0) )))}%` }}
                  />
                </div>
              </div>

              {/* Track A: 1-Tap Daily Check-in (+50%) */}
              <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-primary)]">
                    <Check size={14} className="text-emerald-600" />
                    <span>Track A (50%) — Daily 1-Tap Check-in</span>
                  </div>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${checkedInToday ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                    {checkedInToday ? "+50% Earned" : "0 / 50%"}
                  </span>
                </div>

                {checkedInToday ? (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold flex items-center justify-between">
                    <span>✓ Checked In Today (+50% Growth)</span>
                    <span className="text-[10px] text-emerald-600 font-medium">Recorded</span>
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        setLoggingStatus("Checking in...");
                        await progressApi.checkin();
                        setLoggingStatus("Checked in (+50%)!");
                        await fetchTelemetry();
                        setTimeout(() => setLoggingStatus(""), 1200);
                      } catch (err) {
                        setLoggingStatus("Checkin failed");
                      }
                    }}
                    className="w-full btn-gold py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Check size={14} />
                    <span>{loggingStatus || "Complete 1-Tap Daily Check-in (+50%)"}</span>
                  </button>
                )}
              </div>

              {/* Track B: Daily Practice Questions (+50%) */}
              <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--color-text-primary)]">Track B (50%) — Practice Questions</span>
                  <span className="font-extrabold text-[var(--color-gold-dark)]">
                    +{dashboard?.target?.questions_growth ?? Math.min(50, Math.round(((dashboard?.target?.completed_correct_questions || 0) / (dashboard?.target?.target_correct_questions || 20)) * 50))}% / 50%
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Questions Correct Today: <strong>{dashboard?.target?.completed_correct_questions || 0} / {dashboard?.target?.target_correct_questions || 20}</strong>
                </p>
              </div>

              {/* Optional Manual Time Logger */}
              <div className="pt-2 border-t border-[var(--color-border)] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--color-text-secondary)]">Optional: Log Extra Revision Minutes</span>
                  {loggingStatus && <span className="text-[10px] font-bold text-emerald-600">{loggingStatus}</span>}
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="600"
                    placeholder="Minutes spent revising..."
                    value={customMins}
                    onChange={(e) => setCustomMins(e.target.value)}
                    className="input-field py-2 text-xs flex-1"
                  />
                  <button
                    onClick={() => handleLogMinutes(customMins)}
                    className="btn-gold px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Save Time
                  </button>
                </div>
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
              const isActive = location.pathname === to || (to === "/map" && location.pathname === "/growth");
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] ${
                    isActive
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
