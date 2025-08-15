"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { EventEntity } from "@/types/event"
import { useState } from "react"

export function RsvpPanel({
  event,
  onClose,
  onSave,
}: {
  event: EventEntity
  onClose: () => void
  onSave: (e: EventEntity) => void
}) {
  const [attendees, setAttendees] = useState<string[]>(event.attendees)
  const [email, setEmail] = useState("")

  function add() {
    const v = email.trim().toLowerCase()
    if (!v || attendees.includes(v)) return
    setAttendees((prev) => [...prev, v])
    setEmail("")
  }

  function remove(a: string) {
    setAttendees((prev) => prev.filter((x) => x !== a))
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>RSVP: {event.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Attendee email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
            <Button onClick={add}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {attendees.map((a) => (
              <span key={a} className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs">
                {a}
                <button className="ml-1 text-muted-foreground hover:text-foreground" onClick={() => remove(a)}>
                  ×
                </button>
              </span>
            ))}
            {attendees.length === 0 && <div className="text-sm text-muted-foreground">No attendees yet</div>}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button
              onClick={() => {
                onSave({ ...event, attendees })
                onClose()
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
