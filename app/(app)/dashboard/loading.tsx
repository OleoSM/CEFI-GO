export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      {/* Welcome banner skeleton */}
      <div className="card bg-white/3 h-28 rounded-2xl" />

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="card h-24 rounded-2xl bg-white/3" />
        ))}
      </div>

      {/* Main grid skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-48 bg-white/5 rounded-lg" />
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="card h-20 rounded-2xl bg-white/3" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="card h-40 rounded-2xl bg-white/3" />
          <div className="card h-28 rounded-2xl bg-white/3" />
        </div>
      </div>
    </div>
  );
}
