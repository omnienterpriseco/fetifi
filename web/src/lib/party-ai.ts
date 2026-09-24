import type { Activity, EventRecord, InspoPin, Printable, ThemeOption } from "./types";
import { themePresets } from "./theme-presets";
import { nowIso, uid } from "./utils";

export function rankThemes(text: string): ThemeOption[] {
  const hay = text.toLowerCase();
  const all = presetOptions();
  return [...all].sort((a, b) => score(hay, b) - score(hay, a)).slice(0, 4);
}

function presetOptions(): ThemeOption[] {
  const options: ThemeOption[] = themePresets.map((preset) => ({
    id: preset.name.toLowerCase().replace(/\s+/g, "-"),
    name: preset.name,
    mood: preset.mood,
    why: `Matches ${preset.keywords.slice(0, 3).join(", ")}.`,
    primaryColor: preset.primaryColor,
    secondaryColor: preset.secondaryColor,
    accentColor: preset.accentColor,
  }));
  options.push({
    id: "pastel-confetti",
    name: "Pastel Confetti",
    mood: "Mint, peach, and lilac like a gift box.",
    why: "Fetifi house style: easy, cheerful, photo-friendly.",
    primaryColor: "#C9B6DE",
    secondaryColor: "#FFF7FB",
    accentColor: "#E8A8C4",
  });
  return options;
}

function score(hay: string, theme: ThemeOption) {
  let n = 0;
  if (hay.includes(theme.name.toLowerCase())) n += 6;
  for (const word of `${theme.why} ${theme.mood}`.toLowerCase().split(/\W+/)) {
    if (word.length > 4 && hay.includes(word)) n += 1;
  }
  return n;
}

function parseHex(hex: string) {
  const cleaned = hex.replace("#", "");
  return {
    r: parseInt(cleaned.slice(0, 2), 16) || 0,
    g: parseInt(cleaned.slice(2, 4), 16) || 0,
    b: parseInt(cleaned.slice(4, 6), 16) || 0,
  };
}

function dist(a: string, b: string) {
  const x = parseHex(a);
  const y = parseHex(b);
  return Math.abs(x.r - y.r) + Math.abs(x.g - y.g) + Math.abs(x.b - y.b);
}

export function themeFromInspo(pins: InspoPin[], event: EventRecord): ThemeOption {
  const uploads = pins.filter((pin) => pin.kind === "upload");
  const colors = uploads.flatMap((pin) => pin.colors || []).filter(Boolean);
  const caption = uploads.map((pin) => `${pin.caption} ${pin.detail}`).join(" ");
  const hay = `${event.title} ${event.description} ${caption}`.toLowerCase();
  const presets = presetOptions();
  let best = presets[0];
  let bestScore = -1;
  for (const preset of presets) {
    let n = score(hay, preset);
    if (colors[0]) n += 80 - Math.min(80, dist(colors[0], preset.primaryColor) / 4);
    if (colors[1]) n += 40 - Math.min(40, dist(colors[1], preset.secondaryColor) / 6);
    if (n > bestScore) {
      bestScore = n;
      best = preset;
    }
  }
  if (colors.length >= 2) {
    const sorted = [...colors].sort((a, b) => {
      const la = parseHex(a);
      const lb = parseHex(b);
      return 0.299 * la.r + 0.587 * la.g + 0.114 * la.b - (0.299 * lb.r + 0.587 * lb.g + 0.114 * lb.b);
    });
    return {
      id: "from-inspo",
      name: caption.trim() ? `Inspo: ${uploads[0]?.caption || best.name}` : `${best.name} from your photos`,
      mood: `A ${best.name.toLowerCase()} party pulled from your mood board.`,
      why: "Generated from the photos you uploaded, plus the event vibe.",
      primaryColor: sorted[0] || best.primaryColor,
      secondaryColor: sorted[sorted.length - 1] || best.secondaryColor,
      accentColor: colors[2] || best.accentColor,
    };
  }
  return best;
}

