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

      // Utiliser le client admin Supabase pour mettre à jour la base de données
      const supabase = createAdminClient();

      // Ajouter une entrée dans la table 'purchases'
      // const { error: purchaseError } = await supabase
      //   .from('purchases')
      //   .insert({
      //     email,
      //     stripe_session_id: session.id,
      //     amount_total: session.amount_total,
      //     currency: session.currency,
      //     created_at: new Date().toISOString(),
      //   });

      // if (purchaseError) {
      //   console.error('Error inserting purchase:', purchaseError);
      // }

      // Optionnel: Mettre à jour un flag is_paid dans une table users
      // Décommentez les lignes suivantes si vous avez une table users avec un champ is_paid
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_paid: true })
        .eq('email', email);

      if (updateError) {
        console.error('Error updating user:', updateError);
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

