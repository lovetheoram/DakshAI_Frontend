

// import React, { useEffect, useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import progressApi from "../../api/progressApi";

// // Dynamic Theme Generator for Progress View
// const generateProgressTheme = () => {
//   const themes = [
//     {
//       name: "Time Nexus",
//       primary: "#00d4ff",
//       secondary: "#ff6b35",
//       accent: "#4ecdc4",
//       neural: "#ff0080",
//       success: "#00ff88",
//       warning: "#ffbb00",
//       danger: "#ff3366",
//       background: "from-slate-900 via-blue-900 to-indigo-900",
//       particleColor: "#00d4ff",
//       glowColor: "#4ecdc4"
//     },
//     {
//       name: "Quantum Archive",
//       primary: "#a855f7",
//       secondary: "#06b6d4",
//       accent: "#f59e0b",
//       neural: "#ec4899",
//       success: "#10b981",
//       warning: "#f59e0b",
//       danger: "#ef4444",
//       background: "from-purple-900 via-indigo-900 to-blue-900",
//       particleColor: "#a855f7",
//       glowColor: "#06b6d4"
//     }
//   ];
//   return themes[Math.floor(Math.random() * themes.length)];
// };

// // Futuristic Particle Background
// const ProgressParticleField = ({ theme }) => {
//   const particles = useMemo(() => 
//     Array.from({ length: 60 }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: Math.random() * 4 + 1,
//       speed: Math.random() * 15 + 5,
//       direction: Math.random() * 360,
//       opacity: Math.random() * 0.6 + 0.2,
//       delay: Math.random() * 5
//     })), []);

//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//       <div className={`absolute inset-0 bg-gradient-to-br ${theme.background}`} />
      
//       {/* Data Stream Lines */}
//       {Array.from({ length: 8 }).map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute h-px opacity-30"
//           style={{
//             background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
//             top: `${10 + i * 12}%`,
//             left: '-100%',
//             width: '200%'
//           }}
//           animate={{ x: ['0%', '100%'] }}
//           transition={{
//             duration: 8 + i * 2,
//             repeat: Infinity,
//             ease: "linear",
//             delay: i * 0.5
//           }}
//         />
//       ))}

//       {/* Floating Particles */}
//       {particles.map((particle) => (
//         <motion.div
//           key={particle.id}
//           className="absolute rounded-full"
//           style={{
//             left: `${particle.x}%`,
//             top: `${particle.y}%`,
//             width: particle.size,
//             height: particle.size,
//             backgroundColor: theme.particleColor,
//             opacity: particle.opacity,
//             boxShadow: `0 0 ${particle.size * 3}px ${theme.particleColor}`
//           }}
//           animate={{
//             y: [0, -100, 0],
//             x: [0, Math.sin(particle.id) * 50, 0],
//             opacity: [particle.opacity, 0.8, particle.opacity],
//             scale: [1, 1.5, 1]
//           }}
//           transition={{
//             duration: particle.speed,
//             repeat: Infinity,
//             ease: "easeInOut",
//             delay: particle.delay
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// // Holographic HUD Header
// const ProgressHUD = ({ theme, conceptId, progress }) => {
//   const [scanProgress, setScanProgress] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setScanProgress(prev => (prev + 1) % 100);
//     }, 50);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -50 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="relative mb-8"
//     >
//       <div className="bg-black/60 backdrop-blur-xl border-2 rounded-3xl p-6 relative overflow-hidden"
//            style={{ 
//              borderColor: `${theme.primary}60`,
//              boxShadow: `0 0 50px ${theme.primary}30, inset 0 0 30px ${theme.glowColor}20`
//            }}>
        
//         {/* Scanning Effect */}
//         <motion.div
//           className="absolute top-0 left-0 h-full w-1"
//           style={{ backgroundColor: theme.accent }}
//           animate={{ x: ['0%', '100vw', '0%'] }}
//           transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
//         />

