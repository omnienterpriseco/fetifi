# Fetifi

End-to-end event planning: a Next.js website and a native SwiftUI iPhone app.

- Web brand: `web/src/lib/brand.ts`
- iOS brand: `ios/InABox/Brand.swift`

## Website

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create an account (demo auth on this device), then run the wizard with something like `3rd Birthday Party - Jungle Theme - $500 budget`.

## iPhone app

Open `ios/InABox.xcodeproj` in Xcode 16+, choose an iPhone simulator, and run. The app mirrors the same wizard, workspace tabs, and local store.

## What’s in the MVP

- Event wizard (one prompt or steps) that instantiates theme, schedule, supplies, budget, volunteers, guests, printables
- Adaptive event colors
- RSVP, join codes, collaborator roles, comments on schedule blocks
- AI panel (planner, activities, budget, readiness, mood-board palette)
- Printables (browser print / PDF)
- Pricing entitlements (Free / Event kit / Pro) as local flags
- Account deletion path
- API stubs under `/api/v1/...` matching the spec
- Postgres schema + sample RLS in `supabase/migrations/0001_init.sql`

## Next: Supabase & Stripe

1. Create a Supabase project, run the migration, add Auth (Apple, Google, magic link).
2. Point the web app at it with `web/.env.example`.
3. For subscriptions, use Stripe Billing + Checkout Sessions (`mode: 'subscription'`), one Product per plan (Free is not a paid Product; Pro monthly/annual are Prices on a Pro product; Event Kit is a one-time Price). Omit `payment_method_types` so Dashboard payment methods apply.
4. If you charge in the US or EU, enable Stripe Tax and complete registrations before turning on `automatic_tax`. Otherwise Stripe collects no tax and does not error.
5. iOS IAP: StoreKit 2 + RevenueCat, mapping to the same `subscriptions` / `kit_unlocked` fields.

Storage buckets to create: `printables`, `inspiration`, `public-assets`.
