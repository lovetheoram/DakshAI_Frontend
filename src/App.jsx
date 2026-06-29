// src/App.jsx
import { React, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";

// New Pages
import Home from "./pages/Home";
import LearnPage from "./pages/LearnPage";
import PracticePage from "./pages/PracticePage";
import CommunityPage from "./pages/CommunityPage";
import GrowthPage from "./pages/GrowthPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

// Kept & Restyled Pages/Components
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import About from "./components/about/About";
import AdminDashboard from "./components/admin/AdminDashboard";
import NotificationPage from "./components/social/NotificationPage";
import InboxPage from "./components/social/InboxPage";
import ChatPage from "./components/social/ChatPage";
import UserProfilePage from "./components/social/ProfilePage";
import FullScreenQuiz from "./components/quiz/FullScreenQuiz";

export default function App() {
  const { loading, user } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center text-sm font-semibold text-gray-400">
        Initializing session...
      </div>
    );
  }

  return (
    <AppShell>
      <Routes>
        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />

        {/* ---------------- PROTECTED ROUTES ---------------- */}
        <Route
          path="/learn"
          element={
            <ProtectedRoute>
              <LearnPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn/:conceptId"
          element={
            <ProtectedRoute>
              <LearnPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:conceptId"
          element={
            <ProtectedRoute>
              <FullScreenQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <PracticePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <CommunityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/growth"
          element={
            <ProtectedRoute>
              <GrowthPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Community details */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <InboxPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages/:userId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:id"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
