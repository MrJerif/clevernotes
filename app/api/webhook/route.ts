import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { NextResponse } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const relevantEvents = new Set([
    "checkout.session.completed",
]);

export async function POST(req: Request) {

    if (!process.env.WEBHOOK_ENDPOINT_SECRET) {
        throw new Error("WEBHOOK_ENDPOINT_SECRET is not set");
    }
    if (!process.env.CONVEX_DEPLOYMENT_URL) {
        throw new Error("CONVEX_DEPLOYMENT_URL is not set");
    }

    const convex = new ConvexHttpClient(process.env.CONVEX_DEPLOYMENT_URL);

    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;
    const payload = await req.text(); // Read the raw body as text
    const sig = req.headers.get("stripe-signature") as string; // Retrieve the signature from headers

    if (!sig) {
        return NextResponse.json({ error: "Missing Stripe signature header" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        // Verify and construct the event using the raw body, signature, and secret
        event = stripe.webhooks.constructEvent(payload, sig, secret);
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err);
        return NextResponse.json(
            { error: "Webhook signature verification failed" },
            { status: 400 }
        );
    }

    // Handle relevant Stripe events
    if (relevantEvents.has(event.type)) {
        try {
            switch (event.type) {
                case "checkout.session.completed": {
                    const session = event.data.object as Stripe.Checkout.Session;
                    const userId = session.metadata?.userId as string;
                    const priceString = session.metadata?.price;
                    const price = parseInt(priceString || "0", 10);
                    // Call your function to add tokens 
                    if (userId && price > 0) {
                        await convex.mutation(api.documents.buyTokens, {
                            tokenCount: price,
                            userId: userId
                        });
                    } else {
                        console.error("Invalid metadata in Stripe session:", session.metadata)
                    }
                    break;
                }
                default:
                    break;
            }
        } catch (error) {
            console.log("Error processing event", error);
            return NextResponse.json(
                { error: `Error processing event (event.type) ${event.type}` },
                { status: 500 }
            );
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });
}

