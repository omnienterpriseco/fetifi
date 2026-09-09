import Foundation
import SwiftUI

@MainActor
final class BoxStore: ObservableObject {
    @Published var signedIn = false
    @Published var hostName = "Host"
    @Published var events: [EventRecord] = []

    private let key = "fetifi-ios-events"

    init() {
        load()
    }

    func signIn() {
        signedIn = true
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
        save()
    }

    private func save() {
        if let data = try? JSONEncoder().encode(events) {
            UserDefaults.standard.set(data, forKey: key)
        }
        UserDefaults.standard.set(signedIn, forKey: "fetifi-signed-in")
    }

    private func load() {
        signedIn = UserDefaults.standard.bool(forKey: "fetifi-signed-in")
        guard let data = UserDefaults.standard.data(forKey: key),
              let decoded = try? JSONDecoder().decode([EventRecord].self, from: data) else { return }
        events = decoded
    }
}
