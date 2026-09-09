import SwiftUI

private struct ConfettiBit: Identifiable {
    let id = UUID()
    let startX: CGFloat
    let startY: CGFloat
    let endX: CGFloat
    let endY: CGFloat
    let delay: Double
    let duration: Double
    let size: CGFloat
    let color: Color
}

private struct WelcomeConfetti: View {
    @State private var bits: [ConfettiBit] = []
    @State private var pop = false

    var body: some View {
        GeometryReader { geo in
            ForEach(bits) { bit in
                Circle()
                    .fill(bit.color)
                    .frame(width: bit.size, height: bit.size)
                    .position(
                        x: pop ? bit.endX : bit.startX,
                        y: pop ? bit.endY : bit.startY
                    )
                    .animation(.easeOut(duration: bit.duration).delay(bit.delay), value: pop)
            }
            .onAppear {
                let colors = [
                    Color(hex: "#E8A8C4"),
                    Color(hex: "#9FC4B8"),
                    Color(hex: "#C9B6DE"),
                    Color(hex: "#E2C48A"),
                    Color(hex: "#9DB8CC"),
                ]
                let cx = geo.size.width / 2
                let cy = geo.size.height * 0.34
                bits = (0..<70).map { index in
                    let popping = index < 40
                    let angle = Double.random(in: 0...(2 * .pi))
                    let distance = CGFloat.random(in: 40...220)
                    return ConfettiBit(
                        startX: popping ? cx : CGFloat.random(in: 8...(geo.size.width - 8)),
                        startY: popping ? cy : -16,
                        endX: popping ? cx + CGFloat(cos(angle)) * distance : CGFloat.random(in: 8...(geo.size.width - 8)),
                        endY: popping ? cy + CGFloat(sin(angle)) * distance : geo.size.height + 24,
                        delay: Double.random(in: 0...0.35),
                        duration: popping ? Double.random(in: 0.8...1.3) : Double.random(in: 2.0...3.1),
                        size: CGFloat.random(in: 4...9),
                        color: colors[index % colors.count]
                    )
                }
                pop = true
            }
        }
        .allowsHitTesting(false)
    }
}

struct WelcomeView: View {
    @EnvironmentObject private var store: BoxStore

    var body: some View {
        ZStack {
            Color.white.ignoresSafeArea()
            WelcomeConfetti()
            VStack(spacing: 24) {
                Image("BrandLogo")
                    .resizable()
                    .scaledToFit()
                    .frame(maxWidth: 280)
                (
                    Text("Party ").foregroundStyle(Color(hex: "#E8A8C4"))
                    + Text("in a ").foregroundStyle(Color(hex: "#9FC4B8"))
                    + Text("box").foregroundStyle(Color(hex: "#C9B6DE"))
                )
                .font(.largeTitle.weight(.medium))
                .multilineTextAlignment(.center)
                Text("The same workspace as the website: wizard, timeline, budget, and guests.")
                    .multilineTextAlignment(.center)
                    .foregroundStyle(Color(hex: "#6A6170"))
                Text("Sale, no end date. Event kit \(Brand.eventKitPrice) (was \(Brand.eventKitWas)). Pro \(Brand.proPrice) (was \(Brand.proWas)). Free includes \(Brand.freeAiPromptsPerMonth) AI prompts a month.")
                    .font(.footnote)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(Color(hex: "#6A6170"))
                Spacer()
                Button("Open Fetifi") {
                    store.signIn()
                }
                .buttonStyle(.borderedProminent)
                .tint(Color(hex: "#C989A8"))
            }
            .frame(maxWidth: .infinity)
            .padding(28)
        }
    }
}

struct HomeView: View {
    @EnvironmentObject private var store: BoxStore
    @State private var prompt = "3rd Birthday Party - Jungle Theme - $500 budget"

    var body: some View {
        ZStack {
            Color.white.ignoresSafeArea()
            WelcomeConfetti()
            List {
            Section {
                (
                    Text("Party ").foregroundStyle(Color(hex: "#E8A8C4"))
                    + Text("in a ").foregroundStyle(Color(hex: "#9FC4B8"))
                    + Text("box").foregroundStyle(Color(hex: "#C9B6DE"))
                )
                .font(.title.weight(.medium))
                .frame(maxWidth: .infinity)
                .multilineTextAlignment(.center)
            }
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
        .scrollContentBackground(.hidden)
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
        .toolbarBackground(Color.white, for: .navigationBar)
        .toolbarBackground(.visible, for: .navigationBar)
        .toolbarColorScheme(.light, for: .navigationBar)
        .navigationDestination(for: EventRecord.self) { event in
            EventHubView(eventId: event.id)
        }
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
