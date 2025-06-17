export const MessagesSkeleton = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className="w-full h-[calc(100dvh-6rem-84px)] md:h-[calc(100dvh-8rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 h-full">
          <div className="col-span-1 md:col-span-4 lg:col-span-3 border-r border-gray-200 h-full overflow-hidden">
            <div className="h-full overflow-y-auto p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 animate-pulse"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-8 lg:col-span-9 h-full overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      idx % 2 === 0 ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        idx % 2 === 0 ? "bg-gray-100" : "bg-primary/10"
                      } animate-pulse`}
                    >
                      <div className="h-4 w-48 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                  <div className="w-10 h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
