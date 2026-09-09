import type {
  Activity,
  BudgetItem,
  EventRecord,
  Invitation,
  Printable,
  ScheduleItem,
  Supply,
  Volunteer,
} from "./types";
import { pickTheme } from "./theme-presets";
import { addMinutes, makeJoinCode, nowIso, uid } from "./utils";

export interface WizardInput {
  prompt?: string;
  title?: string;
  eventType?: string;
  demographic?: string;
  budget?: number;
  dateStart?: string;
  location?: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
}

function detectType(text: string) {
  const hay = text.toLowerCase();
  if (hay.includes("wedding")) return "wedding";
  if (hay.includes("shower")) return "baby_shower";
  if (hay.includes("corporate") || hay.includes("offsite") || hay.includes("conference"))
    return "corporate";
  if (hay.includes("anniversary")) return "anniversary";
  if (hay.includes("graduation")) return "graduation";
  if (hay.includes("birthday")) return "birthday";
  return "celebration";
}

function detectBudget(text: string, fallback = 500) {
  const match = text.match(/\$\s?([\d,]+)/) ?? text.match(/([\d,]+)\s*(?:dollar|budget)/i);
  if (!match) return fallback;
  return Number(match[1].replace(/,/g, ""));
}

function detectTitle(input: WizardInput) {
  if (input.title?.trim()) return input.title.trim();
  const prompt = input.prompt?.trim();
  if (!prompt) return "Untitled gathering";
  return prompt.split(" - ")[0].split("—")[0].trim().slice(0, 80);
}

function startOfEvent(input: WizardInput) {
  if (input.dateStart) return new Date(input.dateStart).toISOString();
  const d = new Date();
  d.setDate(d.getDate() + 21);
  d.setHours(14, 0, 0, 0);
  return d.toISOString();
}

function catalogFor(type: string, themeName: string, budget: number) {
  const birthday = type === "birthday";
  const wedding = type === "wedding";
  const supplies: Omit<Supply, "id" | "eventId">[] = birthday
    ? [
        { itemName: "Leaf garland & tropical balloons", category: "Decor", quantity: 1, estimatedCost: Math.round(budget * 0.12), actualCost: 0, status: "needed" },
        { itemName: "Animal mask craft kit", category: "Activities", quantity: 12, estimatedCost: Math.round(budget * 0.08), actualCost: 0, status: "needed" },
        { itemName: "Cake + cupcakes", category: "Food", quantity: 1, estimatedCost: Math.round(budget * 0.16), actualCost: 0, status: "needed" },
        { itemName: "Fruit platters & juice", category: "Food", quantity: 3, estimatedCost: Math.round(budget * 0.1), actualCost: 0, status: "needed" },
        { itemName: "Paper goods & compostable ware", category: "Equipment", quantity: 1, estimatedCost: Math.round(budget * 0.06), actualCost: 0, status: "needed" },
        { itemName: "Speaker + playlist speaker stand", category: "Equipment", quantity: 1, estimatedCost: 0, actualCost: 0, status: "borrowed" },
        { itemName: "Thank-you favors", category: "Decor", quantity: 12, estimatedCost: Math.round(budget * 0.08), actualCost: 0, status: "needed" },
      ]
    : wedding
      ? [
          { itemName: "Florals & tablescape", category: "Decor", quantity: 1, estimatedCost: Math.round(budget * 0.28), actualCost: 0, status: "needed" },
          { itemName: "Catering deposit", category: "Food", quantity: 1, estimatedCost: Math.round(budget * 0.4), actualCost: 0, status: "needed" },
          { itemName: "Lighting & sound", category: "Equipment", quantity: 1, estimatedCost: Math.round(budget * 0.12), actualCost: 0, status: "needed" },
          { itemName: "Stationery suite", category: "Printables", quantity: 1, estimatedCost: Math.round(budget * 0.06), actualCost: 0, status: "needed" },
        ]
      : [
          { itemName: `${themeName} backdrop`, category: "Decor", quantity: 1, estimatedCost: Math.round(budget * 0.14), actualCost: 0, status: "needed" },
          { itemName: "Catering / grazing table", category: "Food", quantity: 1, estimatedCost: Math.round(budget * 0.36), actualCost: 0, status: "needed" },
          { itemName: "Drinks & ice", category: "Food", quantity: 1, estimatedCost: Math.round(budget * 0.12), actualCost: 0, status: "needed" },
          { itemName: "Signage & wayfinding", category: "Printables", quantity: 1, estimatedCost: Math.round(budget * 0.05), actualCost: 0, status: "needed" },
          { itemName: "Audio / playlist", category: "Equipment", quantity: 1, estimatedCost: Math.round(budget * 0.08), actualCost: 0, status: "needed" },
        ];

  const budgets: Omit<BudgetItem, "id" | "eventId">[] = [
    { category: "Decor", allocatedAmount: Math.round(budget * 0.22), spentAmount: 0 },
    { category: "Food", allocatedAmount: Math.round(budget * 0.38), spentAmount: 0 },
    { category: "Activities", allocatedAmount: Math.round(budget * 0.12), spentAmount: 0 },
    { category: "Equipment", allocatedAmount: Math.round(budget * 0.1), spentAmount: 0 },
    { category: "Printables", allocatedAmount: Math.round(budget * 0.08), spentAmount: 0 },
    { category: "Buffer", allocatedAmount: Math.round(budget * 0.1), spentAmount: 0 },
  ];

  return { supplies, budgets };
}

