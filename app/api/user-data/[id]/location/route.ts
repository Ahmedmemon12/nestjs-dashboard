import { NextResponse } from "next/server";
import { MockDB } from "@/data/mock-db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id);
    const locationData = MockDB.getUserLocationData(userId);
    return NextResponse.json(locationData);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Failed to get location data" },
      { status: 500 }
    );
  }
}
