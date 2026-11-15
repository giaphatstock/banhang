import { Loader2 } from 'lucide-react'

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-white/10 rounded-xl" />
          <div className="h-4 w-72 bg-white/5 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-white/10 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-48 rounded-2xl bg-white/[0.03] border border-white/5 p-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-5 w-3/4 bg-white/10 rounded" />
              <div className="h-4 w-1/2 bg-white/5 rounded" />
            </div>
            <div className="h-8 w-full bg-white/5 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}
