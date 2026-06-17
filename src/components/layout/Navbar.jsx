

// // src/components/layout/Navbar.jsx
// import React, { useContext } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import {
//   Home,
//   Sparkles,
//   Bell,
//   User,
//   Flame,
//   LogOut,
//   Info,
// } from "lucide-react";

// export default function Navbar() {
//   const { user, logout, notifications = [] } = useContext(AuthContext);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isActive = (path) =>
//     location.pathname === path
//       ? "text-purple-400"
//       : "text-white/70 hover:text-white";

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   return (
//     <>
//       {/* ================= MOBILE FLOATING TOP BAR ================= */}
//       {user && (
//         <div className="md:hidden fixed top-0 left-0 right-0 z-40 px-4 pt-4 flex justify-between items-center pointer-events-none">
          
//           {/* Logo */}
//           <Link
//             to="/"
//             className="flex items-center gap-2 font-bold text-white pointer-events-auto"
//           >
//             <Flame className="text-purple-400" size={22} />
//             Nimides
//           </Link>

//           {/* Alerts (priority on top) */}
//           <Link
//             to="/notifications"
//             className="relative pointer-events-auto p-2 rounded-xl bg-white/10 backdrop-blur hover:bg-white/20 transition"
//             aria-label="Notifications"
//           >
//             <Bell size={20} />
//             {notifications.length > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">
//                 {notifications.length}
//               </span>
//             )}
//           </Link>
//         </div>
//       )}

//       {/* ================= DESKTOP TOP NAV ================= */}
//       <header className="hidden md:block sticky top-0 z-50 bg-slate-900/70 backdrop-blur-xl border-b border-white/10">
//         <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-white">
          
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2 font-bold text-xl">
//             <Flame className="text-purple-400" />
//             Nimides
//           </Link>

//           {/* Navigation */}
//           <nav className="flex items-center gap-6">
//             {user && (
//               <>
//                 <Link to="/feed" className={isActive("/feed")}>Feed</Link>
//                 <Link to="/syllabus" className={isActive("/syllabus")}>Skill Tree</Link>
//               </>
//             )}

//             {/* About (always visible) */}
//             <Link to="/about" className={isActive("/about")}>About</Link>

//             {user ? (
//               <>
//                 <Link to="/notifications" className="relative">
//                   <Bell />
//                   {notifications.length > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">
//                       {notifications.length}
//                     </span>
//                   )}
//                 </Link>

//                 <Link
//                   to="/profile"
//                   className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
//                 >
//                   {user.username}
//                 </Link>

//                 <button
//                   onClick={handleLogout}
//                   className="p-2 rounded-xl bg-red-500/80 hover:bg-red-600 transition"
//                 >
//                   <LogOut size={18} />
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login" className="px-4 py-2 rounded-xl bg-purple-600">
//                   Login
//                 </Link>
//                 <Link to="/signup" className="px-4 py-2 rounded-xl bg-emerald-600">
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </nav>
//         </div>
//       </header>

//       {/* ================= MOBILE BOTTOM NAV ================= */}
//       {user && (
//         <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-t border-white/10">
//           <div className="flex justify-around items-center py-3 text-white">
            
//             <Link to="/feed" className={`flex flex-col items-center ${isActive("/feed")}`}>
//               <Home size={22} />
//               <span className="text-[10px] mt-1">Home</span>
//             </Link>

//             <Link to="/syllabus" className={`flex flex-col items-center ${isActive("/syllabus")}`}>
//               <Sparkles size={22} />
//               <span className="text-[10px] mt-1">Skills</span>
//             </Link>

//             <Link to="/profile" className={`flex flex-col items-center ${isActive("/profile")}`}>
//               <User size={22} />
//               <span className="text-[10px] mt-1">Profile</span>
//             </Link>

//             {/* About at bottom */}
//             <Link to="/about" className={`flex flex-col items-center ${isActive("/about")}`}>
//               <Info size={22} />
//               <span className="text-[10px] mt-1">About</span>
//             </Link>

//           </div>
//         </nav>
//       )}
//     </>
//   );
// }



// src/components/layout/Navbar.jsx
import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  Sparkles,
  Bell,
  User,
  Flame,
  LogOut,
  Info,
  Users,
  Target
} from "lucide-react";

export default function Navbar() {
  const { user, logout, notifications = [] } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path
      ? "text-purple-400"
      : "text-white/70 hover:text-white";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* ================= MOBILE FLOATING TOP BAR ================= */}
      {user && (
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 px-4 pt-4 flex justify-between items-center pointer-events-none">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-white pointer-events-auto"
          >
            <Flame className="text-purple-400" size={22} />
            DakshAI
          </Link>

          <div className="flex items-center gap-2 pointer-events-auto">
            <Link
              to="/notifications"
              className="relative p-2 rounded-xl bg-white/10 backdrop-blur hover:bg-white/20 transition"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">
                  {notifications.length}
                </span>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 backdrop-blur hover:bg-red-500/20 transition"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ================= DESKTOP TOP NAV ================= */}
      <header className="hidden md:block sticky top-0 z-50 bg-slate-900/70 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-white">
          <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
            <Flame className="text-purple-400" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">DakshAI</span>
          </Link>

          <nav className="flex items-center gap-6">
            {user && (
              <>
                <Link to="/" className={isActive("/")}>Growth OS</Link>
                <Link to="/feed" className={isActive("/feed")}>Social Feed</Link>
                <Link to="/syllabus" className={isActive("/syllabus")}>Skill Tree</Link>
                <Link to="/admin" className={isActive("/admin")}>Admin</Link>
              </>
            )}

            <Link to="/about" className={isActive("/about")}>About</Link>

            {user ? (
              <>
                <Link to="/notifications" className="relative p-1 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl transition">
                  <Bell size={18} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-[9px] px-1 rounded-full border border-slate-900 font-bold">
                      {notifications.length}
                    </span>
                  )}
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition text-sm font-semibold"
                >
                  <User size={14} className="text-purple-400" />
                  <span>{user.username}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-xl text-white/80 hover:text-white font-semibold transition text-sm">
                  Login
                </Link>
                <Link to="/signup" className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition text-sm shadow-lg shadow-purple-500/15">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-t border-white/10">
          <div className="flex justify-around items-center py-3 text-white">
            <Link to="/" className={`flex flex-col items-center ${isActive("/")}`}>
              <Target size={22} />
              <span className="text-[10px] mt-1">Growth OS</span>
            </Link>

            <Link to="/feed" className={`flex flex-col items-center ${isActive("/feed")}`}>
              <Users size={22} />
              <span className="text-[10px] mt-1">Feed</span>
            </Link>

            <Link to="/syllabus" className={`flex flex-col items-center ${isActive("/syllabus")}`}>
              <Sparkles size={22} />
              <span className="text-[10px] mt-1">Skills</span>
            </Link>

            <Link to="/profile" className={`flex flex-col items-center ${isActive("/profile")}`}>
              <User size={22} />
              <span className="text-[10px] mt-1">Profile</span>
            </Link>

            <Link to="/about" className={`flex flex-col items-center ${isActive("/about")}`}>
              <Info size={22} />
              <span className="text-[10px] mt-1">About</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}