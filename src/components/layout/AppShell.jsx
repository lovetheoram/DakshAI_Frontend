import { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import {
  Home,
  BookOpen,
  Swords,
  Users,
  TrendingUp,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

// Bottom nav items (mobile - 5 max)
const NAV_ITEMS = [
  { to: "/",          icon: Home,      label: "Today" },
  { to: "/learn",     icon: BookOpen,  label: "Learn" },
  { to: "/practice",  icon: Swords,    label: "Practice" },
  { to: "/community", icon: Users,     label: "Community" },
  { to: "/growth",    icon: TrendingUp,label: "Growth" },
];

export default function AppShell({ children }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide shell on auth pages and fullscreen experiences
  const hideShell = ["/login", "/signup"].includes(location.pathname) || location.pathname.startsWith("/quiz");

  if (hideShell) {
    return <>{children}</>;
  }

  // Don't show nav for logged-out users (landing page handles its own nav)
  const showNav = !!user;

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      {/* ============= Desktop Top Bar ============= */}
      {showNav && (
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-white/[0.04] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <span className="text-white font-black text-sm">D</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Daksh<span className="text-purple-400">AI</span>
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
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-purple-500/15 text-purple-300 shadow-sm shadow-purple-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                  }`
                }
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                  isActive ? "bg-purple-500/15 text-purple-300" : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                }`
              }
            >
              <Bell size={18} />
            </NavLink>

            {/* Profile menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition-opacity"
              >
                {user?.username?.[0]?.toUpperCase() || "U"}
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    className="absolute right-0 top-12 w-56 glass p-2 z-50"
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <NavLink
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <User size={16} />
                      Profile
                    </NavLink>
                    <NavLink
                      to="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </NavLink>
                    <hr className="border-white/[0.06] my-1" />
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left"
                    >
                      <LogOut size={16} />
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
        <header className="flex md:hidden items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
              <span className="text-white font-black text-xs">D</span>
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              Daksh<span className="text-purple-400">AI</span>
            </span>
          </NavLink>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `w-8.5 h-8.5 flex items-center justify-center rounded-xl transition-colors ${
                  isActive ? "bg-purple-500/15 text-purple-300" : "text-gray-400 hover:text-white"
                }`
              }
            >
              <Bell size={18} />
            </NavLink>

            {/* Profile menu */}
            <div className="relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity"
              >
                {user?.username?.[0]?.toUpperCase() || "U"}
              </button>

              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    className="absolute right-0 top-11 w-48 glass p-2 z-50"
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <NavLink
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <User size={14} />
                      Profile
                    </NavLink>
                    <NavLink
                      to="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <Settings size={14} />
                      Settings
                    </NavLink>
                    <hr className="border-white/[0.06] my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left"
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

      {/* ============= Page Content ============= */}
      <main className={`flex-1 ${showNav ? "mb-nav" : ""}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ============= Mobile Bottom Nav ============= */}
      {showNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-white/[0.04] pb-safe">
          <div className="flex items-center justify-around px-2 py-2">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] ${
                    isActive
                      ? "text-purple-400"
                      : "text-gray-500 active:text-gray-300"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="relative">
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-1 left-1/2 w-1 h-1 bg-purple-400 rounded-full"
                          layoutId="navDot"
                          style={{ x: "-50%" }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </div>
                    <span className="text-[10px] font-medium">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
