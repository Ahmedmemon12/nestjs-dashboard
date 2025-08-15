"use client"

import { useMemo, useState } from "react"
import type { ServicePoint } from "@/types/service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone } from 'lucide-react'

const points: ServicePoint[] = [
  { id: "1", name: "Main St. POS", category: "Points of Sale", location: "123 Main St, Springfield", contact: "+1 (555) 0123", tags: ["pos", "retail"] },
  { id: "2", name: "Green Pharmacy", category: "Drug Stores", location: "42 Elm St, Springfield", contact: "+1 (555) 4567", tags: ["rx", "otc"] },
  { id: "3", name: "Precise Diagnostics", category: "Diagnostic Centers", location: "9 Oak Ave, Springfield", contact: "+1 (555) 9876", tags: ["lab", "bloodwork"] },
]

const categories = ["All", "Points of Sale", "Drug Stores", "Diagnostic Centers"] as const

export function ServiceDirectory() {
  const [q, setQ] = useState("")
  const [cat, setCat] = useState<(typeof categories)[number]>("All")

  const visible = useMemo(() => {
    const s = q.trim().toLowerCase()
    return points.filter((p) => (cat === "All" ? true : p.category === cat))
      .filter((p) => {
        if (!s) return true
        return p.name.toLowerCase().includes(s) || p.location.toLowerCase().includes(s) || p.tags.some((t) => t.includes(s))
      })
  }, [q, cat])

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input placeholder="Search services..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={cat} onChange={(e) => setCat(e.target.value as any)} className="rounded-md border bg-background p-2 text-sm">
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{p.name}</span>
                <Badge variant="secondary">{p.category}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{p.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href={`tel:${p.contact}`} className="hover:underline">
                  {p.contact}
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <Badge key={t} variant="outline" className="lowercase">#{t}</Badge>
                ))}
              </div>
              <iframe
                title={`map-${p.id}`}
                className="mt-2 h-40 w-full rounded-md border"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(p.location)}&z=14&output=embed`}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
