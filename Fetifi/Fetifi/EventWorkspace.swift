import SwiftUI
import PhotosUI

struct EventHubView: View {
    @Environment(BoxStore.self) private var store
    let eventId: String

    var event: EventRecord? {
        store.events.first { $0.id == eventId }
    }

    var body: some View {
        if let event {
            TabView {
                OverviewPane(event: event).tabItem { Label("Plan", systemImage: "square.stack") }
                InspoPane(event: event).tabItem { Label("Inspo", systemImage: "sparkles") }
                GuestsPane(event: event).tabItem { Label("Guest list", systemImage: "person.2") }
                SchedulePane(event: event).tabItem { Label("Checklist", systemImage: "checklist") }
            }
            .navigationTitle(event.title)
            .navigationBarTitleDisplayMode(.inline)
        } else {
            Text("Missing event")
        }
    }
}

struct OverviewPane: View {
    @Environment(BoxStore.self) private var store
    let event: EventRecord

    var body: some View {
        Form {
            Section {
                RoundedRectangle(cornerRadius: 16)
                    .fill(event.primary)
                    .overlay(alignment: .bottomLeading) {
                        VStack(alignment: .leading) {
                            Text(event.themeName.uppercased()).font(.caption).foregroundStyle(.white.opacity(0.85))
                            Text(event.mood).foregroundStyle(.white)
                        }
                        .padding()
                    }
                    .frame(height: 120)
                    .listRowInsets(EdgeInsets())
            }
            Section("Customize") {
                TextField("Title", text: Binding(
                    get: { event.title },
                    set: { value in store.update(event.id) { $0.title = value } }
                ))
                TextField("Where", text: Binding(
                    get: { event.locationName },
                    set: { value in store.update(event.id) { $0.locationName = value } }
                ))
                DatePicker("When", selection: Binding(
                    get: { event.dateStart },
                    set: { value in store.update(event.id) { $0.dateStart = value } }
                ))
                Stepper("Guests: \(event.guestCount)", value: Binding(
                    get: { event.guestCount },
                    set: { value in store.update(event.id) { $0.guestCount = value } }
                ), in: 2...200)
                TextField("Vibe notes", text: Binding(
                    get: { event.description },
                    set: { value in store.update(event.id) { $0.description = value } }
                ), axis: .vertical)
            }
            Section("Theme list") {
                ForEach(event.themeOptions) { theme in
                    Button {
                        store.applyTheme(event.id, theme: theme)
                    } label: {
                        HStack {
                            Circle().fill(Color(hex: theme.primaryHex)).frame(width: 18, height: 18)
                            VStack(alignment: .leading) {
                                Text(theme.name).foregroundStyle(.primary)
                                Text(theme.why).font(.caption).foregroundStyle(.secondary)
                            }
                            Spacer()
                            if theme.name == event.themeName {
                                Image(systemName: "checkmark.circle.fill").foregroundStyle(Color(hex: "#A888C4"))
                            }
                        }
                    }
                }
                Button("Ask Fetifi for a new plan") {
                    store.runAI(event.id)
                }
            }
            Section("Planner notes") {
                ForEach(event.plannerNotes, id: \.self) { note in
                    Text(note)
                }
            }
            Section("Budget") {
                HStack {
                    Text("$")
                    TextField("Ceiling", text: Binding(
                        get: { String(Int(event.totalBudget)) },
                        set: { value in
                            store.update(event.id) { $0.totalBudget = Double(value) ?? event.totalBudget }
                        }
                    ))
                    .keyboardType(.numberPad)
                }
                ForEach(event.budgetLines) { line in
                    HStack {
                        Text(line.category)
                        Spacer()
                        Text("$\(Int(line.allocated))")
                            .foregroundStyle(.secondary)
                    }
                }
            }
            Section("Stuff to get") {
                ForEach(event.supplies) { item in
                    HStack {
                        Text(item.name)
                        Spacer()
                        Text("$\(Int(item.estimated))")
                            .foregroundStyle(.secondary)
                    }
                }
            }
            Section("Printables") {
                ForEach(event.printables) { item in
                    Text(item.title).font(.headline)
                    Text(item.body).font(.caption).foregroundStyle(.secondary)
                }
            }
        }
    }
}

struct InspoPane: View {
    @Environment(BoxStore.self) private var store
    let event: EventRecord
    @State private var pickerItems: [PhotosPickerItem] = []
    @State private var caption = ""

