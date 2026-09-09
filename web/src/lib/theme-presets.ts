export interface ThemePreset {
  name: string;
  keywords: string[];
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  mood: string;
}

export const themePresets: ThemePreset[] = [
  {
    name: "Jungle Canopy",
    keywords: ["jungle", "safari", "wild", "animal", "zoo", "dinosaur"],
    primaryColor: "#1F4D3A",
    secondaryColor: "#F3E2B4",
    accentColor: "#E07A3D",
    mood: "Lush greens, banana leaves, and a sunlit clearing.",
  },
  {
    name: "Garden Party",
    keywords: ["garden", "floral", "spring", "tea", "botanical"],
    primaryColor: "#4F6F52",
    secondaryColor: "#F7E7CE",
    accentColor: "#C45C7A",
    mood: "Soft botanicals with linen and wildflowers.",
  },
  {
    name: "Midnight Gala",
    keywords: ["gala", "black tie", "formal", "evening", "ball"],
    primaryColor: "#141826",
    secondaryColor: "#E8D5A3",
    accentColor: "#9B1C31",
    mood: "Candlelight, brass, and a midnight sky.",
  },
  {
    name: "Coastal",
    keywords: ["beach", "coast", "ocean", "nautical", "seaside"],
    primaryColor: "#1C4E6A",
    secondaryColor: "#F2E6D0",
    accentColor: "#E07A5F",
    mood: "Salt air, washed linen, and late-afternoon light.",
  },
  {
    name: "Storybook",
    keywords: ["birthday", "kids", "child", "princess", "fairytale", "unicorn"],
    primaryColor: "#6B3FA0",
    secondaryColor: "#F8E9F0",
    accentColor: "#E8A838",
    mood: "Playful, bright, and a little magical.",
  },
  {
    name: "Harvest",
    keywords: ["fall", "autumn", "harvest", "thanksgiving", "rustic"],
    primaryColor: "#6B3E26",
    secondaryColor: "#F4E3C3",
    accentColor: "#C45C26",
    mood: "Warm wood, citrus, and long-table gathering.",
  },
  {
    name: "Modern Neutral",
    keywords: ["corporate", "minimal", "workshop", "retreat", "conference"],
    primaryColor: "#2C2A26",
    secondaryColor: "#EFEAE2",
    accentColor: "#3F6F6B",
    mood: "Quiet, considered, and easy to brand.",
  },
];

export function pickTheme(prompt: string) {
  const hay = prompt.toLowerCase();
  return (
    themePresets.find((preset) =>
      preset.keywords.some((keyword) => hay.includes(keyword)),
    ) ?? themePresets[themePresets.length - 1]
  );
}