function timeline(start: string, type: string) {
  const blocks =
    type === "birthday"
      ? [
          ["Setup & balloon forest", -90, 90, "Hang garlands, test playlist, stage crafts."],
          ["Doors / greeting", 0, 20, "Name tags, animal stickers, welcome drink."],
          ["Icebreaker game", 20, 25, "Jungle animal freeze dance."],
          ["Main activity", 45, 35, "Mask making + scavenger hunt."],
          ["Cake & photos", 90, 20, "Candles, group photo in the canopy."],
          ["Open play / favors", 110, 40, "Free play, then thank-you bags."],
          ["Tear-down", 160, 40, "Pack leftover food, recycle, return borrowed gear."],
        ]
      : [
          ["Load-in & styling", -120, 120, "Tables, lighting, signage, walkthrough."],
          ["Guest arrival", 0, 30, "Greeters, coats, first drink."],
          ["Welcome remarks", 30, 10, "Host toast and house notes."],
          ["Core program", 45, 75, "Dinner, speeches, or workshop block."],
          ["Peak moment", 130, 20, "Cake, first dance, or keynote close."],
          ["Wind-down", 160, 40, "Favors, lingering, rides."],
          ["Strike", 210, 50, "Breakdown list and lost-and-found."],
        ];

  return blocks.map(([title, offset, duration, notes]) => ({
    title: String(title),
    startTime: addMinutes(start, Number(offset)),
    endTime: addMinutes(start, Number(offset) + Number(duration)),
    isCompleted: false,
    notes: String(notes),
  }));
}

function volunteers(type: string): Omit<Volunteer, "id" | "eventId">[] {
  const roles =
    type === "birthday"
      ? [
          ["Setup lead", "Arrive 90 minutes early. Own layout and decor."],
          ["Greeter", "Check names, stickers, and allergy notes."],
          ["Activity captain", "Run games and crafts."],
          ["Cake & photos", "Candles, cutting, and a group shot."],
        ]
      : [
          ["Floor manager", "Owns run-of-show and vendor check-ins."],
          ["Catering lead", "Timing of food, dietary flags."],
          ["Greeter", "Door, coats, and first impressions."],
          ["Strike team", "Breakdown and returns."],
        ];
  return roles.map(([roleName, description]) => ({
    roleName,
    description,
    status: "invited" as const,
  }));
}

function activities(type: string, themeName: string): Omit<Activity, "id" | "eventId">[] {
  if (type === "birthday") {
    return [
      {
        title: "Canopy scavenger hunt",
        ageRange: "2-6",
        durationMinutes: 20,
        suppliesNeeded: ["Picture cards", "Tape", "Small stickers"],
        steps: [
          "Hide 8 animal cards at toddler height.",
          "Give each child a sticker sheet.",
          "When they find a card, they stamp a matching sticker.",
          "First complete sheet gets to roar like a lion.",
        ],
      },
      {
        title: "Leaf-mask studio",
        ageRange: "3-8",
        durationMinutes: 25,
        suppliesNeeded: ["Card stock masks", "Crayons", "Elastic"],
        steps: [
          "Set a low craft table away from food.",
          "Offer 3 animal templates.",
          "Adults hole-punch and tie elastic.",
          "Wear masks for the group photo.",
        ],
      },
    ];
  }
  return [
    {
      title: `${themeName} icebreaker`,
      ageRange: "All ages",
      durationMinutes: 15,
      suppliesNeeded: ["Prompt cards"],
      steps: [
        "Hand a prompt card at the door.",
        "Guests find someone who matches the prompt.",
        "Share one answer during welcome remarks.",
      ],
    },
  ];
}

function printables(title: string, themeName: string): Omit<Printable, "id" | "eventId">[] {
  return [
    {
      title: `${title} invitation`,
      type: "invitation",
      body: `You're invited.\n${title}\nA ${themeName} gathering. Come as you are.`,
      createdAt: nowIso(),
    },
    {
      title: "Welcome banner",
      type: "banner",
      body: title.toUpperCase(),
      createdAt: nowIso(),
    },
    {
      title: "Place cards",
      type: "place_card",
      body: "Guest name · table 1",
      createdAt: nowIso(),
    },
    {
      title: "Activity sheet",
      type: "game_sheet",
      body: "Find: parrot, lion, banana leaf, drum, cake.",
      createdAt: nowIso(),
    },
  ];
}

