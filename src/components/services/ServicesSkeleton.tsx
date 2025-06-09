export const ServicesSkeleton = () => {
  return (
    <div className="space-y-6 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mt-2 animate-pulse"></div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
          <div className="hidden md:flex rounded-lg bg-gray-100 p-1 relative overflow-x-auto flex-nowrap scrollbar-hide max-w-full">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="min-w-[140px] px-4 py-2 text-sm font-medium rounded-md bg-gray-200 animate-pulse"
              ></div>
            ))}
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-4 animate-pulse"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="h-6 w-20 bg-gray-200 rounded"></div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
