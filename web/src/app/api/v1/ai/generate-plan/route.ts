import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    job_id: crypto.randomUUID(),
    status: "queued",
    job_type: "planner",
    echo: body,
  });
}
