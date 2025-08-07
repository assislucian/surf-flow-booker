import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PaymentSuccess: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [details, setDetails] = React.useState<any | null>(null);

  React.useEffect(() => {
    const raw = sessionStorage.getItem("pending_booking");
    if (!raw) return;
    const pending = JSON.parse(raw);

    // Persist booking (demo): finalize after successful payment
    const key = `${pending.date}|${pending.slot}`;
    const bookings = JSON.parse(localStorage.getItem("bookings") || "{}");
    if (!bookings[key]) {
      bookings[key] = pending;
      localStorage.setItem("bookings", JSON.stringify(bookings));
    }

    sessionStorage.removeItem("pending_booking");
    setDetails(pending);
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
          <p className="mt-2 text-sm text-muted-foreground">{details.date} – {details.slot}</p>
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
