"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, inputClass } from "@/components/ui";
import { useAppStore } from "@/lib/store";

export default function WizardPage() {
  const createFromWizard = useAppStore((s) => s.createFromWizard);
  const router = useRouter();
  const [mode, setMode] = useState<"prompt" | "steps">("prompt");
  const [prompt, setPrompt] = useState("3rd Birthday Party - Jungle Theme - $500 budget");
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("birthday");
  const [demographic, setDemographic] = useState("toddlers and families");
  const [budget, setBudget] = useState("500");
  const [location, setLocation] = useState("");
  const [dateStart, setDateStart] = useState("");

  function go(e: FormEvent) {
    e.preventDefault();
    const event = createFromWizard(
      mode === "prompt"
        ? { prompt }
        : {
            title,
            eventType,
            demographic,
            budget: Number(budget) || 500,
            location,
            dateStart: dateStart ? new Date(dateStart).toISOString() : undefined,
          },
    );
    if (event) router.push(`/app/events/${event.id}`);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">Event wizard</p>
      <h1 className="mt-2 text-4xl">What are you throwing?</h1>
      <div className="mt-6 flex gap-2">
        <Button variant={mode === "prompt" ? "dark" : "outline"} onClick={() => setMode("prompt")} type="button">
          One prompt
        </Button>
        <Button variant={mode === "steps" ? "dark" : "outline"} onClick={() => setMode("steps")} type="button">
          Step by step
        </Button>
      </div>
      <form onSubmit={go} className="mt-8 space-y-4">
        {mode === "prompt" ? (
          <Field label="The whole idea">
            <textarea
              className={`${inputClass} min-h-32`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </Field>
        ) : (
          <>
            <Field label="Title">
              <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Maya’s garden lunch" />
            </Field>
            <Field label="Type">
              <select className={inputClass} value={eventType} onChange={(e) => setEventType(e.target.value)}>
                <option value="birthday">Birthday</option>
                <option value="wedding">Wedding</option>
                <option value="baby_shower">Baby shower</option>
                <option value="corporate">Corporate</option>
                <option value="anniversary">Anniversary</option>
                <option value="celebration">Celebration</option>
              </select>
            </Field>
            <Field label="Who’s it for">
              <input className={inputClass} value={demographic} onChange={(e) => setDemographic(e.target.value)} />
            </Field>
            <Field label="Budget ceiling">
              <input className={inputClass} value={budget} onChange={(e) => setBudget(e.target.value)} />
            </Field>
            <Field label="When">
              <input className={inputClass} type="datetime-local" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
            </Field>
            <Field label="Where">
              <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Backyard, 14 Willow St" />
            </Field>
          </>
        )}
        <Button
          type="button"
          variant="dark"
          className="w-full"
          onClick={() => {
            const event = createFromWizard(
              mode === "prompt"
                ? { prompt }
                : {
                    title,
                    eventType,
                    demographic,
                    budget: Number(budget) || 500,
                    location,
                    dateStart: dateStart ? new Date(dateStart).toISOString() : undefined,
                  },
            );
            if (event) router.push(`/app/events/${event.id}`);
          }}
        >
          Instantly fill the box
        </Button>
      </form>
    </main>
  );
}
