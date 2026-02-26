import Skeleton from "@/components/app/Skeleton";

export default function CommentsLoading() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Skeleton className="h-8 w-52 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 mb-6">
        <Skeleton className="h-4 w-16 mb-3" />
        <div className="flex gap-2 mb-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-8 w-28 rounded-full" />)}
        </div>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-36 w-full mb-4 rounded-xl" />
        <Skeleton className="h-11 w-44 rounded-xl" />
      </div>
    </div>
  );
}
