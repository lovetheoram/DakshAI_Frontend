// src/components/social/ProfilePage.jsx
// Social Peer Profile Component (for /user/:id)

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageSquare, Sparkles, ArrowLeft, Loader2, Lock, ShieldCheck } from "lucide-react";
import socialApi from "../../api/socialApi";
import FollowButton from "./FollowButton";
import PostCard from "./PostCard";

export default function ProfilePage() {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    socialApi.getProfile(userId)
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
        const is_following = raw.is_following ?? raw.user?.is_following ?? rawData.is_following ?? rawData.user?.is_following;
        const is_self = raw.is_self ?? raw.user?.is_self ?? rawData.is_self ?? rawData.user?.is_self;
        const is_private = raw.is_private ?? raw.user?.is_private ?? false;

        setProfile({
          ...raw,
          id,
          username,
          is_following,
          is_self,
          is_private,
        });
      })
      .catch((err) => {
        console.error("Error loading user profile:", err);
      });

    socialApi.getPosts({ user_id: userId })
      .then((res) => {
        setPosts(res.data?.posts || []);
      })
      .catch((err) => {
        console.error("Error loading user posts:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 size={24} className="animate-spin text-[var(--color-gold)]" />
        <p className="text-xs text-[var(--color-text-secondary)] font-medium">Loading user profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center daksh-card space-y-3">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">User not found</h2>
        <p className="text-xs text-[var(--color-text-secondary)] font-medium">
          User ID #{userId} does not exist in the platform database.
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

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 space-y-6 select-none text-left">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-gold-dark)] text-xs font-semibold transition cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Social
      </button>

      {/* Header Profile Card */}
      <div className="daksh-card p-6 border-t-4 border-t-[var(--color-gold)] space-y-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md">
                {profile.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" title="Active learner" />
            </div>

            {/* Details */}
            <div>
              <h1 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center justify-center sm:justify-start gap-2">
                {profile.username}
                {profile.is_self && (
                  <span className="text-[10px] bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    You
                  </span>
                )}
                {profile.is_private && (
                  <span className="text-[10px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                    <Lock size={10} />
                    Protected
                  </span>
                )}
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-0.5 flex items-center gap-1">
                <ShieldCheck size={14} className="text-[var(--color-gold-dark)]" />
                DakshAI Peer Student
              </p>
              <p className="text-xs text-[var(--color-text-primary)] mt-2 font-medium leading-relaxed max-w-md">
                {profile.bio || "Dedicated student pushing limits in concept mastery & active retrieval."}
              </p>
            </div>
          </div>

          {/* Actions */}
          {!profile.is_self && (
            <div className="flex items-center gap-2 shrink-0">
              <FollowButton userId={profile.id} isFollowing={profile.is_following} />
              
              <button
                onClick={() => navigate(`/messages/${profile.id}`)}
                className="px-3.5 py-2 rounded-xl bg-[var(--color-bg-primary)] hover:bg-[var(--color-gold-pale)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5 cursor-pointer transition"
              >
                <MessageSquare size={14} className="text-[var(--color-gold-dark)]" />
                <span>Message</span>
              </button>
            </div>
          )}
        </div>

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
            {profile.username}&apos;s account details are protected. Follow them to view their shared study notes, badges, and exam trajectory.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="text-[var(--color-gold-dark)]" size={16} />
            Recent Shared Posts
          </h2>
          
          {posts.length === 0 ? (
            <div className="daksh-card p-6 text-center text-xs text-[var(--color-text-secondary)] font-medium">
              No updates or posts shared yet by this student.
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
    </div>
  );
}

