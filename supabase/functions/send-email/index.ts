import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");
const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET") || "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const FROM = Deno.env.get("RESEND_FROM") || "Surfskate Hall <noreply@lifabrasil.com>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payloadText = await req.text();
    const headers = Object.fromEntries(req.headers);

    if (!hookSecret) {
      throw new Error("Missing SEND_EMAIL_HOOK_SECRET environment variable");
    }

    const wh = new Webhook(hookSecret);
    const evt = wh.verify(payloadText, headers) as any;

    const user = evt.user as { email: string };
    const emailData = evt.email_data as {
      token: string;
      token_hash: string;
      redirect_to: string;
      email_action_type: string; // signup | magiclink | recovery | email_change
      site_url: string;
      token_new?: string;
      token_hash_new?: string;
    };

    // Build the verification URL (for confirm, magic link and recovery flows)
    // Supabase expects token_hash and type and forwards redirect_to
    const verifyUrl = `${supabaseUrl}/auth/v1/verify?token=${encodeURIComponent(
      emailData.token_hash
    )}&type=${encodeURIComponent(emailData.email_action_type)}&redirect_to=${encodeURIComponent(
      emailData.redirect_to
    )}`;

    const isGerman = (emailData.redirect_to || "").includes("/de") || false;

    // Subjects per action type
    const subjectMap: Record<string, { de: string; en: string }> = {
      signup: {
        de: "Bestätige deine E-Mail – Surfskate Hall",
        en: "Confirm your email – Surfskate Hall",
      },
      magiclink: {
        de: "Dein Login-Link – Surfskate Hall",
        en: "Your login link – Surfskate Hall",
      },
      recovery: {
        de: "Passwort zurücksetzen – Surfskate Hall",
        en: "Reset your password – Surfskate Hall",
      },
      email_change: {
        de: "E-Mail-Adresse bestätigen – Surfskate Hall",
        en: "Confirm email change – Surfskate Hall",
      },
    };

    const subjectCfg = subjectMap[emailData.email_action_type] || subjectMap.signup;
    const subject = isGerman ? subjectCfg.de : subjectCfg.en;

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${subject}</title>
        </head>
        <body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background:#f7fafc; padding:24px; color:#1f2937;">
          <table role="presentation" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,.06);">
            <tr>
              <td style="padding:28px 24px; background:linear-gradient(135deg, hsl(196, 100%, 28%), hsl(201, 96%, 40%)); color:#fff;">
                <h1 style="margin:0; font-size:24px;">Surfskate Hall</h1>
                <p style="margin:8px 0 0; opacity:.95;">${subject}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 16px;">${isGerman ? "Hallo!" : "Hello!"}</p>
                <p style="margin:0 0 20px; line-height:1.6;">
                  ${isGerman
                    ? "Klicke auf den Button, um fortzufahren."
                    : "Click the button below to continue."}
                </p>
                <p style="text-align:center; margin:28px 0;">
                  <a href="${verifyUrl}" style="display:inline-block; background:linear-gradient(135deg, hsl(196, 100%, 28%), hsl(201, 96%, 40%)); color:#fff; text-decoration:none; padding:14px 22px; border-radius:999px; font-weight:600;">${
                    isGerman ? "Weiter" : "Continue"
                  }</a>
                </p>
                <p style="margin:0 0 8px; color:#6b7280; font-size:12px;">
                  ${isGerman
                    ? "Falls der Button nicht funktioniert, nutze diesen Link:"
                    : "If the button doesn't work, use this link:"}
                </p>
                <p style="word-break:break-all; font-size:12px; color:#374151;">${verifyUrl}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px; background:#f9fafb; color:#9ca3af; font-size:12px; text-align:center;">
                Surfskate Hall • Wiesbaden
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const { error: sendError } = await resend.emails.send({
      from: FROM,
      to: [user.email],
      subject,
      html,
    });

    if (sendError) throw sendError;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("send-email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});