    var body: some View {
        List {
            Section("Upload inspo") {
                TextField("What do you like about it?", text: $caption)
                PhotosPicker(selection: $pickerItems, maxSelectionCount: 4, matching: .images) {
                    Label("Add photos from your camera roll", systemImage: "photo.badge.plus")
                }
                .onChange(of: pickerItems) { _, items in
                    Task {
                        for item in items {
                            if let data = try? await item.loadTransferable(type: Data.self) {
                                store.addInspoPhoto(event.id, data: data, caption: caption)
                            }
                        }
                        caption = ""
                        pickerItems = []
                    }
                }
                Button("Turn inspo into themes, ideas, and printables") {
                    store.runAI(event.id)
                }
            }
            Section("Board") {
                ForEach(event.inspoItems) { item in
                    VStack(alignment: .leading, spacing: 8) {
                        if let file = item.imageFile, let image = InspoImages.load(file) {
                            Image(uiImage: image)
                                .resizable()
                                .scaledToFill()
                                .frame(maxHeight: 160)
                                .clipped()
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                        Text(item.caption).font(.headline)
                        Text(item.detail).font(.subheadline).foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 4)
                }
            }
        }
    }
}

struct BudgetPane: View {
    @Environment(BoxStore.self) private var store
    let event: EventRecord

    var body: some View {
        Form {
            Section("Ceiling") {
                HStack {
                    Text("$")
                    TextField("Budget", text: Binding(
                        get: { String(Int(event.totalBudget)) },
                        set: { value in
                            store.update(event.id) { $0.totalBudget = Double(value) ?? event.totalBudget }
                        }
                    ))
                    .keyboardType(.numberPad)
                }
                Text("Estimated supplies $\(Int(event.estimatedSpend))")
                    .foregroundStyle(.secondary)
            }
            Section("Categories") {
                ForEach(event.budgetLines) { line in
                    VStack(alignment: .leading) {
                        Text(line.category)
                        HStack {
                            Text("Plan $")
                            TextField("0", text: Binding(
                                get: { String(Int(line.allocated)) },
                                set: { value in
                                    store.update(event.id) { event in
                                        guard let i = event.budgetLines.firstIndex(where: { $0.id == line.id }) else { return }
                                        event.budgetLines[i].allocated = Double(value) ?? line.allocated
                                    }
                                }
                            ))
                            .keyboardType(.numberPad)
                            Text("Spent $")
                            TextField("0", text: Binding(
                                get: { String(Int(line.spent)) },
                                set: { value in
                                    store.update(event.id) { event in
                                        guard let i = event.budgetLines.firstIndex(where: { $0.id == line.id }) else { return }
                                        event.budgetLines[i].spent = Double(value) ?? line.spent
                                    }
                                }
                            ))
                            .keyboardType(.numberPad)
                        }
                        .font(.caption)
                    }
                }
            }
        }
    }
}

struct SchedulePane: View {
    @Environment(BoxStore.self) private var store
    let event: EventRecord
    @State private var newTitle = ""

    var body: some View {
        List {
            Section("Checklist") {
                Text("Tap a block when it is done. This is your run of show.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                TextField("Setup, cake, speeches...", text: $newTitle)
                Button("Add to run of show") {
                    let title = newTitle.trimmingCharacters(in: .whitespacesAndNewlines)
                    guard !title.isEmpty else { return }
                    store.update(event.id) { event in
                        event.schedules.append(
                            ScheduleItem(
                                id: UUID().uuidString,
                                title: title,
                                start: event.dateStart,
                                notes: "",
                                isCompleted: false
                            )
                        )
                    }
                    newTitle = ""
                }
            }
            Section("Timeline") {
                ForEach(event.schedules) { item in
                    VStack(alignment: .leading) {
                        Button {
                            store.toggle(event.id, itemId: item.id)
                        } label: {
                            HStack {
                                Text(item.title).foregroundStyle(.primary)
                                Spacer()
                                Image(systemName: item.isCompleted ? "checkmark.circle.fill" : "circle")
                            }
                        }
                        TextField("Notes", text: Binding(
                            get: { item.notes },
                            set: { value in
                                store.update(event.id) { event in
                                    guard let i = event.schedules.firstIndex(where: { $0.id == item.id }) else { return }
                                    event.schedules[i].notes = value
                                }
                            }
                        ))
                        .font(.caption)
                    }
                }
                .onDelete { offsets in
                    store.update(event.id) { $0.schedules.remove(atOffsets: offsets) }
                }
            }
        }
    }
}

struct SuppliesPane: View {
    @Environment(BoxStore.self) private var store
    let event: EventRecord
    @State private var name = ""
    @State private var cost = ""

