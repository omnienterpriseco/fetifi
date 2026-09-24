import Foundation

enum PartyAI {
    static let themes: [ThemeOption] = [
        ThemeOption(id: "jungle", name: "Jungle Canopy", mood: "Lush greens, banana leaves, and a sunlit clearing.", why: "Wild play, animal crafts, and a backyard safari.", primaryHex: "#1F4D3A", secondaryHex: "#F3E2B4", accentHex: "#E07A3D"),
        ThemeOption(id: "garden", name: "Garden Party", mood: "Soft botanicals with linen and wildflowers.", why: "Brunch, showers, and anything with a backyard table.", primaryHex: "#4F6F52", secondaryHex: "#F7E7CE", accentHex: "#C45C7A"),
        ThemeOption(id: "gala", name: "Midnight Gala", mood: "Candlelight, brass, and a midnight sky.", why: "Evenings, dress-up, and a grown-up toast.", primaryHex: "#141826", secondaryHex: "#E8D5A3", accentHex: "#9B1C31"),
        ThemeOption(id: "coastal", name: "Coastal", mood: "Salt air, washed linen, and late-afternoon light.", why: "Beach, pool, or a blue-and-sand color story.", primaryHex: "#1C4E6A", secondaryHex: "#F2E6D0", accentHex: "#E07A5F"),
        ThemeOption(id: "storybook", name: "Storybook", mood: "Playful, bright, and a little magical.", why: "Kids birthdays, princesses, and sparkle without clutter.", primaryHex: "#6B3FA0", secondaryHex: "#F8E9F0", accentHex: "#E8A838"),
        ThemeOption(id: "harvest", name: "Harvest", mood: "Warm wood, citrus, and a long-table gathering.", why: "Fall, thanksgiving, and rustic backyard dinners.", primaryHex: "#6B3E26", secondaryHex: "#F4E3C3", accentHex: "#C45C26"),
        ThemeOption(id: "space", name: "Star Party", mood: "Navy skies, foil stars, and glow cups.", why: "Sleepovers, science birthdays, and night-time play.", primaryHex: "#1B1F3B", secondaryHex: "#E8E4F4", accentHex: "#F4C95D"),
        ThemeOption(id: "neutral", name: "Modern Neutral", mood: "Quiet, considered, and easy to brand.", why: "Work events, minimal gatherings, and mixed-age rooms.", primaryHex: "#2C2A26", secondaryHex: "#EFEAE2", accentHex: "#3F6F6B"),
        ThemeOption(id: "candy", name: "Pastel Confetti", mood: "Mint, peach, and lilac like a gift box.", why: "Fetifi house style: easy, cheerful, photo-friendly.", primaryHex: "#C9B6DE", secondaryHex: "#FFF7FB", accentHex: "#E8A8C4"),
    ]

    static func rankedThemes(for text: String) -> [ThemeOption] {
        let hay = text.lowercased()
        let scored = themes.map { theme -> (ThemeOption, Int) in
            var score = 0
            if hay.contains(theme.name.lowercased()) { score += 5 }
            for word in theme.why.lowercased().split(separator: " ") {
                if word.count > 4, hay.contains(word) { score += 1 }
            }
            for key in ["jungle", "safari", "garden", "floral", "gala", "beach", "ocean", "princess", "unicorn", "fall", "harvest", "space", "star", "pastel", "confetti", "birthday", "wedding"] {
                if hay.contains(key), theme.why.lowercased().contains(key) || theme.name.lowercased().contains(key) {
                    score += 3
                }
            }
            return (theme, score)
        }
        let sorted = scored.sorted { $0.1 > $1.1 }.map(\.0)
        var picked: [ThemeOption] = []
        for theme in sorted where picked.count < 4 {
            if !picked.contains(where: { $0.id == theme.id }) { picked.append(theme) }
        }
        return picked
    }

