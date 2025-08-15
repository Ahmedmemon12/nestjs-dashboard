"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"

type Activity = {
  id: string
  actor: string
  action: string
  entity: string
  at: string
}

export function RecentActivities() {
  const [rows, setRows] = useState<Activity[]>([])

  useEffect(() => {
    setRows([
      { id: "1", actor: "Jane Doe", action: "updated", entity: "Dataset “Pharmacies Q2”", at: new Date().toLocaleString() },
      { id: "2", actor: "Admin", action: "created", entity: "Event “Community Health Fair”", at: new Date(Date.now() - 3600e3).toLocaleString() },
      { id: "3", actor: "John Smith", action: "added", entity: "Service Point “Main St. POS”", at: new Date(Date.now() - 2 * 3600e3).toLocaleString() },
      { id: "4", actor: "System", action: "generated", entity: "Report “Usage Summary”", at: new Date(Date.now() - 6 * 3600e3).toLocaleString() },
    ])
  }, [])

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Actor</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.actor}</TableCell>
              <TableCell className="capitalize">{r.action}</TableCell>
              <TableCell>{r.entity}</TableCell>
              <TableCell className="text-muted-foreground">{r.at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
