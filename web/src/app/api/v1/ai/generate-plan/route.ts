import { NextResponse } from "next/server";
import { plannerNotesFor, printablePack, rankThemes } from "@/lib/party-ai";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    title?: string;
    description?: string;
    location?: string;
    dateStart?: string;
    budget?: number;
    guests?: number;
    eventId?: string;
  };
  const hay = `${body.title || ""} ${body.description || ""}`;
  const theme = rankThemes(hay)[0];
  if (!theme) {
    return NextResponse.json({ status: "failed" }, { status: 400 });
  }
  const eventId = body.eventId || crypto.randomUUID();
  const guests = body.guests || 12;
  const budget = body.budget || 500;
  return NextResponse.json({
    job_id: crypto.randomUUID(),
    status: "completed",
    job_type: "planner",
    result: {
      theme,
      notes: plannerNotesFor(theme, budget, guests),
      printables: printablePack(
        body.title || "Your party",
        theme,
        body.location || "To be confirmed",
        body.dateStart || new Date().toISOString(),
        guests,
        eventId,
      ),
    },
  });
}