    static func eventType(from text: String) -> String {
        let hay = text.lowercased()
        if hay.contains("wedding") { return "wedding" }
        if hay.contains("shower") { return "baby_shower" }
        if hay.contains("corporate") || hay.contains("office") { return "corporate" }
        if hay.contains("anniversary") { return "anniversary" }
        if hay.contains("birthday") { return "birthday" }
        return "celebration"
    }

    static func inspoIdeas(theme: ThemeOption, budget: Double, guests: Int) -> [InspoItem] {
        let each = max(8, Int(budget / Double(max(guests, 1)) / 4))
        let rows = [
            ("Table story", "A \(theme.name.lowercased()) runner, one tall piece, and lots of low candles or flowers so people can talk."),
            ("Photo moment", "A simple backdrop in \(theme.secondaryHex) with the accent color \(theme.accentHex). Tape, streamers, and a floor mark for group shots."),
            ("Kid or craft station", "One contained table: 12 minutes, wipeable, and a bin for finished pieces."),
            ("Favors that match", "Keep them under $\(each) each. Think one useful thing plus a tag, not a bag of plastic."),
            ("Playlist color", "Open with something soft, peak during cake or toasts, then easy talking music."),
            ("Print-at-home set", "Invite, welcome sign, and a one-page activity sheet in the same type."),
        ]
        return rows.map {
            InspoItem(id: UUID().uuidString, caption: $0.0, detail: $0.1, imageFile: nil, kind: "idea")
        }
    }

    static func printables(title: String, theme: ThemeOption, location: String, date: Date, guests: Int) -> [PrintableItem] {
        let when = date.formatted(date: .abbreviated, time: .shortened)
        return [
            PrintableItem(
                id: UUID().uuidString,
                title: "Invitation",
                type: "invitation",
                body: "You're invited\n\n\(title)\n\(theme.name)\n\n\(when)\n\(location)\n\nCome as you are. RSVP in Fetifi."
            ),
            PrintableItem(
                id: UUID().uuidString,
                title: "Welcome sign",
                type: "banner",
                body: title.uppercased() + "\n\n\(theme.name)\nthe planning starts here."
            ),
            PrintableItem(
                id: UUID().uuidString,
                title: "Menu card",
                type: "menu",
                body: "\(title)\n\nWelcome sip\nMain table\nCake or dessert\nCoffee and water\n\nAsk about allergies. Serves about \(guests)."
            ),
            PrintableItem(
                id: UUID().uuidString,
                title: "Activity sheet",
                type: "game_sheet",
                body: "Find five things that match \(theme.name).\nDraw the cake.\nWrite a wish for the host.\nStamp when you say hi to someone new."
            ),
            PrintableItem(
                id: UUID().uuidString,
                title: "Place card",
                type: "place_card",
                body: "Hello, ________\nTable __\n\(theme.name)"
            ),
        ]
    }

    static func notes(theme: ThemeOption, budget: Double, guests: Int) -> [String] {
        [
            "Lock the guest count around \(guests) before you spend the food line.",
            "Keep 10% of $\(Int(budget)) as a buffer until the week of.",
            "The \(theme.name) look works if one surface repeats: napkins, sign, or backdrop. Not all three if the budget is tight.",
            "Assign one person to setup. The first 90 minutes is the hardest part.",
        ]
    }
}

