// src/components/social/ProfilePage.jsx
// Peer Student Profile Component (for /user/:id and /profile/:id)
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Loader2,
  Lock,
  ShieldCheck,
  ShieldAlert,
  Building,
  GraduationCap,
  MapPin,
  Flag,
  UserX,
  MoreVertical,
  Check,
} from "lucide-react";
import socialApi from "../../api/socialApi";
import FollowButton from "./FollowButton";
import PostCard from "./PostCard";
import ReportModal from "./ReportModal";

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
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockingStatus, setBlockingStatus] = useState(false);

  const fetchProfileAndPosts = () => {
    setLoading(true);
    socialApi
      .getProfile(userId)
      .then((res) => {
        const rawData = res.data;
        let raw = rawData;
        if (rawData.profile) {
          raw = rawData.profile;
        } else if (rawData.data) {
          raw = rawData.data;
          if (raw.profile) raw = raw.profile;
        }

        const id = raw.user?.id || raw.id || rawData.user?.id || rawData.id;
        const username = raw.user?.username || raw.username || rawData.user?.username || rawData.username;
        const displayName = raw.display_name || raw.user?.display_name || username;
        const is_following = raw.is_following ?? raw.user?.is_following ?? rawData.is_following ?? rawData.user?.is_following;
        const is_self = raw.is_self ?? raw.user?.is_self ?? rawData.is_self ?? rawData.user?.is_self;
        const is_private = raw.is_private ?? raw.user?.is_private ?? false;

        setProfile({
          ...raw,
          id,
          username,
          display_name: displayName,
          is_following,
          is_self,
          is_private,
        });
      })
      .catch((err) => {
        console.error("Error loading user profile:", err);
      });

    socialApi
      .getPosts({ user_id: userId })
      .then((res) => {
        setPosts(res.data?.posts || []);
      })
      .catch((err) => {
        console.error("Error loading user posts:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProfileAndPosts();
  }, [userId]);

  const handleBlockUser = async () => {
    if (!profile?.id) return;
    const confirmBlock = window.confirm(`Block @${profile.username}? You won't see their posts or receive messages from them.`);
    if (!confirmBlock) return;

    try {
      setBlockingStatus(true);
      await socialApi.blockUser(profile.id);
      setIsBlocked(true);
      setMoreOpen(false);
      alert(`@${profile.username} has been blocked.`);
      navigate("/");
    } catch (err) {
      console.error("Failed to block user:", err);
      alert("Failed to block user.");
    } finally {
      setBlockingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 size={24} className="animate-spin text-[var(--color-gold)]" />
        <p className="text-xs text-[var(--color-text-secondary)] font-medium">Loading student profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center daksh-card space-y-3">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">User not found</h2>
        <p className="text-xs text-[var(--color-text-secondary)] font-medium">
          User ID #{userId} could not be located.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="btn-gold px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isProtected = profile.is_private && !profile.is_following && !profile.is_self;
  const stage = profile.education_stage || "stage_11_12";
  const stageLabel = STAGE_LABELS[stage] || stage;
  const isMinor = Boolean(profile.is_minor);
  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const interests = Array.isArray(profile.interests) ? profile.interests : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 select-none text-left">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-gold-dark)] text-xs font-semibold transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* More Options / Safety Actions */}
        {!profile.is_self && (
          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="w-8 h-8 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] cursor-pointer"
              title="More options"
            >
              <MoreVertical size={16} />
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-10 w-44 rounded-2xl bg-white border border-[var(--color-border)] shadow-xl p-1.5 z-30 space-y-1 text-xs font-semibold">
                <button
                  onClick={() => {
                    setMoreOpen(false);
                    setReportModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] cursor-pointer text-left"
                >
                  <Flag size={14} className="text-amber-500" />
                  <span>Report User</span>
                </button>
                <button
                  onClick={handleBlockUser}
                  disabled={blockingStatus}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer text-left"
                >
                  <UserX size={14} />
                  <span>Block @{profile.username}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Header Profile Card */}
      <div className="daksh-card p-6 border-t-4 border-t-[var(--color-gold)] space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md border-2 border-white">
                {(profile.display_name || profile.username)?.charAt(0).toUpperCase() || "U"}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                  isMinor ? "bg-amber-500" : "bg-emerald-500"
                }`}
                title={isMinor ? "Protected Minor Account" : "Active Student"}
              >
                {isMinor ? <ShieldAlert size={10} className="text-white" /> : <Check size={10} className="text-white" />}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-black text-[var(--color-text-primary)]">
                  {profile.display_name || profile.username}
                </h1>
                <span className="text-xs text-[var(--color-text-secondary)] font-medium">
                  @{profile.username}
                </span>
                {profile.is_self && (
                  <span className="text-[10px] bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    You
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/30">
                  {stageLabel}
                </span>
              </div>

              {/* Institution & City */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-[var(--color-text-secondary)] font-medium pt-0.5">
                {profile.institution_name && (
                  <span className="flex items-center gap-1">
                    <Building size={13} className="text-[var(--color-gold-dark)]" />
                    {profile.institution_name}
                  </span>
                )}
                {profile.grade_or_year && (
                  <span className="flex items-center gap-1">
                    <GraduationCap size={13} className="text-[var(--color-gold-dark)]" />
                    {profile.grade_or_year}
                  </span>
                )}
                {profile.location_city && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-[var(--color-gold-dark)]" />
                    {profile.location_city}
                  </span>
                )}
              </div>

              <p className="text-xs text-[var(--color-text-primary)] mt-2 font-medium leading-relaxed max-w-md">
                {profile.bio || "Dedicated student exploring concepts and sharing peer perspectives on DakshAI."}
              </p>
            </div>
          </div>

          {/* Actions */}
          {!profile.is_self && (
            <div className="flex items-center gap-2 shrink-0">
              <FollowButton userId={profile.id} isFollowing={profile.is_following} />

              <button
                onClick={() => navigate(`/messages/${profile.id}`)}
                className="px-3.5 py-2 rounded-xl bg-[var(--color-bg-primary)] hover:bg-[var(--color-gold-pale)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5 cursor-pointer transition shadow-xs"
              >
                <MessageSquare size={14} className="text-[var(--color-gold-dark)]" />
                <span>Message</span>
              </button>
            </div>
          )}
        </div>

        {/* Skills & Interests Tags */}
        {(skills.length > 0 || interests.length > 0) && (
          <div className="pt-3 border-t border-[var(--color-border)] flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[10px] font-bold text-[var(--color-text-primary)]"
              >
                {skill}
              </span>
            ))}
            {interests.map((interest, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700"
              >
                #{interest}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-around border-t border-[var(--color-border)] pt-4 text-center">
          <div>
            <span className="block text-lg font-black text-[var(--color-gold-dark)]">{posts.length}</span>
            <span className="text-[10px] text-[var(--color-mid-gray)] uppercase tracking-widest font-extrabold">Posts</span>
          </div>
          <div className="h-8 w-px bg-[var(--color-border)]" />
          <div>
            <span className="block text-lg font-black text-[var(--color-text-primary)]">{profile.followers_count || 0}</span>
            <span className="text-[10px] text-[var(--color-mid-gray)] uppercase tracking-widest font-extrabold">Followers</span>
          </div>
          <div className="h-8 w-px bg-[var(--color-border)]" />
          <div>
            <span className="block text-lg font-black text-emerald-600">{profile.following_count || 0}</span>
            <span className="text-[10px] text-[var(--color-mid-gray)] uppercase tracking-widest font-extrabold">Following</span>
          </div>
        </div>
      </div>

      {/* User Content: Public vs Protected */}
      {isProtected ? (
        <div className="daksh-card p-8 text-center space-y-3 border-t-2 border-t-[var(--color-gold)]">
          <div className="w-12 h-12 rounded-full bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/40 flex items-center justify-center mx-auto text-[var(--color-gold-dark)]">
            <Lock size={22} />
          </div>
          <h3 className="text-sm font-bold text-[var(--color-text-primary)]">This Profile is Protected</h3>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto leading-relaxed font-medium">
            {profile.display_name || profile.username}&apos;s profile is protected. Follow them to view their shared reflections, questions, and projects.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="text-[var(--color-gold-dark)]" size={16} />
            Shared Projects & Questions
          </h2>

          {posts.length === 0 ? (
            <div className="daksh-card p-8 text-center text-xs text-[var(--color-text-secondary)] font-medium">
              No public posts shared yet by this student.
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Structured Abuse/Safety Reporting Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType="user"
        targetId={profile.id}
      />
    </div>
  );
}
