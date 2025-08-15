"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = Array.from({ length: 12 }).map((_, i) => ({
  month: new Date(2024, i, 1).toLocaleString("en-US", { month: "short" }),
  users: Math.round(2000 + i * 400 + Math.random() * 300),
}))

export function UserGrowthChart() {
  return (
    <ChartContainer
      config={{
        users: {
          label: "Users",
          color: "hsl(142.1 76.2% 36.3%)",
        },
      }}
      className="h-[320px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUsers" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="hsl(142.1 76.2% 36.3%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(142.1 76.2% 36.3%)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Area type="monotone" dataKey="users" stroke="hsl(142.1 76.2% 36.3%)" fill="url(#colorUsers)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