//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-6">
//             <motion.div
//               animate={{ rotate: [0, 360] }}
//               transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
//               className="w-16 h-16 rounded-full border-4 flex items-center justify-center relative"
//               style={{ borderColor: theme.primary }}
//             >
//               <div className="text-2xl">🧠</div>
//               <motion.div
//                 className="absolute inset-0 rounded-full"
//                 style={{ 
//                   background: `conic-gradient(from 0deg, transparent, ${theme.accent}60, transparent)` 
//                 }}
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//               />
//             </motion.div>

//             <div>
//               <h1 className="text-4xl font-bold text-transparent bg-clip-text"
//                   style={{ 
//                     backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` 
//                   }}>
//                 NEURAL PROGRESS MATRIX
//               </h1>
//               <p className="text-lg text-gray-300">
//                 Concept ID: <span style={{ color: theme.accent }}>{conceptId}</span> • 
//                 Analyzing cognitive patterns...
//               </p>
//             </div>
//           </div>

//           <div className="text-right">
//             <div className="text-sm text-gray-400 uppercase tracking-wider">SCAN PROGRESS</div>
//             <div className="text-2xl font-bold font-mono" style={{ color: theme.accent }}>
//               {scanProgress}%
//             </div>
//             <div className="w-32 h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
//               <motion.div
//                 className="h-full rounded-full"
//                 style={{ backgroundColor: theme.accent }}
//                 animate={{ width: `${scanProgress}%` }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Quantum Mastery Orb
// const QuantumMasteryOrb = ({ label, value, color, theme, index }) => {
//   const [energy, setEnergy] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setEnergy(prev => (prev + 0.02) % 1);
//     }, 50);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0, rotateY: -180 }}
//       animate={{ opacity: 1, scale: 1, rotateY: 0 }}
//       transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
//       className="relative"
//     >
//       <div className="text-center">
//         <motion.div
//           className="relative mx-auto mb-6 cursor-pointer"
//           style={{ width: 160, height: 160 }}
//           whileHover={{ scale: 1.1, rotateY: 15 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           {/* Outer Energy Ring */}
//           <motion.div
//             className="absolute inset-0 rounded-full border-4"
//             style={{ borderColor: `${color}40` }}
//             animate={{ rotate: 360 }}
//             transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
//           />

//           {/* Main Orb */}
//           <div
//             className="w-full h-full rounded-full border-4 relative overflow-hidden"
//             style={{
//               background: `
//                 radial-gradient(circle at 30% 30%, ${color}60 0%, ${color}20 50%, transparent 80%),
//                 conic-gradient(from ${energy * 360}deg, ${theme.glowColor}40, ${color}60, ${theme.glowColor}40)
//               `,
//               borderColor: color,
//               boxShadow: `
//                 0 0 80px ${color}60,
//                 inset 0 0 40px ${theme.glowColor}30,
//                 0 0 120px ${color}30
//               `
//             }}
//           >
//             {/* Quantum Particles */}
//             {Array.from({ length: 6 }).map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="absolute w-2 h-2 rounded-full"
//                 style={{ 
//                   backgroundColor: theme.accent,
//                   left: '50%',
//                   top: '50%'
//                 }}
//                 animate={{
//                   x: Math.cos(i * 60 + energy * 360) * 50,
//                   y: Math.sin(i * 60 + energy * 360) * 50,
//                   scale: [0.5, 1.5, 0.5]
//                 }}
//                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//               />
//             ))}

//             {/* Progress Liquid */}
//             <motion.div
//               className="absolute bottom-0 left-0 w-full rounded-full"
//               style={{
//                 height: `${value}%`,
//                 background: `linear-gradient(0deg, ${color}90, ${theme.glowColor}60)`,
//               }}
//               initial={{ height: 0 }}
//               animate={{ height: `${value}%` }}
//               transition={{ duration: 2, ease: "easeOut", delay: index * 0.3 }}
//             />

//             {/* Holographic Display */}
//             <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
//               <motion.div
//                 className="text-4xl font-bold text-white mb-2"
//                 animate={{ textShadow: [`0 0 20px ${color}`, `0 0 40px ${color}`, `0 0 20px ${color}`] }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               >
//                 {value}%
//               </motion.div>
//               <div className="text-xs text-gray-300 uppercase tracking-wider font-bold">
//                 {label} MASTERY
//               </div>
//             </div>

