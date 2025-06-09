export const ChatWindowSkeleton = () => (
  <div className="flex flex-col h-full overflow-hidden">
    <div className="flex items-center p-4 border-b border-gray-200 bg-white flex-shrink-0">
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
      <div className="ml-3 flex-1">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
      <div className="flex justify-start">
        <div className="max-w-[70%] px-4 py-2 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="max-w-[70%] px-4 py-2 rounded-2xl bg-gray-200">
          <div className="h-4 w-56 bg-gray-300 rounded animate-pulse mb-2"></div>
          <div className="h-3 w-16 bg-gray-300 rounded animate-pulse ml-auto"></div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-gray-100 px-4 py-2 rounded-lg">
          <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="flex justify-start">
        <div className="max-w-[70%] px-4 py-2 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="max-w-[70%] px-4 py-2 rounded-2xl bg-gray-200">
          <div className="h-4 w-48 bg-gray-300 rounded animate-pulse mb-2"></div>
          <div className="h-3 w-16 bg-gray-300 rounded animate-pulse ml-auto"></div>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  </div>
);
