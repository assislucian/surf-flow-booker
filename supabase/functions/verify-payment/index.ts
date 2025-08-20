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

    // Parse slots and convert date format
    const slotsString = md.slots ?? "";
    const slots = slotsString.split(",").filter(s => s.trim());
    const dateString = md.date ?? "";
    
    // Convert dd.MM.yyyy to yyyy-MM-dd for database
    const convertDateFormat = (dateStr: string): string => {
      if (dateStr.includes(".")) {
        const [day, month, year] = dateStr.split(".");
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return dateStr; // Already in correct format
    };
    
    const dbDate = convertDateFormat(dateString);
    const totalAmount = (session.amount_total as number) ?? 1499;
    const amountPerSlot = Math.round(totalAmount / Math.max(slots.length, 1));

    // Check if bookings already exist for this session
    const existingBookings = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("stripe_session_id", session.id);

    let bookingRows: any[] = [];

    if (existingBookings.error || !existingBookings.data?.length) {
      // Create multiple booking records - one for each slot
      const bookingPromises = slots.map(slot => {
        const startTime = slot.split(" - ")[0]; // Extract start time from "HH:mm - HH:mm"
        return supabaseAdmin
          .from("bookings")
          .insert({
            name: md.name ?? "",
            email: md.email ?? "",
            phone: md.phone ?? null,
            level: md.level ?? null,
            notes: md.notes ?? null,
            booking_date: dbDate,
            slot: startTime,
            status: "confirmed",
            stripe_session_id: session.id,
            amount_cents: amountPerSlot,
            currency: (session.currency as string) ?? "eur",
          })
          .select()
          .single();
      });

      const results = await Promise.all(bookingPromises);
      bookingRows = results.map(r => r.data).filter(Boolean);
    } else {
      bookingRows = existingBookings.data;
    }

    const bookings = bookingRows.map(row => ({
      name: row.name,
      email: row.email,
      date: row.booking_date,
      slot: row.slot,
      level: row.level,
      notes: row.notes,
    }));

    return new Response(JSON.stringify({ ok: true, bookings }), {
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
