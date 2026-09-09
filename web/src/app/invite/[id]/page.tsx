"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui";
import { useAppStore } from "@/lib/store";
import { formatWhen } from "@/lib/utils";

export default function InvitePage() {
  const params = useParams<{ id: string }>();
  const event = useAppStore((s) => s.events.find((row) => row.id === params.id));
  const setRsvp = useAppStore((s) => s.setRsvp);

  if (!event) {
    return (
      <main className="p-10">
        <p>Invite not found on this device. Open the same browser that created the event, or connect Supabase.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-lg px-6 py-16 text-center" style={{ background: event.theme.secondaryColor, color: event.theme.primaryColor }}>
      <p className="text-xs uppercase tracking-[0.22em]">{event.theme.themeName}</p>
      <h1 className="mt-4 text-5xl">{event.title}</h1>
      <p className="mt-4">{formatWhen(event.dateStart)}</p>
      <p>{event.locationName}</p>
      <p className="mt-6 text-sm opacity-80">{event.description}</p>
      <div className="mt-10 space-y-3">
        {event.invitations.map((guest) => (
          <div key={guest.id} className="rounded-2xl bg-white/50 px-4 py-3 text-left">
            <p>{guest.guestName}</p>
            <div className="mt-2 flex gap-2">
              <Button variant="dark" onClick={() => setRsvp(event.id, guest.id, "accepted")}>
                Yes
              </Button>
              <Button variant="outline" onClick={() => setRsvp(event.id, guest.id, "declined")}>
                No
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
