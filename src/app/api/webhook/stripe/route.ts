import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/utils/supabase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Missing STRIPE_WEBHOOK_SECRET' },
        { status: 500 }
      );
    }

    // Vérifier la signature webhook
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Gérer l'événement checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email;

      if (!email) {
        console.error('No email found in checkout session');
        return NextResponse.json({ received: true });
      }

      // Récupérer les détails des produits depuis les line_items
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ['line_items'] }
      );

      const lineItems = sessionWithLineItems.line_items?.data || [];
      const productDetails = lineItems.map((item) => {
        // Le nom du produit est dans description (qui contient généralement le nom)
        // Pour une description plus détaillée, on peut utiliser item.description complet
        const description = item.description || 'Unknown';
        const parts = description.split('\n');
        const productName = parts[0] || description;
        
        return {
          name: productName,
          description: description,
          quantity: item.quantity || 1,
          amount: item.amount_total || 0,
        };
      });

      // Utiliser le client admin Supabase pour insérer dans Orders
      const supabase = createAdminClient();

      const { error: orderError } = await supabase
        .from('Orders')
        .insert({
          email,
          stripe_session_id: session.id,
          amount_total: session.amount_total,
          currency: session.currency,
          product_details: productDetails,
          created_at: new Date().toISOString(),
        });

      if (orderError) {
        console.error('Error inserting order:', orderError);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