export function themeOptionsFromInspo(event: EventRecord): ThemeOption[] {
  const pins = event.inspoPins || [];
  const hay = `${event.title} ${event.description} ${pins.map((p) => p.caption).join(" ")}`;
  const ranked = rankThemes(hay);
  if (pins.some((pin) => pin.kind === "upload")) {
    return [themeFromInspo(pins, event), ...ranked.filter((row) => row.id !== "from-inspo")].slice(0, 4);
  }
  return ranked;
}

export function inspoIdeas(theme: ThemeOption, budget: number, guests: number, eventId: string): InspoPin[] {
  const each = Math.max(8, Math.round(budget / Math.max(guests, 1) / 4));
  const rows: [string, string][] = [
    ["The party idea", `Throw a ${theme.name} gathering for about ${guests} people. Repeat ${theme.accentColor} on napkins, the welcome sign, and one dessert.`],
    ["Table story", `A ${theme.name.toLowerCase()} runner, one tall piece, and low flowers so people can talk.`],
    ["Photo moment", `A backdrop in ${theme.secondaryColor} with accent ${theme.accentColor}. Streamers and a floor mark for group shots.`],
    ["Craft or kids table", "One contained table, about 12 minutes, wipeable, with a bin for finished pieces."],
    ["Favors that match", `Keep them under $${each} each. One useful thing plus a tag.`],
    ["Print-at-home set", "Invite, welcome sign, menu, and a one-page activity sheet in the same type."],
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
  const when = Number.isNaN(Date.parse(date)) ? date : new Date(date).toLocaleString();
  const rows: Array<Omit<Printable, "id" | "eventId">> = [
    {
      title: "Invitation",
      type: "invitation",
      body: `You're invited\n\n${title}\nA ${theme.name} party\n\n${when}\n${location}\n\nAbout ${guests} friends. Come as you are.\nRSVP in Fetifi.`,
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
      body: `${title}\n${theme.name} menu\n\nWelcome sip\nSomething savory\nSomething sweet\nCake\nWater and coffee\n\nAsk about allergies. Serves about ${guests}.`,
      createdAt: nowIso(),
    },
    {
      title: "Activity sheet",
      type: "game_sheet",
      body: `${theme.name} hunt\n\nFind five things that match this theme.\nDraw the cake.\nWrite a wish for the host.\nStamp when you say hi to someone new.`,
      createdAt: nowIso(),
    },
    {
      title: "Place card",
      type: "place_card",
      body: `Hello, ________\nTable __\n${theme.name}\n${title}`,
      createdAt: nowIso(),
    },
  ];
  return rows.map((row) => ({ ...row, id: uid(), eventId }));
}

export function activitiesForTheme(theme: ThemeOption, eventId: string): Activity[] {
  return [
    {
      id: uid(),
      eventId,
      title: `${theme.name} welcome game`,
      ageRange: "All ages",
      durationMinutes: 12,
      suppliesNeeded: ["Name tags", "A small prize"],
      steps: [
        "Hand a color-matched name tag at the door.",
        "Ask each guest to find someone wearing a similar color.",
        "Share one party wish during the welcome toast.",
      ],
    },
    {
      id: uid(),
      eventId,
      title: `${theme.name} photo moment`,
      ageRange: "All ages",
      durationMinutes: 10,
      suppliesNeeded: ["Backdrop", "Phone on a stand"],
      steps: [
        "Set the backdrop in the secondary color.",
        "Mark a standing spot on the floor.",
        "Take a group shot before cake.",
      ],
    },
  ];
}

export function plannerNotesFor(theme: ThemeOption, budget: number, guests: number) {
  return [
    `Party idea: a ${theme.name} event for about ${guests} guests on your budget of $${Math.round(budget)}.`,
    theme.mood,
    "Repeat one accent on the invite, the table, and the cake so the theme reads in photos.",
    "Keep 10% of the ceiling in Buffer until the week of.",
  ];
}

export async function fileToDataUrl(file: File): Promise<string> {
  try {
    const image = await (async () => {
      if (typeof createImageBitmap === "function") {
        try {
          return await createImageBitmap(file);
        } catch {
          return null;
        }
      }
      return null;
    })();
    const canvas = document.createElement("canvas");
    const max = 480;
    if (image) {
      const scale = Math.min(1, max / Math.max(image.width, image.height));
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg", 0.55);
    }
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  } catch {
    return "";
  }
}
