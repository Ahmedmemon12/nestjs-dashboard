import { NextResponse } from "next/server"
import { MockDB, userSchema } from "@/data/mock-db"

export async function GET() {
  try {
    return NextResponse.json(MockDB.listUsers())
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to list users" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = userSchema.parse(body)
    const created = MockDB.createUser(parsed)
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    const msg = e?.issues?.[0]?.message ?? e.message ?? "Invalid payload"
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
