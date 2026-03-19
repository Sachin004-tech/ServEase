import React from "react";

const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-pulse">
      {/* Top Section Skeleton */}
      <div className="flex flex-col md:flex-row flex-1 justify-center items-start gap-20 p-4 md:p-12 max-w-[1400px] mx-auto w-full">
        {/* Left Side Skeleton (Sidebar) */}
        <div className="flex flex-col gap-4 w-full md:w-1/4">
          <div className="h-10 bg-gray-200 rounded-xl mb-4 w-3/4"></div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-2xl w-full"></div>
          ))}
        </div>

        {/* Right Side Skeleton (Banner) */}
        <div className="w-full md:w-3/4 h-[300px] md:h-[450px] bg-gray-200 rounded-3xl"></div>
      </div>

      {/* Hero Section 1 Skeleton */}
      <div className="bg-white py-12 px-4 md:px-8 mt-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 bg-gray-200 rounded-xl w-64 mb-8"></div>
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="min-w-[280px] h-[320px] bg-gray-200 rounded-3xl flex-shrink-0"
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories / Most Booked Skeleton */}
      <div className="bg-gray-50 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <div className="h-10 bg-gray-200 rounded-xl w-80 mb-4"></div>
            <div className="h-1.5 w-24 bg-gray-300 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 flex flex-col h-[280px]">
                <div className="h-32 bg-gray-200 w-full relative"></div>
                <div className="p-5 flex flex-col flex-1 gap-2">
                  <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-3"></div>
                  <div className="mt-auto flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded-xl w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Additional Sections Skeleton Pattern */}
      {[...Array(2)].map((_, idx) => (
        <div key={idx} className="bg-white py-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="h-10 bg-gray-200 rounded-xl w-72 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 flex flex-col h-[260px]">
                  <div className="h-36 bg-gray-200 w-full relative"></div>
                  <div className="p-4 flex flex-col flex-1 gap-2">
                    <div className="h-5 bg-gray-200 rounded-md w-2/3 mb-2"></div>
                    <div className="mt-auto flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded-xl w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeSkeleton;
