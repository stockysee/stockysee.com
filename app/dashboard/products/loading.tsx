export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <div className="h-8 w-48 bg-white/5 rounded-lg" />
          <div className="h-4 w-72 bg-white/5 rounded-lg" />
        </div>
        <div className="h-12 w-32 bg-white/5 rounded-2xl" />
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="h-16 bg-white/5 border-b border-white/5" />
        <div className="p-8 space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-white/5 rounded" />
                  <div className="h-3 w-20 bg-white/5 rounded" />
                </div>
              </div>
              <div className="h-4 w-24 bg-white/5 rounded" />
              <div className="h-8 w-16 bg-white/5 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
