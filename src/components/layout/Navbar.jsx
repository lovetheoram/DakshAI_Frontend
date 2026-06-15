

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
  Home,
  Sparkles,
  Bell,
  User,
  Flame,
  LogOut,
  Info,
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
            Nimides
          </Link>

          <Link
            to="/notifications"
            className="relative pointer-events-auto p-2 rounded-xl bg-white/10 backdrop-blur hover:bg-white/20 transition"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">
                {notifications.length}
              </span>
            )}
          </Link>
        </div>
      )}

      {/* ================= DESKTOP TOP NAV ================= */}
      <header className="hidden md:block sticky top-0 z-50 bg-slate-900/70 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-white">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Flame className="text-purple-400" />
            Nimides
          </Link>

          <nav className="flex items-center gap-6">
            {user && (
              <>
                <Link to="/feed" className={isActive("/feed")}>Feed</Link>
                <Link to="/syllabus" className={isActive("/syllabus")}>Skill Tree</Link>
                <Link to="/admin" className={isActive("/admin")}>Admin</Link>
              </>
            )}

            <Link to="/about" className={isActive("/about")}>About</Link>

            {user ? (
              <>
                <Link to="/notifications" className="relative">
                  <Bell />
                  {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </Link>

                <Link
                  to="/profile"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  {user.username}
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-red-500/80 hover:bg-red-600 transition"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-xl bg-purple-600">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 rounded-xl bg-emerald-600">
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
            <Link to="/feed" className={`flex flex-col items-center ${isActive("/feed")}`}>
              <Home size={22} />
              <span className="text-[10px] mt-1">Home</span>
            </Link>

            <Link to="/syllabus" className={`flex flex-col items-center ${isActive("/syllabus")}`}>
              <Sparkles size={22} />
              <span className="text-[10px] mt-1">Skills</span>
            </Link>

            <Link to="/admin" className={`flex flex-col items-center ${isActive("/admin")}`}>
              <span className="text-[10px] mt-1">Admin</span>
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