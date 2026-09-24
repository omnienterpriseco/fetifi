import { NextResponse } from "next/server";
import { rankThemes, themeFromInspo } from "@/lib/party-ai";
import type { EventRecord, InspoPin } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    title?: string;
    description?: string;
    colors?: string[];
    caption?: string;
  };
  const pin: InspoPin = {
    id: "upload",
    eventId: "tmp",
    caption: body.caption || "Mood board",
    detail: "",
    colors: body.colors || [],
    kind: "upload",
  };
  const fake = {
    title: body.title || "Your party",
    description: body.description || "",
    inspoPins: [pin],
  } as EventRecord;
  const theme = body.colors?.length
    ? themeFromInspo([pin], fake)
    : rankThemes(`${body.title || ""} ${body.caption || ""}`)[0];
  return NextResponse.json({
    job_id: crypto.randomUUID(),
    status: "completed",
    job_type: "inspiration",
    result: { theme, colors: body.colors || [] },
  });
}
