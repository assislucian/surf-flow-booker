import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const pending = body?.pending;
    const successUrl = body?.successUrl;
    const cancelUrl = body?.cancelUrl;

    if (!pending || !pending.email) throw new Error("Missing booking or email");

    // Get current booking price from database
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: priceData, error: priceError } = await supabaseClient
      .from('prices')
      .select('*')
      .eq('type', 'booking')
      .eq('is_active', true)
      .single();

    if (priceError) {
      console.log('Using fallback price due to error:', priceError.message);
    }

    const amountCents = priceData?.amount_cents || 1499; // Fallback to default
    const currency = (priceData?.currency || "eur").toLowerCase();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const session = await stripe.checkout.sessions.create({
      customer_email: pending.email,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "Surfskate Hall Booking",
              description: `${pending.date ?? ""} ${Array.isArray(pending.slots) ? pending.slots.join(", ") : pending.slot ?? ""}`.trim(),
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: (successUrl || `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`),
      cancel_url: (cancelUrl || `${req.headers.get("origin")}/payment-canceled`),
      metadata: {
        name: pending.name ?? "",
        email: pending.email ?? "",
        date: pending.date ?? "",
        slots: Array.isArray(pending.slots) ? pending.slots.join(",") : pending.slot ?? "",
        level: pending.level ?? "",
        notes: pending.notes ?? "",
        createdAt: String(pending.createdAt ?? ""),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("create-payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
