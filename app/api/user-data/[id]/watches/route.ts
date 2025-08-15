import { NextResponse } from "next/server";
import { MockDB } from "@/data/mock-db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id);
    const watches = MockDB.getUserWatches(userId);
    return NextResponse.json(watches);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Failed to get watches" },
      { status: 500 }
    );
  }
}
