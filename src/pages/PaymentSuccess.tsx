import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [details, setDetails] = React.useState<any | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) return;

    (async () => {
      try {
        console.log("PaymentSuccess: Verifying payment with sessionId:", sessionId);
        
        // Get current session to send auth token
        const { data: { session } } = await supabase.auth.getSession();
        const headers: any = {};
        
        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
          console.log("PaymentSuccess: Sending auth token with request");
        } else {
          console.log("PaymentSuccess: No auth token available");
        }

        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { sessionId },
          headers
        });

        if (error) {
          console.error("PaymentSuccess: verify-payment error:", error);
          throw error;
        }

        const booking = (data as any)?.booking;
        if (booking) {
          console.log("PaymentSuccess: Payment verified successfully:", booking);
          setDetails(booking);
        }
      } catch (err) {
        console.error("PaymentSuccess: verify-payment error", err);
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

      {details && (
        <article className="mt-6 rounded-xl border bg-card p-6 shadow-[var(--shadow-elegant)]">
          <h2 className="text-lg font-medium">{i18n.language === 'de' ? 'Buchungsdetails' : 'Booking details'}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{details.date} – {Array.isArray(details.slots) 
            ? details.slots.map(slot => {
              const [hour] = slot.split(':');
              const startHour = parseInt(hour);
              const endHour = startHour + 1;
              const endHourStr = endHour.toString().padStart(2, "0");
              return `${slot} - ${endHourStr}:00`;
            }).join(", ") 
            : (details.slot || "")}</p>
          <p className="mt-1 text-sm">{details.name} · {details.email}</p>
        </article>
      )}

      <Button asChild className="mt-6">
        <Link to="/">{i18n.language === 'de' ? 'Zur Startseite' : 'Back to Home'}</Link>
      </Button>
    </main>
  );
};

export default PaymentSuccess;
