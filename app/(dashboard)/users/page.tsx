"use client"

import { useEffect, useState } from "react"
import { UserTable } from "@/components/users/user-table"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { UserFormDialog } from "@/components/users/user-form-dialog"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/types/user"
import { fetchJSON } from "@/lib/fetch-json"
import { motion } from "framer-motion"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  async function load() {
    try {
      setLoading(true)
      const data = await fetchJSON<User[]>("/api/users")
      setUsers(data)
    } catch (e: any) {
      toast({ title: "Failed to load users", description: String(e), variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(input: Omit<User, "id" | "createdAt">) {
    const created = await fetchJSON<User>("/api/users", { method: "POST", body: JSON.stringify(input) })
    setUsers((prev) => [created, ...prev])
    toast({ title: "User created", description: `${created.name} added.` })
  }

  async function handleUpdate(id: string, input: Partial<User>) {
    const updated = await fetchJSON<User>(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify(input) })
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)))
    toast({ title: "User updated", description: `${updated.name} saved.` })
  }

  async function handleDelete(id: string) {
    await fetchJSON<{ ok: true }>(`/api/users/${id}`, { method: "DELETE" })
    setUsers((prev) => prev.filter((u) => u.id !== id))
    toast({ title: "User deleted" })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <UserFormDialog open={open} onOpenChange={setOpen} onSubmit={handleCreate} />
      <UserTable users={users} loading={loading} onUpdate={handleUpdate} onDelete={handleDelete} />
    </motion.div>
  )
}
