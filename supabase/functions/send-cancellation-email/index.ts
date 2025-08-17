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
    const { email, name, language = "de", subscription_end } = await req.json();
    if (!email) throw new Error("Missing email");

    const isGerman = language === "de";
    const endDate = subscription_end ? new Date(subscription_end).toLocaleDateString(isGerman ? 'de-DE' : 'en-US') : null;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${isGerman ? "Premium-Mitgliedschaft gekündigt" : "Premium Membership Canceled"}</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">😔</div>
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Surfskate Hall</h1>
          <p style="margin: 15px 0 0; font-size: 20px; opacity: 0.95;">
            ${isGerman ? "Mitgliedschaft gekündigt" : "Membership Canceled"}
          </p>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #2d3748; margin: 0 0 10px; font-size: 24px;">
              ${isGerman ? `Auf Wiedersehen, ${name || "Surfer"}! 👋` : `Goodbye, ${name || "Surfer"}! 👋`}
            </h2>
            <p style="color: #4a5568; font-size: 16px; margin: 0;">
              ${isGerman 
                ? "Deine Premium-Mitgliedschaft wurde erfolgreich gekündigt." 
                : "Your Premium membership has been successfully canceled."
              }
            </p>
          </div>
          
          ${endDate ? `
          <div style="background: #fef7e0; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #f59e0b;">
            <h3 style="margin: 0 0 15px; color: #92400e; font-size: 18px; text-align: center;">
              📅 ${isGerman ? "Wichtige Information:" : "Important Information:"}
            </h3>
            <p style="color: #92400e; margin: 0; text-align: center; font-size: 16px;">
              ${isGerman 
                ? `Du kannst deine Premium-Vorteile noch bis zum <strong>${endDate}</strong> nutzen.`
                : `You can still use your Premium benefits until <strong>${endDate}</strong>.`
              }
            </p>
          </div>
          ` : ''}
          
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 25px; border-radius: 12px; margin: 25px 0;">
            <h3 style="margin: 0 0 20px; color: #2d3748; font-size: 18px; text-align: center;">
              ${isGerman ? "Was passiert jetzt?" : "What happens now?"}
            </h3>
            <ul style="color: #4a5568; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>${isGerman ? "Keine weiteren Zahlungen werden abgebucht" : "No further payments will be charged"}</li>
              <li>${isGerman ? "Du kannst weiterhin normale Slots buchen" : "You can still book regular slots"}</li>
              <li>${isGerman ? "Dein Konto bleibt aktiv" : "Your account remains active"}</li>
              <li>${isGerman ? "Du kannst jederzeit wieder Premium werden" : "You can upgrade to Premium anytime"}</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${Deno.env.get("SUPABASE_URL")?.replace("https://aezvouallinpwtuaakes.supabase.co", "https://surfskate-hall.lovable.app") || "https://surfskate-hall.lovable.app"}" 
               style="display: inline-block; background: linear-gradient(135deg, hsl(196, 100%, 28%) 0%, hsl(201, 96%, 40%) 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(196, 100%, 28%, 0.3);">
              ${isGerman ? "🏄‍♂️ Weiter surfen" : "🏄‍♂️ Continue Surfing"}
            </a>
          </div>
          
          <div style="background: #e6fffa; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #14b8a6;">
            <h4 style="margin: 0 0 10px; color: #0f766e; font-size: 16px;">
              💬 ${isGerman ? "Feedback?" : "Feedback?"}
            </h4>
            <p style="color: #0f766e; margin: 0; font-size: 14px;">
              ${isGerman 
                ? "Wir würden gerne wissen, wie wir uns verbessern können. Falls du Feedback hast, schreib uns gerne!"
                : "We'd love to know how we can improve. If you have feedback, please reach out to us!"
              }
            </p>
          </div>
          
          <p style="color: #718096; margin: 25px 0; text-align: center; font-size: 14px;">
            ${isGerman 
              ? "Danke, dass du Teil unserer Community warst. Die Tür steht immer offen! 🌊" 
              : "Thank you for being part of our community. The door is always open! 🌊"
            }
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 25px; color: #a0aec0; font-size: 13px;">
          <p>Surfskate Hall | ${isGerman ? "Dein Flow-Spot" : "Your Flow Spot"}</p>
          <p style="margin-top: 10px;">
            <a href="https://surfskate-hall.lovable.app" style="color: #667eea; text-decoration: none;">surfskate-hall.lovable.app</a>
          </p>
        </div>
      </body>
      </html>
    `;

    const subject = isGerman 
      ? "😔 Premium-Mitgliedschaft gekündigt – Wir sehen uns!"
      : "😔 Premium Membership Canceled – See You Around!";

    const { error: sendError } = await resend.emails.send({
      from: "Surfskate Hall <noreply@lifabrasil.com>",
      to: [email],
      subject,
      html,
    });

    if (sendError) throw sendError;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("send-cancellation-email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});