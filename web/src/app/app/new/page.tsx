"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, inputClass } from "@/components/ui";
import { fileToDataUrl } from "@/lib/party-ai";
import { extractPalette } from "@/lib/palette";
import { useAppStore } from "@/lib/store";
import { uid } from "@/lib/utils";

export default function WizardPage() {
  const createFromWizard = useAppStore((s) => s.createFromWizard);
  const addInspoPin = useAppStore((s) => s.addInspoPin);
  const router = useRouter();
  const [prompt, setPrompt] = useState("3rd birthday, jungle theme, backyard");
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("500");
  const [location, setLocation] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [guests, setGuests] = useState("12");
  const [files, setFiles] = useState<File[]>([]);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [createdTitle, setCreatedTitle] = useState("");

  async function go(e: FormEvent) {
    e.preventDefault();
    const event = createFromWizard({
      prompt: title ? `${title}. ${prompt}` : prompt,
      title: title || undefined,
      budget: Number(budget) || 500,
      location,
      dateStart: dateStart ? new Date(dateStart).toISOString() : undefined,
      guestCount: Number(guests) || 12,
    });
    if (!event) return;
    for (const file of files) {
      const dataUrl = await fileToDataUrl(file);
      const colors = await extractPalette(file);
      addInspoPin(event.id, {
        id: uid(),
        eventId: event.id,
        caption: file.name.replace(/\.[^.]+$/, ""),
        detail: "Uploaded inspo. Fetifi uses this as a color and texture cue.",
        dataUrl,
        colors,
        kind: "upload",
      });
    }
    setCreatedId(event.id);
    setCreatedTitle(event.title);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">Plan a party</p>
      <h1 className="mt-2 text-4xl">Tell Fetifi the easy parts</h1>
      <p className="mt-2 text-sm text-muted">
        Name, budget, a vibe, and a few photos. We fill a theme list, shopping ideas, timeline, and printables. You can change every line.
      </p>
      <form onSubmit={go} className="mt-8 space-y-4">
        <Field label="Party name">
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Maya garden lunch" />
        </Field>
        <Field label="The vibe">
          <textarea
            className={`${inputClass} min-h-28`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </Field>
        <Field label="Budget ceiling">
          <input className={inputClass} value={budget} onChange={(e) => setBudget(e.target.value)} inputMode="decimal" />
        </Field>
        <Field label="Guests">
          <input className={inputClass} value={guests} onChange={(e) => setGuests(e.target.value)} inputMode="numeric" />
        </Field>
        <Field label="When">
          <input className={inputClass} type="datetime-local" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
        </Field>
        <Field label="Where">
          <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Backyard, 14 Willow St" />
        </Field>
        <Field label="Inspo photos">
          <input
            className="text-sm"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
          {files.length ? <p className="text-xs text-muted">{files.length} photo(s) ready</p> : null}
        </Field>
        <Button type="submit" variant="dark" className="w-full">
          Ask Fetifi to plan it
        </Button>
      </form>

      {createdId ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-6">
          <div className="w-full max-w-md rounded-[1.8rem] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Workspace ready</p>
                <h2 className="mt-1 text-2xl">{createdTitle}</h2>
                <p className="mt-2 text-sm text-muted">Open it now, or close this and find it on your home list.</p>
              </div>
              <button className="text-muted" onClick={() => router.push("/app")} aria-label="Close">
                X
              </button>
            </div>
            <Button className="mt-6 w-full" variant="dark" href={`/app/events/${createdId}`}>
              Open workspace
            </Button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