//             {/* Scanning Lines */}
//             <motion.div
//               className="absolute inset-0 rounded-full"
//               style={{
//                 background: `conic-gradient(from 0deg, transparent 350deg, ${theme.accent}80 360deg)`
//               }}
//               animate={{ rotate: 360 }}
//               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
//             />
//           </div>

//           {/* Achievement Badge */}
//           {value >= 80 && (
//             <motion.div
//               initial={{ scale: 0, rotate: -180 }}
//               animate={{ scale: 1, rotate: 0 }}
//               className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center"
//               style={{ backgroundColor: theme.success }}
//             >
//               <span className="text-xl">🏆</span>
//             </motion.div>
//           )}
//         </motion.div>

//         {/* Level Indicator */}
//         <motion.div
//           className="text-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: index * 0.3 + 0.5 }}
//         >
//           <div className="text-sm text-gray-400 mb-2">NEURAL LEVEL</div>
//           <div className="font-mono text-2xl font-bold"
//                style={{ color: value >= 80 ? theme.success : value >= 60 ? theme.warning : theme.danger }}>
//             {Math.ceil(value / 10)}
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// // Futuristic Stats Grid
// const QuantumStatsGrid = ({ summary, theme }) => {
//   const stats = [
//     { label: "Total Attempts", value: summary.total_attempts, icon: "🎯", color: theme.primary },
//     { label: "Best Exam Score", value: `${Math.round(summary.best_exam_score * 100)}%`, icon: "⚡", color: theme.success },
//     { label: "Best Chapter Score", value: `${Math.round(summary.best_chapter_score * 100)}%`, icon: "📊", color: theme.accent },
//     { label: "Average Exam", value: `${Math.round(summary.average_exam_score * 100)}%`, icon: "🎮", color: theme.secondary },
//     { label: "Average Chapter", value: `${Math.round(summary.average_chapter_score * 100)}%`, icon: "🧪", color: theme.neural },
//     { label: "Learning Velocity", value: "High", icon: "🚀", color: theme.warning }
//   ];

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//       {stats.map((stat, index) => (
//         <motion.div
//           key={stat.label}
//           initial={{ opacity: 0, y: 50, rotateX: -30 }}
//           animate={{ opacity: 1, y: 0, rotateX: 0 }}
//           transition={{ delay: index * 0.1, type: "spring" }}
//           whileHover={{ y: -5, scale: 1.05 }}
//           className="relative group"
//         >
//           <div className="bg-black/60 backdrop-blur-xl border-2 rounded-2xl p-6 relative overflow-hidden"
//                style={{ 
//                  borderColor: `${stat.color}40`,
//                  boxShadow: `0 0 30px ${stat.color}20`
//                }}>
            
//             {/* Background Pattern */}
//             <motion.div
//               className="absolute inset-0 opacity-10"
//               style={{
//                 backgroundImage: `repeating-linear-gradient(
//                   45deg,
//                   transparent,
//                   transparent 10px,
//                   ${stat.color} 10px,
//                   ${stat.color} 11px
//                 )`
//               }}
//               animate={{ backgroundPosition: ['0 0', '20px 20px'] }}
//               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
//             />

//             <div className="relative z-10 text-center">
//               <motion.div
//                 className="text-4xl mb-3"
//                 animate={{ 
//                   scale: [1, 1.2, 1],
//                   rotate: [0, 5, -5, 0]
//                 }}
//                 transition={{ duration: 3, repeat: Infinity }}
//               >
//                 {stat.icon}
//               </motion.div>
              
//               <div className="text-3xl font-bold font-mono mb-2" style={{ color: stat.color }}>
//                 {stat.value}
//               </div>
              
//               <div className="text-sm text-gray-400 uppercase tracking-wider">
//                 {stat.label}
//               </div>

