export type DatasetDocStatus = "uploaded" | "embedded"

export interface DatasetDoc {
  id: string
  name: string
  type: "application/pdf"
  size: number
  createdAt: string
  status: DatasetDocStatus
  embeddingDim?: number
}
