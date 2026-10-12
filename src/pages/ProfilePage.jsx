// src/pages/ProfilePage.jsx
// Complete People-First Student Profile & Identity Management
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import socialApi from "../api/socialApi";
import progressApi from "../api/progressApi";
import PostCard from "../components/social/PostCard";
import CreatePostModal from "../components/social/CreatePostModal";
import {
  User,
  ShieldCheck,
  ShieldAlert,
  Edit3,
  MapPin,
  Building,
  GraduationCap,
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Users,
  Target,
  ExternalLink,
  Check,
  X,
  Loader2,
  Lock,
  Eye,
  Settings,
  FolderGit2,
} from "lucide-react";

const STAGE_LABELS = {
  below_6: "Below Class 6",
  stage_6_10: "Class 6–10 (Foundations)",
  stage_11_12: "Class 11–12 (Boards)",
  jee: "JEE (Mains & Advanced)",
  neet: "NEET (Medical)",
  college: "College & University",
  placements: "Placements & Tech Careers",
  pcs: "Civil Services & State PCS",
  general: "Lifelong Learner",
};

export default function ProfilePage() {
  const { user, updateUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  // Active Tab: 'portfolio' | 'circles' | 'achievements'
  const [activeTab, setActiveTab] = useState("portfolio");

  // Profile Data
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userCircles, setUserCircles] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: "",
    education_stage: "stage_11_12",
    institution_name: "",
    grade_or_year: "",
    location_city: "",
    bio: "",
    interests: "",
    skills: "",
    is_minor: false,
    profile_visibility: "public",
    allow_dms: true,
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);

  const fetchFullProfile = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [dashRes, profileRes] = await Promise.all([
        progressApi.getDashboard().catch(() => null),
        user.id ? socialApi.getProfile(user.id).catch(() => null) : null,
      ]);

      if (dashRes) setDashboard(dashRes);

      const raw = profileRes?.data?.profile || profileRes?.data || user;
      setProfileData(raw);

      // Initialize edit form
      const profileObj = raw.profile || raw;
      setEditForm({
        display_name: profileObj.display_name || user.username || "",
        education_stage: profileObj.education_stage || "stage_11_12",
        institution_name: profileObj.institution_name || "",
        grade_or_year: profileObj.grade_or_year || "",
        location_city: profileObj.location_city || "",
        bio: profileObj.bio || user.bio || "",
        interests: Array.isArray(profileObj.interests) ? profileObj.interests.join(", ") : (profileObj.interests || ""),
        skills: Array.isArray(profileObj.skills) ? profileObj.skills.join(", ") : (profileObj.skills || ""),
        is_minor: Boolean(profileObj.is_minor),
        profile_visibility: profileObj.privacy_settings?.profile_visibility || "public",
        allow_dms: profileObj.privacy_settings?.direct_messages !== false,
      });

      // Fetch user's own posts
      if (user.id) {
        const postsRes = await socialApi.getPosts({ user_id: user.id }).catch(() => ({ data: { posts: [] } }));
        setUserPosts(postsRes.data?.posts || []);
      }

      // Fetch user's joined communities
      const commRes = await socialApi.getCommunities().catch(() => ({ data: { communities: [] } }));
      const allCommunities = commRes.data?.communities || [];
      const joined = allCommunities.filter((c) => c.is_member);
      setUserCircles(joined.length > 0 ? joined : allCommunities.slice(0, 3));
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFullProfile();
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);

      const interestsArray = editForm.interests
        ? editForm.interests.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const skillsArray = editForm.skills
        ? editForm.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        display_name: editForm.display_name,
        education_stage: editForm.education_stage,
        institution_name: editForm.institution_name,
        grade_or_year: editForm.grade_or_year,
        location_city: editForm.location_city,
        bio: editForm.bio,
        interests: interestsArray,
        skills: skillsArray,
        is_minor: editForm.is_minor,
        privacy_settings: {
          profile_visibility: editForm.profile_visibility,
          direct_messages: editForm.allow_dms,
          show_activity: true,
        },
      };

      const res = await socialApi.updateProfile(payload);
      const updatedUser = res.data?.user || res.data;
      if (updateUserData) {
        updateUserData({ ...user, ...updatedUser });
      }

      setSaveSuccess(true);
      await fetchFullProfile();
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditOpen(false);
      }, 1000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Please verify your inputs.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-3">
        <Loader2 className="animate-spin text-[var(--color-gold)] mx-auto" size={32} />
        <p className="text-xs font-semibold text-[var(--color-text-secondary)]">Loading student identity & journey...</p>
      </div>
    );
  }

  const profile = profileData?.profile || profileData || {};
  const displayName = profile.display_name || user?.username || "Student";
  const stage = profile.education_stage || "stage_11_12";
  const stageLabel = STAGE_LABELS[stage] || stage;
  const isMinor = Boolean(profile.is_minor);
  const interests = Array.isArray(profile.interests) ? profile.interests : [];
  const skills = Array.isArray(profile.skills) ? profile.skills : [];

  // Telemetry derivation
  const streakStats = dashboard?.streak_stats || {};
  const currentStreak = streakStats?.current_streak ?? streakStats?.practice_streak ?? 0;
  const totalActiveDays = streakStats?.total_active_days ?? 0;
  const questionsSolved = dashboard?.total_questions_solved ?? 0;
  const conceptsLearned = dashboard?.concepts_mastered_count ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 select-none text-left">
      {/* ========================================================= */}
      {/* 1. STUDENT IDENTITY BANNER */}
      {/* ========================================================= */}
      <div className="daksh-card p-6 sm:p-8 border-t-4 border-t-[var(--color-gold)] shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] text-white flex items-center justify-center font-black text-3xl shadow-lg border-2 border-white">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                  isMinor ? "bg-amber-500" : "bg-emerald-500"
                }`}
                title={isMinor ? "Protected Minor Account" : "Active Student"}
              >
                {isMinor ? <ShieldAlert size={12} className="text-white" /> : <Check size={12} className="text-white" />}
              </div>
            </div>

            {/* Core Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">
                  {displayName}
                </h1>
                <span className="text-xs text-[var(--color-text-secondary)] font-medium">
                  @{user?.username}
                </span>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/30">
                  {stageLabel}
                </span>
              </div>

              {/* Institution, Grade, Location */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-[var(--color-text-secondary)] font-medium pt-1">
                {profile.institution_name && (
                  <span className="flex items-center gap-1">
                    <Building size={14} className="text-[var(--color-gold-dark)]" />
                    {profile.institution_name}
                  </span>
                )}
                {profile.grade_or_year && (
                  <span className="flex items-center gap-1">
                    <GraduationCap size={14} className="text-[var(--color-gold-dark)]" />
                    {profile.grade_or_year}
                  </span>
                )}
                {profile.location_city && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-[var(--color-gold-dark)]" />
                    {profile.location_city}
                  </span>
                )}
              </div>

              {/* Bio */}
              <p className="text-xs text-[var(--color-text-primary)] font-medium leading-relaxed max-w-xl pt-1">
                {profile.bio || "Student expanding horizons in curiosity, problem-solving, and deep concepts."}
              </p>

              {/* Child Safety & Visibility Indicator */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                {isMinor ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <ShieldCheck size={12} />
                    Child-Safety Safeguards Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck size={12} />
                    Verified Peer Profile
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
                  <Eye size={12} />
                  Visibility: {profile.privacy_settings?.profile_visibility || "Public"}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setIsEditOpen(true)}
              className="w-full sm:w-auto btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:scale-105 transition-all"
            >
              <Edit3 size={14} />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => user?.id && navigate(`/profile/${user.id}`)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] text-xs font-bold text-[var(--color-text-secondary)] flex items-center justify-center gap-1.5 cursor-pointer transition"
              title="See how peers view you"
            >
              <ExternalLink size={13} />
              <span>Public View</span>
            </button>
          </div>
        </div>

        {/* Skills & Interests Tags */}
        {(skills.length > 0 || interests.length > 0) && (
          <div className="pt-5 mt-5 border-t border-[var(--color-border)] space-y-3">
            {skills.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-mid-gray)] mr-1">
                  Skills:
                </span>
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-text-primary)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
            {interests.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-mid-gray)] mr-1">
                  Interests:
                </span>
                {interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-indigo-700"
                  >
                    #{interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Counters Bar */}
        <div className="grid grid-cols-4 gap-2 pt-5 mt-5 border-t border-[var(--color-border)] text-center">
          <div>
            <span className="block text-xl font-black text-[var(--color-gold-dark)]">{userPosts.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-mid-gray)]">Posts</span>
          </div>
          <div>
            <span className="block text-xl font-black text-[var(--color-text-primary)]">
              {profile.followers_count || 0}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-mid-gray)]">Followers</span>
          </div>
          <div>
            <span className="block text-xl font-black text-[var(--color-text-primary)]">
              {profile.following_count || 0}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-mid-gray)]">Following</span>
          </div>
          <div>
            <span className="block text-xl font-black text-amber-500">{currentStreak}d</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-mid-gray)]">Streak</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. TAB NAVIGATION */}
      {/* ========================================================= */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-2 text-xs font-bold">
        {[
          { id: "portfolio", label: "My Posts & Projects", icon: FolderGit2, count: userPosts.length },
          { id: "circles", label: "My Circles & Guilds", icon: Users, count: userCircles.length },
          { id: "achievements", label: "Learning & Consistency", icon: Award, count: null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/30"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white border border-[var(--color-border)] font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 3. TAB CONTENT */}
      {/* ========================================================= */}
      {activeTab === "portfolio" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-[var(--color-gold-dark)]" />
              <span>Shared Reflections, Projects & Questions</span>
            </h2>
            <button
              onClick={() => setCreatePostOpen(true)}
              className="text-xs font-bold text-[var(--color-gold-dark)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              + Create Post
            </button>
          </div>

          {userPosts.length === 0 ? (
            <div className="daksh-card p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center mx-auto">
                <FolderGit2 size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">No posts shared yet</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-sm mx-auto">
                  Showcase a project, ask a challenging question, or share an insight with the student community.
                </p>
              </div>
              <button
                onClick={() => setCreatePostOpen(true)}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                <Sparkles size={14} />
                <span>Publish First Post</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPostDeleted={(deletedId) =>
                    setUserPosts((prev) => prev.filter((p) => p.id !== deletedId))
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "circles" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Users size={14} className="text-[var(--color-gold-dark)]" />
              <span>Joined Communities</span>
            </h2>
            <button
              onClick={() => navigate("/communities")}
              className="text-xs font-bold text-[var(--color-gold-dark)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Explore All Circles →
            </button>
          </div>

          {userCircles.length === 0 ? (
            <div className="daksh-card p-10 text-center space-y-3">
              <Users size={32} className="text-[var(--color-mid-gray)] mx-auto opacity-50" />
              <p className="text-xs text-[var(--color-text-secondary)]">You haven't joined any circles yet.</p>
              <button
                onClick={() => navigate("/communities")}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Browse Circles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userCircles.map((circle) => (
                <div
                  key={circle.id}
                  onClick={() => navigate(`/communities/${circle.slug || circle.id}`)}
                  className="daksh-card p-5 cursor-pointer hover:border-[var(--color-gold)] transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-gold-dark)]">
                      {circle.category}
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)] font-semibold">
                      {circle.members_count || 1} members
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-gold-dark)] transition-colors">
                    {circle.name}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                    {circle.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="space-y-6">
          {/* Lifetime Activity Stats */}
          <div className="daksh-card p-6 space-y-4">
            <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
              Lifetime Verified Learning Stats
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-1">
                <span className="text-2xl font-black text-[var(--color-gold-dark)] block">{conceptsLearned}</span>
                <span className="text-[10px] font-extrabold text-[var(--color-mid-gray)] uppercase tracking-wider block">
                  Concepts Mastered
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-1">
                <span className="text-2xl font-black text-[var(--color-text-primary)] block">{questionsSolved}</span>
                <span className="text-[10px] font-extrabold text-[var(--color-mid-gray)] uppercase tracking-wider block">
                  Questions Solved
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-1">
                <span className="text-2xl font-black text-emerald-600 block">{totalActiveDays}</span>
                <span className="text-[10px] font-extrabold text-[var(--color-mid-gray)] uppercase tracking-wider block">
                  Active Days
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] space-y-1">
                <span className="text-2xl font-black text-amber-500 block">{currentStreak}d</span>
                <span className="text-[10px] font-extrabold text-[var(--color-mid-gray)] uppercase tracking-wider block">
                  Current Streak
                </span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="daksh-card p-6 space-y-4">
            <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-[var(--color-gold-dark)]" />
              <span>Consistency & Milestone Badges</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[
                { emoji: "🌱", label: "1-Day Kickoff", req: 1, unlocked: currentStreak >= 1 },
                { emoji: "⚡", label: "3-Day Sprint", req: 3, unlocked: currentStreak >= 3 },
                { emoji: "🔥", label: "7-Day Habit", req: 7, unlocked: currentStreak >= 7 },
                { emoji: "🎯", label: "14-Day Trajectory", req: 14, unlocked: currentStreak >= 14 },
                { emoji: "👑", label: "21-Day Mastery", req: 21, unlocked: currentStreak >= 21 },
                { emoji: "💎", label: "30-Day Legend", req: 30, unlocked: currentStreak >= 30 },
              ].map((b, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                    b.unlocked
                      ? "bg-amber-500/10 border-amber-500/40 text-[var(--color-text-primary)] font-bold shadow-xs"
                      : "bg-[var(--color-bg-primary)] border-[var(--color-border)] text-[var(--color-mid-gray)] opacity-60"
                  }`}
                >
                  <span className="text-2xl">{b.emoji}</span>
                  <div>
                    <span className="block font-bold">{b.label}</span>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--color-mid-gray)]">
                      {b.unlocked ? "✓ Unlocked" : `${b.req}d needed`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. EDIT PROFILE MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="fixed inset-0" onClick={() => setIsEditOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative max-w-xl w-full daksh-card p-6 space-y-5 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-bold">
                    <Edit3 size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Edit Student Identity</h3>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">Update your stage, skills, and safety options</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="w-8 h-8 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)] cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-semibold">
                {/* Display Name */}
                <div>
                  <label className="block text-[var(--color-text-secondary)] mb-1">Display Name</label>
                  <input
                    type="text"
                    value={editForm.display_name}
                    onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                    placeholder="Your Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)]"
                    required
                  />
                </div>

                {/* Education Stage */}
                <div>
                  <label className="block text-[var(--color-text-secondary)] mb-1">Education Stage / Current Journey</label>
                  <select
                    value={editForm.education_stage}
                    onChange={(e) => setEditForm({ ...editForm, education_stage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)]"
                  >
                    {Object.entries(STAGE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Institution & Grade */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--color-text-secondary)] mb-1">School / College / Institute</label>
                    <input
                      type="text"
                      value={editForm.institution_name}
                      onChange={(e) => setEditForm({ ...editForm, institution_name: e.target.value })}
                      placeholder="e.g. Modern High School / IIT Delhi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--color-text-secondary)] mb-1">Grade or College Year</label>
                    <input
                      type="text"
                      value={editForm.grade_or_year}
                      onChange={(e) => setEditForm({ ...editForm, grade_or_year: e.target.value })}
                      placeholder="e.g. Grade 11, 2nd Year"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)]"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-[var(--color-text-secondary)] mb-1">Location City</label>
                  <input
                    type="text"
                    value={editForm.location_city}
                    onChange={(e) => setEditForm({ ...editForm, location_city: e.target.value })}
                    placeholder="e.g. Bangalore, Lucknow, Pune"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)]"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-[var(--color-text-secondary)] mb-1">Bio / Learning Mantra</label>
                  <textarea
                    rows={2}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Share what you're passionate about or exploring right now..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)] resize-none"
                  />
                </div>

                {/* Skills & Interests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--color-text-secondary)] mb-1">Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={editForm.skills}
                      onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                      placeholder="Python, Organic Chem, Calculus"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--color-text-secondary)] mb-1">Interests (comma-separated)</label>
                    <input
                      type="text"
                      value={editForm.interests}
                      onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                      placeholder="Robotics, Astrophysics, AI"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)]"
                    />
                  </div>
                </div>

                {/* Child Safety & Privacy */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-amber-600" />
                    <span className="text-xs font-bold text-amber-800">Child-Safety & Privacy Options</span>
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.is_minor}
                      onChange={(e) => setEditForm({ ...editForm, is_minor: e.target.checked })}
                      className="mt-0.5 rounded border-[var(--color-border)] text-[var(--color-gold)] focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-bold text-[var(--color-text-primary)] block">
                        Minor Account Safeguard (<span className="text-amber-600">Under 18</span>)
                      </span>
                      <span className="text-[11px] text-[var(--color-text-secondary)] font-normal leading-tight block">
                        Enforces server-side child protection, auto-moderates public text, and restricts untrusted direct outreach.
                      </span>
                    </div>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] text-[var(--color-text-secondary)] mb-1">Profile Visibility</label>
                      <select
                        value={editForm.profile_visibility}
                        onChange={(e) => setEditForm({ ...editForm, profile_visibility: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] text-xs font-semibold"
                      >
                        <option value="public">Public (Everyone)</option>
                        <option value="followers">Followers Only</option>
                        <option value="private">Private (Only Me)</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.allow_dms}
                          onChange={(e) => setEditForm({ ...editForm, allow_dms: e.target.checked })}
                          className="rounded border-[var(--color-border)] text-[var(--color-gold)]"
                        />
                        <span className="text-xs text-[var(--color-text-primary)]">Allow Direct Messages</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : saveSuccess ? (
                      <>
                        <Check size={14} />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Post Creation Modal */}
      <CreatePostModal
        isOpen={createPostOpen}
        onClose={() => setCreatePostOpen(false)}
        onPostCreated={() => {
          setCreatePostOpen(false);
          fetchFullProfile();
        }}
      />
    </div>
  );
}
