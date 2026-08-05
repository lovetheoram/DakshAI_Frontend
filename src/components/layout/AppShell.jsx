import { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { useExperience } from "../../context/ThemeContext";
import AmbientBackgroundEngine from "../ui/AmbientBackgroundEngine";
import DakshPersona from "../intelligence/DakshPersona";

import {
  Home,
  BookOpen,
  Globe,
  TrendingUp,
  User,
  Bell,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

// 5 Primary Navigation Tabs
const NAV_ITEMS = [
  { to: "/",          icon: Home,       label: "Home" },
  { to: "/learn",     icon: BookOpen,   label: "Learn" },
  { to: "/community", icon: Globe,      label: "Community" },
  { to: "/growth",    icon: TrendingUp, label: "Growth" },
  { to: "/profile",   icon: User,       label: "Profile" },
];

export default function AppShell({ children }) {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useExperience();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide shell on auth pages and fullscreen experiences
  const hideShell = ["/login", "/signup"].includes(location.pathname) || location.pathname.startsWith("/quiz");

  if (hideShell) {
    return (
      <>
        <AmbientBackgroundEngine />
        {children}
      </>
    );
  }

  // Don't show nav for logged-out users (landing page handles its own nav)
  const showNav = !!user;

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col relative">
      {/* Ambient Background Particle Engine */}
      <AmbientBackgroundEngine />

      {/* Behavioral Intelligence Layer — Daksh Persona (silent by default) */}
      {user && <DakshPersona />}

      {/* ============= Desktop Top Bar ============= */}
      {showNav && (
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-white/[0.04] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-shadow">
              <span className="text-white font-black text-sm">D</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Daksh<span className="text-sky-400">AI</span>
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
                      ? "bg-sky-500/15 text-sky-300 shadow-sm shadow-sky-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                  }`
                }
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right section: Notifications + Profile */}
          <div className="flex items-center gap-3">
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                  isActive ? "bg-sky-500/15 text-sky-300" : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                }`
              }
            >
              <Bell size={18} />
            </NavLink>

            {/* Profile menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                {user?.username?.[0]?.toUpperCase() || "U"}
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    className="absolute right-0 top-12 w-56 glass p-2 z-50 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl"
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                      <p className="text-xs font-bold text-white truncate">{user?.username}</p>
                      <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => { toggleTheme(); setMenuOpen(false); }}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-gray-300 font-bold hover:bg-white/[0.05] transition-colors w-full text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        {theme === "night" ? <Moon size={14} className="text-sky-400" /> : <Sun size={14} className="text-amber-400" />}
                        {theme === "night" ? "Night Mode" : "Day Mode"}
                      </span>
                      <span className="text-[10px] uppercase text-gray-500">{theme}</span>
                    </button>

                    <NavLink
                      to="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                    >
                      <Settings size={14} />
                      Settings
                    </NavLink>

                    <button
                      onClick={logout}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors w-full text-left cursor-pointer mt-1 border-t border-white/[0.06]"
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
        <header className="flex md:hidden items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-md">
              <span className="text-white font-black text-xs">D</span>
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              Daksh<span className="text-sky-400">AI</span>
            </span>
          </NavLink>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `w-8.5 h-8.5 flex items-center justify-center rounded-xl transition-colors ${
                  isActive ? "bg-sky-500/15 text-sky-300" : "text-gray-400 hover:text-white"
                }`
              }
            >
              <Bell size={18} />
            </NavLink>

            {/* Profile menu */}
            <div className="relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                {user?.username?.[0]?.toUpperCase() || "U"}
              </button>

              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    className="absolute right-0 top-11 w-48 glass p-2 z-50 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl"
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <button
                      onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-sky-300 font-bold hover:bg-sky-500/10 transition-colors w-full text-left cursor-pointer"
                    >
                      {theme === "night" ? <Moon size={14} /> : <Sun size={14} />}
                      {theme === "night" ? "Night Mode" : "Day Mode"}
                    </button>
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
