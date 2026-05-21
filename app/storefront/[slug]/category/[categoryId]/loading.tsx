export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-[#F8F7F5] pb-20">
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md py-4 border-b border-zinc-100">
        <div className="max-w-screen-xl mx-auto px-5 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-5 bg-zinc-100 rounded" />
            <div className="w-24 h-5 bg-zinc-100 rounded" />
          </div>
          <div className="w-28 h-10 bg-zinc-100 rounded-lg" />
        </div>
      </nav>

      <header className="pt-20 pb-12 px-8 max-w-screen-xl mx-auto">
        <div className="border-b border-zinc-200 pb-10 space-y-4">
          <div className="w-20 h-3 bg-zinc-100 rounded" />
          <div className="w-72 h-12 bg-zinc-100 rounded" />
          <div className="w-80 h-5 bg-zinc-100 rounded" />
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10">
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
      </main>
    </div>
  );
}
