import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");
const FROM = Deno.env.get("RESEND_FROM") || "Surfskate Hall <noreply@lifabrasil.com>";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking, language = "de" } = await req.json();
    if (!booking?.email) throw new Error("Missing booking or email");
    const isGerman = language === "de";
    const slots: string[] = Array.isArray(booking.slots)
      ? booking.slots
      : (booking.slot ? [booking.slot] : []);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${isGerman ? "Buchungsbestätigung" : "Booking Confirmation"}</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px 15px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🏄‍♂️ Surfskate Hall</h1>
          <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">
            ${isGerman ? "Buchungsbestätigung" : "Booking Confirmation"}
          </p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 15px 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
          <p style="font-size: 18px; color: #2d3748; margin-bottom: 25px;">
            ${isGerman 
              ? `Hallo <strong>${booking.name || "Surfskater"}</strong>! 🤙`
              : `Hello <strong>${booking.name || "Surfer"}</strong>! 🤙`
            }
          </p>
          
          <p style="color: #4a5568; margin-bottom: 20px;">
            ${isGerman 
              ? "Deine Buchung wurde erfolgreich bestätigt. Wir freuen uns riesig auf deine Session!"
              : "Your booking has been successfully confirmed. We're super excited for your session!"
            }
          </p>
          
          <div style="background: #f7fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea; margin: 25px 0;">
            <h3 style="margin: 0 0 15px; color: #2d3748; font-size: 16px;">
              📅 ${isGerman ? "Buchungsdetails" : "Booking Details"}
            </h3>
            <p style="margin: 8px 0; color: #4a5568;">
              <strong>${isGerman ? "Datum:" : "Date:"}</strong> ${booking.date}
            </p>
            <p style="margin: 8px 0; color: #4a5568;">
              <strong>${isGerman ? "Zeitslots:" : "Time slots:"}</strong> ${slots.join(", ")}
            </p>
            ${booking.level ? `<p style="margin: 8px 0; color: #4a5568;"><strong>${isGerman ? "Level:" : "Level:"}</strong> ${booking.level}</p>` : ""}
            ${booking.notes ? `<p style="margin: 8px 0; color: #4a5568;"><strong>${isGerman ? "Notizen:" : "Notes:"}</strong> ${booking.notes}</p>` : ""}
          </div>
          
          <div style="background: #e6fffa; padding: 20px; border-radius: 10px; margin: 25px 0;">
            <h3 style="margin: 0 0 10px; color: #234e52; font-size: 16px;">
              💡 ${isGerman ? "Was dich erwartet:" : "What to expect:"}
            </h3>
            <ul style="color: #2d5a67; margin: 0; padding-left: 20px;">
              <li>${isGerman ? "Top-Equipment und sichere Umgebung" : "Top equipment and safe environment"}</li>
              <li>${isGerman ? "Professionelle Anleitung" : "Professional guidance"}</li>
              <li>${isGerman ? "Community-Vibe und gute Musik" : "Community vibe and great music"}</li>
              <li>${isGerman ? "Flexible Pausen und Snack-Möglichkeiten" : "Flexible breaks and snack options"}</li>
            </ul>
          </div>
          
          <p style="color: #4a5568; margin: 20px 0;">
            ${isGerman 
              ? "Falls du Fragen hast oder deine Buchung ändern möchtest, melde dich gerne bei uns!"
              : "If you have any questions or want to change your booking, feel free to contact us!"
            }
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 18px; color: #667eea; font-weight: bold;">
              Ride the wave! 🌊
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #718096; font-size: 14px;">
          <p>Surfskate Hall | ${isGerman ? "Dein Flow-Spot" : "Your Flow Spot"}</p>
        </div>
      </body>
      </html>
    `;

    const subject = isGerman 
      ? "🏄‍♂️ Buchung bestätigt – Let's ride!"
      : "🏄‍♂️ Booking Confirmed – Let's ride!";

    const { error: sendError } = await resend.emails.send({
      from: FROM,
      to: [booking.email],
      subject,
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
