'use client'

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'

interface RadarChartProps {
  data: {
    subject: string
    A: number
    fullMark: number
  }[]
}

export function RiasecRadarChart({ data }: RadarChartProps) {
  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="var(--color-border)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12, fontWeight: 600 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--color-card)', 
              borderColor: 'var(--color-border)',
              borderRadius: '12px',
              color: 'var(--color-foreground)'
            }} 
            itemStyle={{ color: 'var(--color-primary)' }}
          />
          <Radar
            name="Skor Minat"
            dataKey="A"
            stroke="var(--color-primary)"
            fill="var(--color-primary)"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
