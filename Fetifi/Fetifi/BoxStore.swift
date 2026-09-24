import Foundation
import Observation

@Observable
final class BoxStore {
    var signedIn = false
    var hostName = "Host"
    var hostEmail = ""
    var trialStartedAt: Date?
    var onboardingComplete = false
    var paletteVibe = "neutrals"
    var partyFrequency = "A few times a year"
    var plannerLevel = "Beginner"
    var events: [EventRecord] = []

    private let key = "fetifi-ios-events"

    init() {
        load()
    }

    func startTrial(name: String, email: String) {
        hostName = name.trimmingCharacters(in: .whitespacesAndNewlines)
        hostEmail = email.trimmingCharacters(in: .whitespacesAndNewlines)
        trialStartedAt = Date()
        signedIn = true
        save()
    }

    func finishOnboarding(palette: String, frequency: String, level: String) {
        paletteVibe = palette
        partyFrequency = frequency
        plannerLevel = level
        onboardingComplete = true
        save()
    }

    @discardableResult
    func create(draft: PlanDraft) -> EventRecord {
        let event = EventFactory.make(from: draft)
        events.insert(event, at: 0)
        save()
        return event
    }

    func update(_ eventId: String, _ change: (inout EventRecord) -> Void) {
        guard let index = events.firstIndex(where: { $0.id == eventId }) else { return }
        change(&events[index])
        save()
    }

    func applyTheme(_ eventId: String, theme: ThemeOption) {
        update(eventId) { event in
            event = EventFactory.apply(theme: theme, to: event)
        }
    }

    func runAI(_ eventId: String) {
        update(eventId) { event in
            event = EventFactory.refreshAI(on: event)
        }
    }

    func addInspoPhoto(_ eventId: String, data: Data, caption: String) {
        let file = InspoImages.save(data)
        update(eventId) { event in
            event.inspoItems.insert(
                InspoItem(
                    id: UUID().uuidString,
                    caption: caption.isEmpty ? "Uploaded inspo" : caption,
                    detail: "Use this as a color and texture cue.",
                    imageFile: file,
                    kind: "upload"
                ),
                at: 0
            )
        }
    }

    func toggle(_ eventId: String, itemId: String) {
        update(eventId) { event in
            guard let i = event.schedules.firstIndex(where: { $0.id == itemId }) else { return }
            event.schedules[i].isCompleted.toggle()
        }
    }

    func setGuest(_ eventId: String, guestId: String, status: String) {
        update(eventId) { event in
            guard let i = event.guests.firstIndex(where: { $0.id == guestId }) else { return }
            event.guests[i].status = status
        }
    }

    func deleteAll() {
        for event in events {
            for item in event.inspoItems {
                if let file = item.imageFile { InspoImages.delete(file) }
            }
        }
        events = []
        signedIn = false
        hostName = "Host"
        hostEmail = ""
        trialStartedAt = nil
        onboardingComplete = false
        paletteVibe = "neutrals"
        partyFrequency = "A few times a year"
        plannerLevel = "Beginner"
        save()
    }

    private func save() {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        if let data = try? encoder.encode(events) {
            UserDefaults.standard.set(data, forKey: key)
        }
        UserDefaults.standard.set(signedIn, forKey: "fetifi-signed-in")
        UserDefaults.standard.set(hostName, forKey: "fetifi-host-name")
        UserDefaults.standard.set(hostEmail, forKey: "fetifi-host-email")
        UserDefaults.standard.set(trialStartedAt, forKey: "fetifi-trial-started")
        UserDefaults.standard.set(onboardingComplete, forKey: "fetifi-onboarding")
        UserDefaults.standard.set(paletteVibe, forKey: "fetifi-palette")
        UserDefaults.standard.set(partyFrequency, forKey: "fetifi-frequency")
        UserDefaults.standard.set(plannerLevel, forKey: "fetifi-level")
    }

    private func load() {
        signedIn = UserDefaults.standard.bool(forKey: "fetifi-signed-in")
        hostName = UserDefaults.standard.string(forKey: "fetifi-host-name") ?? "Host"
        hostEmail = UserDefaults.standard.string(forKey: "fetifi-host-email") ?? ""
        trialStartedAt = UserDefaults.standard.object(forKey: "fetifi-trial-started") as? Date
        onboardingComplete = UserDefaults.standard.bool(forKey: "fetifi-onboarding")
        paletteVibe = UserDefaults.standard.string(forKey: "fetifi-palette") ?? "neutrals"
        partyFrequency = UserDefaults.standard.string(forKey: "fetifi-frequency") ?? "A few times a year"
        plannerLevel = UserDefaults.standard.string(forKey: "fetifi-level") ?? "Beginner"
        guard let data = UserDefaults.standard.data(forKey: key) else { return }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        if let decoded = try? decoder.decode([EventRecord].self, from: data) {
            events = decoded
            return
        }
        if let decoded = try? JSONDecoder().decode([EventRecord].self, from: data) {
            events = decoded
        }
    }
}
