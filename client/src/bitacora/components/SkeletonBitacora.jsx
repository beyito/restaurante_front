import React from 'react'

export const SkeletonBitacora = () => {
  return (
    <div className="flex flex-col items-center py-4 px-4 space-y-6 container max-h-[calc(100vh-50px)] overflow-y-auto">
      <div className="w-full max-w-7xl">
        <div className="border-b pb-4">
          <div className="flex items-center justify-center mb-2">
            <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse mr-2" />
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-4 w-80 bg-gray-200 rounded mx-auto animate-pulse mt-2" />
        </div>
        <div className="flex flex-wrap gap-4 justify-center items-center border rounded-xl p-4 mb-6 bg-gray-100 mt-4">
          <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
          <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="w-48 h-8 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"></div>
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="p-4 flex gap-2 items-start shadow-sm rounded-lg bg-white animate-pulse">
            <div className="p-2 rounded-full bg-gray-200 w-10 h-10" />
            <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="h-4 w-24 bg-gray-200 rounded col-span-1" />
              <div className="h-4 w-16 bg-gray-200 rounded col-span-1" />
              <div className="h-4 w-28 bg-gray-200 rounded col-span-1" />
              <div className="h-4 w-20 bg-gray-200 rounded col-span-1" />
              <div className="h-4 w-40 bg-gray-200 rounded col-span-2" />
              <div className="h-4 w-32 bg-gray-200 rounded col-span-2" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center space-x-4 mt-6">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  )
}
