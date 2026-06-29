


// CreatePostMobile.jsx
import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import socialApi from "../../api/socialApi";
import syllabusApi from "../../api/syllabusApi";
import { AuthContext } from "../../context/AuthContext";
import { Image, FileText, Video, X, Sparkles } from "lucide-react";
import Modal from "../ui/Modal";

const toYouTubeEmbed = (url) => {
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  const long = url.match(/v=([a-zA-Z0-9_-]+)/);
  const id = short?.[1] || long?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : null;
};

export default function CreatePost({ onPostCreated }) {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoInput, setVideoInput] = useState("");
  const [concepts, setConcepts] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

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
    const embed = toYouTubeEmbed(videoInput.trim());
    if (!embed) return alert("Invalid YouTube link");
    setVideos((prev) => [...prev, embed]);
    setVideoInput("");
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
    if (selectedConcept) formData.append("concept", selectedConcept);
    images.forEach((img) => formData.append("images", img));
    documents.forEach((doc) => formData.append("documents", doc));
    videos.forEach((v) => formData.append("videos", v));

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
  };

  return (
    <motion.div layout className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-4 mb-4 relative overflow-hidden sm:p-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center text-lg"
          >
            ✨
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg">
              Create Post
            </h3>
          </div>
        </div>
      </div>

      {/* Concept Select (Custom Search Modal Picker) */}
      <div className="mb-3">
        {selectedConcept ? (
          <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-purple-300">
            <span className="truncate pr-2 font-medium">
              🎓 Linked: {concepts.find((c) => String(c.id) === String(selectedConcept))?.name}
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
            <span>🎓 Link a Concept (optional)</span>
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
        className="w-full resize-none bg-slate-950/60 border border-white/10 text-white text-sm sm:text-base rounded-xl p-3.5 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 mb-3 transition-all duration-200"
        rows={isExpanded ? 4 : 3}
        placeholder="Share your thoughts, ideas, or discoveries..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setIsExpanded(true)}
      />

      {/* Media Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-blue-400 font-medium text-xs sm:text-sm">
          <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg"><Image size={16} /></div> Images
          <input type="file" multiple accept="image/*" hidden onChange={handleImages} />
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-emerald-400 font-medium text-xs sm:text-sm">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg"><FileText size={16} /></div> Documents
          <input type="file" multiple hidden onChange={handleDocuments} />
        </label>

        <div className="flex items-center gap-2 flex-1">
          <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg"><Video size={16} className="text-red-400" /></div>
          <input
            type="text"
            placeholder="YouTube link"
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
            className="flex-1 bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 transition-all duration-200"
          />
          <button
            onClick={handleAddVideo}
            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition active:scale-[0.97] border border-red-500/30"
          >
            Add
          </button>
        </div>
      </div>

      {/* Media Previews */}
      <AnimatePresence>
        {/* Images */}
        {imagePreviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative group">
                  <img src={src} className="h-24 w-full object-cover rounded-lg border border-white/10" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Documents */}
        {documents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 space-y-2"
          >
            {documents.map((d, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-950/60 rounded-xl p-3 border border-white/10 text-xs sm:text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-purple-400" />
                  {d.name}
                </div>
                <button onClick={() => removeDocument(i)} className="text-red-500 hover:text-red-600">
                  <X size={14} />
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 space-y-3"
          >
            {videos.map((v, i) => (
              <div key={i} className="relative group">
                <iframe
                  src={v}
                  className="w-full h-40 sm:h-60 rounded-lg border border-white/10"
                  allowFullScreen
                  title={`video-${i}`}
                />
                <button
                  onClick={() => removeVideo(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Button */}
      <button
        onClick={submit}
        disabled={!content && !images.length && !videos.length && !documents.length}
        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 disabled:bg-slate-800/80 disabled:from-slate-800 disabled:to-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed border border-white/5 hover:border-white/10 text-white py-3 sm:py-3.5 rounded-xl font-extrabold text-sm sm:text-base transition-all duration-200 active:scale-[0.98] shadow-lg"
      >
        <div className="flex items-center justify-center gap-2">
          <Sparkles size={18} />
          Share Your Creation ✨
        </div>
      </button>
    </motion.div>
  );
}
