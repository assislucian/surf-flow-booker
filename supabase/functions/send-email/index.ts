import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);
const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET") as string;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Supabase will POST with a signed payload
  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  try {
    const wh = new Webhook(hookSecret);
    const evt = wh.verify(payload, headers) as any;

    const {
      user,
      email_data: { token_hash, redirect_to, email_action_type },
    } = evt;

    const supabase_url = Deno.env.get("SUPABASE_URL") ?? "";
    const actionUrl = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(redirect_to || "https://surfskate-hall.lovable.app/")}`;

    // Locale (German default)
    const localeRaw = (user?.user_metadata?.locale as string) || 'de';
    const locale = localeRaw === 'en' ? 'en' : 'de';

    // Localized subjects
    const subjects: Record<string, Record<string, string>> = {
      de: {
        signup: "E-Mail bestätigen – Surfskate Hall",
        magiclink: "Dein Magic Link – Surfskate Hall",
        recovery: "Passwort zurücksetzen – Surfskate Hall",
        email_change: "E-Mail-Adresse bestätigen – Surfskate Hall",
        email_change_current: "E-Mail-Änderung bestätigen – Surfskate Hall",
        reauthentication: "Erneut anmelden – Surfskate Hall",
        invite: "Einladung – Surfskate Hall",
      },
      en: {
        signup: "Confirm your email – Surfskate Hall",
        magiclink: "Your magic link – Surfskate Hall",
        recovery: "Reset your password – Surfskate Hall",
        email_change: "Confirm your email change – Surfskate Hall",
        email_change_current: "Confirm your email change – Surfskate Hall",
        reauthentication: "Re-authenticate – Surfskate Hall",
        invite: "Invitation – Surfskate Hall",
      },
    };
    const subject = (subjects[locale][email_action_type] || (locale === 'de' ? 'Aktion erforderlich – Surfskate Hall' : 'Action required – Surfskate Hall')) as string;

    const copy = locale === 'de'
      ? {
          greet: `Hallo${user?.email ? ` ${user.email}` : ''}! 👋`,
          instruction: 'Bitte klicke auf den Button, um fortzufahren.',
          cta: 'Weiter',
          fallback: 'Wenn der Button nicht funktioniert, kopiere folgenden Link in deinen Browser:',
          ignore: 'Wenn du dies nicht angefordert hast, kannst du diese E-Mail ignorieren.',
        }
      : {
          greet: `Hello${user?.email ? ` ${user.email}` : ''}! 👋`,
          instruction: 'Please click the button below to continue.',
          cta: 'Continue',
          fallback: "If the button doesn't work, copy and paste this link into your browser:",
          ignore: "If you didn't request this, you can safely ignore this email.",
        };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Surfskate Hall</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; background:#f8f9fa; padding:24px; color:#1f2937;">
          <table width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,0.08);overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(135deg, hsl(196,100%,28%) 0%, hsl(201,96%,40%) 100%); padding:32px; color:#fff; text-align:center;">
                <div style="font-size:42px;">🏄‍♂️</div>
                <h1 style="margin:8px 0 0; font-size:24px; font-weight:700;">Surfskate Hall</h1>
                <p style="margin:8px 0 0; opacity:0.95;">${subject}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 28px 8px; font-size:16px; line-height:1.6;">
                <p>${copy.greet}</p>
                <p>${copy.instruction}</p>
                <div style="text-align:center; margin:28px 0;">
                  <a href="${actionUrl}" style="display:inline-block; background:linear-gradient(135deg, hsl(196,100%,28%) 0%, hsl(201,96%,40%) 100%); color:#fff; text-decoration:none; padding:14px 24px; border-radius:999px; font-weight:600;">${copy.cta}</a>
                </div>
                <p style="color:#6b7280; font-size:14px;">${copy.fallback}</p>
                <div style="background:#f3f4f6; padding:12px; border-radius:10px; word-break:break-all; font-family:monospace; font-size:12px; color:#374151;">${actionUrl}</div>
                <p style="margin-top:24px; color:#6b7280; font-size:12px;">${copy.ignore}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px 28px; text-align:center; color:#9ca3af; font-size:12px;">
                <div>Surfskate Hall • lifabrasil.com</div>
              </td>
            </tr>
          </table>
        </body>
      </html>`;

    const { error } = await resend.emails.send({
      from: "Surfskate Hall <noreply@lifabrasil.com>",
      to: [user?.email].filter(Boolean) as string[],
      subject,
      html,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("send-email webhook error:", err?.message || err);
    return new Response(
      JSON.stringify({ error: err?.message || "Unknown error" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
