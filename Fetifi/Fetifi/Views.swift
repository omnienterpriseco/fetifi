import SwiftUI
import PhotosUI

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
                let cy = geo.size.height * 0.22
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
    @Environment(BoxStore.self) private var store
    @State private var name = ""
    @State private var email = ""

    private var canStartTrial: Bool {
        !name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            && email.contains("@")
            && email.contains(".")
    }

    var body: some View {
        ZStack {
            Color.white.ignoresSafeArea()
            WelcomeConfetti()
            ScrollView {
                VStack(spacing: 18) {
                    Image("BrandLogo")
                        .resizable()
                        .scaledToFit()
                        .frame(maxWidth: 148)
                        .padding(.top, 28)

                    Text(Brand.slogan)
                        .font(.title2.weight(.medium))
                        .foregroundStyle(Color(hex: "#C9B6DE"))
                        .multilineTextAlignment(.center)

                    Text(Brand.brief)
                        .font(.subheadline)
                        .multilineTextAlignment(.center)
                        .foregroundStyle(Color(hex: "#6A6170"))
                        .padding(.horizontal, 8)

                    VStack(spacing: 12) {
                        TextField("Your name", text: $name)
                            .textContentType(.name)
                            .textInputAutocapitalization(.words)
                            .padding(14)
                            .background(Color(hex: "#F7F3F8"))
                            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                        TextField("Email", text: $email)
                            .textContentType(.emailAddress)
                            .keyboardType(.emailAddress)
                            .textInputAutocapitalization(.never)
                            .autocorrectionDisabled()
                            .padding(14)
                            .background(Color(hex: "#F7F3F8"))
                            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                    }
                    .padding(.top, 8)

                    Button {
                        store.startTrial(name: name, email: email)
                    } label: {
                        Text("Start \(Brand.trialDays)-day free trial")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 6)
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(Color(hex: "#A888C4"))
                    .foregroundStyle(.white)
                    .disabled(!canStartTrial)

                    Text("No charge today. Your trial lasts \(Brand.trialDays) days.")
                        .font(.footnote)
                        .foregroundStyle(Color(hex: "#6A6170"))
                }
                .frame(maxWidth: .infinity)
                .padding(.horizontal, 28)
                .padding(.bottom, 40)
            }
            .scrollDismissesKeyboard(.interactively)
        }
    }
}

struct HomeView: View {
    @Environment(BoxStore.self) private var store
    @State private var path = NavigationPath()
    @State private var title = ""
    @State private var vibe = "3rd birthday, jungle theme, backyard"
    @State private var budget = "500"
    @State private var location = ""
    @State private var date = Calendar.current.date(byAdding: .day, value: 21, to: Date()) ?? Date()
    @State private var guestCount = 12
    @State private var pickerItems: [PhotosPickerItem] = []
    @State private var photos: [Data] = []
    @State private var created: EventRecord?

    var body: some View {
        NavigationStack(path: $path) {
            ZStack {
                Color.white.ignoresSafeArea()
                WelcomeConfetti()
                List {
                    Section {
                        HStack(spacing: 0) {
                            Text("Party ").foregroundStyle(Color(hex: "#E8A8C4"))
                            Text("in a ").foregroundStyle(Color(hex: "#9FC4B8"))
                            Text("box").foregroundStyle(Color(hex: "#C9B6DE"))
                        }
                        .font(.title.weight(.medium))
                        .frame(maxWidth: .infinity)
                        .multilineTextAlignment(.center)
                        Text("Set a budget, drop inspo, and Fetifi fills a theme list, shopping ideas, timeline, and printables. You can change every line.")
                            .font(.subheadline)
                            .foregroundStyle(Color(hex: "#6A6170"))
                            .multilineTextAlignment(.center)
                    }
                    Section("New party") {
                        TextField("Party name", text: $title)
                        TextField("The vibe", text: $vibe, axis: .vertical)
                        HStack {
                            Text("Budget $")
                            TextField("500", text: $budget)
                                .keyboardType(.decimalPad)
                        }
                        Stepper("Guests: \(guestCount)", value: $guestCount, in: 2...200)
                        DatePicker("When", selection: $date)
                        TextField("Where", text: $location)
                        PhotosPicker(selection: $pickerItems, maxSelectionCount: 6, matching: .images) {
                            Label(photos.isEmpty ? "Upload inspo photos" : "\(photos.count) inspo photos", systemImage: "photo.on.rectangle")
                        }
                        .onChange(of: pickerItems) { _, items in
                            Task { await loadPhotos(items) }
                        }
                        Button("Ask Fetifi to plan it") {
                            created = store.create(draft: PlanDraft(
                                title: title,
                                vibe: vibe,
                                budget: Double(budget) ?? 500,
                                location: location,
                                date: date,
                                guestCount: guestCount,
                                photos: photos
                            ))
                            pickerItems = []
                            photos = []
                        }
                    }
                    Section("Workspaces") {
                        if store.events.isEmpty {
                            Text("The box is empty.")
                        }
                        ForEach(store.events) { event in
                            NavigationLink(value: event.id) {
                                VStack(alignment: .leading) {
                                    Text(event.title).font(.headline)
                                    Text("\(event.themeName) · $\(Int(event.totalBudget)) · join \(event.joinCode)")
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
                            .frame(height: 26)
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
                .navigationDestination(for: String.self) { eventId in
                    EventHubView(eventId: eventId)
                }

                if let created {
                    Color.black.opacity(0.32)
                        .ignoresSafeArea()
                        .onTapGesture { self.created = nil }
                    VStack(alignment: .leading, spacing: 16) {
                        HStack {
                            Text("Workspace ready")
                                .font(.title3.weight(.medium))
                            Spacer()
                            Button {
                                self.created = nil
                            } label: {
                                Image(systemName: "xmark")
                                    .font(.headline)
                                    .foregroundStyle(Color(hex: "#6A6170"))
                                    .padding(8)
                            }
                            .accessibilityLabel("Close")
                        }
                        Text(created.title)
                            .font(.headline)
                        Text("Open it now, or close this and find it under Workspaces.")
                            .font(.subheadline)
                            .foregroundStyle(Color(hex: "#6A6170"))
                        Button("Open workspace") {
                            let id = created.id
                            self.created = nil
                            path.append(id)
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(Color(hex: "#A888C4"))
                        .foregroundStyle(.white)
                    }
                    .padding(22)
                    .background(Color.white)
                    .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
                    .padding(28)
                }
            }
        }
    }

    private func loadPhotos(_ items: [PhotosPickerItem]) async {
        var loaded: [Data] = []
        for item in items {
            if let data = try? await item.loadTransferable(type: Data.self) {
                loaded.append(data)
            }
        }
        photos = loaded
    }
}
