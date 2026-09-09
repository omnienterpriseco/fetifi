export const FREE_AI_PROMPTS = 2;

export const pricing = {
  saleNote: "Sale prices. No end date.",
  free: {
    name: "Free",
    price: "$0",
    detail: `One active workspace, core RSVP, ${FREE_AI_PROMPTS} AI prompts / month.`,
  },
  kit: {
    name: "Event kit",
    was: "$29",
    price: "$19",
    detail:
      "One-time unlock for a single event: unlimited AI, printables, collaborators.",
  },
  pro: {
    name: "Pro",
    was: "$19/mo",
    price: "$10/mo",
    detail: "Unlimited events, branding, PDF/CSV export, team workspaces.",
  },
} as const;
