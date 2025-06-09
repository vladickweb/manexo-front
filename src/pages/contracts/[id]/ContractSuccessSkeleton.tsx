export const ContractSuccessSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-sm">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-6 animate-pulse"></div>

        <div className="space-y-3 mb-8">
          <div className="h-7 w-64 bg-gray-200 rounded animate-pulse mx-auto"></div>
          <div className="h-5 w-72 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  </div>
);
