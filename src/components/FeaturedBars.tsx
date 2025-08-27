
// Simplified component for waitlist-only deployment
export default async function FeaturedBars() {
  return (
    <div className="text-center py-8">
      <p className="text-zinc-400">
        Coming soon! Bar listings will be available after launch.
      </p>
    </div>
  );
}

// Loading skeleton
export function FeaturedBarsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="h-5 bg-zinc-700 rounded w-24 mb-2"></div>
              <div className="h-4 bg-zinc-700 rounded w-16"></div>
            </div>
            <div className="h-5 bg-zinc-700 rounded w-8"></div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-zinc-700 rounded w-20"></div>
            <div className="h-4 bg-zinc-700 rounded w-16"></div>
          </div>
          <div className="flex gap-1">
            <div className="h-5 bg-zinc-700 rounded-full w-12"></div>
            <div className="h-5 bg-zinc-700 rounded-full w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
