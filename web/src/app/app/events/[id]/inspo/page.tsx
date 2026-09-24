"use client";

import { useState } from "react";
import { useEvent } from "@/components/event-frame";
import { Button, Field, inputClass } from "@/components/ui";
import { fileToDataUrl } from "@/lib/party-ai";
import { extractPalette } from "@/lib/palette";
import { useAppStore } from "@/lib/store";
import { uid } from "@/lib/utils";

export default function InspoPage() {
  const event = useEvent();
  const addInspoPin = useAppStore((s) => s.addInspoPin);
  const applyThemeOption = useAppStore((s) => s.applyThemeOption);
  const refreshPlan = useAppStore((s) => s.refreshPlan);
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");

  if (!event) return null;
  const pins = event.inspoPins || [];
  const themes = event.themeOptions || [];

  async function onFiles(list: FileList | null) {
    if (!list || !event) return;
    for (const file of Array.from(list)) {
      const dataUrl = await fileToDataUrl(file);
      const colors = await extractPalette(file);
      addInspoPin(event.id, {
        id: uid(),
        eventId: event.id,
        caption: caption || file.name.replace(/\.[^.]+$/, ""),
        detail: "Uploaded inspo. Use it as a color and texture cue.",
        dataUrl,
        colors,
        kind: "upload",
      });
    }
    setCaption("");
    setMessage("Saved to the board.");
  }

  return (
    <div>
      <h2 className="text-3xl">Inspo and themes</h2>
      <p className="mt-2 text-sm text-muted">
        Upload screenshots, then ask Fetifi for a theme list, shopping ideas, and printables.
      </p>
      {message ? <p className="mt-3 text-sm">{message}</p> : null}
      <div className="mt-6 space-y-3 hairline rounded-3xl bg-white/50 p-5">
        <Field label="What do you like about it?">
          <input className={inputClass} value={caption} onChange={(e) => setCaption(e.target.value)} />
        </Field>
        <input className="text-sm" type="file" accept="image/*" multiple onChange={(e) => void onFiles(e.target.files)} />
        <Button
          variant="dark"
          onClick={() => {
            refreshPlan(event.id);
            setMessage("Theme list, inspo ideas, and printables refreshed.");
          }}
        >
          Turn inspo into a plan
        </Button>
      </div>
      <h3 className="mt-10 text-2xl">Theme list</h3>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {themes.map((theme) => (
          <li key={theme.id} className="hairline rounded-3xl bg-white/50 p-4">
            <div className="flex gap-2">
              <span className="h-6 w-6 rounded-full" style={{ background: theme.primaryColor }} />
              <span className="h-6 w-6 rounded-full" style={{ background: theme.accentColor }} />
            </div>
            <p className="mt-2 text-lg">{theme.name}</p>
            <p className="text-sm text-muted">{theme.why}</p>
            <Button className="mt-3" variant="outline" onClick={() => applyThemeOption(event.id, theme)}>
              {event.theme.themeName === theme.name ? "Using this" : "Use this theme"}
            </Button>
          </li>
        ))}
      </ul>
      <h3 className="mt-10 text-2xl">Board</h3>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {pins.map((pin) => (
          <li key={pin.id} className="hairline overflow-hidden rounded-3xl bg-white/50">
            {pin.dataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pin.dataUrl} alt="" className="h-40 w-full object-cover" />
            ) : null}
            <div className="p-4">
              <p className="font-medium">{pin.caption}</p>
              <p className="mt-1 text-sm text-muted">{pin.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
