import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const stripeSignature = request.headers.get("stripe-signature");
  const raw = await request.text();

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({
      received: true,
      demo: true,
      hint: "Set STRIPE_WEBHOOK_SECRET and construct a StripeClient to verify events.",
    });
  }

  return NextResponse.json({
    received: true,
    stripeSignature: Boolean(stripeSignature),
    bytes: raw.length,
  });
}
