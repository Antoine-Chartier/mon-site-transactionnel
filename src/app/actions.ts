"use server";

import Stripe from "stripe";

export async function createCheckoutSession(
  price: number,
  name: string,
  description: string
) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-11-17.clover",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name,
              description,
            },
            unit_amount: Math.round(price * 100), // Convertir en centimes
          },
          quantity: 1,
        },
      ],
      customer_creation: "if_required",
      invoice_creation: { enabled: true },
      billing_address_collection: "required", // Force la saisie de l'email
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    return { url: session.url };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return {
      error: error instanceof Error ? error.message : "Une erreur est survenue",
    };
  }
}

