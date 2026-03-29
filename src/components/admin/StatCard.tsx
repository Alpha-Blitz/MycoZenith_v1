interface StatCardProps {
  label:         string
  value:         string | number
  delta?:        string
  deltaPositive?: boolean
  icon?:         React.ReactNode
  sublabel?:     string
}

export default function StatCard({ label, value, delta, deltaPositive, icon, sublabel }: StatCardProps) {
  return (
    <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <p className="text-white/45 text-xs font-semibold tracking-[0.15em] uppercase">{label}</p>
        {icon && (
          <span className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/15 flex items-center justify-center text-[#8B5CF6]">
            {icon}
          </span>
        )}
      </div>
      <p className="text-white text-3xl font-semibold tracking-tight">{value}</p>
      {sublabel && <p className="text-white/35 text-xs mt-1">{sublabel}</p>}
      {delta && (
        <p className={['text-xs font-medium mt-3', deltaPositive ? 'text-emerald-400' : 'text-red-400'].join(' ')}>
          {deltaPositive ? '↑' : '↓'} {delta}
        </p>
      )}
    </div>
  )
}
