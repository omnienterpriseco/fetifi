"use client";

import { FormEvent, useState } from "react";
import { useEvent } from "@/components/event-frame";
import { Button, inputClass } from "@/components/ui";
import { useAppStore } from "@/lib/store";
import type { RsvpStatus } from "@/lib/types";

export default function GuestsPage() {
  const event = useEvent();
  const addGuest = useAppStore((s) => s.addGuest);
  const setRsvp = useAppStore((s) => s.setRsvp);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  if (!event) return null;

  function add(e: FormEvent) {
    e.preventDefault();
    if (!guestName.trim() || !event) return;
    addGuest(event.id, { guestName: guestName.trim(), guestEmail });
    setGuestName("");
    setGuestEmail("");
  }

  const counts = {
    accepted: event.invitations.filter((i) => i.rsvpStatus === "accepted").length,
    declined: event.invitations.filter((i) => i.rsvpStatus === "declined").length,
    pending: event.invitations.filter((i) => i.rsvpStatus === "pending").length,
  };

  return (
    <div>
      <h2 className="text-3xl">Guests & RSVP</h2>
      <p className="mt-2 text-sm text-muted">
        {counts.accepted} yes · {counts.pending} pending · {counts.declined} no
      </p>
      <form onSubmit={add} className="mt-4 grid gap-2 md:grid-cols-[1fr_1fr_auto]">
        <input className={inputClass} value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Name" />
        <input className={inputClass} value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="Email" />
        <Button type="submit" variant="dark">
          Invite
        </Button>
      </form>
      <ul className="mt-6 space-y-2">
        {event.invitations.map((guest) => (
          <li key={guest.id} className="hairline flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/50 px-4 py-3">
            <div>
              <p>{guest.guestName}</p>
              <p className="text-xs text-muted">
                {guest.guestEmail || "no email"} · +{guest.plusOnes}
                {guest.dietaryRestrictions ? ` · ${guest.dietaryRestrictions}` : ""}
              </p>
            </div>
            <select
              className="rounded-xl hairline bg-transparent px-2 py-1 text-sm"
              value={guest.rsvpStatus}
              onChange={(e) => setRsvp(event.id, guest.id, e.target.value as RsvpStatus)}
            >
              <option value="pending">pending</option>
              <option value="accepted">accepted</option>
              <option value="declined">declined</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
