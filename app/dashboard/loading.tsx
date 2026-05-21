export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Overview Stats Skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-48 bg-white/5 rounded-lg" />
        <div className="h-4 w-72 bg-white/5 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 md:h-40 bg-white/5 border border-white/5 rounded-2xl" />
            ))}
          </div>
          <div className="h-[380px] bg-white/5 border border-white/5 rounded-2xl" />
        </div>
        <div className="lg:col-span-2 h-full min-h-[500px] bg-white/5 border border-white/5 rounded-2xl" />
      </div>
    </div>
  );
}
