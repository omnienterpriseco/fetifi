import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.join_code || String(body.join_code).length < 6) {
    return NextResponse.json({ error: "Invalid join code" }, { status: 400 });
  }
  return NextResponse.json({
    ok: true,
    message: "Join is applied in the client store. Wire this to collaborators + RLS next.",
  });
}
