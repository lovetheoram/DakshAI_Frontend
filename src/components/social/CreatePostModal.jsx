import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  HelpCircle,
  FolderGit2,
  Trophy,
  MessageSquare,
  Globe,
  Users,
  Image as ImageIcon,
  Tag,
  Loader2,
  Check,
} from "lucide-react";
import socialApi from "../../api/socialApi";

const CONTENT_TYPES = [
  { id: "general", label: "Reflection", icon: MessageSquare, desc: "Ideas, notes, discussions" },
  { id: "project", label: "Project", icon: FolderGit2, desc: "Showcase code, hardware, or research" },
  { id: "question", label: "Question", icon: HelpCircle, desc: "Ask peers for assistance" },
  { id: "milestone", label: "Milestone", icon: Trophy, desc: "Celebrate an achievement" },
];

export default function CreatePostModal({ isOpen, onClose, onPostCreated, defaultCommunity = null }) {
  const [contentType, setContentType] = useState("general");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [communities, setCommunities] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState(defaultCommunity?.id || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      socialApi.getCommunities().then((res) => {
        setCommunities(res.data?.communities || []);
      }).catch(() => {});
      if (defaultCommunity) {
        setSelectedCommunityId(defaultCommunity.id);
      }
    }
  }, [isOpen, defaultCommunity]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !title.trim()) {
      setError("Please write some content or a title for your post.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean);

      if (imageFile) {
        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("content", content.trim());
        formData.append("content_type", contentType);
        formData.append("visibility", visibility);
        if (selectedCommunityId) formData.append("community", selectedCommunityId);
        parsedTags.forEach((tag) => formData.append("tags", tag));
        formData.append("images", imageFile);

        const res = await socialApi.createPost(formData);
        if (onPostCreated) onPostCreated(res.data?.data);
      } else {
        const payload = {
          title: title.trim(),
          content: content.trim(),
          content_type: contentType,
          visibility,
          community: selectedCommunityId || null,
          tags: parsedTags,
        };
        const res = await socialApi.createPost(payload);
        if (onPostCreated) onPostCreated(res.data?.data);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTitle("");
        setContent("");
        setTagsInput("");
        setImageFile(null);
        setImagePreview(null);
        onClose();
      }, 700);
    } catch (err) {
      console.error("Failed to create post:", err);
      setError(err.response?.data?.detail || "Could not publish post. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-xl w-full bg-white dark:bg-zinc-900 border border-[var(--color-border)] rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-5 max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--color-text-primary)]">Publish to DakshAI</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">Share your curiosity, creations, and inquiries</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[var(--color-mid-gray)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
              <Check size={16} /> Post published to the student ecosystem!
            </div>
          )}

          {/* Type Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CONTENT_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = contentType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setContentType(type.id)}
                  className={`p-2.5 rounded-2xl border text-left flex flex-col items-start gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? "border-[var(--color-gold)] bg-[var(--color-gold-pale)] shadow-xs"
                      : "border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 hover:border-[var(--color-gold)]/40"
                  }`}
                >
                  <Icon size={16} className={isSelected ? "text-[var(--color-gold-dark)]" : "text-[var(--color-mid-gray)]"} />
                  <span className={`text-xs font-bold ${isSelected ? "text-[var(--color-gold-dark)]" : "text-[var(--color-text-primary)]"}`}>
                    {type.label}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-secondary)] leading-tight hidden sm:block">
                    {type.desc}
                  </span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title (Recommended for Project / Question) */}
            <div>
              <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
                {contentType === "project" ? "Project Name" : contentType === "question" ? "Question Summary" : "Title (Optional)"}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  contentType === "project"
                    ? "e.g. Autonomous Mars Rover Simulator"
                    : contentType === "question"
                    ? "e.g. How does Heisenberg's uncertainty principle affect orbitals?"
                    : "Give your post a descriptive headline..."
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)] transition-colors"
              />
            </div>

            {/* Main Content */}
            <div>
              <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
                {contentType === "project" ? "Project Details & Learnings" : "Content"}
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  contentType === "project"
                    ? "Explain the problem you solved, technologies used, challenges overcome, and GitHub/demo links..."
                    : contentType === "question"
                    ? "Explain what you have attempted so far and where you are feeling stuck..."
                    : "Share your reflection, insight, or experience with the student community..."
                }
                className="w-full px-4 py-3 rounded-2xl border border-[var(--color-border)] bg-transparent text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)] transition-colors resize-none leading-relaxed"
                required
              />
            </div>

            {/* Media Upload & Preview */}
            {imagePreview && (
              <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] max-h-48 group">
                <img src={imagePreview} alt="Upload preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Tags & Community Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
                  Tags (comma separated)
                </label>
                <div className="relative">
                  <Tag size={13} className="absolute left-3.5 top-3 text-[var(--color-mid-gray)]" />
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Python, Robotics, Physics"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--color-border)] bg-transparent text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
                  Post to Circle (Optional)
                </label>
                <div className="relative">
                  <Users size={13} className="absolute left-3.5 top-3 text-[var(--color-mid-gray)]" />
                  <select
                    value={selectedCommunityId}
                    onChange={(e) => setSelectedCommunityId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--color-border)] bg-white dark:bg-zinc-800 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)]"
                  >
                    <option value="">Public World Feed</option>
                    {communities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Visibility & Action Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <label className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-gold)] text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 cursor-pointer transition-colors">
                  <ImageIcon size={14} className="text-[var(--color-gold-dark)]" />
                  <span>Attach Image</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>

                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                  <Globe size={13} />
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="bg-transparent border-none text-xs font-semibold text-[var(--color-text-primary)] focus:outline-none cursor-pointer"
                  >
                    <option value="public">Public</option>
                    <option value="connections">Connections Only</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[var(--color-gold)] text-black font-bold text-xs hover:bg-[var(--color-gold-dark)] hover:text-white transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Post"
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
