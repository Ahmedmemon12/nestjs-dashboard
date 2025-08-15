export type UserRole = "admin" | "editor" | "viewer"
export type UserStatus = "active" | "suspended"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
}