//               {/* Progress Bar */}
//               <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
//                 <motion.div
//                   className="h-full rounded-full"
//                   style={{ backgroundColor: stat.color }}
//                   initial={{ width: 0 }}
//                   animate={{ width: '100%' }}
//                   transition={{ duration: 2, delay: index * 0.2 }}
//                 />
//               </div>
//             </div>

//             {/* Hover Glow Effect */}
//             <motion.div
//               className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
//               style={{ boxShadow: `inset 0 0 50px ${stat.color}30` }}
//               transition={{ duration: 0.3 }}
//             />
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// // Time Portal History Viewer
const TimePortalHistory = ({ records, theme, openSession, setOpenSession, renderAnswerTree }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12"
    >
      <div className="mb-8 text-center">
        <h3 className="text-4xl font-bold text-transparent bg-clip-text mb-4"
            style={{ 
              backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` 
            }}>
          TEMPORAL LEARNING ARCHIVE
        </h3>
        <div className="h-1 w-32 mx-auto rounded-full"
             style={{ backgroundColor: theme.accent }} />
      </div>

      {records.length === 0 ? (
        <motion.div
          className="text-center py-20"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <div className="text-6xl mb-6">🌌</div>
          <h4 className="text-2xl font-bold text-gray-400 mb-2">No Records Found</h4>
          <p className="text-gray-500">Begin your learning journey to populate the archives</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {records.map((record, index) => (
            <TimelineEntry
              key={record.id}
              record={record}
              index={index}
              theme={theme}
              isOpen={openSession === record.quiz_session}
              onToggle={() => setOpenSession(
                openSession === record.quiz_session ? null : record.quiz_session
              )}
              renderAnswerTree={renderAnswerTree}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// // Individual Timeline Entry
const TimelineEntry = ({ record, index, theme, isOpen, onToggle, renderAnswerTree }) => {
  const scorePercent = Math.round((record.score || 0) * 100);
  const scoreColor = scorePercent >= 80 ? theme.success : 
                     scorePercent >= 60 ? theme.warning : theme.danger;

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, type: "spring" }}
      className="relative"
    >
      <div className="bg-black/60 backdrop-blur-xl border-2 rounded-3xl overflow-hidden"
           style={{ 
             borderColor: `${scoreColor}40`,
             boxShadow: `0 0 40px ${scoreColor}20`
           }}>
        
        {/* Header */}
        <motion.div
          onClick={onToggle}
          className="p-6 cursor-pointer relative overflow-hidden"
          whileHover={{ backgroundColor: `${theme.primary}10` }}
        >
          {/* Timeline Connector */}
          <div className="absolute left-0 top-0 w-1 h-full"
               style={{ backgroundColor: scoreColor }} />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <motion.div
                className="w-16 h-16 rounded-full border-4 flex items-center justify-center relative"
                style={{ borderColor: scoreColor }}
                animate={{ rotate: isOpen ? 180 : 0 }}
              >
                <div className="text-2xl">
                  {scorePercent >= 80 ? '🏆' : scorePercent >= 60 ? '🎯' : '🔄'}
                </div>
              </motion.div>

              <div>
                <h4 className="text-2xl font-bold" style={{ color: scoreColor }}>
                  Mission #{index + 1}
                </h4>
                <p className="text-gray-400">
                  {new Date(record.created_at).toLocaleDateString()} • 
                  {new Date(record.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold font-mono" style={{ color: scoreColor }}>
                {scorePercent}%
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                Neural Efficiency
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: scoreColor }}
              initial={{ width: 0 }}
              animate={{ width: `${scorePercent}%` }}
              transition={{ duration: 1.5, delay: index * 0.2 }}
            />
          </div>
        </motion.div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-700"
            >
              <div className="p-6">
                <h5 className="text-xl font-bold mb-4" style={{ color: theme.accent }}>
                  DETAILED ANALYSIS
                </h5>
                {renderAnswerTree(record.answers)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// // Enhanced Answer Tree Renderer
const renderEnhancedAnswerTree = (answers, theme) => {
  const questionsMap = {};
  answers.forEach((a) => {
    const qid = a.question_id;
    if (!questionsMap[qid]) questionsMap[qid] = { main: null, subs: [] };
    if (a.sub_question_type) questionsMap[qid].subs.push(a);
    else questionsMap[qid].main = a;
  });

  return Object.entries(questionsMap).map(([qid, qData], qIndex) => (
    <motion.div
      key={qid}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: qIndex * 0.1 }}
      className="mb-8"
    >
      <div className="bg-black/40 backdrop-blur-xl border-2 rounded-2xl p-6 relative overflow-hidden"
           style={{ 
             borderColor: `${theme.primary}30`,
             boxShadow: `0 0 30px ${theme.primary}20`
           }}>
        
        {/* Question Header */}
        {qData.main && (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4"
                   style={{ borderColor: theme.accent }}>
                <span className="text-sm font-bold" style={{ color: theme.accent }}>
                  Q{qIndex + 1}
                </span>
              </div>
              <h6 className="text-lg font-semibold text-white flex-1">
                {qData.main.question_text}
              </h6>
              <div className={`text-2xl ${qData.main.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                {qData.main.is_correct ? '✅' : '❌'}
              </div>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(qData.main.options).map(([key, val]) => {
                const isCorrect = key === qData.main.correct_option;
                const isSelected = key === qData.main.marked_option;
                const optionColor = isCorrect ? theme.success : 
                                   isSelected && !isCorrect ? theme.danger : theme.primary;

                return (
                  <motion.div
                    key={key}
                    className="p-4 rounded-xl border-2 relative overflow-hidden"
                    style={{ 
                      borderColor: `${optionColor}60`,
                      backgroundColor: `${optionColor}15`
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3"
                           style={{ borderColor: optionColor }}>
                        <span className="font-bold" style={{ color: optionColor }}>
                          {key}
                        </span>
                      </div>
                      <span className="text-white">{val}</span>
                      {isCorrect && (
                        <span className="ml-auto text-green-400 font-bold">CORRECT</span>
                      )}
                      {isSelected && !isCorrect && (
                        <span className="ml-auto text-red-400 font-bold">YOUR ANSWER</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sub-questions */}
        {qData.subs.length > 0 && (
          <div className="ml-8 space-y-4">
            <h6 className="text-lg font-semibold" style={{ color: theme.secondary }}>
              Sub-Analysis Protocols
            </h6>
            {qData.subs.map((sub, subIndex) => (
              <motion.div
                key={subIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (qIndex + subIndex) * 0.1 }}
                className="bg-black/30 backdrop-blur-sm border rounded-xl p-4"
                style={{ borderColor: `${theme.secondary}30` }}
              >
                <div className="flex items-center mb-3">
                  <span className="text-sm font-bold" style={{ color: theme.secondary }}>
                    Sub-Protocol ({sub.sub_question_type})
                  </span>
                  <div className={`ml-auto text-lg ${sub.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                    {sub.is_correct ? '✅' : '❌'}
                  </div>
                </div>

                <div className="space-y-2">
                  {Object.entries(sub.options).map(([key, val]) => {
                    const isCorrect = key === sub.correct_option;
                    const isSelected = key === sub.marked_option;
                    const optionColor = isCorrect ? theme.success : 
                                       isSelected && !isCorrect ? theme.danger : theme.accent;

                    return (
                      <div key={key} className="flex items-center p-2 rounded-lg"
                           style={{ backgroundColor: `${optionColor}10` }}>
                        <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs mr-3"
                              style={{ borderColor: optionColor, color: optionColor }}>
                          {key}
                        </span>
                        <span className="text-gray-300 text-sm">{val}</span>
                        {isCorrect && <span className="ml-auto text-xs text-green-400">✓</span>}
                        {isSelected && !isCorrect && <span className="ml-auto text-xs text-red-400">✗</span>}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  ));
};

// // Main Progress View Component
// export default function ProgressView({ conceptId = 13 }) {
//   const [loading, setLoading] = useState(true);
//   const [progress, setProgress] = useState(null);
//   const [history, setHistory] = useState(null);
//   const [openSession, setOpenSession] = useState(null);
  
//   // Generate random theme for each instance
//   const [theme] = useState(() => generateProgressTheme());

//   useEffect(() => {
//     setLoading(true);
//     progressApi
//       .getFull(conceptId)
//       .then((data) => {
//         setProgress(data.progress);
//         setHistory(data.history);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [conceptId]);

//   if (loading || !progress || !history) {
//     return (
//       <div className="min-h-screen flex items-center justify-center relative">
//         <ProgressParticleField theme={theme} />
//         <motion.div
//           className="relative z-10 text-center"
//           initial={{ scale: 0.5, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//         >
//           <motion.div
//             className="w-32 h-32 border-4 border-t-transparent rounded-full mx-auto mb-8"
//             style={{ 
//               borderColor: theme.primary,
//               boxShadow: `0 0 60px ${theme.primary}60` 
//             }}
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           />
//           <h2 className="text-4xl font-bold text-transparent bg-clip-text mb-4"
//               style={{ 
//                 backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` 
//               }}>
//             ANALYZING NEURAL PATTERNS
//           </h2>
//           <p className="text-gray-400 text-lg">Reconstructing learning timeline...</p>
//         </motion.div>
//       </div>
//     );
//   }

//   const examMastery = Math.round(progress.exam_readiness * 100);
//   const chapterMastery = Math.round(progress.chapter_understanding * 100);

//   return (
//     <div className="min-h-screen relative">
//       <ProgressParticleField theme={theme} />
      
//       <div className="relative z-10 max-w-7xl mx-auto p-6">
//         <ProgressHUD theme={theme} conceptId={conceptId} progress={progress} />

//         {/* Mastery Orbs Section */}
//         <motion.div
//           className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//         >
//           <QuantumMasteryOrb
//             label="EXAM"
//             value={examMastery}
//             color={theme.primary}
//             theme={theme}
//             index={0}
//           />
//           <QuantumMasteryOrb
//             label="CHAPTER"
//             value={chapterMastery}
//             color={theme.secondary}
//             theme={theme}
//             index={1}
//           />
//         </motion.div>

//         {/* Stats Grid */}
//         <motion.div
//           className="mb-16"
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.8 }}
//         >
//           <QuantumStatsGrid summary={history.summary} theme={theme} />
//         </motion.div>

//         {/* History Timeline */}
//         <TimePortalHistory
//           records={history.records}
//           theme={theme}
//           openSession={openSession}
//           setOpenSession={setOpenSession}
//           renderAnswerTree={(answers) => renderEnhancedAnswerTree(answers, theme)}
//         />
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import progressApi from "../../api/progressApi";

// Random Theme Generator
const generateProgressTheme = () => {
  const themes = [
    { primary: "#00d4ff", secondary: "#ff6b35", accent: "#4ecdc4", success: "#00ff88", warning: "#ffbb00", danger: "#ff3366", background: "from-slate-900 via-blue-900 to-indigo-900", glowColor: "#4ecdc4" },
    { primary: "#a855f7", secondary: "#06b6d4", accent: "#f59e0b", success: "#10b981", warning: "#f59e0b", danger: "#ef4444", background: "from-purple-900 via-indigo-900 to-blue-900", glowColor: "#06b6d4" }
  ];
  return themes[Math.floor(Math.random() * themes.length)];
};

// Background Particle Field (simplified for mobile)
const ProgressParticleField = ({ theme }) => {
  const particles = useMemo(() => Array.from({ length: 30 }, () => ({
    x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 3 + 1, opacity: Math.random() * 0.5 + 0.2
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.background}`} />
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, backgroundColor: theme.primary, opacity: p.opacity }}
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
        />
      ))}
    </div>
  );
};

// HUD Header
const ProgressHUD = ({ theme, conceptId }) => {
  const [scan, setScan] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setScan(prev => (prev + 1) % 100), 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div className="relative mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-black/60 backdrop-blur-lg border-2 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center"
           style={{ borderColor: `${theme.primary}60`, boxShadow: `0 0 20px ${theme.primary}30` }}>
        <div className="flex items-center space-x-4 sm:space-x-6 mb-4 sm:mb-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 flex items-center justify-center text-xl sm:text-2xl"
               style={{ borderColor: theme.primary }}>
            🧠
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text"
                style={{ backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
              NEURAL MATRIX
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Concept {conceptId} • Analyzing patterns...
            </p>
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wider">SCAN</div>
          <div className="text-xl sm:text-2xl font-bold" style={{ color: theme.accent }}>{scan}%</div>
          <div className="w-32 h-2 bg-gray-700 rounded-full mt-1 overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: theme.accent }} animate={{ width: `${scan}%` }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Mastery Orb (simplified for mobile)
const QuantumMasteryOrb = ({ label, value, color }) => (
  <motion.div className="flex flex-col items-center">
    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white flex items-center justify-center mb-2"
         style={{ borderColor: color, background: `${color}20` }}>
      <span className="text-xl sm:text-2xl font-bold text-white">{value}%</span>
    </div>
    <div className="text-sm sm:text-base text-gray-300 uppercase">{label} MASTERY</div>
  </motion.div>
);

// Stats Grid
const QuantumStatsGrid = ({ summary, theme }) => {
  const stats = [
    { label: "Total Attempts", value: summary.total_attempts, color: theme.primary },
    { label: "Best Exam Score", value: `${Math.round(summary.best_exam_score * 100)}%`, color: theme.success },
    { label: "Best Chapter Score", value: `${Math.round(summary.best_chapter_score * 100)}%`, color: theme.accent },
    { label: "Average Exam", value: `${Math.round(summary.average_exam_score * 100)}%`, color: theme.secondary },
    { label: "Average Chapter", value: `${Math.round(summary.average_chapter_score * 100)}%`, color: theme.secondary },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {stats.map((s, i) => (
        <motion.div key={i} className="bg-black/60 backdrop-blur-md border-2 rounded-xl p-4 text-center"
                     style={{ borderColor: `${s.color}40` }}
                     initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <div className="text-lg sm:text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
          <div className="text-xs sm:text-sm text-gray-400 uppercase mt-1">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
};



export default function ProgressView({conceptId, concept }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [history, setHistory] = useState(null);
  const [openSession, setOpenSession] = useState(null);
  
  // Generate random theme for each instance
  const [theme] = useState(() => generateProgressTheme());

  useEffect(() => {
    setLoading(true);
    progressApi
      .getFull(conceptId)
      .then((data) => {
        setProgress(data.progress);
        setHistory(data.history);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [conceptId]);

  if (loading || !progress || !history) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <ProgressParticleField theme={theme} />
        <motion.div
          className="relative z-10 text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <motion.div
            className="w-32 h-32 border-4 border-t-transparent rounded-full mx-auto mb-8"
            style={{ 
              borderColor: theme.primary,
              boxShadow: `0 0 60px ${theme.primary}60` 
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-4xl font-bold text-transparent bg-clip-text mb-4"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` 
              }}>
            ANALYZING NEURAL PATTERNS
          </h2>
          <p className="text-gray-400 text-lg">Reconstructing learning timeline...</p>
        </motion.div>
      </div>
    );
  }

  const examMastery = Math.round(progress.exam_readiness * 100);
  const chapterMastery = Math.round(progress.chapter_understanding * 100);

  return (
    <div className="min-h-screen relative">
      <ProgressParticleField theme={theme} />
      
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <ProgressHUD theme={theme} conceptId={conceptId} progress={progress} />

        {/* Mastery Orbs Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <QuantumMasteryOrb
            label="EXAM"
            value={examMastery}
            color={theme.primary}
            theme={theme}
            index={0}
          />
          <QuantumMasteryOrb
            label="CHAPTER"
            value={chapterMastery}
            color={theme.secondary}
            theme={theme}
            index={1}
          />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <QuantumStatsGrid summary={history.summary} theme={theme} />
        </motion.div>

        {/* History Timeline */}
        <TimePortalHistory
          records={history.records}
          theme={theme}
          openSession={openSession}
          setOpenSession={setOpenSession}
          renderAnswerTree={(answers) => renderEnhancedAnswerTree(answers, theme)}
        />
      </div>
    </div>
  );
}
