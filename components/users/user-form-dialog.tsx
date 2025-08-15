"use client"

import { useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User } from "@/types/user"

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email(),
  role: z.enum(["admin", "editor", "viewer"]),
  status: z.enum(["active", "suspended"]).default("active"),
})

type FormValues = z.infer<typeof schema>

export function UserFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode = "create",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: Omit<User, "id" | "createdAt">) => Promise<void>
  defaultValues?: Partial<FormValues>
  mode?: "create" | "edit"
}) {
  const { register, handleSubmit, formState, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { name: "", email: "", role: "viewer", status: "active" },
  })

  useEffect(() => {
    if (defaultValues) reset(defaultValues)
  }, [defaultValues, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="user-dialog-desc">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add User" : "Edit User"}</DialogTitle>
        </DialogHeader>
        <form
          id="user-form"
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values as any)
            onOpenChange(false)
            reset()
          })}
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {formState.errors.name && (
              <p className="text-sm text-destructive">{formState.errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {formState.errors.email && (
              <p className="text-sm text-destructive">{formState.errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <select id="role" className="rounded-md border bg-background p-2 text-sm" {...register("role")}>
              <option value="admin">admin</option>
              <option value="editor">editor</option>
              <option value="viewer">viewer</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" className="rounded-md border bg-background p-2 text-sm" {...register("status")}>
              <option value="active">active</option>
              <option value="suspended">suspended</option>
            </select>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="user-form">
            {mode === "create" ? "Create" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
