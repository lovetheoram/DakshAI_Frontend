import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageSquare, ArrowLeft, Loader2, UserCheck, UserPlus, Lock, Clock, Check, X } from "lucide-react";
import socialApi from "../../api/socialApi";
import PostCard from "./PostCard";

export default function ProfilePage() {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("none"); // "none" | "pending" | "incoming_pending" | "accepted" | "rejected"
  const [actionLoading, setActionLoading] = useState(false);

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
        const status = raw.connection_status || (raw.user?.is_following ? "accepted" : "none");
        const is_self = raw.is_self ?? raw.user?.is_self ?? rawData.is_self ?? rawData.user?.is_self ?? false;

        setProfile({
          ...raw,
          id,
          username,
          is_self,
        });
        setConnectionStatus(status);
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

  const handleSendConnect = async () => {
    if (actionLoading || !profile?.id) return;
    setActionLoading(true);
    try {
      const res = await socialApi.followUser(profile.id);
      setConnectionStatus(res.data?.connection_status || "pending");
    } catch (err) {
      console.error("Connection request failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptConnection = async () => {
    if (actionLoading || !profile?.id) return;
    setActionLoading(true);
    try {
      const res = await socialApi.acceptConnection(profile.id, "accept");
      setConnectionStatus(res.data?.connection_status || "accepted");
    } catch (err) {
      console.error("Accept connection failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectOrDisconnect = async () => {
    if (actionLoading || !profile?.id) return;
    setActionLoading(true);
    try {
      const res = await socialApi.acceptConnection(profile.id, "reject");
      setConnectionStatus(res.data?.connection_status || "rejected");
    } catch (err) {
      console.error("Reject connection failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 size={24} className="animate-spin text-[var(--color-gold)]" />
        <p className="text-xs text-[var(--color-text-secondary)] font-medium">Loading learner profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center daksh-card space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">User not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="btn-gold px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isAccepted = connectionStatus === "accepted";
  const isPending = connectionStatus === "pending";
  const isIncomingPending = connectionStatus === "incoming_pending";

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 min-h-screen space-y-6 select-none">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-xs font-semibold transition cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      {/* Header Profile Card */}
      <div className="daksh-card p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/40 flex items-center justify-center font-bold text-2xl shadow-xs">
              {profile.username?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                {profile.username}
              </h1>
              {profile.is_self && (
                <span className="text-[10px] bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  You
                </span>
              )}
              {profile.exam_name && (
                <span className="text-[10px] bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] px-2.5 py-0.5 rounded-full font-semibold">
                  {profile.exam_name}
                </span>
              )}
            </div>

            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-xl mx-auto md:mx-0 font-normal">
              {profile.bio || "Learner pushing boundaries in concept understanding."}
            </p>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-8 pt-4 border-t border-[var(--color-border)]">
              <div className="text-center md:text-left">
                <span className="block text-base font-bold text-[var(--color-text-primary)]">{posts.length}</span>
                <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-semibold">Posts</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-base font-bold text-[var(--color-text-primary)]">
                  {profile.followers_count || 0}
                </span>
                <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-semibold">Connections</span>
              </div>
            </div>
          </div>

          {/* Connect & Message Actions */}
          {!profile.is_self && (
            <div className="flex flex-col gap-2.5 w-full md:w-auto mt-4 md:mt-0 shrink-0">
              {/* Connection Action Button */}
              {isAccepted ? (
                <button
                  onClick={handleRejectOrDisconnect}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:text-[var(--color-danger)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Click to disconnect"
                >
                  <UserCheck size={14} className="text-[var(--color-gold-dark)]" />
                  <span>Connected</span>
                </button>
              ) : isPending ? (
                <button
                  onClick={handleRejectOrDisconnect}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-bg-primary)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Click to cancel connection request"
                >
                  <Clock size={13} className="animate-pulse" />
                  <span>Request Pending</span>
                </button>
              ) : isIncomingPending ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAcceptConnection}
                    disabled={actionLoading}
                    className="btn-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check size={14} />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={handleRejectOrDisconnect}
                    disabled={actionLoading}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:text-[var(--color-danger)] cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSendConnect}
                  disabled={actionLoading}
                  className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <>
                      <UserPlus size={14} />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              )}

              {/* Message Button (Enabled only when Accepted) */}
              {isAccepted ? (
                <button
                  onClick={() => navigate(`/messages/${profile.id}`)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)] hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare size={14} />
                  <span>Message</span>
                </button>
              ) : (
                <div
                  className="px-4 py-2 rounded-xl text-[11px] font-semibold bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] opacity-75 flex items-center justify-center gap-1.5"
                  title="Connection must be accepted before direct messaging is unlocked"
                >
                  <Lock size={12} />
                  <span>{isPending ? "Pending approval" : "Connect to message"}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User's Posts Stream */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
          Activity & Reflections
        </h2>

        {posts.length === 0 ? (
          <div className="py-8 text-center border border-[var(--color-border)] rounded-2xl">
            <p className="text-xs text-[var(--color-text-secondary)]">No posts shared yet by this peer.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
