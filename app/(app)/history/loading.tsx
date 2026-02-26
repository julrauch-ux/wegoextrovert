import Skeleton from "@/components/app/Skeleton";

export default function HistoryLoading() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Skeleton className="h-8 w-28 mb-2" />
      <Skeleton className="h-4 w-64 mb-8" />
      <Skeleton className="h-10 w-56 rounded-xl mb-6" />
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 py-4 border-b border-white/5 last:border-0">
            <Skeleton className="h-5 w-16 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
