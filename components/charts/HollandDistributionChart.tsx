'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useState, useEffect } from 'react'

const COLORS = {
  R: '#ef4444', // Red
  I: '#f59e0b', // Amber
  A: '#10b981', // Emerald
  S: '#3b82f6', // Blue
  E: '#8b5cf6', // Violet
  C: '#64748b', // Slate
}

const DIMENSION_NAMES = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
}

interface HollandDistributionChartProps {
  data: {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
  }
}

export function HollandDistributionChart({ data }: HollandDistributionChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-[300px] flex items-center justify-center bg-slate-50 animate-pulse rounded-2xl">Loading Chart...</div>

  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: DIMENSION_NAMES[key as keyof typeof DIMENSION_NAMES],
      value,
      fill: COLORS[key as keyof typeof COLORS]
    }))

  if (chartData.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-slate-500">Belum ada data untuk ditampilkan.</div>
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => [`${value} Siswa`, 'Jumlah']}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
