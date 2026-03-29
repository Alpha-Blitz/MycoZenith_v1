const STYLES: Record<string, string> = {
  active:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  published:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  draft:      'bg-white/[0.05] text-white/50 border-white/[0.1]',
  pending:    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  processing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  shipped:    'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20',
  delivered:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled:  'bg-red-500/10 text-red-400 border-red-500/20',
  refunded:   'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function StatusBadge({ status }: { status: string }) {
  const styles = STYLES[status.toLowerCase()] ?? 'bg-white/[0.05] text-white/50 border-white/[0.1]'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${styles}`}>
      {status}
    </span>
  )
}
