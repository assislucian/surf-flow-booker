import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Missing sessionId");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") {
      throw new Error("Payment not verified");
    }

    const md = (session.metadata || {}) as Record<string, string>;

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Insert booking (idempotent by stripe_session_id)
    let bookingRow: any = null;
    const insertRes = await supabaseAdmin
      .from("bookings")
      .insert({
        name: md.name ?? "",
        email: md.email ?? "",
        phone: null,
        level: md.level ?? null,
        notes: md.notes ?? null,
        booking_date: md.date ?? "",
        slot: md.slots ?? md.slot ?? "",
        status: "confirmed",
        stripe_session_id: session.id,
        amount_cents: (session.amount_total as number) ?? 1499,
        currency: (session.currency as string) ?? "eur",
      })
      .select()
      .single();

    if (insertRes.error) {
      // If unique violation, fetch existing row
      const existing = await supabaseAdmin
        .from("bookings")
        .select("*")
        .eq("stripe_session_id", session.id)
        .maybeSingle();
      if (existing.data) {
        bookingRow = existing.data;
      } else {
        throw insertRes.error;
      }
    } else {
      bookingRow = insertRes.data;
    }

    const booking = {
      name: bookingRow.name,
      email: bookingRow.email,
      date: bookingRow.booking_date,
      slots: bookingRow.slot.split(",").filter(Boolean),
      level: bookingRow.level,
      notes: bookingRow.notes,
    };

    return new Response(JSON.stringify({ ok: true, booking }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("verify-payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
