import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    note: "Summary is computed on the client from the event workspace until Supabase is connected.",
  });
}