enum EventFactory {
    static func make(from draft: PlanDraft) -> EventRecord {
        let vibe = [draft.title, draft.vibe].joined(separator: " ")
        let title = draft.title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            ? (draft.vibe.split(separator: "-").first.map { String($0).trimmingCharacters(in: .whitespaces) } ?? "Untitled gathering")
            : draft.title.trimmingCharacters(in: .whitespacesAndNewlines)
        let budget = draft.budget > 0 ? draft.budget : (extractBudget(draft.vibe) ?? 500)
        let options = PartyAI.rankedThemes(for: vibe)
        let theme = options.first ?? PartyAI.themes.last!
        let start = draft.date
        let guests = max(2, draft.guestCount)
        let location = draft.location.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            ? "To be confirmed"
            : draft.location.trimmingCharacters(in: .whitespacesAndNewlines)
        let type = PartyAI.eventType(from: vibe)
        let code = String((0..<6).compactMap { _ in "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".randomElement() })

        var uploads: [InspoItem] = []
        for data in draft.photos {
            let file = InspoImages.save(data)
            uploads.append(
                InspoItem(
                    id: UUID().uuidString,
                    caption: "Uploaded inspo",
                    detail: "Pulled into the \(theme.name) palette.",
                    imageFile: file,
                    kind: "upload"
                )
            )
        }

        return EventRecord(
            id: UUID().uuidString,
            title: title,
            description: draft.vibe.isEmpty ? "A \(theme.name) \(type.replacingOccurrences(of: "_", with: " "))." : draft.vibe,
            eventType: type,
            dateStart: start,
            locationName: location,
            totalBudget: budget,
            guestCount: guests,
            joinCode: code,
            kitUnlocked: false,
            themeName: theme.name,
            primaryHex: theme.primaryHex,
            secondaryHex: theme.secondaryHex,
            accentHex: theme.accentHex,
            mood: theme.mood,
            qualityScore: 74,
            plannerNotes: PartyAI.notes(theme: theme, budget: budget, guests: guests),
            schedules: timeline(start: start, type: type),
            supplies: supplies(theme: theme, budget: budget, type: type),
            guests: [
                GuestItem(id: UUID().uuidString, name: "Avery Chen", status: "accepted"),
                GuestItem(id: UUID().uuidString, name: "Sam Rivera", status: "pending"),
                GuestItem(id: UUID().uuidString, name: "Jordan Blake", status: "pending"),
            ],
            budgetLines: budgetLines(budget),
            inspoItems: uploads + PartyAI.inspoIdeas(theme: theme, budget: budget, guests: guests),
            printables: PartyAI.printables(title: title, theme: theme, location: location, date: start, guests: guests),
            themeOptions: options
        )
    }

    static func make(from prompt: String) -> EventRecord {
        make(from: PlanDraft(
            title: "",
            vibe: prompt,
            budget: extractBudget(prompt) ?? 500,
            location: "",
            date: Calendar.current.date(byAdding: .day, value: 21, to: Date()) ?? Date(),
            guestCount: 12,
            photos: []
        ))
    }

    static func apply(theme: ThemeOption, to event: EventRecord) -> EventRecord {
        var next = event
        next.themeName = theme.name
        next.primaryHex = theme.primaryHex
        next.secondaryHex = theme.secondaryHex
        next.accentHex = theme.accentHex
        next.mood = theme.mood
        next.printables = PartyAI.printables(
            title: event.title,
            theme: theme,
            location: event.locationName,
            date: event.dateStart,
            guests: event.guestCount
        )
        next.inspoItems = event.inspoItems.filter { $0.kind == "upload" }
            + PartyAI.inspoIdeas(theme: theme, budget: event.totalBudget, guests: event.guestCount)
        next.plannerNotes = PartyAI.notes(theme: theme, budget: event.totalBudget, guests: event.guestCount)
        return next
    }

