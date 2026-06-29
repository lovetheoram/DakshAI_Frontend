export default function SkeletonLoader({
  lines = 3,
  avatar = false,
  className = "",
}) {
  return (
    <div className={`glass p-6 space-y-4 ${className}`}>
      {avatar && (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full animate-shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded-lg animate-shimmer" />
            <div className="h-3 w-1/4 rounded-lg animate-shimmer" />
          </div>
        </div>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded-lg animate-shimmer"
          style={{ width: `${85 - i * 15}%`, animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}
