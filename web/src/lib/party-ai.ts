import type { InspoPin, Printable, ThemeOption } from "./types";
import { themePresets } from "./theme-presets";
import { nowIso, uid } from "./utils";

export function rankThemes(text: string): ThemeOption[] {
  const hay = text.toLowerCase();
  const options: ThemeOption[] = themePresets.map((preset) => ({
    id: preset.name.toLowerCase().replace(/\s+/g, "-"),
    name: preset.name,
    mood: preset.mood,
    why: `Matches ${preset.keywords.slice(0, 3).join(", ")}.`,
    primaryColor: preset.primaryColor,
    secondaryColor: preset.secondaryColor,
    accentColor: preset.accentColor,
  }));
  const extra: ThemeOption = {
    id: "pastel-confetti",
    name: "Pastel Confetti",
    mood: "Mint, peach, and lilac like a gift box.",
    why: "Fetifi house style: easy, cheerful, photo-friendly.",
    primaryColor: "#C9B6DE",
    secondaryColor: "#FFF7FB",
    accentColor: "#E8A8C4",
  };
  const all = [...options, extra];
  return [...all].sort((a, b) => score(hay, b) - score(hay, a)).slice(0, 4);
}

function score(hay: string, theme: ThemeOption) {
  let n = 0;
  if (hay.includes(theme.name.toLowerCase())) n += 5;
  for (const word of `${theme.why} ${theme.mood}`.toLowerCase().split(/\W+/)) {
    if (word.length > 4 && hay.includes(word)) n += 1;
  }
  return n;
}

export function inspoIdeas(theme: ThemeOption, budget: number, guests: number, eventId: string): InspoPin[] {
  const each = Math.max(8, Math.round(budget / Math.max(guests, 1) / 4));
  const rows: [string, string][] = [
    ["Table story", `A ${theme.name.toLowerCase()} runner, one tall piece, and low flowers so people can talk.`],
    ["Photo moment", `A backdrop in ${theme.secondaryColor} with accent ${theme.accentColor}. Streamers and a floor mark for group shots.`],
    ["Craft or kids table", "One contained table, about 12 minutes, wipeable, with a bin for finished pieces."],
    ["Favors that match", `Keep them under $${each} each. One useful thing plus a tag.`],
    ["Print-at-home set", "Invite, welcome sign, and a one-page activity sheet in the same type."],
  ];
  return rows.map(([caption, detail]) => ({
    id: uid(),
    eventId,
    caption,
    detail,
    colors: [theme.primaryColor, theme.secondaryColor, theme.accentColor],
    kind: "idea" as const,
  }));
}

export function printablePack(
  title: string,
  theme: ThemeOption,
  location: string,
  date: string,
  guests: number,
  eventId: string,
): Printable[] {
  const when = new Date(date).toLocaleString();
  const rows: Array<Omit<Printable, "id" | "eventId">> = [
    {
      title: "Invitation",
      type: "invitation",
      body: `You're invited\n\n${title}\n${theme.name}\n\n${when}\n${location}\n\nCome as you are. RSVP in Fetifi.`,
      createdAt: nowIso(),
    },
    {
      title: "Welcome sign",
      type: "banner",
      body: `${title.toUpperCase()}\n\n${theme.name}\nthe planning starts here.`,
      createdAt: nowIso(),
    },
    {
      title: "Menu card",
      type: "menu",
      body: `${title}\n\nWelcome sip\nMain table\nCake or dessert\nCoffee and water\n\nAsk about allergies. Serves about ${guests}.`,
      createdAt: nowIso(),
    },
    {
      title: "Activity sheet",
      type: "game_sheet",
      body: `Find five things that match ${theme.name}.\nDraw the cake.\nWrite a wish for the host.\nStamp when you say hi to someone new.`,
      createdAt: nowIso(),
    },
  ];
  return rows.map((row) => ({ ...row, id: uid(), eventId }));
}

export async function fileToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const max = 720;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.7);
}
