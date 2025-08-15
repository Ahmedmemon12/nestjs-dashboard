"use client"

import { Users, Database, Activity, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const kpiConfig = [
  { title: "Total Users", icon: Users, key: "users", color: "text-emerald-600" },
  { title: "Total Datasets", icon: Database, key: "datasets", color: "text-violet-600" },
  { title: "Active Events", icon: Activity, key: "events", color: "text-amber-600" },
  { title: "Service Points", icon: Building2, key: "services", color: "text-rose-600" },
] as const

export function KpiCards() {
  const [stats, setStats] = useState({ users: 0, datasets: 0, events: 0, services: 0 })

  useEffect(() => {
    // Mock load
    const t = setTimeout(() => {
      setStats({ users: 12458, datasets: 342, events: 18, services: 527 })
    }, 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpiConfig.map((k, idx) => (
        <motion.div
          key={k.key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{k.title}</CardTitle>
              <k.icon className={`h-4 w-4 ${k.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats[k.key as keyof typeof stats].toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">{'Updated just now'}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
