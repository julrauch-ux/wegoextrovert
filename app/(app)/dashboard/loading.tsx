import Skeleton from "@/components/app/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Skeleton className="h-8 w-40 mb-2" />
      <Skeleton className="h-4 w-56 mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <Skeleton className="h-4 w-32 mb-3" />
            <Skeleton className="h-9 w-16 mb-2" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <Skeleton className="h-4 w-36 mb-4" />
            {[0, 1, 2].map((j) => (
              <Skeleton key={j} className="h-10 w-full mb-3" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
