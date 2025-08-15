import { NextResponse } from "next/server"
import { MockDB, docMetaSchema } from "@/data/mock-db"

export async function GET() {
  try {
    return NextResponse.json(MockDB.listDocs())
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to list documents" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file")
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 })
    }
    const meta = { name: file.name, type: file.type as "application/pdf", size: file.size }
    const parsed = docMetaSchema.parse(meta)
    const buf = new Uint8Array(await file.arrayBuffer())
    const created = MockDB.createDoc(parsed, buf)
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    const msg = e?.issues?.[0]?.message ?? e.message ?? "Invalid payload"
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
