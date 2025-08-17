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
    const { email, name, language = "de", subscription_tier = "Premium" } = await req.json();
    if (!email) throw new Error("Missing email");

    const isGerman = language === "de";
    const displayName = name || email.split('@')[0];
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${isGerman ? "Willkommen bei Surfskate Hall!" : "Welcome to Surfskate Hall!"}</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, hsl(196, 100%, 28%) 0%, hsl(201, 96%, 40%) 100%); color: white; padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">🏄‍♂️</div>
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Surfskate Hall</h1>
          <p style="margin: 15px 0 0; font-size: 20px; opacity: 0.95;">
            ${isGerman ? "Premium-Mitglied!" : "Premium Member!"}
          </p>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #2d3748; margin: 0 0 10px; font-size: 24px;">
              ${isGerman ? `Willkommen, ${displayName}! 🎉` : `Welcome, ${displayName}! 🎉`}
            </h2>
            <p style="color: #4a5568; font-size: 16px; margin: 0;">
              ${isGerman 
                ? "Du bist jetzt Premium-Mitglied und hast Zugang zu allen exklusiven Vorteilen!" 
                : "You're now a Premium member with access to all exclusive benefits!"
              }
            </p>
          </div>
          
          <div style="background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #14b8a6;">
            <h3 style="margin: 0 0 20px; color: #0f766e; font-size: 18px; text-align: center;">
              ✨ ${isGerman ? "Deine Premium-Vorteile:" : "Your Premium Benefits:"}
            </h3>
            <ul style="color: #0f766e; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>${isGerman ? "Unbegrenzter Zugang zur Halle" : "Unlimited hall access"}</li>
              <li>${isGerman ? "Vorrangige Buchung von Slots" : "Priority slot booking"}</li>
              <li>${isGerman ? "10% Rabatt auf Equipment" : "10% equipment discount"}</li>
              <li>${isGerman ? "Kostenlose Workshops und Events" : "Free workshops and events"}</li>
              <li>${isGerman ? "Exklusiver Community-Zugang" : "Exclusive community access"}</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${Deno.env.get("SUPABASE_URL")?.replace("https://aezvouallinpwtuaakes.supabase.co", "https://surfskate-hall.lovable.app") || "https://surfskate-hall.lovable.app"}/book" 
               style="display: inline-block; background: linear-gradient(135deg, hsl(196, 100%, 28%) 0%, hsl(201, 96%, 40%) 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(196, 100%, 28%, 0.3); margin-right: 10px;">
              ${isGerman ? "🏄‍♂️ Ersten Slot buchen" : "🏄‍♂️ Book Your First Slot"}
            </a>
            <a href="${Deno.env.get("SUPABASE_URL")?.replace("https://aezvouallinpwtuaakes.supabase.co", "https://surfskate-hall.lovable.app") || "https://surfskate-hall.lovable.app"}/profile" 
               style="display: inline-block; background: transparent; color: hsl(196, 100%, 28%); padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; border: 2px solid hsl(196, 100%, 28%); margin-top: 10px;">
              ${isGerman ? "👤 Profil verwalten" : "👤 Manage Profile"}
            </a>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #0ea5e9;">
            <h4 style="margin: 0 0 10px; color: #0c4a6e; font-size: 16px;">
              💡 ${isGerman ? "Erste Schritte:" : "Getting Started:"}
            </h4>
            <p style="color: #0c4a6e; margin: 0; font-size: 14px;">
              ${isGerman 
                ? "Besuche dein Premium-Dashboard, um Slots zu buchen und deine Mitgliedschaft zu verwalten. Bei Fragen sind wir da!"
                : "Visit your Premium dashboard to book slots and manage your membership. We're here if you have any questions!"
              }
            </p>
          </div>
          
          <p style="color: #718096; margin: 25px 0; text-align: center; font-size: 14px;">
            ${isGerman 
              ? "Danke, dass du Teil unserer Surfskate-Community bist. Let's ride the waves! 🌊" 
              : "Thank you for joining our surfskate community. Let's ride the waves! 🌊"
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
      ? `🎉 Willkommen bei Premium, ${displayName}! Dein Flow beginnt jetzt`
      : `🎉 Welcome to Premium, ${displayName}! Your Flow Starts Now`;

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
    console.error("send-welcome-email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});