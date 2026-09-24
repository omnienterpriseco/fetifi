import SwiftUI

@main
struct FetifiApp: App {
    @State private var store = BoxStore()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(store)
        }
    }
}

struct RootView: View {
    @Environment(BoxStore.self) private var store

    var body: some View {
        if store.signedIn {
            if store.onboardingComplete {
                HomeView()
            } else {
                GetToKnowView()
            }
        } else {
            WelcomeView()
        }
    }
}
