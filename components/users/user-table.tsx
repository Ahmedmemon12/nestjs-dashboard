"use client"

import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import type { User } from "@/types/user"
import { UserFormDialog } from "./user-form-dialog"

export function UserTable({
  users,
  loading,
  onUpdate,
  onDelete,
}: {
  users: User[]
  loading?: boolean
  onUpdate: (id: string, input: Partial<User>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [q, setQ] = useState("")
  const [role, setRole] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  const [editing, setEditing] = useState<User | null>(null)

  const filtered = useMemo(() => {
    return users
      .filter((u) => (role === "all" ? true : u.role === role))
      .filter((u) => (status === "all" ? true : u.status === status))
      .filter((u) => {
        const s = q.trim().toLowerCase()
        if (!s) return true
        return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
      })
  }, [users, q, role, status])

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input placeholder="Search by name or email..." value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex gap-2">
          <select
            className="w-36 rounded-md border bg-background p-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-label="Filter by role"
          >
            <option value="all">All roles</option>
            <option value="admin">admin</option>
            <option value="editor">editor</option>
            <option value="viewer">viewer</option>
          </select>
          <select
            className="w-36 rounded-md border bg-background p-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All status</option>
            <option value="active">active</option>
            <option value="suspended">suspended</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-14 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="capitalize" variant={u.status === "active" ? "default" : "destructive"}>
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditing(u)}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive"
                          onClick={() => onDelete(u.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserFormDialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        onSubmit={async (payload) => {
          if (!editing) return
          await onUpdate(editing.id, payload as any)
          setEditing(null)
        }}
        defaultValues={
          editing
            ? { name: editing.name, email: editing.email, role: editing.role, status: editing.status }
            : undefined
        }
        mode="edit"
      />
    </div>
  )
}
