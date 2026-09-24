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
  const [busy, setBusy] = useState(false);

  if (!event) return null;
  const pins = event.inspoPins || [];
  const themes = event.themeOptions || [];

  async function onFiles(list: FileList | null) {
    if (!list || !event) return;
    setBusy(true);
    try {
      for (const file of Array.from(list)) {
        const [dataUrl, colors] = await Promise.all([fileToDataUrl(file), extractPalette(file)]);
        addInspoPin(event.id, {
          id: uid(),
          eventId: event.id,
          caption: caption || file.name.replace(/\.[^.]+$/, "") || "Mood board",
          detail: "Pulled into your party idea: colors, printables, and a theme list.",
          dataUrl: dataUrl || undefined,
          colors,
          kind: "upload",
        });
      }
      refreshPlan(event.id);
      setCaption("");
      setMessage("Fetifi built a party idea from your photos. Check Plan, Print, and the theme list below.");
    } catch {
      setMessage("That photo could not be read. Try a JPG or PNG under 10 MB.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h2 className="text-3xl">Inspo and themes</h2>
      <p className="mt-2 text-sm text-muted">
        Upload a mood board. Fetifi reads the colors, picks a party idea, and fills printables to match.
      </p>
      {message ? <p className="mt-3 text-sm">{message}</p> : null}
      <div className="mt-6 space-y-3 hairline rounded-3xl bg-white/50 p-5">
        <Field label="What do you like about it?">
          <input className={inputClass} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="jungle greens, gold balloons..." />
        </Field>
        <input
          className="text-sm"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          multiple
          disabled={busy}
          onChange={(e) => {
            const files = e.target.files;
            void onFiles(files);
            e.target.value = "";
          }}
        />
        <Button
          variant="dark"
          disabled={busy}
          onClick={() => {
            refreshPlan(event.id);
            setMessage("Party idea, theme list, and printables rebuilt from your board.");
          }}
        >
          {busy ? "Reading photos..." : "Generate party from inspo"}
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
