import Foundation

enum EventFactory {
    static func make(from prompt: String) -> EventRecord {
        let title = prompt.split(separator: "-").first.map { String($0).trimmingCharacters(in: .whitespaces) } ?? "Untitled gathering"
        let hay = prompt.lowercased()
        let jungle = hay.contains("jungle") || hay.contains("safari")
        let budget = extractBudget(prompt) ?? 500
        let start = Calendar.current.date(byAdding: .day, value: 21, to: Date()) ?? Date()
        let code = String((0..<6).compactMap { _ in "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".randomElement() })

        return EventRecord(
            id: UUID().uuidString,
            title: title,
            description: prompt,
            eventType: hay.contains("birthday") ? "birthday" : "celebration",
            dateStart: start,
            locationName: "To be confirmed",
            totalBudget: budget,
            joinCode: code,
            kitUnlocked: false,
            themeName: jungle ? "Jungle Canopy" : "Modern Neutral",
            primaryHex: jungle ? "#1F4D3A" : "#2C2A26",
            secondaryHex: jungle ? "#F3E2B4" : "#EFEAE2",
            accentHex: jungle ? "#E07A3D" : "#3F6F6B",
            mood: jungle ? "Lush greens, banana leaves, and a sunlit clearing." : "Quiet, considered, and easy to brand.",
            qualityScore: 72,
            plannerNotes: [
                "Confirm venue dimensions before ordering balloons.",
                "Collect dietary notes with RSVPs.",
                "Assign a setup lead for the first 90 minutes."
            ],
            schedules: [
                ScheduleItem(id: UUID().uuidString, title: "Setup", start: start.addingTimeInterval(-90 * 60), notes: "Decor and playlist.", isCompleted: false),
                ScheduleItem(id: UUID().uuidString, title: "Doors", start: start, notes: "Greeters and stickers.", isCompleted: false),
                ScheduleItem(id: UUID().uuidString, title: "Main activity", start: start.addingTimeInterval(45 * 60), notes: "Games and crafts.", isCompleted: false),
                ScheduleItem(id: UUID().uuidString, title: "Cake", start: start.addingTimeInterval(90 * 60), notes: "Photos.", isCompleted: false),
                ScheduleItem(id: UUID().uuidString, title: "Strike", start: start.addingTimeInterval(160 * 60), notes: "Pack and recycle.", isCompleted: false)
            ],
            supplies: [
                SupplyItem(id: UUID().uuidString, name: "Garland & balloons", category: "Decor", estimated: budget * 0.12, status: "needed"),
                SupplyItem(id: UUID().uuidString, name: "Cake", category: "Food", estimated: budget * 0.16, status: "needed"),
                SupplyItem(id: UUID().uuidString, name: "Craft kits", category: "Activities", estimated: budget * 0.08, status: "needed"),
                SupplyItem(id: UUID().uuidString, name: "Paper goods", category: "Equipment", estimated: budget * 0.06, status: "needed")
            ],
            guests: [
                GuestItem(id: UUID().uuidString, name: "Avery Chen", status: "accepted"),
                GuestItem(id: UUID().uuidString, name: "Sam Rivera", status: "pending"),
                GuestItem(id: UUID().uuidString, name: "Jordan Blake", status: "pending")
            ]
        )
    }

    static func extractBudget(_ text: String) -> Double? {
        let pattern = #"\$?\s?([\d,]+)"#
        guard let regex = try? NSRegularExpression(pattern: pattern),
              let match = regex.firstMatch(in: text, range: NSRange(text.startIndex..., in: text)),
              let range = Range(match.range(at: 1), in: text) else { return nil }
        return Double(text[range].replacingOccurrences(of: ",", with: ""))
    }
}
