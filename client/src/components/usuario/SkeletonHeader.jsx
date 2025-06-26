

export const SkeletonHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center animate-pulse">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-gray-300 rounded-full" />
          <div className="h-6 w-24 bg-gray-300 rounded" />
        </div>
        <nav className="hidden md:flex ml-10 gap-6">
          <div className="h-5 w-16 bg-gray-300 rounded" />
          <div className="h-5 w-16 bg-gray-300 rounded" />
          <div className="h-5 w-16 bg-gray-300 rounded" />
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-300" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-20 bg-gray-300 rounded" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
            </div>
            <div className="h-8 w-24 bg-gray-300 rounded" />
          </div>
          <div className="hidden md:flex gap-2">
            <div className="h-8 w-24 bg-gray-300 rounded" />
            <div className="h-8 w-24 bg-gray-300 rounded" />
          </div>
          <div className="md:hidden flex items-center">
            <div className="h-10 w-10 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </header>
  )
}
