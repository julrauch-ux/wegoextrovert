import Skeleton from "@/components/app/Skeleton";

export default function PostsLoading() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Skeleton className="h-8 w-36 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-5">
        <Skeleton className="h-4 w-16 mb-1" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-8 w-28 rounded-full" />)}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
        </div>
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>
    </div>
  );
}
