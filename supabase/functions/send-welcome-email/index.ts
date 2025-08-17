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
    const { email, name, language = "de" } = await req.json();
    if (!email) throw new Error("Missing email");

    const isGerman = language === "de";
    
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
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">🏄‍♂️ Surfskate Hall</h1>
          <p style="margin: 15px 0 0; font-size: 20px; opacity: 0.95;">
            ${isGerman ? "Willkommen in der Community!" : "Welcome to the Community!"}
          </p>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <p style="font-size: 20px; color: #2d3748; margin-bottom: 25px; text-align: center;">
            ${isGerman ? `Hallo ${name || "Surfskater"}! 🤙` : `Hello ${name || "Surfer"}! 🤙`}
          </p>
          
          <p style="color: #4a5568; margin-bottom: 25px; font-size: 16px; text-align: center;">
            ${isGerman 
              ? "Herzlich willkommen bei Surfskate Hall! Du bist jetzt Teil unserer globalen Surfskate-Community." 
              : "Welcome to Surfskate Hall! You're now part of our global surfskate community."
            }
          </p>
          
          <div style="background: linear-gradient(135deg, #e6fffa 0%, #f0f9ff 100%); padding: 25px; border-radius: 12px; border-left: 4px solid hsl(196, 100%, 28%); margin: 30px 0;">
            <h3 style="margin: 0 0 20px; color: #234e52; font-size: 18px; text-align: center;">
              ${isGerman ? "🌊 Was dich erwartet:" : "🌊 What awaits you:"}
            </h3>
            <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">
              <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; min-width: 120px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="font-size: 24px; margin-bottom: 8px;">🏄‍♂️</div>
                <div style="font-size: 14px; color: #2d5a67; font-weight: 600;">
                  ${isGerman ? "Premium Hall" : "Premium Hall"}
                </div>
              </div>
              <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; min-width: 120px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="font-size: 24px; margin-bottom: 8px;">👥</div>
                <div style="font-size: 14px; color: #2d5a67; font-weight: 600;">
                  ${isGerman ? "Community" : "Community"}
                </div>
              </div>
              <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; min-width: 120px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="font-size: 24px; margin-bottom: 8px;">⭐</div>
                <div style="font-size: 14px; color: #2d5a67; font-weight: 600;">
                  ${isGerman ? "Premium Features" : "Premium Features"}
                </div>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${Deno.env.get("SUPABASE_URL")?.replace("https://aezvouallinpwtuaakes.supabase.co", "https://surfskate-hall.lovable.app") || "https://surfskate-hall.lovable.app"}" 
               style="display: inline-block; background: linear-gradient(135deg, hsl(196, 100%, 28%) 0%, hsl(201, 96%, 40%) 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(196, 100%, 28%, 0.3); transition: transform 0.2s;">
              ${isGerman ? "🚀 Jetzt loslegen" : "🚀 Get Started"}
            </a>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid #e2e8f0;">
            <h4 style="margin: 0 0 15px; color: #2d3748; font-size: 16px;">
              ${isGerman ? "💎 Deine nächsten Schritte:" : "💎 Your next steps:"}
            </h4>
            <ul style="color: #4a5568; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>${isGerman ? "Erkunde unsere Premium-Features" : "Explore our premium features"}</li>
              <li>${isGerman ? "Buche deine erste Session" : "Book your first session"}</li>
              <li>${isGerman ? "Tritt unserer Community bei" : "Join our community"}</li>
              <li>${isGerman ? "Teile deine Surfskate-Erfahrungen" : "Share your surfskate experiences"}</li>
            </ul>
          </div>
          
          <p style="color: #718096; margin: 25px 0; text-align: center; font-size: 14px;">
            ${isGerman 
              ? "Bei Fragen sind wir jederzeit für dich da. Lass uns gemeinsam diese Welle reiten! 🌊" 
              : "If you have any questions, we're always here for you. Let's ride this wave together! 🌊"
            }
          </p>
          
          <div style="text-align: center; margin: 35px 0;">
            <p style="font-size: 20px; background: linear-gradient(135deg, hsl(196, 100%, 28%) 0%, hsl(201, 96%, 40%) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;">
              ${isGerman ? "Ride the wave! 🌊" : "Ride the wave! 🌊"}
            </p>
          </div>
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
      ? "🏄‍♂️ Willkommen bei Surfskate Hall – Deine Community wartet!"
      : "🏄‍♂️ Welcome to Surfskate Hall – Your community awaits!";

    const { error: sendError } = await resend.emails.send({
      from: "Surfskate Hall <welcome@lifabrasil.com>",
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