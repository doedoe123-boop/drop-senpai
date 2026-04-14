export default function LoadingProtectedRoute() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="h-10 w-80 rounded-2xl bg-white/[0.04]" />
          <div className="h-5 w-96 rounded-xl bg-white/[0.03]" />
        </div>
        <div className="h-12 w-32 rounded-full border border-white/10 bg-white/[0.03]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-3xl border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>
      <div className="h-[32rem] rounded-[28px] border border-white/10 bg-slate-950/70" />
    </div>
  );
}