    var body: some View {
        List {
            Section("Add stuff") {
                TextField("Item", text: $name)
                TextField("Estimate $", text: $cost).keyboardType(.decimalPad)
                Button("Add") {
                    let item = name.trimmingCharacters(in: .whitespacesAndNewlines)
                    guard !item.isEmpty else { return }
                    store.update(event.id) { event in
                        event.supplies.append(
                            SupplyItem(
                                id: UUID().uuidString,
                                name: item,
                                category: "General",
                                estimated: Double(cost) ?? 0,
                                status: "needed"
                            )
                        )
                    }
                    name = ""
                    cost = ""
                }
            }
            ForEach(event.supplies) { item in
                VStack(alignment: .leading) {
                    TextField("Name", text: Binding(
                        get: { item.name },
                        set: { value in
                            store.update(event.id) { event in
                                guard let i = event.supplies.firstIndex(where: { $0.id == item.id }) else { return }
                                event.supplies[i].name = value
                            }
                        }
                    ))
                    HStack {
                        TextField("Category", text: Binding(
                            get: { item.category },
                            set: { value in
                                store.update(event.id) { event in
                                    guard let i = event.supplies.firstIndex(where: { $0.id == item.id }) else { return }
                                    event.supplies[i].category = value
                                }
                            }
                        ))
                        TextField("$", text: Binding(
                            get: { String(Int(item.estimated)) },
                            set: { value in
                                store.update(event.id) { event in
                                    guard let i = event.supplies.firstIndex(where: { $0.id == item.id }) else { return }
                                    event.supplies[i].estimated = Double(value) ?? item.estimated
                                }
                            }
                        ))
                        .keyboardType(.numberPad)
                        .frame(width: 70)
                    }
                    .font(.caption)
                    Picker("Status", selection: Binding(
                        get: { item.status },
                        set: { value in
                            store.update(event.id) { event in
                                guard let i = event.supplies.firstIndex(where: { $0.id == item.id }) else { return }
                                event.supplies[i].status = value
                            }
                        }
                    )) {
                        Text("needed").tag("needed")
                        Text("purchased").tag("purchased")
                        Text("borrowed").tag("borrowed")
                    }
                }
            }
            .onDelete { offsets in
                store.update(event.id) { $0.supplies.remove(atOffsets: offsets) }
            }
        }
    }
}

struct GuestsPane: View {
    @Environment(BoxStore.self) private var store
    let event: EventRecord
    @State private var name = ""

    var body: some View {
        List {
            Section("Guest list") {
                TextField("Name", text: $name)
                Button("Add") {
                    let guest = name.trimmingCharacters(in: .whitespacesAndNewlines)
                    guard !guest.isEmpty else { return }
                    store.update(event.id) { event in
                        event.guests.append(GuestItem(id: UUID().uuidString, name: guest, status: "pending"))
                    }
                    name = ""
                }
            }
            ForEach(event.guests) { guest in
                HStack {
                    TextField("Name", text: Binding(
                        get: { guest.name },
                        set: { value in
                            store.update(event.id) { event in
                                guard let i = event.guests.firstIndex(where: { $0.id == guest.id }) else { return }
                                event.guests[i].name = value
                            }
                        }
                    ))
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
            .onDelete { offsets in
                store.update(event.id) { $0.guests.remove(atOffsets: offsets) }
            }
        }
    }
}

struct PrintablesPane: View {
    @Environment(BoxStore.self) private var store
    let event: EventRecord

    var body: some View {
        List {
            Section {
                Text("Edit the copy, then use Share to print or save a PDF. Colors follow your theme.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            ForEach(event.printables) { item in
                Section(item.title) {
                    Text(item.type.uppercased()).font(.caption).foregroundStyle(.secondary)
                    TextEditor(text: Binding(
                        get: { item.body },
                        set: { value in
                            store.update(event.id) { event in
                                guard let i = event.printables.firstIndex(where: { $0.id == item.id }) else { return }
                                event.printables[i].body = value
                            }
                        }
                    ))
                    .frame(minHeight: 120)
                    ShareLink(item: item.body)
                }
            }
        }
    }
}
