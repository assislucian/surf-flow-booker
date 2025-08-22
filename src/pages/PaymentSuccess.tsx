import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { sendConfirmationEmail } from "@/lib/emails";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [details, setDetails] = React.useState<any[] | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) return;

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { sessionId },
        });
        if (error) throw error;
        const bookings = (data as any)?.bookings as any[] | undefined;
        if (bookings && bookings.length) {
          setDetails(bookings);
          // Build a consolidated booking payload for email
          const first = bookings[0];
          const combined = {
            name: first.name,
            email: first.email,
            phone: first.phone ?? "",
            level: first.level ?? "",
            notes: first.notes ?? "",
            date: first.date,
            slots: bookings.map((b: any) => b.slot),
            createdAt: Date.now(),
          };
          // Send confirmation email (non-blocking)
          sendConfirmationEmail(combined as any, i18n.language).catch((err) => console.error("email error", err));
        }
      } catch (err) {
        console.error("verify-payment error", err);
      } finally {
        sessionStorage.removeItem("pending_booking");
      }
    })();
  }, []);

  return (
    <main className="container py-10">
      <Helmet>
        <title>Surfskate Hall – {t("payment.success.title", { defaultValue: "Zahlung erfolgreich" })}</title>
        <meta name="description" content={t("payment.success.desc", { defaultValue: "Deine Buchung ist bestätigt." }) as string} />
        <link rel="canonical" href="/payment-success" />
      </Helmet>

      <h1 className="font-display text-3xl md:text-4xl font-semibold">{t("payment.success.title", { defaultValue: "Zahlung erfolgreich" })}</h1>
      <p className="mt-2 text-muted-foreground">
        {t("payment.success.desc", { defaultValue: "Deine Buchung ist bestätigt. Eine Bestätigungsmail wird gesendet." })}
      </p>

      {details && details.length > 0 && (
        <article className="mt-6 rounded-xl border bg-card p-6 shadow-[var(--shadow-elegant)]">
          <h2 className="text-lg font-medium">{i18n.language === 'de' ? 'Buchungsdetails' : 'Booking details'}</h2>
          <ul className="mt-2 text-sm text-muted-foreground">
            {details.map((b: any, i: number) => (
              <li key={i}>{b.date} – {b.slot}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm">{details[0].name} · {details[0].email}</p>
        </article>
      )}

      <Button asChild className="mt-6">
        <Link to="/">{i18n.language === 'de' ? 'Zur Startseite' : 'Back to Home'}</Link>
      </Button>
    </main>
  );
};

export default PaymentSuccess;
