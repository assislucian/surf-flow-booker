import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

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
    const amountCents = Number.isFinite(body?.amountCents) ? body.amountCents : 1499;
    const currency = (body?.currency || "eur").toLowerCase();
    const successUrl = body?.successUrl;
    const cancelUrl = body?.cancelUrl;

    if (!pending || !pending.email) throw new Error("Missing booking or email");

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
              description: `${pending.date ?? ""} ${pending.slot ?? ""}`.trim(),
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
        phone: pending.phone ?? "",
        date: pending.date ?? "",
        slot: pending.slot ?? "",
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
