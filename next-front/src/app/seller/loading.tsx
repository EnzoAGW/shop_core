export default function SellerLoading() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4" />
        </div>
        <div className="h-9 w-28 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
          <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-40 bg-gray-200 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                <div className="flex gap-2 mt-2">
                  <div className="h-8 bg-gray-200 rounded-lg animate-pulse flex-1" />
                  <div className="h-8 w-10 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
