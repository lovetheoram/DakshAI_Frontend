// src/components/ui/Input.jsx
export default function Input({ label, ...rest }) {
  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</label>
      <input
        {...rest}
        className="bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 outline-none"
      />
    </div>
  );
}
