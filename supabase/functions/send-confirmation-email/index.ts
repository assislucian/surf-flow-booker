import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking } = await req.json();
    if (!booking?.email) throw new Error("Missing booking or email");

    const html = `
      <div>
        <h1>Surfskate Hall – Buchungsbestätigung</h1>
        <p>Danke für deine Buchung, ${booking.name || "Gast"}!</p>
        <p><strong>Datum:</strong> ${booking.date}</p>
        <p><strong>Zeit:</strong> ${booking.slot}</p>
        ${booking.level ? `<p><strong>Level:</strong> ${booking.level}</p>` : ""}
        ${booking.notes ? `<p><strong>Notizen:</strong> ${booking.notes}</p>` : ""}
        <p>Wir freuen uns auf dich!</p>
      </div>
    `;

    const { error: sendError } = await resend.emails.send({
      from: "Surfskate Hall <onboarding@resend.dev>",
      to: [booking.email],
      subject: "Buchungsbestätigung – Surfskate Hall",
      html,
    });

    if (sendError) throw sendError;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("send-confirmation-email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
