import { NextResponse } from "next/server";
import { MockDB } from "@/data/mock-db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id);
  const user = MockDB.getUserData(id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);
    MockDB.deleteUserData(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Failed to delete" },
      { status: 400 }
    );
  }
}
