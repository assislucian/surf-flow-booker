import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import { Resend } from "npm:resend@4.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.5.0';
import { AuthEmail } from './_templates/auth-email.tsx';

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

  // Supabase will POST with either a signed payload or an Authorization bearer secret
  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  try {
    const authHeader = req.headers.get("authorization");
    let evt: any;

    if (authHeader && authHeader === `Bearer ${hookSecret}`) {
      // Direct bearer verification: payload is plain JSON
      evt = JSON.parse(payload);
    } else {
      // Signature verification via Standard Webhooks headers
      const wh = new Webhook(hookSecret);
      evt = wh.verify(payload, headers) as any;
    }

    const {
      user,
      email_data: { token_hash, redirect_to, email_action_type },
    } = evt;

    const supabase_url = Deno.env.get("SUPABASE_URL") ?? "";
    const defaultRedirect = email_action_type === 'recovery'
      ? 'https://surfskate-hall.lovable.app/reset-password'
      : 'https://surfskate-hall.lovable.app/';
    const actionUrl = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(redirect_to || defaultRedirect)}`;

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

    const html = await renderAsync(
      React.createElement(AuthEmail, {
        actionUrl,
        subject,
        greet: copy.greet,
        instruction: copy.instruction,
        cta: copy.cta,
        fallback: copy.fallback,
        ignore: copy.ignore,
      })
    );

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
