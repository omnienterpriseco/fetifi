import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    job_id: crypto.randomUUID(),
    status: "queued",
    job_type: "inspiration",
  });
}
