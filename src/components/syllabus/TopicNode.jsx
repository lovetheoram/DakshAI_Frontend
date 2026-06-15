

import React, { useEffect, useState, useMemo, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import syllabusApi from "../../api/syllabusApi";
import { AuthContext } from "../../context/AuthContext";
import progressApi from "../../api/progressApi";
import ProgressView from "../progress/ProgressView";
import FullScreenQuiz from "../quiz/FullScreenQuiz";

// Dynamic Theme Generator - Creates new look every time
const generateGameTheme = () => {
  const themes = [
    {
      name: "Cyber Matrix",
      primary: ["#00ff41", "#39ff14", "#00ff9f"],
      secondary: ["#ff0080", "#ff3366", "#ff6b9d"],
      accent: ["#00d4ff", "#0099ff", "#3366ff"],
      bg: "from-gray-900 via-purple-900 to-black",
      particleColor: "#00ff41",
      glowColor: "#00ff9f"
    },
    {
      name: "Neon Dreams",
      primary: ["#ff006e", "#fb5607", "#ffbe0b"],
      secondary: ["#8338ec", "#3a86ff", "#06ffa5"],
      accent: ["#ff4081", "#e91e63", "#9c27b0"],
      bg: "from-indigo-900 via-purple-900 to-pink-900",
      particleColor: "#ff006e",
      glowColor: "#8338ec"
    },
    {
      name: "Quantum Core",
      primary: ["#64ffda", "#18ffff", "#00e5ff"],
      secondary: ["#ff4081", "#ff5722", "#ff9800"],
      accent: ["#76ff03", "#00e676", "#1de9b6"],
      bg: "from-blue-900 via-teal-900 to-cyan-900",
      particleColor: "#64ffda",
      glowColor: "#18ffff"
    },
    {
      name: "Plasma Storm",
      primary: ["#ff3d00", "#ff6d00", "#ff9100"],
      secondary: ["#651fff", "#3d5afe", "#2979ff"],
      accent: ["#c6ff00", "#76ff03", "#00e676"],
      bg: "from-red-900 via-orange-900 to-yellow-900",
      particleColor: "#ff3d00",
      glowColor: "#651fff"
    },
    {
      name: "Void Walker",
      primary: ["#e1bee7", "#ce93d8", "#ba68c8"],
      secondary: ["#4fc3f7", "#29b6f6", "#03a9f4"],
      accent: ["#66bb6a", "#4caf50", "#2e7d32"],
      bg: "from-purple-900 via-indigo-900 to-blue-900",
      particleColor: "#e1bee7",
      glowColor: "#4fc3f7"
    }
  ];
  
  return themes[Math.floor(Math.random() * themes.length)];
};




const DynamicParticleField = ({ theme }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 3,
        duration: Math.random() * 2 + 1.5,
        opacity: Math.random() * 0.4 + 0.3,
        color:
          theme.colors?.[i % theme.colors.length] ||
          ["#60a5fa", "#34d399", "#f472b6", "#a78bfa"][i % 4],
      })),
    [theme]
  );

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Colorful soft background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0f172a, #020617)",
        }}
      />

      {/* Subtle color glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_60%)]" />

      {/* Twinkling dots */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.opacity,
          }}
          animate={{
            opacity: [p.opacity, 0.1, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};





const FuturisticSubjectSelector = ({ subjects, selectedSubject, onSubjectChange, theme }) => {
  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2
          className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text mb-2"
          style={{ backgroundImage: `linear-gradient(135deg, ${theme.primary[0]}, ${theme.secondary[0]})` }}
        >
          SELECT PATHWAY
        </h2>
      </div>

      {/* Subject buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {subjects.map((subject, index) => {
          const isActive = subject.id === selectedSubject;
          const colors = {
            primary: theme.primary[index % theme.primary.length],
            secondary: theme.secondary[index % theme.secondary.length],
            accent: theme.accent[index % theme.accent.length],
          };

          return (
            <motion.button
              key={subject.id}
              onClick={() => onSubjectChange(subject.id)}
              className="w-36 sm:w-44 h-28 sm:h-32 rounded-xl flex flex-col items-center justify-center text-white text-center font-semibold shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}70, ${colors.secondary}50)`,
                boxShadow: isActive ? `0 0 20px ${colors.accent}80` : `0 0 10px ${colors.accent}50`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-2xl sm:text-3xl mb-1 animate-pulse">🧠</div>
              <div className="text-sm sm:text-base">{subject.name}</div>
              <div className="text-xs sm:text-sm text-gray-200 mt-1">
                {subject.topics?.length || 0} MODULES
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};



// Dynamic Tech Tree Visualization
const TechTreeVisualization = ({ currentSubject, theme, onConceptSelect, onSubtopicToggle, openSubtopic }) => {
  return (
    <div className="relative z-10 px-8 py-12 max-w-7xl mx-auto">
      <motion.h2
        className="text-4xl font-bold mb-12 text-center"
        style={{ 
          color: theme.primary[0],
          textShadow: `0 0 20px ${theme.primary[0]}60`
        }}
        animate={{ 
          textShadow: [
            `0 0 20px ${theme.primary[0]}60`,
            `0 0 40px ${theme.primary[0]}80`,
            `0 0 20px ${theme.primary[0]}60`
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {currentSubject.name} NEURAL NETWORK
      </motion.h2>

      <div className="space-y-20">
        {currentSubject.topics.map((topic, topicIndex) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, x: topicIndex % 2 === 0 ? -200 : 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: topicIndex * 0.2, type: "spring" }}
            className="relative"
          >
            {/* Topic Header */}
            <div className="text-center mb-12">
              <motion.h3
                className="text-3xl font-bold text-transparent bg-clip-text mb-4"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${theme.secondary[0]}, ${theme.accent[0]})` 
                }}
                whileHover={{ scale: 1.05 }}
              >
                {topic.name}
              </motion.h3>
              <div className="h-0.5 w-24 mx-auto rounded-full"
                   style={{ backgroundColor: theme.accent[0] }} />
            </div>

            {/* Subtopics Network */}
            <div className="relative flex flex-wrap justify-center gap-32">
              {topic.subtopics.map((subtopic, subtopicIndex) => (
                <SubtopicNode
                  key={subtopic.id}
                  subtopic={subtopic}
                  theme={theme}
                  index={subtopicIndex}
                  isOpen={openSubtopic === subtopic.id}
                  onToggle={() => onSubtopicToggle(subtopic.id)}
                  onConceptSelect={onConceptSelect}
                />
              ))}
            </div>

            {/* Connecting Lines */}
            <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
              {topic.subtopics.map((_, i) => 
                topic.subtopics.slice(i + 1).map((_, j) => (
                  <motion.line
                    key={`${i}-${j + i + 1}`}
                    x1={`${(i + 1) * 100 / (topic.subtopics.length + 1)}%`}
                    y1="50%"
                    x2={`${(j + i + 2) * 100 / (topic.subtopics.length + 1)}%`}
                    y2="50%"
                    stroke={theme.glowColor}
                    strokeWidth="2"
                    strokeOpacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: i * 0.2 }}
                  />
                ))
              )}
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
};



const SubtopicNode = ({ subtopic, theme, index, isOpen, onToggle, onConceptSelect }) => {
  const [efficiency, setEfficiency] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await progressApi.getSubtopic(subtopic.id);
        setEfficiency(Math.max(0, Math.min(1, data?.efficiency || 0)));
      } catch (err) {
        console.error("Failed to fetch subtopic efficiency:", err);
      }
    };
    fetchProgress();
  }, [subtopic.id]);

  const nodeColor = theme.primary[index % theme.primary.length];
  const glowColor = theme.secondary[index % theme.secondary.length];

  return (
    <div className="flex flex-col items-center px-2 sm:px-4">
      <motion.div
        onClick={onToggle}
        className="relative cursor-pointer w-40 h-40 sm:w-52 sm:h-52"
      >
        {/* Bubble */}
        <div
          className="w-full h-full rounded-full border-4 relative overflow-hidden"
          style={{
            borderColor: glowColor,
            boxShadow: `0 0 30px ${glowColor}50`,
            background: `radial-gradient(circle at 50% 50%, ${nodeColor}20, #00000010)`,
          }}
        >
          {/* Efficiency Water-fill */}
          <motion.div
            className="absolute bottom-0 left-0 w-full rounded-b-full"
            style={{
              height: `${efficiency * 100}%`,
              background: `linear-gradient(to top, ${glowColor}80, ${nodeColor}40)`,
            }}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* HUD */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-1">
            <div className="text-2xl sm:text-3xl">🔮</div>
            <h4 className="font-bold text-white text-sm sm:text-base mt-2">{subtopic.name}</h4>
            <div className="text-[10px] sm:text-xs text-gray-300 mt-1">
              {subtopic.concepts?.length || 0} CONCEPTS
            </div>
            <div className="text-[10px] sm:text-xs text-cyan-300 mt-1">
              {Math.round(efficiency * 100)}% COMPLETE
            </div>
          </div>
        </div>
      </motion.div>

      {/* Concepts Expansion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-4 flex flex-wrap gap-3 sm:gap-6 justify-center"
          >
            {subtopic.concepts?.map((concept, i) => (
              <ConceptOrb
                key={concept.id}
                concept={concept}
                theme={theme}
                index={i}
                onClick={() => onConceptSelect(concept)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";

const ConceptOrb = ({ concept, theme, index, onClick }) => {
  const [current, setCurrent] = useState(0);
  const [peak, setPeak] = useState(0);
  const orbColor = theme.accent[index % theme.secondary.length]; // main color
const peakColor = "#88888880"; // grey for peak
const nodeColor = theme.primary[index % theme.primary.length]; // main node color
const glowColor = theme.accent[index % theme.accent.length];  // glowing/top color


  useEffect(() => {
    // Using mastery & raw_mastry from backend
    const mastery = concept.mastery?.length ? concept.mastery.reduce((a, b) => a + b, 0) / concept.mastery.length : 0;
    const raw = concept.raw_mastry?.length ? concept.raw_mastry.reduce((a, b) => a + b, 0) / concept.raw_mastry.length : 0;
    setCurrent(Math.max(0, Math.min(1, mastery)));
    setPeak(Math.max(0, Math.min(1, raw)));
  }, [concept]);

  // const orbColor = theme.accent[index % theme.accent.length];
  // const peakColor = theme.primary[index % theme.primary.length];

  return (
    <motion.div
      onClick={onClick}
      className="relative cursor-pointer w-20 h-20 sm:w-24 sm:h-24 mx-1 my-1"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 120 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className="w-full h-full rounded-full border-2 relative overflow-hidden"
        style={{
          borderColor: peakColor + "80",
          boxShadow: `0 0 10px ${peakColor}50`,
          background: `radial-gradient(circle at 50% 50%, ${orbColor}40 0%, ${orbColor}10 80%, transparent 100%)`
        }}
      >
        

        <div
  className="absolute bottom-0 left-0 w-full rounded-b-full pointer-events-none"
  style={{
    height: `${peak * 100}%`,
    background: `linear-gradient(to top, #88888880, #cccccc40)` // grey gradient
  }}
/>
<div
  className="absolute bottom-0 left-0 w-full rounded-b-full pointer-events-none"
  style={{
    height: `${current * 100}%`,
    background: `linear-gradient(to top, ${glowColor}aa, ${nodeColor}66)` // colored gradient
  }}
/>


        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1 z-10">
          <div className="text-sm sm:text-base mb-1">💎</div>
          <div className="text-[10px] sm:text-xs font-bold text-white leading-tight">
            {concept.name.length > 10 ? concept.name.slice(0, 10) + "..." : concept.name}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// export default ConceptOrb;


// const ConceptOrb = ({ concept, theme, index, onClick }) => {
//   const [mastery] = useState(Math.random()); // Random for demo
//   const [isCharging, setIsCharging] = useState(false);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIsCharging(prev => !prev);
//     }, 2000 + index * 500);
//     return () => clearInterval(interval);
//   }, [index]);

//   const orbColor = theme.accent[index % theme.accent.length];
//   const glowColor = theme.primary[index % theme.primary.length];

//   return (
//     <motion.div
//       onClick={onClick}
//       className="relative cursor-pointer transform-gpu"
//       initial={{ opacity: 0, scale: 0, rotate: -180 }}
//       animate={{ opacity: 1, scale: 1, rotate: 0 }}
//       transition={{ 
//         delay: index * 0.1, 
//         type: "spring", 
//         stiffness: 150,
//         damping: 10 
//       }}
//       whileHover={{ 
//         scale: 1.2, 
//         rotate: 360,
//         z: 50
//       }}
//       whileTap={{ scale: 0.9 }}
//     >
//       <div
//         className="w-24 h-24 rounded-full border-2 relative overflow-hidden"
//         style={{
//           background: `
//             radial-gradient(circle at 30% 30%, ${orbColor}80 0%, ${orbColor}20 70%, transparent 100%)
//           `,
//           borderColor: glowColor,
//           boxShadow: isCharging 
//             ? `0 0 40px ${glowColor}80, inset 0 0 20px ${orbColor}60`
//             : `0 0 20px ${glowColor}40, inset 0 0 10px ${orbColor}30`,
//         }}
//       >
//         {/* Mastery fill */}
//         <motion.div
//           className="absolute bottom-0 left-0 w-full rounded-full"
//           style={{
//             height: `${mastery * 100}%`,
//             background: `linear-gradient(0deg, ${glowColor}90, ${orbColor}60)`,
//           }}
//           initial={{ height: 0 }}
//           animate={{ height: `${mastery * 100}%` }}
//           transition={{ duration: 1.5, delay: index * 0.2 }}
//         />

//         {/* Energy pulse */}
//         <motion.div
//           className="absolute inset-0 rounded-full"
//           style={{ background: `radial-gradient(circle, ${orbColor}40, transparent 70%)` }}
//           animate={isCharging ? { 
//             scale: [1, 1.5, 1],
//             opacity: [0.3, 0.8, 0.3]
//           } : {}}
//           transition={{ duration: 1, repeat: isCharging ? Infinity : 0 }}
//         />

//         {/* Content */}
//         <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1 z-10">
//           <motion.div 
//             className="text-lg mb-1"
//             animate={{ 
//               rotate: [0, 360],
//             }}
//             transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
//           >
//             💎
//           </motion.div>
//           <div className="text-xs font-bold text-white leading-tight">
//             {concept.name.slice(0, 8)}...
//           </div>
//         </div>

//         {/* Scanning beam */}
//         <motion.div
//           className="absolute inset-0 rounded-full"
//           style={{
//             background: `conic-gradient(from 0deg, transparent 270deg, ${glowColor}60 360deg)`,
//           }}
//           animate={{ rotate: 360 }}
//           transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
//         />
//       </div>
//     </motion.div>
//   );
// };

// Main Component
export default function TopicNode() {
  const { user } = useContext(AuthContext);
  const [tree, setTree] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [openSubtopic, setOpenSubtopic] = useState(null);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [activeConceptId, setActiveConceptId] = useState(null);
  const [activeConcept,setActiveConcept]= useState(null);

  // Generate random theme on each load
  const [gameTheme] = useState(() => generateGameTheme());
  
  

  useEffect(() => {
    syllabusApi
      .getTree()
      .then((data) => {
        setTree(data);
        const subs = extractSubjects(data, user?.selected_exam?.id);
        setSubjects(subs);
        if (subs.length) setSelectedSubject(subs[0].id);
      })
      .catch((e) => console.error("Tree load failed:", e));
  }, [user]);

  const handleSubjectChange = (subjectId) => {
    setSelectedSubject(subjectId);
    setOpenSubtopic(null);
    setSelectedConcept(null);
  };

  const handleSubtopicToggle = (subtopicId) => {
    setOpenSubtopic(openSubtopic === subtopicId ? null : subtopicId);
    setSelectedConcept(null);
  };

  const openQuiz = (concept) => {
    setActiveConceptId(concept.id);
    setActiveConcept(concept)
    setSelectedConcept(null);
    setShowQuiz(true);
  };

  const openProgress = (concept) => {
    setActiveConceptId(concept.id);
    setActiveConcept(concept)
    setSelectedConcept(null);
    setShowProgress(true);
  };

  if (!tree) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <DynamicParticleField theme={gameTheme} />
        <motion.div
          className="relative z-10 text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <motion.div
            className="w-32 h-32 border-4 border-t-transparent rounded-full mx-auto mb-8"
            style={{ 
              borderColor: gameTheme.glowColor,
              boxShadow: `0 0 60px ${gameTheme.glowColor}60` 
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.h2
            className="text-4xl font-bold mb-4 text-transparent bg-clip-text"
            style={{ 
              backgroundImage: `linear-gradient(135deg, ${gameTheme.primary[0]}, ${gameTheme.secondary[0]})` 
            }}
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🚀 INITIALIZING NEURAL MATRIX
          </motion.h2>
          <p className="text-gray-400 text-lg">Establishing quantum connections...</p>
        </motion.div>
      </div>
    );
  }

  if (!subjects.length) return <TreeError tree={tree} gameTheme={gameTheme} />;

  const hideTree = showQuiz || showProgress;
  const currentSubject = subjects.find((s) => s.id === selectedSubject) || subjects[0];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <DynamicParticleField theme={gameTheme} />
      
      {!hideTree && (
        <>
          
          
          
          <div className="pt-32">
            <FuturisticSubjectSelector
              subjects={subjects}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              theme={gameTheme}
              onSubjectChange={handleSubjectChange}
            />

            <TechTreeVisualization
              currentSubject={currentSubject}
              theme={gameTheme}
              onConceptSelect={setSelectedConcept}
              onSubtopicToggle={handleSubtopicToggle}
              openSubtopic={openSubtopic}
            />
          </div>
        </>
      )}

      {/* Enhanced Popups and Overlays */}
      <AnimatePresence>
        {selectedConcept && !showQuiz && !showProgress && (
          <EnhancedConceptPopup
            concept={selectedConcept}
            theme={gameTheme}
            onClose={() => setSelectedConcept(null)}
            onQuiz={() => openQuiz(selectedConcept)}
            onStats={() => openProgress(selectedConcept)}
          />
        )}

        {showQuiz && (
          <motion.div
            className="fixed inset-0 z-50 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: `linear-gradient(135deg, ${gameTheme.bg.replace('from-', '').replace('via-', '').replace('to-', '').split(' ').join(', ')})` }}
          >
            <div className="min-h-screen p-6">
              <motion.button
                onClick={() => setShowQuiz(false)}
                className="mb-8 group flex items-center gap-3 px-8 py-4 rounded-2xl shadow-2xl transition-all duration-300"
                style={{ 
                  background: `linear-gradient(135deg, ${gameTheme.primary[0]}, ${gameTheme.secondary[0]})`,
                  boxShadow: `0 0 40px ${gameTheme.glowColor}40`
                }}
                whileHover={{ scale: 1.05, x: -10 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Return to Neural Matrix
              </motion.button>
              <FullScreenQuiz 
                conceptId={activeConceptId} 
                concept={activeConcept}
                
                onClose={() => setShowQuiz(false)} 
              />
            </div>
          </motion.div>
        )}

        {showProgress && (
          <motion.div
            className="fixed inset-0 z-50 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: `linear-gradient(135deg, ${gameTheme.bg.replace('from-', '').replace('via-', '').replace('to-', '').split(' ').join(', ')})` }}
          >
            <div className="min-h-screen p-6">
              <motion.button
                onClick={() => setShowProgress(false)}
                className="mb-8 group flex items-center gap-3 px-8 py-4 rounded-2xl shadow-2xl transition-all duration-300"
                style={{ 
                  background: `linear-gradient(135deg, ${gameTheme.primary[0]}, ${gameTheme.secondary[0]})`,
                  boxShadow: `0 0 40px ${gameTheme.glowColor}40`
                }}
                whileHover={{ scale: 1.05, x: -10 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Return to Neural Matrix
              </motion.button>
              <ProgressView conceptId={activeConceptId}  concept={activeConcept}/>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Enhanced Concept Popup
// function EnhancedConceptPopup({ concept, theme, onClose, onQuiz, onStats }) {
//   return (
//     <motion.div
//       className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       onClick={onClose}
//     >
//       <motion.div
//         className="relative max-w-2xl w-full rounded-3xl overflow-hidden border-2"
//         style={{ 
//           background: `linear-gradient(135deg, ${theme.primary[0]}20, ${theme.secondary[0]}20, ${theme.accent[0]}20)`,
//           borderColor: theme.glowColor,
//           boxShadow: `0 0 100px ${theme.glowColor}60`
//         }}
//         initial={{ scale: 0.3, rotateY: -90, opacity: 0 }}
//         animate={{ scale: 1, rotateY: 0, opacity: 1 }}
//         exit={{ scale: 0.3, rotateY: 90, opacity: 0 }}
//         onClick={(e) => e.stopPropagation()}
//         transition={{ type: "spring", stiffness: 200, damping: 20 }}
//       >
//         {/* Animated background */}
//         <motion.div
//           className="absolute inset-0"
//           style={{
//             background: `conic-gradient(from 0deg, ${theme.primary[0]}30, ${theme.secondary[0]}30, ${theme.accent[0]}30, ${theme.primary[0]}30)`
//           }}
//           animate={{ rotate: 360 }}
//           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//         />

//         <div className="relative z-10 p-12 text-center">
//           <motion.div 
//             className="text-8xl mb-6"
//             animate={{ 
//               rotateY: [0, 360],
//               scale: [1, 1.2, 1]
//             }}
//             transition={{ 
//               rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
//               scale: { duration: 3, repeat: Infinity }
//             }}
//           >
//             🔮
//           </motion.div>
          
//           <h3 className="text-4xl font-bold text-white mb-4">
//             {concept.name}
//           </h3>
          
//           <p className="text-gray-300 text-lg mb-8 leading-relaxed">
//             {concept.description || "Enter the quantum realm of advanced learning protocols."}
//           </p>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             <motion.button
//               onClick={onQuiz}
//               className="px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300"
//               style={{ 
//                 background: `linear-gradient(135deg, ${theme.primary[0]}, ${theme.secondary[0]})`,
//                 boxShadow: `0 0 30px ${theme.primary[0]}40`
//               }}
//               whileHover={{ 
//                 scale: 1.05,
//                 boxShadow: `0 0 50px ${theme.primary[0]}60`
//               }}
//               whileTap={{ scale: 0.95 }}
//             >
//               🎯 QUIZ TEST
//             </motion.button>

//             <motion.button
//               onClick={onStats}
//               className="px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300"
//               style={{ 
//                 background: `linear-gradient(135deg, ${theme.secondary[0]}, ${theme.accent[0]})`,
//                 boxShadow: `0 0 30px ${theme.secondary[0]}40`
//               }}
//                             whileHover={{ 
//                 scale: 1.05,
//                 boxShadow: `0 0 50px ${theme.secondary[0]}60`
//               }}
//               whileTap={{ scale: 0.95 }}
//             >
//               📊 PROGRESS MATRIX
//             </motion.button>
//           </div>

//           <motion.button
//             onClick={onClose}
//             className="w-full text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 py-4 text-lg font-medium border border-gray-600 rounded-xl hover:border-gray-400"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//             DISCONNECT
//           </motion.button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

function EnhancedConceptPopup({ concept, theme, onClose, onQuiz, onStats }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-md sm:max-w-2xl rounded-2xl overflow-hidden border-2"
        style={{ 
          background: `linear-gradient(135deg, ${theme.primary[0]}20, ${theme.secondary[0]}20, ${theme.accent[0]}20)`,
          borderColor: theme.glowColor,
          boxShadow: `0 0 60px ${theme.glowColor}40`
        }}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
      >
        {/* Optional subtle rotating background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from 0deg, ${theme.primary[0]}20, ${theme.secondary[0]}20, ${theme.accent[0]}20)`
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10 p-6 sm:p-12 text-center flex flex-col items-center">
          <motion.div
            className="text-6xl sm:text-8xl mb-4 sm:mb-6"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            🔮
          </motion.div>

          <h3 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">
            {concept.name}
          </h3>

          <p className="text-gray-300 text-sm sm:text-lg mb-4 sm:mb-8 leading-relaxed">
            {concept.description || "Enter the quantum realm of advanced learning protocols."}
          </p>

          <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-6 mb-4 sm:mb-8">
            <motion.button
              onClick={onQuiz}
              className="flex-1 px-4 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-white text-sm sm:text-lg transition-all duration-200"
              style={{ 
                background: `linear-gradient(135deg, ${theme.primary[0]}, ${theme.secondary[0]})`,
                boxShadow: `0 0 20px ${theme.primary[0]}40`
              }}
              whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${theme.primary[0]}60` }}
              whileTap={{ scale: 0.95 }}
            >
              🎯 QUIZ TEST
            </motion.button>

            <motion.button
              onClick={onStats}
              className="flex-1 px-4 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-white text-sm sm:text-lg transition-all duration-200"
              style={{ 
                background: `linear-gradient(135deg, ${theme.secondary[0]}, ${theme.accent[0]})`,
                boxShadow: `0 0 20px ${theme.secondary[0]}40`
              }}
              whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${theme.secondary[0]}60` }}
              whileTap={{ scale: 0.95 }}
            >
              📊 PROGRESS MATRIX
            </motion.button>
          </div>

          <motion.button
            onClick={onClose}
            className="w-full text-gray-400 hover:text-white flex items-center justify-center gap-2 py-3 text-sm sm:text-lg font-medium border border-gray-600 rounded-xl hover:border-gray-400 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            DISCONNECT
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}


// Enhanced Tree Error Component
function TreeError({ tree, gameTheme }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <DynamicParticleField theme={gameTheme} />
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative z-10 max-w-4xl mx-4"
      >
        <div 
          className="backdrop-blur-xl border-2 rounded-3xl p-12 relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${gameTheme.primary[0]}15, ${gameTheme.secondary[0]}15)`,
            borderColor: `${gameTheme.glowColor}60`,
            boxShadow: `0 0 80px ${gameTheme.glowColor}40`
          }}
        >
          {/* Animated warning pattern */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 20px,
                ${gameTheme.accent[0]}10 20px,
                ${gameTheme.accent[0]}10 40px
              )`
            }}
            animate={{ backgroundPosition: ['0 0', '80px 80px'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative z-10 text-center">
            <motion.div 
              className="text-9xl mb-8"
              animate={{ 
                rotate: [0, -15, 15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              ⚠️
            </motion.div>
            
            <h2 className="text-5xl font-bold mb-6 text-transparent bg-clip-text"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${gameTheme.primary[0]}, ${gameTheme.secondary[0]})` 
                }}>
              NEURAL NETWORK MALFUNCTION
            </h2>
            
            <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
              Critical system failure detected in the quantum matrix.<br />
              Unable to establish connection with the learning algorithms.
            </p>

            <div className="bg-black/60 backdrop-blur-sm border border-gray-600 rounded-2xl p-6 max-h-96 overflow-auto">
              <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center justify-center gap-2">
                <span>🔍</span> DIAGNOSTIC DATA
              </h3>
              <pre className="text-xs text-green-400 font-mono text-left">
                {JSON.stringify(tree, null, 2)}
              </pre>
            </div>

            <motion.button
              className="mt-8 px-8 py-4 rounded-2xl font-bold text-white text-lg"
              style={{ 
                background: `linear-gradient(135deg, ${gameTheme.secondary[0]}, ${gameTheme.accent[0]})`,
                boxShadow: `0 0 30px ${gameTheme.secondary[0]}40`
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 0 50px ${gameTheme.secondary[0]}60`
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
            >
              🔄 REINITIALIZE MATRIX
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Extract Subjects Function
function extractSubjects(data, selectedExamId) {
  if (!data?.exams?.length) return [];
  
  let subjects = [];
  data.exams.forEach((exam) => {
    if (selectedExamId && exam.id !== selectedExamId) {
      return;
    }
    exam.subjects?.forEach((s) => {
      if (Array.isArray(s.topics)) subjects.push(s);
    });
  });

  // Fallback to all subjects if none match or selectedExamId not provided
  if (subjects.length === 0) {
    data.exams.forEach((exam) => {
      exam.subjects?.forEach((s) => {
        if (Array.isArray(s.topics)) subjects.push(s);
      });
    });
  }
  return subjects;
}





export { 
  generateGameTheme, 
  DynamicParticleField, 
};

