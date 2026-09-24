export const colorVibes = [
  { id: "bold", name: "Bold", hint: "Loud color, high contrast", swatches: ["#E23D28", "#FF6B00", "#1A1A1A", "#FFF1C9"] },
  { id: "neutrals", name: "Neutrals", hint: "Linen, stone, warm wood", swatches: ["#2C2A26", "#EFEAE2", "#A89F91", "#F7F3EE"] },
  { id: "modern", name: "Modern", hint: "Clean lines, one accent", swatches: ["#111111", "#F4F4F4", "#3F6F6B", "#C9D4D1"] },
  { id: "nineties", name: "90s", hint: "Neons, brights, graphic", swatches: ["#FF2D95", "#00C2FF", "#FFE600", "#111111"] },
  { id: "retro", name: "Retro", hint: "Harvest, mustard, rust", swatches: ["#C45C26", "#F4E3C3", "#6B3E26", "#E07A3D"] },
  { id: "dark", name: "Dark", hint: "Night, gold, candlelight", swatches: ["#141826", "#E8D5A3", "#9B1C31", "#2A3148"] },
] as const;

export const partyFrequencies = [
  "A few times a year",
  "Every few months",
  "Monthly",
  "It is my job",
] as const;

export const plannerLevels = ["Beginner", "Medium", "Expert planner"] as const;
