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
    var guestCount: Int
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
    var budgetLines: [BudgetLine]
    var inspoItems: [InspoItem]
    var printables: [PrintableItem]
    var themeOptions: [ThemeOption]

    init(
        id: String,
        title: String,
        description: String,
        eventType: String,
        dateStart: Date,
        locationName: String,
        totalBudget: Double,
        guestCount: Int = 12,
        joinCode: String,
        kitUnlocked: Bool,
        themeName: String,
        primaryHex: String,
        secondaryHex: String,
        accentHex: String,
        mood: String,
        qualityScore: Int,
        plannerNotes: [String],
        schedules: [ScheduleItem],
        supplies: [SupplyItem],
        guests: [GuestItem],
        budgetLines: [BudgetLine] = [],
        inspoItems: [InspoItem] = [],
        printables: [PrintableItem] = [],
        themeOptions: [ThemeOption] = []
    ) {
        self.id = id
        self.title = title
        self.description = description
        self.eventType = eventType
        self.dateStart = dateStart
        self.locationName = locationName
        self.totalBudget = totalBudget
        self.guestCount = guestCount
        self.joinCode = joinCode
        self.kitUnlocked = kitUnlocked
        self.themeName = themeName
        self.primaryHex = primaryHex
        self.secondaryHex = secondaryHex
        self.accentHex = accentHex
        self.mood = mood
        self.qualityScore = qualityScore
        self.plannerNotes = plannerNotes
        self.schedules = schedules
        self.supplies = supplies
        self.guests = guests
        self.budgetLines = budgetLines
        self.inspoItems = inspoItems
        self.printables = printables
        self.themeOptions = themeOptions
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decode(String.self, forKey: .id)
        title = try c.decode(String.self, forKey: .title)
        description = try c.decode(String.self, forKey: .description)
        eventType = try c.decode(String.self, forKey: .eventType)
        dateStart = try c.decode(Date.self, forKey: .dateStart)
        locationName = try c.decode(String.self, forKey: .locationName)
        totalBudget = try c.decode(Double.self, forKey: .totalBudget)
        guestCount = try c.decodeIfPresent(Int.self, forKey: .guestCount) ?? 12
        joinCode = try c.decode(String.self, forKey: .joinCode)
        kitUnlocked = try c.decode(Bool.self, forKey: .kitUnlocked)
        themeName = try c.decode(String.self, forKey: .themeName)
        primaryHex = try c.decode(String.self, forKey: .primaryHex)
        secondaryHex = try c.decode(String.self, forKey: .secondaryHex)
        accentHex = try c.decode(String.self, forKey: .accentHex)
        mood = try c.decode(String.self, forKey: .mood)
        qualityScore = try c.decode(Int.self, forKey: .qualityScore)
        plannerNotes = try c.decode([String].self, forKey: .plannerNotes)
        schedules = try c.decode([ScheduleItem].self, forKey: .schedules)
        supplies = try c.decode([SupplyItem].self, forKey: .supplies)
        guests = try c.decode([GuestItem].self, forKey: .guests)
        budgetLines = try c.decodeIfPresent([BudgetLine].self, forKey: .budgetLines) ?? []
        inspoItems = try c.decodeIfPresent([InspoItem].self, forKey: .inspoItems) ?? []
        printables = try c.decodeIfPresent([PrintableItem].self, forKey: .printables) ?? []
        themeOptions = try c.decodeIfPresent([ThemeOption].self, forKey: .themeOptions) ?? []
    }
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

struct BudgetLine: Identifiable, Codable, Hashable {
    var id: String
    var category: String
    var allocated: Double
    var spent: Double
}

struct InspoItem: Identifiable, Codable, Hashable {
    var id: String
    var caption: String
    var detail: String
    var imageFile: String?
    var kind: String
}

struct PrintableItem: Identifiable, Codable, Hashable {
    var id: String
    var title: String
    var type: String
    var body: String
}

struct ThemeOption: Identifiable, Codable, Hashable {
    var id: String
    var name: String
    var mood: String
    var why: String
    var primaryHex: String
    var secondaryHex: String
    var accentHex: String
}

struct PlanDraft {
    var title: String
    var vibe: String
    var budget: Double
    var location: String
    var date: Date
    var guestCount: Int
    var photos: [Data]
}

extension EventRecord {
    var primary: Color { Color(hex: primaryHex) }
    var secondary: Color { Color(hex: secondaryHex) }
    var estimatedSpend: Double { supplies.reduce(0) { $0 + $1.estimated } }
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
