// src/components/social/CreatePost.jsx
import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import socialApi from "../../api/socialApi";
import syllabusApi from "../../api/syllabusApi";
import { AuthContext } from "../../context/AuthContext";
import { Image, FileText, Video, X, Sparkles } from "lucide-react";
import Modal from "../ui/Modal";

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

export default function CreatePost({ onPostCreated }) {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoInput, setVideoInput] = useState("");
  const [videoError, setVideoError] = useState("");
  const [concepts, setConcepts] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);

  const [showConceptPicker, setShowConceptPicker] = useState(false);
  const [conceptSearch, setConceptSearch] = useState("");

  useEffect(() => {
    syllabusApi.getConceptList()
      .then((res) => setConcepts(Array.isArray(res) ? res : res?.concepts || []))
      .catch(() => setConcepts([]));
  }, []);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    setIsExpanded(true);
  };

  const handleDocuments = (e) => {
    setDocuments((prev) => [...prev, ...Array.from(e.target.files)]);
    setIsExpanded(true);
  };

  const handleAddVideo = () => {
    setVideoError("");
    if (!videoInput.trim()) return;
    const embed = parseYouTubeEmbedUrl(videoInput.trim());
    if (!embed) {
      setVideoError("Invalid YouTube URL. Please paste a valid YouTube watch or shorts link.");
      return;
    }
    setVideos((prev) => [...prev, embed]);
    setVideoInput("");
    setShowVideoInput(false);
    setIsExpanded(true);
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

    const formData = new FormData();
    formData.append("content", content);
    formData.append("post_type", "general");
    if (selectedConcept) formData.append("concept", selectedConcept);
    images.forEach((img) => formData.append("images", img));
    documents.forEach((doc) => formData.append("documents", doc));
    videos.forEach((v) => formData.append("videos", v));

    try {
      const res = await socialApi.createPost(formData);
      onPostCreated(res.data.data);

      setContent("");
      setSelectedConcept("");
      setImages([]);
      setImagePreviews([]);
      setDocuments([]);
      setVideos([]);
      setIsExpanded(false);
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className="daksh-card p-5 sm:p-6 space-y-4 text-[var(--color-text-primary)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--color-text-primary)]">
          Share Peer Update
        </h3>
        <span className="text-[10px] text-[var(--color-mid-gray)]">Community Space</span>
      </div>

      {/* Concept Select */}
      <div>
        {selectedConcept ? (
          <div className="flex items-center justify-between bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30 rounded-xl px-4 py-2 text-xs text-[var(--color-gold-dark)]">
            <span className="truncate pr-2 font-medium">
              Linked Concept: {concepts.find((c) => String(c.id) === String(selectedConcept))?.name}
            </span>
            <button
              type="button"
              onClick={() => setSelectedConcept("")}
              className="text-[var(--color-gold-dark)] hover:text-[var(--color-text-primary)] p-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowConceptPicker(true)}
            className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl px-4 py-2 text-left text-xs text-[var(--color-text-secondary)] hover:border-[var(--color-gold)] transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Link to a Concept (optional)</span>
            <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
          </button>
        )}
      </div>

      {/* Concept Picker Modal */}
      <Modal isOpen={showConceptPicker} onClose={() => setShowConceptPicker(false)} title="Select Concept">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search concepts..."
            value={conceptSearch}
            onChange={(e) => setConceptSearch(e.target.value)}
            className="input-field py-2 text-xs"
          />

          <div className="max-h-[250px] overflow-y-auto space-y-1 pr-1">
            {concepts.filter((c) => c.name.toLowerCase().includes(conceptSearch.toLowerCase())).length === 0 ? (
              <p className="text-xs text-[var(--color-text-secondary)] text-center py-6">No matching concepts</p>
            ) : (
              concepts
                .filter((c) => c.name.toLowerCase().includes(conceptSearch.toLowerCase()))
                .map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedConcept(String(c.id));
                      setShowConceptPicker(false);
                      setConceptSearch("");
                    }}
                    className="w-full text-left px-3.5 py-2 rounded-xl text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-gold-dark)] hover:bg-[var(--color-gold-pale)] transition-colors block truncate cursor-pointer"
                  >
                    {c.name}
                  </button>
                ))
            )}
          </div>
        </div>
      </Modal>

      {/* Content Textarea */}
      <textarea
        className="input-field resize-none text-xs sm:text-sm p-3.5"
        rows={isExpanded ? 4 : 3}
        placeholder="What concept or insight are you exploring?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setIsExpanded(true)}
      />

      {/* Media Attachment Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-gold)] rounded-xl cursor-pointer text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all">
          <Image size={14} className="text-[var(--color-gold)]" />
          <span>Image</span>
          <input type="file" multiple accept="image/*" hidden onChange={handleImages} />
        </label>

        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-gold)] rounded-xl cursor-pointer text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all">
          <FileText size={14} className="text-[var(--color-gold)]" />
          <span>Document</span>
          <input type="file" multiple hidden onChange={handleDocuments} />
        </label>

        <button
          type="button"
          onClick={() => setShowVideoInput(!showVideoInput)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-gold)] rounded-xl text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
        >
          <Video size={14} className="text-[var(--color-gold)]" />
          <span>YouTube Link</span>
        </button>
      </div>

      {/* YouTube Drawer */}
      {showVideoInput && (
        <div className="p-3 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl space-y-2">
          <label className="block text-[10px] font-bold text-[var(--color-text-primary)] uppercase">Add YouTube Video Link</label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste YouTube URL..."
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              className="input-field py-1.5 text-xs flex-1"
            />
            <button
              type="button"
              onClick={handleAddVideo}
              className="btn-gold px-4 py-1.5 text-xs font-bold shrink-0"
            >
              Add
            </button>
          </div>
          {videoError && <p className="text-[10px] text-[var(--color-danger)] font-semibold">{videoError}</p>}
        </div>
      )}

      {/* Previews */}
      {(imagePreviews.length > 0 || videos.length > 0) && (
        <div className="space-y-3 p-3 bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)]">
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden aspect-square border border-[var(--color-border)]">
                  <img src={src} className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full"><X size={12} /></button>
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
                className="absolute top-2 right-2 bg-black/80 text-white p-1.5 rounded-full hover:bg-[var(--color-danger)] transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit CTA */}
      <div className="flex justify-end pt-2 border-t border-[var(--color-border)]">
        <button
          onClick={submit}
          disabled={!content && !images.length && !videos.length && !documents.length}
          className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40"
        >
          Post Update
        </button>
      </div>
    </div>
  );
}
