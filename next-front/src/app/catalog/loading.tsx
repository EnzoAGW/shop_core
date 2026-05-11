export default function CatalogLoading() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse flex-1" />
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-full sm:w-44" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-44 bg-gray-200 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3 mt-1" />
              <div className="h-8 bg-gray-200 rounded-lg animate-pulse mt-2" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
