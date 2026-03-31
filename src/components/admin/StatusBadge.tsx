const STYLES: Record<string, string> = {
  active:        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  published:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  draft:         'bg-white/[0.05] text-white/50 border-white/[0.1]',
  out_of_stock:  'bg-orange-500/10 text-orange-400 border-orange-500/20',
  pending:       'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  processing:    'bg-purple-500/10 text-purple-400 border-purple-500/20',
  shipped:       'bg-[#FF6523]/10 text-[#FF6523] border-[#FF6523]/20',
  delivered:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled:     'bg-red-500/10 text-red-400 border-red-500/20',
  refunded:      'bg-red-500/10 text-red-400 border-red-500/20',
}

const LABELS: Record<string, string> = {
  out_of_stock: 'Out Of Stock',
}

export default function StatusBadge({ status }: { status: string }) {
  const key    = status.toLowerCase()
  const styles = STYLES[key] ?? 'bg-white/[0.05] text-white/50 border-white/[0.1]'
  const label  = LABELS[key] ?? status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}>
      {label}
    </span>
  )
}
