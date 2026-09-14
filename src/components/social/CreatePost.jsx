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
    <div className="bg-slate-900/90 rounded-2xl p-5 sm:p-6 space-y-4 text-slate-100 border border-indigo-500/30 shadow-xl shadow-slate-950/60 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-indigo-500 to-amber-500 opacity-60" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-black text-xs uppercase tracking-wider text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Share Peer Study Update
        </h3>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Community Space</span>
      </div>

      {/* Concept Select */}
      <div>
        {selectedConcept ? (
          <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2 text-xs text-amber-300">
            <span className="truncate pr-2 font-bold">
              Linked Concept: {concepts.find((c) => String(c.id) === String(selectedConcept))?.name}
            </span>
            <button
              type="button"
              onClick={() => setSelectedConcept("")}
              className="text-amber-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowConceptPicker(true)}
            className="w-full bg-slate-950 border border-slate-800 hover:border-indigo-500/60 rounded-xl px-4 py-2.5 text-left text-xs text-slate-400 hover:text-slate-200 transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Link to a Concept (optional)</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
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
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
          />

          <div className="max-h-[250px] overflow-y-auto space-y-1 pr-1">
            {concepts.filter((c) => c.name.toLowerCase().includes(conceptSearch.toLowerCase())).length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No matching concepts</p>
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
                    className="w-full text-left px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:text-amber-300 hover:bg-slate-800 transition-colors block truncate cursor-pointer"
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
        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/60 rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition resize-none"
        rows={isExpanded ? 4 : 3}
        placeholder="What concept, insight, or question are you exploring today?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setIsExpanded(true)}
      />

      {/* Media Attachment Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-indigo-500/40 rounded-xl cursor-pointer text-xs font-bold text-slate-300 hover:text-white transition-all">
          <Image size={14} className="text-amber-400" />
          <span>Image</span>
          <input type="file" multiple accept="image/*" hidden onChange={handleImages} />
        </label>

        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-indigo-500/40 rounded-xl cursor-pointer text-xs font-bold text-slate-300 hover:text-white transition-all">
          <FileText size={14} className="text-amber-400" />
          <span>Document</span>
          <input type="file" multiple hidden onChange={handleDocuments} />
        </label>

        <button
          type="button"
          onClick={() => setShowVideoInput(!showVideoInput)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <Video size={14} className="text-amber-400" />
          <span>YouTube Link</span>
        </button>
      </div>

      {/* YouTube Drawer */}
      {showVideoInput && (
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Add YouTube Video Link</label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste YouTube URL..."
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 flex-1 outline-none"
            />
            <button
              type="button"
              onClick={handleAddVideo}
              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 text-xs font-bold rounded-xl shrink-0 cursor-pointer"
            >
              Add
            </button>
          </div>
          {videoError && <p className="text-[10px] text-rose-400 font-bold">{videoError}</p>}
        </div>
      )}

      {/* Previews */}
      {(imagePreviews.length > 0 || videos.length > 0) && (
        <div className="space-y-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden aspect-square border border-slate-800">
                  <img src={src} className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full"><X size={12} /></button>
                </div>
              ))}
            </div>
          )}

          {videos.map((url, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video">
              <iframe
                src={url}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => removeVideo(i)}
                className="absolute top-2 right-2 bg-black/80 text-white p-1.5 rounded-full hover:bg-rose-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit CTA */}
      <div className="flex justify-end pt-2 border-t border-slate-800">
        <button
          onClick={submit}
          disabled={!content && !images.length && !videos.length && !documents.length}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-amber-500/20 transition active:scale-[0.98] disabled:opacity-40 cursor-pointer"
        >
          Post Update 🚀
        </button>
      </div>
    </div>
  );
}
