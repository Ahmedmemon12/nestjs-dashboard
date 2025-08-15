export interface EventEntity {
  id: number;
  title: string;
  description: string;
  eventDate: string; // ISO date string
  location: string;
  organizerName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string;
  status: "active" | "cancelled" | "completed";
  createdAt?: string;
  updatedAt?: string;
}
