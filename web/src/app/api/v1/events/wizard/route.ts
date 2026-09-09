import { NextResponse } from "next/server";
import { instantiateEvent } from "@/lib/planner";

export async function POST(request: Request) {
  const body = await request.json();
  const event = instantiateEvent({
    prompt: body.prompt,
    title: body.title,
    eventType: body.eventType,
    demographic: body.demographic,
    budget: body.budget,
    dateStart: body.dateStart,
    location: body.location,
    ownerId: body.ownerId || "api",
    ownerName: body.ownerName || "Host",
    ownerEmail: body.ownerEmail || "host@example.com",
  });
  return NextResponse.json(event);
}
