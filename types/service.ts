export interface ServicePoint {
  id: string
  name: string
  category: "Points of Sale" | "Drug Stores" | "Diagnostic Centers"
  location: string
  contact: string
  tags: string[]
}
