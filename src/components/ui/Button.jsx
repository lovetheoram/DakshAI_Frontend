// src/components/ui/Button.jsx
export default function Button({ children, loading, ...rest }) {
  return (
    <button
      {...rest}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all active:scale-95 disabled:opacity-60"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
