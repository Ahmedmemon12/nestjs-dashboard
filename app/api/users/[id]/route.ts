import { NextResponse } from "next/server"
import { MockDB, userUpdateSchema } from "@/data/mock-db"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = MockDB.getUser(params.id)
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(user)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const parsed = userUpdateSchema.parse(body)
    const updated = MockDB.updateUser(params.id, parsed)
    return NextResponse.json(updated)
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update" }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    MockDB.deleteUser(params.id)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to delete" }, { status: 400 })
  }
}
