// src/components/ui/Input.jsx
export default function Input({ label, ...rest }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium">{label}</label>
      <input
        {...rest}
        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
      />
    </div>
  );
}
