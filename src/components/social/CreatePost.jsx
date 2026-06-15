


// CreatePostMobile.jsx
import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import socialApi from "../../api/socialApi";
import syllabusApi from "../../api/syllabusApi";
import { AuthContext } from "../../context/AuthContext";
import { Image, FileText, Video, X, Sparkles } from "lucide-react";

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
  const [postStreak, setPostStreak] = useState(3);

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
    setPostStreak((prev) => prev + 1);

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
    <motion.div layout className="bg-white border rounded-2xl shadow-md p-4 mb-4 relative overflow-hidden sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-lg"
          >
            ✨
          </motion.div>
          <div>
            <h3 className="font-bold text-gray-800 text-base sm:text-lg">
              Create Amazing Content
            </h3>
            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              {/* <span className="text-orange-500 font-semibold">🔥 {postStreak} post streak</span> */}
              {/* <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-0.5 rounded-full font-bold"
              >
                +50 XP
              </motion.span> */}
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 px-3 py-1 rounded-full text-xs font-semibold">
          🎯 Level 12
        </div>
      </div>

      {/* Concept Select */}
      <div className="mb-3 relative">
        <select
          value={selectedConcept}
          onChange={(e) => setSelectedConcept(e.target.value)}
          className="w-full appearance-none bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
        >
          <option value="">🎓 Select Concept (optional)</option>
          {concepts.map((c) => (
            <option key={c.id} value={c.id}>📚 {c.name}</option>
          ))}
        </select>
        <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
      </div>

      {/* Content Textarea */}
      <textarea
        className="w-full resize-none text-gray-800 text-sm sm:text-base border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200 mb-3 transition"
        rows={isExpanded ? 4 : 3}
        placeholder="Share your thoughts, ideas, or discoveries..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setIsExpanded(true)}
      />

      {/* Media Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
        <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-blue-600 font-medium">
          <div className="p-2 bg-blue-100 rounded-lg"><Image size={16} /></div> Images
          <input type="file" multiple accept="image/*" hidden onChange={handleImages} />
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-green-600 font-medium">
          <div className="p-2 bg-green-100 rounded-lg"><FileText size={16} /></div> Documents
          <input type="file" multiple hidden onChange={handleDocuments} />
        </label>

        <div className="flex items-center gap-2 flex-1">
          <div className="p-2 bg-red-100 rounded-lg"><Video size={16} className="text-red-600" /></div>
          <input
            type="text"
            placeholder="YouTube link"
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
            className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-red-400 transition"
          />
          <button
            onClick={handleAddVideo}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold transition"
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
                  <img src={src} className="h-24 w-full object-cover rounded-lg border-2 border-gray-200" />
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
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 border border-gray-200 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-blue-600" />
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
                  className="w-full h-40 sm:h-60 rounded-lg border-2 border-gray-200"
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
        className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 text-white py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-lg transition-all duration-200"
      >
        <div className="flex items-center justify-center gap-2">
          <Sparkles size={18} />
          Share Your Creation ✨
        </div>
      </button>
    </motion.div>
  );
}
