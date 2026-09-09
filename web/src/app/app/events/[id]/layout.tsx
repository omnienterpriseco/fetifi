"use client";

import { EventFrame } from "@/components/event-frame";

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return <EventFrame>{children}</EventFrame>;
}