    static func refreshAI(on event: EventRecord) -> EventRecord {
        let captions = event.inspoItems.map { "\($0.caption) \($0.detail)" }.joined(separator: " ")
        let hay = "\(event.title) \(event.description) \(event.themeName) \(captions)"
        var options = PartyAI.rankedThemes(for: hay)
        if event.inspoItems.contains(where: { $0.kind == "upload" }), let top = options.first {
            let named = ThemeOption(
                id: "from-inspo",
                name: "Inspo: \(top.name)",
                mood: "A \(top.name.lowercased()) party pulled from your mood board.",
                why: "Generated from the photos and notes you added.",
                primaryHex: top.primaryHex,
                secondaryHex: top.secondaryHex,
                accentHex: top.accentHex
            )
            options = [named] + options.filter { $0.id != top.id }
        }
        let theme = options.first ?? ThemeOption(
            id: "current",
            name: event.themeName,
            mood: event.mood,
            why: "Your current look.",
            primaryHex: event.primaryHex,
            secondaryHex: event.secondaryHex,
            accentHex: event.accentHex
        )
        var next = EventFactory.apply(theme: theme, to: event)
        next.themeOptions = options
        next.qualityScore = min(96, 70 + min(event.inspoItems.filter { $0.kind == "upload" }.count, 4) * 6)
        return next
    }

    static func extractBudget(_ text: String) -> Double? {
        let pattern = #"\$?\s?([\d,]+)"#
        guard let regex = try? NSRegularExpression(pattern: pattern),
              let match = regex.firstMatch(in: text, range: NSRange(text.startIndex..., in: text)),
              let range = Range(match.range(at: 1), in: text) else { return nil }
        return Double(text[range].replacingOccurrences(of: ",", with: ""))
    }

    private static func budgetLines(_ budget: Double) -> [BudgetLine] {
        [
            ("Decor", 0.22),
            ("Food", 0.38),
            ("Activities", 0.12),
            ("Printables", 0.08),
            ("Equipment", 0.10),
            ("Buffer", 0.10),
        ].map { BudgetLine(id: UUID().uuidString, category: $0.0, allocated: (budget * $0.1).rounded(), spent: 0) }
    }

    private static func supplies(theme: ThemeOption, budget: Double, type: String) -> [SupplyItem] {
        let rows: [(String, String, Double)] = type == "wedding"
            ? [
                ("Florals and tablescape", "Decor", 0.28),
                ("Catering", "Food", 0.4),
                ("Lighting and sound", "Equipment", 0.12),
                ("Stationery suite", "Printables", 0.06),
            ]
            : [
                ("\(theme.name) backdrop and balloons", "Decor", 0.14),
                ("Cake and dessert", "Food", 0.16),
                ("Savory food and drinks", "Food", 0.22),
                ("Craft or activity kits", "Activities", 0.08),
                ("Paper goods", "Printables", 0.05),
                ("Speaker (borrow if you can)", "Equipment", 0.04),
                ("Favors", "Decor", 0.08),
            ]
        return rows.map {
            SupplyItem(id: UUID().uuidString, name: $0.0, category: $0.1, estimated: (budget * $0.2).rounded(), status: "needed")
        }
    }

    private static func timeline(start: Date, type: String) -> [ScheduleItem] {
        let blocks: [(String, TimeInterval, String)] = type == "birthday"
            ? [
                ("Setup", -90 * 60.0, "Decor, playlist, craft table."),
                ("Doors", 0, "Greeters, name tags, first sip."),
                ("Main activity", 45 * 60.0, "Game or craft. 20 to 30 minutes."),
                ("Cake and photos", 90 * 60.0, "Candles, then a group shot."),
                ("Open play and favors", 110 * 60.0, "Easy wind-down."),
                ("Strike", 160 * 60.0, "Pack, recycle, thank the setup lead."),
            ]
            : [
                ("Load-in", -120 * 60.0, "Tables, lighting, walkthrough."),
                ("Guest arrival", 0, "Door, coats, first drink."),
                ("Welcome", 30 * 60.0, "Host toast and house notes."),
                ("Core program", 45 * 60.0, "Dinner, speeches, or party block."),
                ("Peak moment", 130 * 60.0, "Cake, dance, or big toast."),
                ("Strike", 210 * 60.0, "Breakdown and lost-and-found."),
            ]
        return blocks.map {
            ScheduleItem(id: UUID().uuidString, title: $0.0, start: start.addingTimeInterval($0.1), notes: $0.2, isCompleted: false)
        }
    }
}
