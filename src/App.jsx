// src/App.jsx
import {React, useContext} from "react";
import { Routes, Route } from "react-router-dom";

import PageWrapper from "./components/layout/PageWrapper";

import Home from "./components/layout/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Profile from "./components/auth/Profile"; // your personal profile

import TopicNode from "./components/syllabus/TopicNode";

import ProtectedRoute from "./components/auth/ProtectedRoute";

// Social Components
import FeedPage from "./components/social/FeedPage";
import UserProfilePage from "./components/social/ProfilePage";
import NotificationPage from "./components/social/NotificationPage";
import ChatPage from "./components/social/ChatPage";
import InboxPage from "./components/social/InboxPage";
import { AuthContext } from "./context/AuthContext";
import About from "./components/about/About";
import AdminDashboard from "./components/admin/AdminDashboard";


export default function App() {
  // 🔒 Wait for auth to initialize
    const { loading, user } = useContext(AuthContext);

  if (loading) {
    return <div style={{ padding: 40 }}>Initializing session...</div>;
  }
  return (
    <PageWrapper>
      <Routes>
        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About/>}/>
        {/* ---------------- PROTECTED ROUTES ---------------- */}

        {/* User's Own Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Social Media User Profile */}
        <Route
          path="/user/:id"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Feed */}
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          }
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          }
        />

        {/* Messaging */}

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

        {/* Syllabus */}
        <Route
          path="/syllabus"
          element={
            <ProtectedRoute>
              <TopicNode />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard/>
            </ProtectedRoute>
          }
        />

        {/* ---------------- CATCH-ALL REDIRECT ---------------- */}
        <Route path="*" element={<Home />} />
      </Routes>
    </PageWrapper>
  );
}
