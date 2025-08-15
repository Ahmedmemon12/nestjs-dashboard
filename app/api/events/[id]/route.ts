import { NextResponse } from "next/server"
import { MockDB, eventUpdateSchema } from "@/data/mock-db"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const e = MockDB.getEvent(params.id)
  if (!e) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(e)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const parsed = eventUpdateSchema.parse(body)
    const e = MockDB.updateEvent(params.id, parsed)
    return NextResponse.json(e)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update" }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    MockDB.deleteEvent(params.id)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete" }, { status: 400 })
  }
}
