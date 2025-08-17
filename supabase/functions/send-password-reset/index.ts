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
    const { email, resetUrl, language = "de" } = await req.json();
    if (!email || !resetUrl) throw new Error("Missing email or resetUrl");

    const isGerman = language === "de";
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${isGerman ? "Passwort zurücksetzen" : "Reset Your Password"}</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, hsl(196, 100%, 28%) 0%, hsl(201, 96%, 40%) 100%); color: white; padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">🔐</div>
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Surfskate Hall</h1>
          <p style="margin: 15px 0 0; font-size: 20px; opacity: 0.95;">
            ${isGerman ? "Passwort zurücksetzen" : "Reset Your Password"}
          </p>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <p style="font-size: 20px; color: #2d3748; margin-bottom: 25px; text-align: center;">
            ${isGerman ? "Hallo! 👋" : "Hello! 👋"}
          </p>
          
          <p style="color: #4a5568; margin-bottom: 25px; font-size: 16px;">
            ${isGerman 
              ? "Du hast eine Passwort-Zurücksetzung für dein Surfskate Hall Konto angefordert. Klicke auf den Button unten, um ein neues Passwort festzulegen." 
              : "You requested a password reset for your Surfskate Hall account. Click the button below to set a new password."
            }
          </p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, hsl(196, 100%, 28%) 0%, hsl(201, 96%, 40%) 100%); color: white; padding: 18px 35px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 18px; box-shadow: 0 4px 15px rgba(196, 100%, 28%, 0.3);">
              ${isGerman ? "🔑 Neues Passwort festlegen" : "🔑 Set New Password"}
            </a>
          </div>
          
          <div style="background: #fef7e0; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #f59e0b;">
            <h4 style="margin: 0 0 10px; color: #92400e; font-size: 16px;">
              ⚠️ ${isGerman ? "Sicherheitshinweis:" : "Security Notice:"}
            </h4>
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              ${isGerman 
                ? "Dieser Link ist nur 24 Stunden gültig. Falls du diese Anfrage nicht gestellt hast, ignoriere diese E-Mail."
                : "This link is valid for 24 hours only. If you didn't request this reset, please ignore this email."
              }
            </p>
          </div>
          
          <p style="color: #718096; margin: 25px 0; text-align: center; font-size: 14px;">
            ${isGerman 
              ? "Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:"
              : "If the button doesn't work, copy this link to your browser:"
            }
          </p>
          
          <div style="background: #f7fafc; padding: 15px; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 12px; color: #4a5568; text-align: center;">
            ${resetUrl}
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <p style="font-size: 20px; background: linear-gradient(135deg, hsl(196, 100%, 28%) 0%, hsl(201, 96%, 40%) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;">
              ${isGerman ? "Stay safe! 🌊" : "Stay safe! 🌊"}
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
      ? "🔐 Passwort zurücksetzen – Surfskate Hall"
      : "🔐 Reset Your Password – Surfskate Hall";

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
    console.error("send-password-reset error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});