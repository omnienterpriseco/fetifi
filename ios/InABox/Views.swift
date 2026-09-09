import SwiftUI

struct WelcomeView: View {
    @EnvironmentObject private var store: BoxStore

    var body: some View {
        ZStack {
            Color(hex: "#95BDC7").ignoresSafeArea()
            VStack(alignment: .leading, spacing: 24) {
                Image("BrandLogo")
                    .resizable()
                    .scaledToFit()
                    .frame(maxWidth: 320)
                Text("The same workspace as the website: wizard, timeline, budget, and guests.")
                    .foregroundStyle(Color(hex: "#2F4A52"))
                Text("Sale, no end date. Event kit \(Brand.eventKitPrice) (was \(Brand.eventKitWas)). Pro \(Brand.proPrice) (was \(Brand.proWas)). Free includes \(Brand.freeAiPromptsPerMonth) AI prompts a month.")
                    .font(.footnote)
                    .foregroundStyle(Color(hex: "#2F4A52"))
                Spacer()
                Button("Open Fetifi") {
                    store.signIn()
                }
                .buttonStyle(.borderedProminent)
                .tint(Color(hex: "#6B4CFF"))
            }
            .padding(28)
        }
    }
}

struct HomeView: View {
    @EnvironmentObject private var store: BoxStore
    @State private var prompt = "3rd Birthday Party - Jungle Theme - $500 budget"

    var body: some View {
        List {
            Section("New event") {
                TextField("The whole idea", text: $prompt, axis: .vertical)
                Button("Fill the box") {
                    store.create(prompt: prompt)
                }
            }
            Section("Workspaces") {
                if store.events.isEmpty {
                    Text("The box is empty.")
                }
                ForEach(store.events) { event in
                    NavigationLink(value: event) {
                        VStack(alignment: .leading) {
                            Text(event.title).font(.headline)
                            Text("\(event.themeName) · join \(event.joinCode)")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Image("BrandLogo")
                    .resizable()
                    .scaledToFit()
                    .frame(height: 28)
            }
            ToolbarItem(placement: .topBarTrailing) {
                Button("Delete account") {
                    store.deleteAll()
                }
            }
        }
        .toolbarBackground(Color(hex: "#95BDC7"), for: .navigationBar)
        .toolbarBackground(.visible, for: .navigationBar)
        .toolbarColorScheme(.light, for: .navigationBar)
        .navigationDestination(for: EventRecord.self) { event in
            EventHubView(eventId: event.id)
        }
    }
}

struct EventHubView: View {
    @EnvironmentObject private var store: BoxStore
    let eventId: String

    var event: EventRecord? {
        store.events.first { $0.id == eventId }
    }

    var body: some View {
        if let event {
            TabView {
                OverviewPane(event: event).tabItem { Label("Overview", systemImage: "square.stack") }
                SchedulePane(event: event).tabItem { Label("Show", systemImage: "timeline.selection") }
                SuppliesPane(event: event).tabItem { Label("Stuff", systemImage: "basket") }
                GuestsPane(event: event).tabItem { Label("Guests", systemImage: "person.2") }
            }
            .navigationTitle(event.title)
            .navigationBarTitleDisplayMode(.inline)
        } else {
            Text("Missing event")
        }
    }
}

struct OverviewPane: View {
    let event: EventRecord
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                RoundedRectangle(cornerRadius: 20)
                    .fill(event.primary)
                    .overlay(alignment: .bottomLeading) {
                        VStack(alignment: .leading) {
                            Text(event.themeName.uppercased()).font(.caption).foregroundStyle(.white.opacity(0.8))
                            Text("Score \(event.qualityScore)").font(.title).foregroundStyle(.white)
                        }
                        .padding()
                    }
                    .frame(height: 140)
                Text(event.mood)
                ForEach(event.plannerNotes, id: \.self) { note in
                    Text("• \(note)").font(.subheadline)
                }
                Text("Budget ceiling $\(Int(event.totalBudget))")
                    .font(.headline)
            }
            .padding()
        }
        .background(event.secondary)
    }
}

struct SchedulePane: View {
    @EnvironmentObject private var store: BoxStore
    let event: EventRecord

    var body: some View {
        List {
            ForEach(event.schedules) { item in
                Button {
                    store.toggle(event.id, itemId: item.id)
                } label: {
                    HStack {
                        VStack(alignment: .leading) {
                            Text(item.title)
                            Text(item.notes).font(.caption).foregroundStyle(.secondary)
                        }
                        Spacer()
                        Image(systemName: item.isCompleted ? "checkmark.circle.fill" : "circle")
                    }
                }
            }
        }
    }
}

struct SuppliesPane: View {
    let event: EventRecord
    var body: some View {
        List(event.supplies) { item in
            HStack {
                VStack(alignment: .leading) {
                    Text(item.name)
                    Text(item.category).font(.caption).foregroundStyle(.secondary)
                }
                Spacer()
                Text("$\(Int(item.estimated))")
            }
        }
    }
}

struct GuestsPane: View {
    @EnvironmentObject private var store: BoxStore
    let event: EventRecord

    var body: some View {
        List {
            ForEach(event.guests) { guest in
                HStack {
                    Text(guest.name)
                    Spacer()
                    Picker("RSVP", selection: Binding(
                        get: { guest.status },
                        set: { store.setGuest(event.id, guestId: guest.id, status: $0) }
                    )) {
                        Text("pending").tag("pending")
                        Text("accepted").tag("accepted")
                        Text("declined").tag("declined")
                    }
                    .labelsHidden()
                }
            }
        }
    }
}
