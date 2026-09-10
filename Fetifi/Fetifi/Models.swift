import Foundation
import SwiftUI

struct EventRecord: Identifiable, Codable, Hashable {
    var id: String
    var title: String
    var description: String
    var eventType: String
    var dateStart: Date
    var locationName: String
    var totalBudget: Double
    var joinCode: String
    var kitUnlocked: Bool
    var themeName: String
    var primaryHex: String
    var secondaryHex: String
    var accentHex: String
    var mood: String
    var qualityScore: Int
    var plannerNotes: [String]
    var schedules: [ScheduleItem]
    var supplies: [SupplyItem]
    var guests: [GuestItem]
}

struct ScheduleItem: Identifiable, Codable, Hashable {
    var id: String
    var title: String
    var start: Date
    var notes: String
    var isCompleted: Bool
}

struct SupplyItem: Identifiable, Codable, Hashable {
    var id: String
    var name: String
    var category: String
    var estimated: Double
    var status: String
}

struct GuestItem: Identifiable, Codable, Hashable {
    var id: String
    var name: String
    var status: String
}

extension EventRecord {
    var primary: Color { Color(hex: primaryHex) }
    var secondary: Color { Color(hex: secondaryHex) }
}

extension Color {
    init(hex: String) {
        let cleaned = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: cleaned).scanHexInt64(&int)
        let r, g, b: UInt64
        (r, g, b) = ((int >> 16) & 0xFF, (int >> 8) & 0xFF, int & 0xFF)
        self.init(.sRGB, red: Double(r) / 255, green: Double(g) / 255, blue: Double(b) / 255)
    }
}
