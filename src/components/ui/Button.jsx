// src/components/ui/Button.jsx
export default function Button({ children, loading, ...rest }) {
  return (
    <button
      {...rest}
      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-2.5 rounded-xl font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-60 shadow-lg shadow-purple-500/10 mt-2"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
