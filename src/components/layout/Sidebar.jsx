// src/components/layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ open }) {
  const navigation = [
    { name: "Dashboard", to: "/" },
    { name: "Syllabus", to: "/syllabus" },
    { name: "Quiz", to: "/quiz" },
    { name: "Progress", to: "/progress" },
    { name: "Social", to: "/social" },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <nav className="flex flex-col py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-6 py-3 text-sm font-medium ${
                isActive ? "bg-slate-800 text-white" : "text-slate-400"
              } hover:bg-slate-800 hover:text-white`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
