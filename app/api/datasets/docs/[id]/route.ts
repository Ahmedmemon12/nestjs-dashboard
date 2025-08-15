import { NextResponse } from "next/server"
import { MockDB, embedSchema } from "@/data/mock-db"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const doc = MockDB.getDoc(params.id)
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const url = new URL(req.url)
  const download = url.searchParams.get("download")
  const headers: HeadersInit = {
    "Content-Type": doc.type,
    "Content-Length": String(doc.size),
  }
  if (download) {
    headers["Content-Disposition"] = `attachment; filename="${doc.name.replace(/"/g, "")}"`
  }
  return new Response(doc.data, { headers })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const parsed = embedSchema.parse(body)
    // Simulate embedding generation (e.g., 1536-dim vector). In production, call your embedding provider here.
    const updated = MockDB.markEmbedded(params.id, 1536)
    return NextResponse.json(updated)
  } catch (e: any) {
    const msg = e?.issues?.[0]?.message ?? e.message ?? "Invalid payload"
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    MockDB.deleteDoc(params.id)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to delete" }, { status: 400 })
  }
}
