import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");
const FROM = Deno.env.get("RESEND_FROM") || "Surfskate Hall <onboarding@resend.dev>";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, language = "de", subscription_tier = "Premium" } = await req.json();
    if (!email) throw new Error("Missing email");

    const isGerman = language === "de";
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${isGerman ? "Premium Mitgliedschaft aktiviert!" : "Premium Membership Activated!"}</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, hsl(196, 100%, 28%) 0%, hsl(201, 96%, 40%) 100%); color: white; padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -20px; right: -20px; background: rgba(255,255,255,0.1); width: 100px; height: 100px; border-radius: 50%; transform: rotate(45deg);"></div>
          <div style="position: absolute; bottom: -30px; left: -30px; background: rgba(255,255,255,0.1); width: 80px; height: 80px; border-radius: 50%;"></div>
          <div style="position: relative; z-index: 2;">
            <div style="font-size: 48px; margin-bottom: 15px;">👑</div>
            <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Surfskate Hall</h1>
            <div style="background: rgba(255,255,255,0.2); padding: 8px 20px; border-radius: 20px; display: inline-block; margin-top: 15px;">
              <span style="font-size: 18px; font-weight: 600;">
                ${isGerman ? "Premium Mitgliedschaft" : "Premium Membership"}
              </span>
            </div>
          </div>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #2d3748; margin: 0 0 10px; font-size: 28px;">
              ${isGerman ? `Willkommen ${name || "Premium Member"}! 🎉` : `Welcome ${name || "Premium Member"}! 🎉`}
            </h2>
            <p style="color: #4a5568; font-size: 18px; margin: 0;">
              ${isGerman 
                ? "Deine Premium Mitgliedschaft ist jetzt aktiv!" 
                : "Your Premium membership is now active!"
              }
            </p>
          </div>
          
          <div style="background: linear-gradient(135deg, #fef7e0 0%, #f0f9ff 100%); padding: 30px; border-radius: 15px; border: 1px solid #e2e8f0; margin: 30px 0;">
            <h3 style="margin: 0 0 25px; color: #234e52; font-size: 20px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 10px;">
              <span style="font-size: 24px;">⭐</span>
              ${isGerman ? "Deine Premium-Vorteile:" : "Your Premium Benefits:"}
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
              <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 4px solid hsl(196, 100%, 28%);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                  <div style="background: linear-gradient(135deg, hsl(196, 100%, 28%) 0%, hsl(201, 96%, 40%) 100%); color: white; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🏄‍♂️</div>
                  <div style="font-weight: 600; color: #2d3748; font-size: 16px;">
                    ${isGerman ? "Unbegrenzte Slots" : "Unlimited Slots"}
                  </div>
                </div>
                <p style="color: #4a5568; margin: 0; font-size: 14px;">
                  ${isGerman ? "Täglich so viele Sessions wie du möchtest" : "As many sessions as you want daily"}
                </p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 4px solid hsl(196, 100%, 28%);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                  <div style="background: linear-gradient(135deg, hsl(196, 100%, 28%) 0%, hsl(201, 96%, 40%) 100%); color: white; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px;">⚡</div>
                  <div style="font-weight: 600; color: #2d3748; font-size: 16px;">
                    ${isGerman ? "Prioritäts-Buchung" : "Priority Booking"}
                  </div>
                </div>
                <p style="color: #4a5568; margin: 0; font-size: 14px;">
                  ${isGerman ? "Erste Wahl bei begehrten Zeitslots" : "First choice on popular time slots"}
                </p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 4px solid hsl(196, 100%, 28%);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                  <div style="background: linear-gradient(135deg, hsl(196, 100%, 28%) 0%, hsl(201, 96%, 40%) 100%); color: white; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🔄</div>
                  <div style="font-weight: 600; color: #2d3748; font-size: 16px;">
                    ${isGerman ? "Kostenlose Stornierung" : "Free Cancellation"}
                  </div>
                </div>
                <p style="color: #4a5568; margin: 0; font-size: 14px;">
                  ${isGerman ? "Flexible Änderungen ohne Zusatzkosten" : "Flexible changes without additional costs"}
                </p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 4px solid hsl(196, 100%, 28%);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                  <div style="background: linear-gradient(135deg, hsl(196, 100%, 28%) 0%, hsl(201, 96%, 40%) 100%); color: white; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px;">👥</div>
                  <div style="font-weight: 600; color: #2d3748; font-size: 16px;">
                    ${isGerman ? "Premium Community" : "Premium Community"}
                  </div>
                </div>
                <p style="color: #4a5568; margin: 0; font-size: 14px;">
                  ${isGerman ? "Exklusiver Zugang zu Events & Workshops" : "Exclusive access to events & workshops"}
                </p>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${Deno.env.get("SUPABASE_URL")?.replace("https://aezvouallinpwtuaakes.supabase.co", "https://surfskate-hall.lovable.app") || "https://surfskate-hall.lovable.app"}/profile" 
               style="display: inline-block; background: linear-gradient(135deg, hsl(196, 100%, 28%) 0%, hsl(201, 96%, 40%) 100%); color: white; padding: 18px 35px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 18px; box-shadow: 0 4px 15px rgba(196, 100%, 28%, 0.3); transition: transform 0.2s;">
              ${isGerman ? "🏄‍♂️ Mein Profil verwalten" : "🏄‍♂️ Manage My Profile"}
            </a>
          </div>
          
          <div style="background: linear-gradient(135deg, #e6fffa 0%, #f0f9ff 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #e2e8f0;">
            <h4 style="margin: 0 0 15px; color: #234e52; font-size: 18px; text-align: center;">
              ${isGerman ? "🚀 Los geht's!" : "🚀 Let's Get Started!"}
            </h4>
            <ul style="color: #2d5a67; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>${isGerman ? "Buche jetzt deine erste Premium-Session" : "Book your first premium session now"}</li>
              <li>${isGerman ? "Entdecke exklusive Community-Features" : "Discover exclusive community features"}</li>
              <li>${isGerman ? "Nimm an Premium-Events teil" : "Join premium events"}</li>
              <li>${isGerman ? "Verwalte dein Abonnement im Kundenprofil" : "Manage your subscription in your customer profile"}</li>
            </ul>
          </div>
          
          <p style="color: #718096; margin: 25px 0; text-align: center; font-size: 14px;">
            ${isGerman 
              ? "Du kannst dein Abonnement jederzeit in deinem Profil verwalten. Welcome to the Premium experience! 🌊" 
              : "You can manage your subscription anytime in your profile. Welcome to the Premium experience! 🌊"
            }
          </p>
          
          <div style="text-align: center; margin: 35px 0;">
            <p style="font-size: 22px; background: linear-gradient(135deg, hsl(196, 100%, 28%) 0%, hsl(201, 96%, 40%) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; margin: 0;">
              ${isGerman ? "Let's ride this wave together! 🌊👑" : "Let's ride this wave together! 🌊👑"}
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 25px; color: #a0aec0; font-size: 13px;">
          <p>Surfskate Hall Premium | ${isGerman ? "Dein Premium Flow-Spot" : "Your Premium Flow Spot"}</p>
          <p style="margin-top: 10px;">
            <a href="https://surfskate-hall.lovable.app" style="color: #667eea; text-decoration: none;">surfskate-hall.lovable.app</a>
          </p>
        </div>
      </body>
      </html>
    `;

    const subject = isGerman 
      ? "👑 Premium Mitgliedschaft aktiviert – Welcome to the VIP Experience!"
      : "👑 Premium Membership Activated – Welcome to the VIP Experience!";

    const { error: sendError } = await resend.emails.send({
      from: FROM,
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
    console.error("send-subscription-email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});