import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";
import { Resend } from "npm:resend@4.0.0";

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

  // Get authenticated user from request (if available)
  const authHeader = req.headers.get("Authorization");
  let userId: string | null = null;
  
  if (authHeader) {
    try {
      const authClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? ""
      );
      const token = authHeader.replace("Bearer ", "");
      console.log("verify-payment: Attempting to authenticate user with token");
      const { data: userData, error: authError } = await authClient.auth.getUser(token);
      if (!authError && userData.user) {
        userId = userData.user.id;
        console.log("verify-payment: User authenticated:", userId, userData.user.email);
      } else {
        console.log("verify-payment: No valid authentication found:", authError?.message || "No user");
      }
    } catch (error) {
      console.log("verify-payment: Could not authenticate user:", error);
    }
  } else {
    console.log("verify-payment: No Authorization header provided");
  }

  const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
);

let booking: any = null;

// Idempotency: if already recorded for this session, return existing
const { data: existingRows, error: existingErr } = await supabaseAdmin
  .from("bookings")
  .select("*")
  .eq("stripe_session_id", session.id);
if (existingErr) throw existingErr;

if (existingRows && existingRows.length > 0) {
  booking = {
    name: existingRows[0].name,
    email: existingRows[0].email,
    date: existingRows[0].booking_date,
    slots: existingRows.map((r: any) => r.slot).filter(Boolean).sort(),
    level: existingRows[0].level,
    notes: existingRows[0].notes,
  };
} else {
  // Parse slots (CSV from Stripe metadata) into array of HH:00
  const desiredSlots = String(md.slots ?? md.slot ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (desiredSlots.length === 0) throw new Error("Missing slots");

  // Pre-check availability to improve UX (still protected by DB unique index)
  const { data: conflicts, error: conflictsErr } = await supabaseAdmin
    .from("bookings")
    .select("slot")
    .eq("booking_date", md.date ?? "")
    .in("slot", desiredSlots)
    .eq("status", "confirmed");
  if (conflictsErr) throw conflictsErr;
  if (conflicts && conflicts.length > 0) {
    throw new Error("One or more selected slots were just booked. Please choose different times.");
  }

  const rows = desiredSlots.map((slot) => ({
    name: md.name ?? "",
    email: md.email ?? "",
    phone: null,
    level: md.level ?? null,
    notes: md.notes ?? null,
    booking_date: md.date ?? "",
    slot,
    status: "confirmed",
    stripe_session_id: session.id,
    amount_cents: (session.amount_total as number) ?? 1499,
    currency: (session.currency as string) ?? "eur",
    user_id: userId, // Associate booking with authenticated user if available
  }));

  console.log("verify-payment: Inserting booking rows:", {
    count: rows.length,
    userId,
    email: md.email,
    slots: desiredSlots
  });

  const { data: inserted, error: insertErr } = await supabaseAdmin
    .from("bookings")
    .insert(rows)
    .select("*");
  if (insertErr) {
    console.error("verify-payment: Database insert error:", insertErr);
    throw insertErr;
  }

  console.log("verify-payment: Successfully inserted bookings:", {
    count: inserted?.length || 0,
    bookingIds: inserted?.map(b => b.id) || []
  });

  booking = {
    name: inserted[0].name,
    email: inserted[0].email,
    date: inserted[0].booking_date,
    slots: inserted.map((r: any) => r.slot).filter(Boolean).sort(),
    level: inserted[0].level,
    notes: inserted[0].notes,
  };
}

// Send confirmation email server-side (best practice)
try {
  const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");
  const FROM = Deno.env.get("RESEND_FROM") || "Surfskate Hall <noreply@lifabrasil.com>";
  const subject = (md.locale || md.language || "de") === "de"
    ? "🏄‍♂️ Buchung bestätigt – Let's ride!"
    : "🏄‍♂️ Booking Confirmed – Let's ride!";
  const slotsText = Array.isArray(booking.slots) ? booking.slots.join(", ") : (booking.slot || "");
  const html = `
    <h2>${subject}</h2>
    <p>${((md.locale || md.language || "de") === "de") ? "Danke für deine Buchung!" : "Thanks for your booking!"}</p>
    <p><strong>Date:</strong> ${booking.date}</p>
    <p><strong>Time:</strong> ${slotsText}</p>
  `;
  await resend.emails.send({ from: FROM, to: [booking.email], subject, html });
} catch (e) {
  console.log("verify-payment: email send failed (non-blocking)", e);
}

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
