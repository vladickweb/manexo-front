export const ServiceDetailsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
      <div className="flex-1 space-y-2">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>

    <div className="space-y-3">
      <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="text-right">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2 ml-auto"></div>
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse ml-auto"></div>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-4">
      <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  </div>
);
