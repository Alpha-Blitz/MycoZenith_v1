interface StatCardProps {
  label:          string
  value:          string | number
  delta?:         string
  deltaPositive?: boolean
  icon?:          React.ReactNode
  sublabel?:      string
}

export default function StatCard({ label, value, delta, deltaPositive, icon, sublabel }: StatCardProps) {
  return (
    <div className="relative bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-5 overflow-hidden group hover:border-white/[0.12] transition-colors duration-200">
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/[0.03] to-transparent pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <p className="text-white/40 text-xs font-semibold tracking-[0.14em] uppercase leading-tight">{label}</p>
          {icon && (
            <span className="w-7 h-7 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/15 flex items-center justify-center text-[#8B5CF6] shrink-0">
              {icon}
            </span>
          )}
        </div>

        <p className="text-white text-2xl font-semibold tracking-tight">{value}</p>

        {sublabel && <p className="text-white/30 text-xs mt-1">{sublabel}</p>}

        {delta && (
          <div className={['inline-flex items-center gap-1 mt-3 text-xs font-medium px-2 py-0.5 rounded-full',
            deltaPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400',
          ].join(' ')}>
            {deltaPositive ? '↑' : '↓'} {delta}
          </div>
        )}
      </div>
    </div>
  )
}
