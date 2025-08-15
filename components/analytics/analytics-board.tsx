"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DateRange } from "react-day-picker"
import { Input } from "@/components/ui/input"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, HeatMap, Rectangle } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

type Point = { label: string; value: number }
type Issue = { issue: string; count: number }
type HeatItem = { day: string; hour: string; value: number }

function genSeries(label: string, len = 12): Point[] {
  return Array.from({ length: len }).map((_, i) => ({
    label: `T${i + 1}`,
    value: Math.round(50 + Math.random() * 50 + i * 5),
  }))
}

const issues: Issue[] = [
  { issue: "Login failures", count: 48 },
  { issue: "Timeouts", count: 32 },
  { issue: "Payment declines", count: 27 },
  { issue: "Sync delays", count: 19 },
]

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const hours = Array.from({ length: 24 }).map((_, i) => `${i}:00`)

function genHeat(): HeatItem[] {
  const data: HeatItem[] = []
  for (const d of days) {
    for (const h of hours) {
      data.push({ day: d, hour: h, value: Math.round(Math.random() * 10) })
    }
  }
  return data
}

export function AnalyticsBoard() {
  const [wa, setWa] = useState<Point[]>([])
  const [watch, setWatch] = useState<Point[]>([])
  const [heat, setHeat] = useState<HeatItem[]>([])
  const [range, setRange] = useState<{ from: string; to: string } | null>(null)

  useEffect(() => {
    setWa(genSeries("WhatsApp"))
    setWatch(genSeries("Watch"))
    setHeat(genHeat())
    const id = setInterval(() => {
      setWa((s) => [...s.slice(1), genSeries("WhatsApp", 1)[0]])
      setWatch((s) => [...s.slice(1), genSeries("Watch", 1)[0]])
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const csv = useMemo(() => {
    const rows = ["label,whatsapp,watch"]
    for (let i = 0; i < Math.max(wa.length, watch.length); i++) {
      rows.push(`${wa[i]?.label ?? ""},${wa[i]?.value ?? ""},${watch[i]?.value ?? ""}`)
    }
    return rows.join("\n")
  }, [wa, watch])

  function downloadCSV() {
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "analytics.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  async function downloadPDF() {
    // lightweight PDF export: render CSV in a blob with .pdf name for demo purposes
    const blob = new Blob([`Analytics Report\n\n${csv}`], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "analytics.pdf"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader className="flex items-center justify-between gap-2 sm:flex-row">
          <CardTitle>WhatsApp Interactions</CardTitle>
          <Input
            type="date"
            className="w-44"
            onChange={() => {}}
            aria-label="Start date"
          />
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: { label: "Interactions", color: "hsl(142.1 76.2% 36.3%)" },
            }}
            className="h-[320px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wa}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="value" fill="hsl(142.1 76.2% 36.3%)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between gap-2 sm:flex-row">
          <CardTitle>Smartwatch Activity Metrics</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadCSV}>Export CSV</Button>
            <Button onClick={downloadPDF}>Export PDF</Button>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: { label: "Activity", color: "hsl(262.1 83.3% 57.8%)" },
            }}
            className="h-[320px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={watch}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="value" fill="hsl(262.1 83.3% 57.8%)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Service Usage Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-1 overflow-x-auto p-2">
            <div />
            {hoursShort.map((h) => (
              <div key={h} className="text-center text-xs text-muted-foreground">{h}</div>
            ))}
            {days.map((d) => (
              <div key={d} className="contents">
                <div className="text-xs text-muted-foreground">{d}</div>
                {hoursShort.map((h, i) => {
                  const v = Math.round(Math.random() * 10)
                  const bg = `hsl(262.1 83.3% ${20 + v * 5}%)`
                  return <div key={d + h + i} title={`${d} ${h}: ${v}`} className="h-6 w-8 rounded-sm" style={{ background: bg }} />
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Most Common Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: { label: "Count", color: "hsl(27.9 84.2% 56.7%)" },
            }}
            className="h-[320px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issues}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="issue" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="count" fill="hsl(27.9 84.2% 56.7%)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

const hoursShort = ["0", "4", "8", "12", "16", "20"]
