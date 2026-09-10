import Foundation
import Observation

@Observable
final class BoxStore {
    var signedIn = false
    var hostName = "Host"
    var hostEmail = ""
    var trialStartedAt: Date?
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

    func create(prompt: String) {
        events.insert(EventFactory.make(from: prompt), at: 0)
        save()
    }

    func toggle(_ eventId: String, itemId: String) {
        guard let e = events.firstIndex(where: { $0.id == eventId }),
              let i = events[e].schedules.firstIndex(where: { $0.id == itemId }) else { return }
        events[e].schedules[i].isCompleted.toggle()
        save()
    }

    func setGuest(_ eventId: String, guestId: String, status: String) {
        guard let e = events.firstIndex(where: { $0.id == eventId }),
              let i = events[e].guests.firstIndex(where: { $0.id == guestId }) else { return }
        events[e].guests[i].status = status
        save()
    }

    func deleteAll() {
        events = []
        signedIn = false
        hostName = "Host"
        hostEmail = ""
        trialStartedAt = nil
        save()
    }

    private func save() {
        if let data = try? JSONEncoder().encode(events) {
            UserDefaults.standard.set(data, forKey: key)
        }
        UserDefaults.standard.set(signedIn, forKey: "fetifi-signed-in")
        UserDefaults.standard.set(hostName, forKey: "fetifi-host-name")
        UserDefaults.standard.set(hostEmail, forKey: "fetifi-host-email")
        UserDefaults.standard.set(trialStartedAt, forKey: "fetifi-trial-started")
    }

    private func load() {
        signedIn = UserDefaults.standard.bool(forKey: "fetifi-signed-in")
        hostName = UserDefaults.standard.string(forKey: "fetifi-host-name") ?? "Host"
        hostEmail = UserDefaults.standard.string(forKey: "fetifi-host-email") ?? ""
        trialStartedAt = UserDefaults.standard.object(forKey: "fetifi-trial-started") as? Date
        guard let data = UserDefaults.standard.data(forKey: key),
              let decoded = try? JSONDecoder().decode([EventRecord].self, from: data) else { return }
        events = decoded
    }
}
