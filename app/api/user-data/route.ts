import { NextResponse } from "next/server";
import { MockDB } from "@/data/mock-db";

export async function GET() {
  try {
    return NextResponse.json(MockDB.listUserData());
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Failed to list user data" },
      { status: 500 }
    );
  }
}
