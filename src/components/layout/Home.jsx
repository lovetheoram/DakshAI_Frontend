// src/components/layout/Home.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { 
  Sparkles, Trophy, Users, Brain, Target, 
  ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2 
} from "lucide-react";
import TodayTarget from "../progress/TodayTarget";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    {
      title: "The Linear Learning Bias",
      subtitle: "Underestimating 1% Daily Compound Growth",
      flaw: "We think learning must happen in massive, exhausting leaps. We overestimate what we can do in a day, but vastly underestimate what we can achieve in a year.",
      consequence: "Setting unrealistic schedules, feeling overwhelmed, burning out, and quitting within 2 weeks.",
      solution: "DakshAI calibrates a dynamic 0.83% daily growth target to your deadlines. No cramming. No burnout. Just consistent compound growth.",
      icon: <Target className="text-purple-400 w-10 h-10 sm:w-12 sm:h-12" />,
      color: "from-purple-500/10 via-indigo-500/5 to-slate-950",
      accent: "purple"
    },
    {
      title: "The Ebbinghaus Curve",
      subtitle: "The Silent Decay of Newly Acquired Knowledge",
      flaw: "We study a concept once, understand it perfectly, and assume we will remember it forever. We fail to plan for natural cognitive decay.",
      consequence: "80% of new learning is completely lost within 48 hours, causing massive frustration when re-studied later.",
      solution: "Our active spaced decay algorithms track your concepts, decaying your mastery score daily and alerting you exactly when a concept is ready for revision.",
      icon: <Brain className="text-cyan-400 w-10 h-10 sm:w-12 sm:h-12" />,
      color: "from-cyan-500/10 via-blue-500/5 to-slate-950",
      accent: "cyan"
    },
    {
      title: "Illusion of Competence",
      subtitle: "Passive Consumption vs. Active Problem Solving",
      flaw: "Watching lectures and reading pages passively feels comfortable and productive. The brain mistakes familiarity with actual coding competency.",
      consequence: "Freezing and failing when presented with a blank screen or a timed coding assessment.",
      solution: "DakshAI enforces active recall. Complete quiz sessions, log accuracy scores, and track your raw understanding on the visual Skill Tree.",
      icon: <Sparkles className="text-emerald-400 w-10 h-10 sm:w-12 sm:h-12" />,
      color: "from-emerald-500/10 via-teal-500/5 to-slate-950",
      accent: "emerald"
    },
    {
      title: "The Isolation Trap",
      subtitle: "Absence of Social Accountability",
      flaw: "Studying in a vacuum. No transparency, no peer updates, and no validation of your consistency.",
      consequence: "Losing focus and discipline. It is easy to skip a day when nobody is watching or sharing the journey.",
      solution: "A unified Social Feedback Loop. Publish your daily target compliance directly to the peer learning feed to stay motivated and accountable.",
      icon: <Users className="text-orange-400 w-10 h-10 sm:w-12 sm:h-12" />,
      color: "from-orange-500/10 via-red-500/5 to-slate-950",
      accent: "orange"
    }
  ];

  useEffect(() => {
    if (user || isHovered) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [user, isHovered]);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  if (user) {
    return (
      <div className="min-h-[85vh] bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 px-4 py-10 flex justify-center">
        <TodayTarget />
      </div>
    );
  }

  const active = slides[activeSlide];

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 px-4 py-12 md:py-16 text-white overflow-hidden">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Master Consistency with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">DakshAI</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          The behavioral Growth OS + Social Feed built for deep cognitive alignment and persistent skill mastery.
        </p>
      </div>

      {/* Main Interactive Carousel / Auto-Slider */}
      <div 
        className="w-full max-w-4xl mx-auto mb-12"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative rounded-3xl bg-gradient-to-b ${active.color} backdrop-blur-xl border border-white/10 shadow-2xl p-6 sm:p-10 transition-all duration-500 min-h-[420px] flex flex-col justify-between overflow-hidden`}>
          
          {/* Subtle glow sphere behind the icon */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Slider Content */}
          <div className="space-y-6">
            {/* Header: Icon + Title */}
            <div className="flex items-center space-x-4 border-b border-white/5 pb-4">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                {active.icon}
              </div>
              <div>
                <span className="text-xs text-purple-400 uppercase tracking-widest font-black">Cognitive Flaw #{activeSlide + 1}</span>
                <h2 className="text-xl sm:text-2xl font-black">{active.title}</h2>
                <p className="text-xs sm:text-sm text-gray-400 font-medium italic mt-0.5">{active.subtitle}</p>
              </div>
            </div>

            {/* Core Flaw vs Solution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Left Column: Human Weakness */}
              <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 sm:p-5 space-y-2.5">
                <h3 className="text-red-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={14} /> The Human Weakness & Failure
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {active.flaw}
                </p>
                <div className="text-xs text-red-300/80 italic font-semibold border-t border-red-500/5 pt-2">
                  Consequence: {active.consequence}
                </div>
              </div>

              {/* Right Column: DakshAI Solution */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 sm:p-5 space-y-2.5">
                <h3 className="text-emerald-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> The DakshAI Solution
                </h3>
                <p className="text-sm text-gray-200 leading-relaxed font-medium">
                  {active.solution}
                </p>
              </div>
            </div>
          </div>

          {/* Slider Footer: Controls & Dots */}
          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
            {/* Prev/Next arrows */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={handlePrev}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-gray-400 hover:text-white transition"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={handleNext}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-gray-400 hover:text-white transition"
                aria-label="Next Slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Dots */}
            <div className="flex items-center space-x-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === activeSlide 
                      ? "bg-purple-400 w-6" 
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Status indicator */}
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider hidden sm:inline">
              Autoplay Active
            </span>
          </div>

        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-4xl mx-auto">
        <Link
          to="/feed"
          className="group rounded-3xl p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 text-white shadow-xl hover:-translate-y-1 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="p-3 bg-purple-500/10 rounded-2xl w-fit border border-purple-500/20 group-hover:scale-110 transition duration-300">
              <Users className="text-purple-400" size={24} />
            </div>
            <h3 className="font-bold text-lg">Social Learning Feed</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Connect with peers, share daily target status cards, and grow together.
            </p>
          </div>
          <span className="text-xs text-purple-400 font-bold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
            Enter Community <ChevronRight size={12} />
          </span>
        </Link>

        <Link
          to="/syllabus"
          className="group rounded-3xl p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 text-white shadow-xl hover:-translate-y-1 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="p-3 bg-indigo-500/10 rounded-2xl w-fit border border-indigo-500/20 group-hover:scale-110 transition duration-300">
              <Sparkles className="text-indigo-400" size={24} />
            </div>
            <h3 className="font-bold text-lg">Visual Skill Tree</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Unlock complex subjects concept-by-concept inside an interactive map.
            </p>
          </div>
          <span className="text-xs text-indigo-400 font-bold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
            Explore Skills <ChevronRight size={12} />
          </span>
        </Link>

        <Link
          to="/login"
          className="group rounded-3xl p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 text-white shadow-xl hover:-translate-y-1 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit border border-emerald-500/20 group-hover:scale-110 transition duration-300">
              <Trophy className="text-emerald-400" size={24} />
            </div>
            <h3 className="font-bold text-lg">Initialize Growth OS</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Configure your prep goal, deadlines, and log daily cognitive metrics.
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-bold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
            Get Started <ChevronRight size={12} />
          </span>
        </Link>
      </div>

    </div>
  );
}
