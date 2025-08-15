"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const services = ["POS", "Pharmacy", "Diagnostics"] as const
const colors = ["hsl(262.1 83.3% 57.8%)", "hsl(343.7 81.6% 43.9%)", "hsl(27.9 84.2% 56.7%)"]

const data = Array.from({ length: 10 }).map((_, i) => ({
  week: `W${i + 1}`,
  POS: Math.round(100 + Math.random() * 80 + i * 10),
  Pharmacy: Math.round(120 + Math.random() * 60 + i * 8),
  Diagnostics: Math.round(80 + Math.random() * 70 + i * 9),
}))

export function ServiceUsageChart() {
  return (
    <ChartContainer
      config={{
        POS: { label: "Points of Sale", color: colors[0] },
        Pharmacy: { label: "Drug Stores", color: colors[1] },
        Diagnostics: { label: "Diagnostic Centers", color: colors[2] },
      }}
      className="h-[320px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          {services.map((s, i) => (
            <Line key={s} type="monotone" dataKey={s} stroke={colors[i]} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
