// src/components/social/CreatePost.jsx
// Clean tactile Post Creation — 100% Ivory + Ink + Antique Gold identity.

import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import socialApi from "../../api/socialApi";
import { Image, FileText, Video, X } from "lucide-react";

export const parseYouTubeEmbedUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const cleanUrl = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = cleanUrl.match(regExp);

  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}`;
  }
  return null;
};

export default function CreatePost({ onPostCreated, conceptId = null, initialContentType = "general" }) {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(conceptId ? "learning" : initialContentType);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoInput, setVideoInput] = useState("");
  const [videoError, setVideoError] = useState("");
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const handleDocuments = (e) => {
    setDocuments((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const handleAddVideo = () => {
    setVideoError("");
    if (!videoInput.trim()) return;
    const embed = parseYouTubeEmbedUrl(videoInput.trim());
    if (!embed) {
      setVideoError("Invalid YouTube URL. Please paste a valid watch or shorts link.");
      return;
    }
    setVideos((prev) => [...prev, embed]);
    setVideoInput("");
    setShowVideoInput(false);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = async () => {
    if (!content && !images.length && !videos.length && !documents.length) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("content", content);
      formData.append("content_type", contentType);
      formData.append("source", conceptId ? "concept" : "world");
      if (conceptId) {
        formData.append("concept", conceptId);
      }

      images.forEach((img) => formData.append("images", img));
      documents.forEach((doc) => formData.append("documents", doc));
      videos.forEach((v) => formData.append("videos", v));

      const res = await socialApi.createPost(formData);
      if (onPostCreated) {
        onPostCreated(res.data.data);
      }

      setContent("");
      setImages([]);
      setImagePreviews([]);
      setDocuments([]);
      setVideos([]);
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const contentTypes = [
    { key: "general", label: "General" },
    { key: "learning", label: "Learning" },
    { key: "strategy", label: "Strategy" },
    { key: "discovery", label: "Discovery" },
    { key: "project", label: "Project" },
  ];

  return (
    <div className="daksh-card p-5 space-y-4 text-[var(--color-text-primary)] select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-bold text-xs border border-[var(--color-gold)]/30">
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <span className="font-bold text-xs text-[var(--color-text-primary)]">
            {user?.username || "Learner"}
          </span>
        </div>
      </div>

      {/* Content Textarea */}
      <textarea
        className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] focus:border-[var(--color-gold)] rounded-xl p-3.5 text-xs sm:text-sm text-[var(--color-text-primary)] placeholder-[var(--color-mid-gray)] outline-none transition resize-none font-normal leading-relaxed"
        rows={3}
        placeholder="Share what you learned, discovered, or achieved today..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Media Attachment Action Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-gold)]/50 rounded-xl cursor-pointer text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all">
            <Image size={14} className="text-[var(--color-gold-dark)]" />
            <span>Image</span>
            <input type="file" multiple accept="image/*" hidden onChange={handleImages} />
          </label>

          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-gold)]/50 rounded-xl cursor-pointer text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all">
            <FileText size={14} className="text-[var(--color-gold-dark)]" />
            <span>Document</span>
            <input type="file" multiple hidden onChange={handleDocuments} />
          </label>

          <button
            type="button"
            onClick={() => setShowVideoInput(!showVideoInput)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-gold)]/50 rounded-xl text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
          >
            <Video size={14} className="text-[var(--color-gold-dark)]" />
            <span>YouTube Link</span>
          </button>
        </div>

        <button
          onClick={submit}
          disabled={submitting || (!content && !images.length && !videos.length && !documents.length)}
          className="btn-gold px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
        >
          {submitting ? "Posting..." : "Post Experience"}
        </button>
      </div>

      {/* YouTube Drawer */}
      {showVideoInput && (
        <div className="p-3 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl space-y-2">
          <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
            YouTube Video Link
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste YouTube watch or shorts URL..."
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl px-3 py-1.5 text-xs text-[var(--color-text-primary)] flex-1 outline-none"
            />
            <button
              type="button"
              onClick={handleAddVideo}
              className="btn-gold px-3 py-1.5 text-xs font-bold rounded-xl shrink-0 cursor-pointer"
            >
              Add Video
            </button>
          </div>
          {videoError && <p className="text-[10px] text-[var(--color-danger)] font-bold">{videoError}</p>}
        </div>
      )}

      {/* Previews */}
      {(imagePreviews.length > 0 || videos.length > 0) && (
        <div className="space-y-3 p-3 bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)]">
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden aspect-square border border-[var(--color-border)]">
                  <img src={src} className="w-full h-full object-cover" alt="Preview" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full cursor-pointer hover:bg-rose-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {videos.map((url, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden border border-[var(--color-border)] bg-black aspect-video">
              <iframe
                src={url}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => removeVideo(i)}
                className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-rose-600 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
