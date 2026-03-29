'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface DataPoint { date: string; count: number }

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111111] border border-white/[0.1] rounded-xl px-4 py-3 shadow-xl">
      <p className="text-white/45 text-xs mb-1">{label}</p>
      <p className="text-white font-semibold text-sm">{payload[0].value} orders</p>
    </div>
  )
}

export default function OrdersBarChart({ data }: { data: DataPoint[] }) {
  const fmt = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={fmt}
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval={Math.floor(data.length / 6)}
        />
        <YAxis
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={28}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" fill="#F97316" radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  )
}
