import React from 'react'

export const PagoSkeleto = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border animate-pulse bg-gray-100"
        >
          <div>
            <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="mt-2 sm:mt-0 flex items-center gap-4">
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
