import SwiftUI

@main
struct InABoxApp: App {
    @StateObject private var store = BoxStore()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(store)
        }
    }
}

struct RootView: View {
    @EnvironmentObject private var store: BoxStore

    var body: some View {
        if store.signedIn {
            NavigationStack {
                HomeView()
            }
        } else {
            WelcomeView()
        }
    }
}
