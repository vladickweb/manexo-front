export const AvailabilitySkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 7 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between animate-pulse"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
            <div className="h-6 w-12 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
