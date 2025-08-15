import { NextResponse } from "next/server"
import { MockDB, eventSchema } from "@/data/mock-db"

export async function GET() {
  try {
    return NextResponse.json(MockDB.listEvents())
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to list events" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = eventSchema.parse(body)
    const created = MockDB.createEvent(parsed)
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    const msg = e?.issues?.[0]?.message ?? e.message ?? "Invalid payload"
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
