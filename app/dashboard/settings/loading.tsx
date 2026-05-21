export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-3">
        <div className="h-8 w-48 bg-white/5 rounded-lg" />
        <div className="h-4 w-72 bg-white/5 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-64 bg-white/5 border border-white/5 rounded-2xl p-10 space-y-4">
             <div className="w-12 h-12 bg-white/5 rounded-full" />
             <div className="h-6 w-40 bg-white/5 rounded" />
             <div className="h-4 w-64 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
