import { NextResponse } from "next/server";
import { MockDB } from "@/data/mock-db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id);
    const healthData = MockDB.getUserHealthData(userId);
    return NextResponse.json(healthData);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Failed to get health data" },
      { status: 500 }
    );
  }
}
