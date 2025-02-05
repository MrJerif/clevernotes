// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// export async function POST(req: Request) {
//     const { price, userId } = await req.json();

//     if (!userId) {
//         return NextResponse.json({
//             error: "User not found",
//         }, {
//             status: 400,
//         });
//     }

//     const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/successful?payment=success`;
//     const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/documents/cancel`;

//     if (!successUrl || !cancelUrl) {
//         return NextResponse.json({
//             error: "Url invalid",
//         }, {
//             status: 400,
//         });
//     }

//     if (req.method === "POST") {
//         try {
//             const session = await stripe.checkout.sessions.create({
//                 payment_method_types: ['card'],
//                 line_items: [
//                     {
//                         price_data: {
//                             currency: 'usd',
//                             unit_amount: Math.round(price * 100),
//                             product_data: {
//                                 name: `Pay $${price}`,
//                             }
//                         },
//                         quantity: 1,
//                     }
//                 ],
//                 mode: 'payment',
//                 success_url: successUrl,
//                 cancel_url: cancelUrl,
//                 metadata: {
//                     userId: userId,
//                     price: Math.round(price * 100)
//                 }
//             });
//             return NextResponse.json({ sessionId: session.id, url: session.url }, { status: 200 });
//         } catch (error) {
//             console.log('checkout-session: =>=> ', error);
//         }
//     } else {
//         return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
//     }
// }
