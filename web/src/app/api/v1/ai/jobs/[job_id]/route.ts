import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ job_id: string }> },
) {
  const { job_id } = await context.params;
  return NextResponse.json({
    job_id,
    status: "completed",
    result_payload: { note: "Attach a FastAPI/Edge worker to fill this." },
  });
}
