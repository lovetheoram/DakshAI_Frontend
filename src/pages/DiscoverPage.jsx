// src/pages/DiscoverPage.jsx
// Comprehensive Student Social Discovery: Projects, People, Communities, Challenges & Opportunities
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Compass,
  Search,
  FolderGit2,
  Users,
  Trophy,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  Tag,
  GraduationCap,
} from "lucide-react";
import socialApi from "../api/socialApi";
import PostCard from "../components/social/PostCard";
import SkeletonLoader from "../components/ui/SkeletonLoader";

const DISCOVERY_TABS = [
  { id: "all", label: "Overview", icon: Compass },
  { id: "projects", label: "Projects & Creations", icon: FolderGit2 },
  { id: "people", label: "People & Talent", icon: Users },
  { id: "communities", label: "Circles & Guilds", icon: Sparkles },
  { id: "challenges", label: "Challenges & Quests", icon: Trophy },
];

const STAGE_FILTERS = [
  { id: "all", label: "All Pathways" },
  { id: "college", label: "College / University" },
  { id: "class_11_12", label: "Classes 11 - 12" },
  { id: "jee", label: "JEE Track" },
  { id: "neet", label: "NEET Track" },
  { id: "placement", label: "Placement Prep" },
  { id: "pcs", label: "State PCS" },
  { id: "class_6_10", label: "Classes 6 - 10" },
];