export function instantiateEvent(input: WizardInput): EventRecord {
  const prompt = [input.prompt, input.title, input.eventType, input.demographic]
    .filter(Boolean)
    .join(" ");
  const title = detectTitle(input);
  const eventType = input.eventType || detectType(prompt || title);
  const budget = input.budget ?? detectBudget(prompt || "", 500);
  const dateStart = startOfEvent(input);
  const themePick = pickTheme(prompt || title);
  const id = uid();
  const catalog = catalogFor(eventType, themePick.name, budget);
  const qualityScore = 72;

  const event: EventRecord = {
    id,
    ownerId: input.ownerId,
    title,
    description:
      input.prompt?.trim() ||
      `A ${themePick.name.toLowerCase()} ${eventType.replace("_", " ")} planned for ${input.demographic || "your guests"}.`,
    eventType,
    dateStart,
    dateEnd: addMinutes(dateStart, 180),
    locationName: input.location?.trim() || "To be confirmed",
    totalBudget: budget,
    joinCode: makeJoinCode(),
    kitUnlocked: false,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    theme: {
      id: uid(),
      eventId: id,
      themeName: themePick.name,
      primaryColor: themePick.primaryColor,
      secondaryColor: themePick.secondaryColor,
      accentColor: themePick.accentColor,
      fontFamily: "Fraunces",
      mood: themePick.mood,
    },
    schedules: timeline(dateStart, eventType).map((item) => ({
      ...item,
      id: uid(),
      eventId: id,
    })) as ScheduleItem[],
    supplies: catalog.supplies.map((item) => ({ ...item, id: uid(), eventId: id })),
    budgets: catalog.budgets.map((item) => ({ ...item, id: uid(), eventId: id })),
    volunteers: volunteers(eventType).map((item) => ({ ...item, id: uid(), eventId: id })),
    printables: printables(title, themePick.name).map((item) => ({
      ...item,
      id: uid(),
      eventId: id,
    })),
    collaborators: [
      {
        id: uid(),
        eventId: id,
        userId: input.ownerId,
        name: input.ownerName,
        email: input.ownerEmail,
        role: "owner",
        joinedAt: nowIso(),
      },
    ],
    invitations: sampleGuests(id),
    comments: [],
    aiJobs: [],
    activities: activities(eventType, themePick.name).map((item) => ({
      ...item,
      id: uid(),
      eventId: id,
    })),
    plannerNotes: [
      "Confirm the venue dimensions before ordering balloons or florals.",
      "Collect dietary notes with RSVPs. The food budget assumes 2 unknowns.",
      "Assign a setup lead; the first 90 minutes is the riskiest part of the day.",
    ],
    qualityScore,
  };

  return event;
}

function sampleGuests(eventId: string): Invitation[] {
  return [
    { id: uid(), eventId, guestName: "Avery Chen", guestEmail: "avery@example.com", rsvpStatus: "accepted", plusOnes: 1, dietaryRestrictions: "Vegetarian" },
    { id: uid(), eventId, guestName: "Sam Rivera", guestEmail: "sam@example.com", rsvpStatus: "pending", plusOnes: 0 },
    { id: uid(), eventId, guestName: "Jordan Blake", rsvpStatus: "pending", plusOnes: 2, dietaryRestrictions: "Nut allergy" },
  ];
}

export function optimizeBudget(event: EventRecord) {
  const spent = event.supplies.reduce((sum, s) => sum + (s.actualCost || s.estimatedCost), 0);
  const over = spent - event.totalBudget;
  const notes =
    over > 0
      ? [
          `You're about ${Math.round(over)} over if every estimate lands.`,
          "Swap the largest decor line for a DIY backdrop and borrow audio.",
          "Cut favor quantity to confirmed RSVPs only.",
        ]
      : [
          `Estimates sit ${Math.round(-over)} under the ceiling.`,
          "Hold 10% in Buffer until final headcount.",
          "Put leftover toward a better cake or a photographer hour.",
        ];
  return { spent, over, notes };
}

export function readiness(event: EventRecord) {
  const flags: string[] = [];
  if (event.locationName === "To be confirmed") flags.push("Venue is still TBD.");
  if (event.schedules.some((s) => !s.assignedTo) && event.volunteers.every((v) => v.status !== "accepted")) {
    flags.push("No volunteer has accepted a role yet.");
  }
  const unbought = event.supplies.filter((s) => s.status === "needed").length;
  if (unbought > 3) flags.push(`${unbought} supply items are still marked needed.`);
  const pending = event.invitations.filter((i) => i.rsvpStatus === "pending").length;
  if (pending) flags.push(`${pending} guests have not RSVP'd.`);
  const highTasks = event.schedules.filter((s) => !s.isCompleted);
  if (highTasks.length) flags.push(`${highTasks.length} run-of-show blocks are open.`);
  const score = Math.max(40, event.qualityScore - flags.length * 8);
  return { score, flags, ready: flags.length <= 1 };
}
