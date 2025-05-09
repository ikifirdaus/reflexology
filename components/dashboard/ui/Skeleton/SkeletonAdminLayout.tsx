export default function SkeletonAdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100 animate-pulse">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 border-r space-y-4">
        <div className="h-8 bg-gray-300 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded w-2/3" />
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="h-6 bg-gray-200 rounded w-5/6" />
        <div className="h-6 bg-gray-200 rounded w-4/5" />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white p-4 border-b flex justify-between items-center">
          <div className="h-6 bg-gray-300 rounded w-40" />
          <div className="h-10 w-10 bg-gray-300 rounded-full" />
        </header>

        {/* Content */}
        <main className="p-6 space-y-6">
          <div className="h-6 bg-gray-300 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-lg shadow border space-y-3"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
