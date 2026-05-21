export default function StorefrontLoading() {
  return (
    <div className="min-h-screen bg-[#F8F7F5]">
      {/* Header Skeleton */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md py-4 border-b border-zinc-100">
        <div className="max-w-screen-xl mx-auto px-5 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-100 rounded-lg" />
            <div className="w-24 h-5 bg-zinc-100 rounded" />
          </div>
          <div className="w-28 h-10 bg-zinc-100 rounded-lg" />
        </div>
      </nav>

      <main className="max-w-screen-xl mx-auto">
        {/* Hero Skeleton */}
        <section className="px-5 md:px-10 pt-6 pb-4">
          <div className="bg-zinc-100 rounded-2xl h-[400px] w-full" />
        </section>

        {/* Categories Skeleton */}
        <section className="px-5 md:px-10 py-8">
          <div className="flex justify-between mb-7">
            <div className="w-40 h-8 bg-zinc-100 rounded" />
            <div className="w-20 h-5 bg-zinc-100 rounded" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center gap-3 shrink-0">
                <div className="w-20 h-20 md:w-28 md:h-28 bg-zinc-100 rounded-2xl" />
                <div className="w-16 h-4 bg-zinc-100 rounded" />
              </div>
            ))}
          </div>
        </section>

        {/* Products Grid Skeleton */}
        <section className="px-5 md:px-10 py-8 space-y-6">
          <div className="w-48 h-8 bg-zinc-100 rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-zinc-100 rounded-2xl" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-zinc-100 rounded" />
                  <div className="w-2/3 h-4 bg-zinc-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
