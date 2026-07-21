// src/components/social/CreatePost.jsx
import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import socialApi from "../../api/socialApi";
import syllabusApi from "../../api/syllabusApi";
import { AuthContext } from "../../context/AuthContext";
import { Image, FileText, Video, X, Sparkles, Plus } from "lucide-react";
import Modal from "../ui/Modal";

// Universal YouTube Embed Parser (Mobile & Desktop Compatible)
export const parseYouTubeEmbedUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const cleanUrl = url.trim();

  // Handles:
  // - youtube.com/watch?v=VIDEO_ID
  // - m.youtube.com/watch?v=VIDEO_ID
  // - youtu.be/VIDEO_ID
  // - youtube.com/shorts/VIDEO_ID
  // - youtube.com/embed/VIDEO_ID
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

  // Custom concept picker state
  const [showConceptPicker, setShowConceptPicker] = useState(false);
  const [conceptSearch, setConceptSearch] = useState("");

  useEffect(() => {
    syllabusApi.getConceptList()
      .then((res) => setConcepts(res))
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

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
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

      // Reset
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
    <motion.div layout className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-400 border border-purple-500/30 rounded-full flex items-center justify-center font-bold text-sm">
            ✨
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">
              Share Contribution
            </h3>
          </div>
        </div>
      </div>

      {/* Concept Select */}
      <div className="mb-3">
        {selectedConcept ? (
          <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-purple-300">
            <span className="truncate pr-2 font-medium">
              🎓 Linked Concept: {concepts.find((c) => String(c.id) === String(selectedConcept))?.name}
            </span>
            <button
              type="button"
              onClick={() => setSelectedConcept("")}
              className="text-purple-400 hover:text-white transition-colors p-1"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowConceptPicker(true)}
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-left text-xs text-gray-400 hover:border-purple-500/50 hover:text-white transition-all flex items-center justify-between"
          >
            <span>🎓 Link to a Concept (optional)</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
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
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
          />

          <div className="max-h-[250px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
            {concepts.filter((c) => c.name.toLowerCase().includes(conceptSearch.toLowerCase())).length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">No matching concepts</p>
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
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs text-gray-300 hover:text-purple-300 hover:bg-purple-500/5 transition-colors block truncate"
                  >
                    📚 {c.name}
                  </button>
                ))
            )}
          </div>
        </div>
      </Modal>

      {/* Content Textarea */}
      <textarea
        className="w-full resize-none bg-slate-950/60 border border-white/10 text-white text-xs sm:text-sm rounded-xl p-3.5 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 mb-3 transition-all duration-200"
        rows={isExpanded ? 4 : 3}
        placeholder="What are you building, learning, or discovering?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setIsExpanded(true)}
      />

      {/* Media Attachment Action Buttons (Mobile-optimized grid) */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <label className="flex items-center gap-2 px-3 py-2 bg-slate-950/60 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer text-xs font-semibold text-gray-300 hover:text-white transition-all">
          <Image size={15} className="text-blue-400" />
          <span>Image</span>
          <input type="file" multiple accept="image/*" hidden onChange={handleImages} />
        </label>

        <label className="flex items-center gap-2 px-3 py-2 bg-slate-950/60 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer text-xs font-semibold text-gray-300 hover:text-white transition-all">
          <FileText size={15} className="text-emerald-400" />
          <span>Document</span>
          <input type="file" multiple hidden onChange={handleDocuments} />
        </label>

        <button
          type="button"
          onClick={() => setShowVideoInput(!showVideoInput)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-950/60 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-all"
        >
          <Video size={15} className="text-red-400" />
          <span>YouTube Link</span>
        </button>
      </div>

      {/* Mobile-Friendly YouTube Input Drawer */}
      {showVideoInput && (
        <div className="p-3 bg-slate-950/80 border border-red-500/30 rounded-2xl mb-3 space-y-2">
          <label className="block text-[11px] font-bold text-red-400">Add YouTube Video or Short Link</label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste YouTube URL (e.g., https://youtu.be/...)"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
            <button
              type="button"
              onClick={handleAddVideo}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0"
            >
              Add Video
            </button>
          </div>
          {videoError && <p className="text-[11px] text-rose-400 font-semibold">{videoError}</p>}
        </div>
      )}

      {/* Previews */}
      {(imagePreviews.length > 0 || videos.length > 0 || documents.length > 0) && (
        <div className="space-y-3 mb-4 p-3 bg-slate-950/40 rounded-2xl border border-white/5">
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border border-white/10">
                  <img src={src} className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full"><X size={12} /></button>
                </div>
              ))}
            </div>
          )}

          {videos.map((url, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden border border-red-500/30 bg-black aspect-video">
              <iframe
                src={url}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => removeVideo(i)}
                className="absolute top-2 right-2 bg-black/80 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit CTA */}
      <div className="flex justify-end pt-2 border-t border-white/10">
        <button
          onClick={submit}
          disabled={!content && !images.length && !videos.length && !documents.length}
          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
        >
          Post to Community
        </button>
      </div>
    </motion.div>
  );
}
