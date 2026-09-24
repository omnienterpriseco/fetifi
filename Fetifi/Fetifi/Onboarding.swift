import SwiftUI

struct ColorVibe: Identifiable, Hashable {
    let id: String
    let name: String
    let hint: String
    let swatches: [String]
}

enum Taste {
    static let palettes: [ColorVibe] = [
        ColorVibe(id: "bold", name: "Bold", hint: "Loud color, high contrast", swatches: ["#E23D28", "#FF6B00", "#1A1A1A", "#FFF1C9"]),
        ColorVibe(id: "neutrals", name: "Neutrals", hint: "Linen, stone, warm wood", swatches: ["#2C2A26", "#EFEAE2", "#A89F91", "#F7F3EE"]),
        ColorVibe(id: "modern", name: "Modern", hint: "Clean lines, one accent", swatches: ["#111111", "#F4F4F4", "#3F6F6B", "#C9D4D1"]),
        ColorVibe(id: "nineties", name: "90s", hint: "Neons, brights, graphic", swatches: ["#FF2D95", "#00C2FF", "#FFE600", "#111111"]),
        ColorVibe(id: "retro", name: "Retro", hint: "Harvest, mustard, rust", swatches: ["#C45C26", "#F4E3C3", "#6B3E26", "#E07A3D"]),
        ColorVibe(id: "dark", name: "Dark", hint: "Night, gold, candlelight", swatches: ["#141826", "#E8D5A3", "#9B1C31", "#2A3148"]),
    ]

    static let frequencies = [
        "A few times a year",
        "Every few months",
        "Monthly",
        "It is my job",
    ]

    static let levels = [
        "Beginner",
        "Medium",
        "Expert planner",
    ]
}

struct GetToKnowView: View {
    @Environment(BoxStore.self) private var store
    @State private var step = 0
    @State private var palette = "neutrals"
    @State private var frequency = Taste.frequencies[0]
    @State private var level = Taste.levels[0]

    var body: some View {
        ZStack {
            Color.white.ignoresSafeArea()
            VStack(alignment: .leading, spacing: 20) {
                Text("Let's get to know you")
                    .font(.title.weight(.medium))
                Text(stepTitle)
                    .font(.subheadline)
                    .foregroundStyle(Color(hex: "#6A6170"))

                Group {
                    if step == 0 {
                        paletteGrid
                    } else if step == 1 {
                        optionList(Taste.frequencies, selection: $frequency)
                    } else {
                        optionList(Taste.levels, selection: $level)
                    }
                }

                Spacer()

                Button(step == 2 ? "Start planning" : "Next") {
                    if step < 2 {
                        step += 1
                    } else {
                        store.finishOnboarding(palette: palette, frequency: frequency, level: level)
                    }
                }
                .buttonStyle(.borderedProminent)
                .tint(Color(hex: "#A888C4"))
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
            }
            .padding(28)
        }
    }

    private var stepTitle: String {
        switch step {
        case 0: return "Which color palette feels like you?"
        case 1: return "How often do you plan parties?"
        default: return "What is your planner level?"
        }
    }

    private var paletteGrid: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
            ForEach(Taste.palettes) { vibe in
                Button {
                    palette = vibe.id
                } label: {
                    VStack(alignment: .leading, spacing: 8) {
                        HStack(spacing: 4) {
                            ForEach(vibe.swatches, id: \.self) { hex in
                                RoundedRectangle(cornerRadius: 4)
                                    .fill(Color(hex: hex))
                                    .frame(height: 28)
                            }
                        }
                        Text(vibe.name).font(.headline).foregroundStyle(.primary)
                        Text(vibe.hint).font(.caption).foregroundStyle(.secondary)
                    }
                    .padding(10)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(hex: "#F7F3F8"))
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16, style: .continuous)
                            .stroke(palette == vibe.id ? Color(hex: "#A888C4") : .clear, lineWidth: 2)
                    )
                }
            }
        }
    }

    private func optionList(_ options: [String], selection: Binding<String>) -> some View {
        VStack(spacing: 10) {
            ForEach(options, id: \.self) { option in
                Button {
                    selection.wrappedValue = option
                } label: {
                    HStack {
                        Text(option).foregroundStyle(.primary)
                        Spacer()
                        if selection.wrappedValue == option {
                            Image(systemName: "checkmark.circle.fill").foregroundStyle(Color(hex: "#A888C4"))
                        }
                    }
                    .padding(16)
                    .background(Color(hex: "#F7F3F8"))
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                }
            }
        }
    }
}
