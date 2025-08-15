export interface EventEntity {
  id: string
  title: string
  venue: string
  date: string // ISO date
  time: string // HH:mm
  organizer: string
  agenda: string
  attendees: string[]
}
