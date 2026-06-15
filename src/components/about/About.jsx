// // src/components/layout/About.jsx
// import React from "react";
// import { Brain, BarChart3, Repeat, Users, PlayCircle } from "lucide-react";

// export default function About() {
//   return (
//     <div className="bg-slate-950 text-white">
      
//       {/* ================= HERO ================= */}
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-slate-900 to-black" />
        
//         <div className="relative max-w-6xl mx-auto px-5 py-20 text-center">
//           <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
//             See your learning.
//             <br />
//             <span className="text-purple-400">Clearly.</span>
//           </h1>

//           <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
//             Nimides helps you understand what you truly know,
//             what you don’t, and how ready you really are.
//           </p>

//           {/* Image Placeholder */}
//           <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl h-56 sm:h-72 flex items-center justify-center text-white/40">
//             📱 App overview / dashboard screenshot
//           </div>
//         </div>
//       </section>

//       {/* ================= CORE IDEA ================= */}
//       <section className="max-w-6xl mx-auto px-5 py-20">
//         <div className="grid md:grid-cols-3 gap-8 text-center">
          
//           <Feature
//             icon={<Brain size={28} />}
//             title="True Understanding"
//             desc="Not just chapters completed — see what concepts you actually understand."
//           />

//           <Feature
//             icon={<BarChart3 size={28} />}
//             title="Know Your Weakness"
//             desc="Weak areas surface automatically through smart concept-based MCQs."
//           />

//           <Feature
//             icon={<Repeat size={28} />}
//             title="Natural Revision"
//             desc="Mastery fades over time, so revision happens when you actually need it."
//           />
//         </div>
//       </section>

//       {/* ================= VISUAL MASTERY ================= */}
//       <section className="bg-gradient-to-b from-slate-900 to-slate-950">
//         <div className="max-w-6xl mx-auto px-5 py-20 grid md:grid-cols-2 gap-12 items-center">
          
//           <div>
//             <h2 className="text-3xl font-bold mb-4">
//               Learning that shows itself
//             </h2>
//             <p className="text-gray-300 leading-relaxed">
//               Every concept you practice builds visible mastery.
//               Over time, mastery decays — just like memory.
//               Nimides tracks this so you always know your real level.
//             </p>
//           </div>

//           {/* Image Placeholder */}
//           <div className="rounded-3xl border border-white/10 bg-white/5 h-64 flex items-center justify-center text-white/40">
//             📊 Concept mastery / skill tree image
//           </div>
//         </div>
//       </section>

//       {/* ================= COMMUNITY ================= */}
//       <section className="max-w-6xl mx-auto px-5 py-20">
//         <div className="grid md:grid-cols-2 gap-12 items-center">
          
//           {/* Image Placeholder */}
//           <div className="order-2 md:order-1 rounded-3xl border border-white/10 bg-white/5 h-64 flex items-center justify-center text-white/40">
//             🎥 Short concept explanation videos
//           </div>

//           <div className="order-1 md:order-2">
//             <h2 className="text-3xl font-bold mb-4">
//               Learn together. Grow faster.
//             </h2>
//             <p className="text-gray-300 leading-relaxed mb-6">
//               Learning isn’t solitary here.
//               Learners explain concepts through short videos —
//               helping others while strengthening their own understanding.
//             </p>

//             <div className="flex items-center gap-3 text-purple-400">
//               <PlayCircle />
//               <span className="font-medium">
//                 Teach once, learn twice
//               </span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ================= CLOSING ================= */}
//       <section className="border-t border-white/10">
//         <div className="max-w-6xl mx-auto px-5 py-20 text-center">
//           <Users className="mx-auto mb-4 text-purple-400" size={36} />
//           <h2 className="text-3xl font-bold mb-4">
//             This is not just practice.
//           </h2>
//           <p className="text-gray-300 max-w-xl mx-auto">
//             It’s awareness.
//             Of your learning.
//             Of your gaps.
//             Of your growth.
//           </p>
//         </div>
//       </section>
//     </div>
//   );
// }

// /* ================= SMALL COMPONENT ================= */
// function Feature({ icon, title, desc }) {
//   return (
//     <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
//       <div className="text-purple-400 mb-4 flex justify-center">
//         {icon}
//       </div>
//       <h3 className="font-semibold text-lg mb-2">{title}</h3>
//       <p className="text-gray-300 text-sm leading-relaxed">
//         {desc}
//       </p>
//     </div>
//   );
// }



// src/components/layout/About.jsx
import React from "react";
import { Brain, BarChart3, Repeat, Users, PlayCircle } from "lucide-react";

export default function About() {
  return (
    <div className="bg-slate-950 text-white">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-slate-900 to-black" />

        <div className="relative max-w-6xl mx-auto px-5 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            See your learning.<br />
            <span className="text-purple-400">Clearly.</span>
          </h1>

          <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Nimides helps you understand what you truly know,
            what you don’t, and how ready you really are.
          </p>

          {/* HERO IMAGE */}
          <img
            src="/images/progress.jpg"
            alt="App Overview"
            className="mt-12 w-full max-w-md mx-auto rounded-3xl border border-white/10 shadow-lg"
          />
        </div>
      </section>

      {/* ================= CORE IDEA ================= */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <Feature
            icon={<Brain size={28} />}
            title="True Understanding"
            desc="Not just chapters completed — see what concepts you actually understand."
          />
          <Feature
            icon={<BarChart3 size={28} />}
            title="Know Your Weakness"
            desc="Weak areas surface automatically through smart concept-based MCQs."
          />
          <Feature
            icon={<Repeat size={28} />}
            title="Natural Revision"
            desc="Mastery fades over time, so revision happens when you actually need it."
          />
        </div>
      </section>

      {/* ================= VISUAL MASTERY ================= */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-5 py-20 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl font-bold mb-4">Learning that shows itself</h2>
            <p className="text-gray-300 leading-relaxed">
              Every concept you practice builds visible mastery.
              Over time, mastery decays — just like memory.
              Nimides tracks this so you always know your real level.
            </p>
          </div>

          {/* MASTERY IMAGE */}
          <img
            src="/images/bubbles.jpg"
            alt="Concept Mastery"
            className="rounded-3xl w-full h-64 md:h-auto object-cover border border-white/10 shadow-lg"
          />
        </div>
      </section>

      {/* ================= COMMUNITY ================= */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* VIDEO IMAGE */}
          {/* <img
            src="/images/social.jpg"
            alt="Community Learning"
            className="order-2 md:order-1 rounded-3xl w-full h-64 md:h-auto object-cover border border-white/10 shadow-lg"
          /> */}
          <img
  src="/images/social.jpg"
  alt="Community Learning"
  className="order-2 md:order-1 rounded-3xl w-full md:h-64 h-auto object-contain border border-white/10 shadow-lg"
/>


          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold mb-4">Learn together. Grow faster.</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Learning isn’t solitary here.
              Learners explain concepts through short videos —
              helping others while strengthening their own understanding.
            </p>

            <div className="flex items-center gap-3 text-purple-400">
              <PlayCircle />
              <span className="font-medium">Teach once, learn twice</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CLOSING ================= */}
      <section className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 py-20 text-center">
          <Users className="mx-auto mb-4 text-purple-400" size={36} />
          <h2 className="text-3xl font-bold mb-4">This is not just practice.</h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            It’s awareness.<br />
            Of your learning.<br />
            Of your gaps.<br />
            Of your growth.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */
function Feature({ icon, title, desc }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
      <div className="text-purple-400 mb-4 flex justify-center">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