export default function DiscoverPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const [discoveryData, setDiscoveryData] = useState({
    projects: [],
    questions: [],
    people: [],
    communities: [],
    activities: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDiscovery = async (stage = selectedStage) => {
    try {
      setLoading(true);
      const params = stage !== "all" ? { stage } : {};
      const res = await socialApi.getDiscovery(params);
      setDiscoveryData(res.data || {});
    } catch (err) {
      console.error("Discovery error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscovery(selectedStage);
  }, [selectedStage]);

  // Handle Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }
    try {
      setIsSearching(true);
      const res = await socialApi.searchAll(searchQuery.trim());
      setSearchResults(res.data || {});
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7 select-none font-sans text-left">
      {/* 1. Header & Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/40 text-xs font-bold text-[var(--color-gold-dark)]">
          <Compass size={14} />
          <span>Student Ecosystem Discovery</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
          Explore Projects, Talent, Circles & Sprints
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-2xl">
          Connect with peers across schools and universities. Discover creative projects, collaborate on challenges, and find students who share your curiosity.
        </p>
      </div>

      {/* 2. Global Search Bar */}
      <form onSubmit={handleSearch} className="relative max-w-2xl">
        <Search size={16} className="absolute left-4 top-3.5 text-[var(--color-mid-gray)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!e.target.value.trim()) setSearchResults(null);
          }}
          placeholder="Search by topic, skill, project name, or peer username..."
          className="w-full pl-11 pr-24 py-3 rounded-2xl border border-[var(--color-border)] bg-white dark:bg-zinc-900 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)] shadow-xs transition-colors"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 px-4 py-1.5 rounded-xl bg-[var(--color-gold)] text-black font-bold text-xs hover:bg-[var(--color-gold-dark)] hover:text-white transition-colors cursor-pointer"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </form>

      {/* 3. Search Results Overlay (if searching) */}
      {searchResults && (
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[var(--color-border)] space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              Search Results for "{searchQuery}"
            </h3>
            <button
              onClick={() => setSearchResults(null)}
              className="text-xs font-bold text-[var(--color-gold-dark)] hover:underline cursor-pointer"
            >
              Clear Search
            </button>
          </div>

          {/* People Results */}
          {searchResults.people?.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] block">
                Peers ({searchResults.people.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {searchResults.people.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/user/${p.id}`)}
                    className="p-3.5 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-gold)] flex items-center gap-3 cursor-pointer transition-all"
                  >
                    <div className="w-9 h-9 rounded-full bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-bold text-xs shrink-0">
                      {p.display_name?.[0] || p.username?.[0] || "U"}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[var(--color-text-primary)] truncate">{p.display_name || p.username}</h4>
                      <span className="text-[10px] text-[var(--color-mid-gray)] truncate block">@{p.username}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post Results */}
          {searchResults.posts?.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] block">
                Posts & Projects ({searchResults.posts.length})
              </span>
              <div className="space-y-3">
                {searchResults.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* Empty search */}
          {searchResults.people?.length === 0 && searchResults.posts?.length === 0 && (
            <p className="text-xs text-[var(--color-text-secondary)] text-center py-4">
              No results found matching "{searchQuery}". Try searching for broader terms like "Robotics", "Python", or "Math".
            </p>
          )}
        </div>
      )}

      {/* 4. Tab Selector & Stage Filter */}
      {!searchResults && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {DISCOVERY_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-[var(--color-text-primary)] text-white shadow-xs"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                    }`}
                  >
                    <Icon size={14} className={isActive ? "text-[var(--color-gold)]" : ""} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Stage filter dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <Filter size={13} className="text-[var(--color-mid-gray)]" />
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-white dark:bg-zinc-800 text-xs font-semibold text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)]"
              >
                {STAGE_FILTERS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Main Tab Content */}
          {loading ? (
            <div className="space-y-4">
              <SkeletonLoader lines={2} />
              <SkeletonLoader lines={4} />
            </div>
          ) : (
            <div className="space-y-8">
              {/* SECTION A: Featured Projects */}
              {(activeTab === "all" || activeTab === "projects") && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderGit2 size={18} className="text-indigo-500" />
                      <h2 className="text-base font-bold text-[var(--color-text-primary)]">
                        Showcase Projects & Work
                      </h2>
                    </div>
                  </div>

                  {discoveryData.projects?.length === 0 ? (
                    <div className="p-8 rounded-3xl border border-[var(--color-border)] text-center text-xs text-[var(--color-text-secondary)] bg-white dark:bg-zinc-900">
                      No student projects published in this track yet. Share your project from the Home page!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {discoveryData.projects.map((proj) => (
                        <PostCard key={proj.id} post={proj} />
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* SECTION B: People & Talent */}
              {(activeTab === "all" || activeTab === "people") && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-[var(--color-gold-dark)]" />
                      <h2 className="text-base font-bold text-[var(--color-text-primary)]">
                        Peers & Curious Minds
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                    {discoveryData.people?.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => navigate(`/user/${p.id}`)}
                        className="bg-white dark:bg-zinc-900 p-4.5 rounded-3xl border border-[var(--color-border)] hover:border-[var(--color-gold)] transition-all cursor-pointer space-y-3 shadow-xs text-center flex flex-col items-center justify-between"
                      >
                        <div className="w-14 h-14 rounded-full bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)] flex items-center justify-center font-black text-lg border border-[var(--color-gold)]/40 overflow-hidden">
                          {p.avatar ? (
                            <img src={p.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            p.display_name?.[0] || p.username?.[0] || "U"
                          )}
                        </div>

                        <div className="space-y-0.5 w-full">
                          <h4 className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                            {p.display_name || p.username}
                          </h4>
                          <span className="text-[10px] text-[var(--color-mid-gray)] block truncate">
                            @{p.username}
                          </span>
                        </div>

                        <button className="w-full py-1.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-gold)] hover:bg-[var(--color-gold-pale)] text-[11px] font-bold text-[var(--color-text-primary)] transition-colors cursor-pointer">
                          View Profile
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* SECTION C: Communities (Circles) */}
              {(activeTab === "all" || activeTab === "communities") && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-500" />
                      <h2 className="text-base font-bold text-[var(--color-text-primary)]">
                        Interest Circles & Guilds
                      </h2>
                    </div>
                    <button
                      onClick={() => navigate("/communities")}
                      className="text-xs font-bold text-[var(--color-gold-dark)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Browse All Circles <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {discoveryData.communities?.map((comm) => (
                      <div
                        key={comm.id}
                        onClick={() => navigate(`/communities/${comm.slug || comm.id}`)}
                        className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-[var(--color-border)] hover:border-[var(--color-gold)] transition-all cursor-pointer space-y-2.5 shadow-xs"
                      >
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                          {comm.category}
                        </span>
                        <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
                          {comm.name}
                        </h4>
                        <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
                          {comm.description || "A student interest circle for discussion, peer projects, and learning."}
                        </p>
                        <div className="pt-2 border-t border-[var(--color-border)]/60 text-[11px] text-[var(--color-mid-gray)] flex items-center justify-between">
                          <span>{comm.members_count || 1} members</span>
                          <span className="text-[var(--color-gold-dark)] font-bold">Join Circle →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* SECTION D: Challenges & Sprints */}
              {(activeTab === "all" || activeTab === "challenges") && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy size={18} className="text-emerald-500" />
                      <h2 className="text-base font-bold text-[var(--color-text-primary)]">
                        Challenges, Sprints & Quests
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {discoveryData.activities?.map((act) => (
                      <div
                        key={act.id}
                        className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-amber-500/20 hover:border-amber-500/50 transition-all space-y-3 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {act.category}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            ● Active
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                          {act.title}
                        </h3>
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                          {act.description}
                        </p>

                        <div className="pt-2 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-[var(--color-mid-gray)]">
                            {act.participants_count || 0} participants
                          </span>
                          <button
                            onClick={() => navigate(`/communities`)}
                            className="btn-gold px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                          >
                            View & Submit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
