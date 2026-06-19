export default function BookCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[20px] border border-emerald-100 bg-white p-4 shadow-sm">
      <div className="mb-4 h-56 rounded-3xl bg-emerald-100" />
      <div className="h-4 w-3/4 rounded-full bg-emerald-100" />
      <div className="mt-3 h-3 w-1/2 rounded-full bg-emerald-100" />
      <div className="mt-6 flex items-center justify-between">
        <div className="h-8 w-24 rounded-full bg-emerald-100" />
        <div className="h-8 w-16 rounded-full bg-emerald-100" />
      </div>
    </div>
  );
}
