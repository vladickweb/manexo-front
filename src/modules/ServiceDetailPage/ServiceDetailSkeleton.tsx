export const ServiceDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-8"></div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>

        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-56 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);
