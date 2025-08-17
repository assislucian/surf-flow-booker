import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { createPaymentSession } from "@/lib/payments";

const Checkout: React.FC = () => {
  const { t, i18n, ready } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pending, setPending] = React.useState<any | null>(null);

  // Wait for translations to load
  if (!ready) {
    return <div className="container py-10">Loading...</div>;
  }

  React.useEffect(() => {
    const raw = sessionStorage.getItem("pending_booking");
    if (raw) setPending(JSON.parse(raw));
    
    // Clear session storage if coming from successful payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from') === 'success') {
      sessionStorage.removeItem("pending_booking");
    }
  }, []);

  const handlePay = async () => {
    if (!pending) return;
    try {
      const { url } = await createPaymentSession(pending);
      // Open Stripe checkout in a new tab
      window.open(url, "_blank");
    } catch (e: any) {
      toast({
        title: i18n.language === "de" ? "Zahlung fehlgeschlagen" : "Payment failed",
        description: e?.message || (i18n.language === "de" ? "Bitte später erneut versuchen." : "Please try again later."),
      });
    }
  };

  // Force re-render when language changes
  const currentLang = i18n.language;

  return (
    <main className="container py-10" key={currentLang}>
      <Helmet>
        <title>Surfskate Hall – {t("checkout.title")}</title>
        <meta name="description" content={t("checkout.subtitle") as string} />
        <link rel="canonical" href="/checkout" />
      </Helmet>

      <h1 className="font-display text-3xl md:text-4xl font-semibold">
        {t("checkout.title", "Checkout")}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {t("checkout.subtitle", "Please review your information and proceed with payment")}
      </p>

      {!pending ? (
        <div className="mt-6">
          <p className="text-destructive">
            {t("checkout.missing", "No pending booking found")}
          </p>
          <Button asChild className="mt-4">
            <Link to="/book">{t("checkout.back", "Back to Booking")}</Link>
          </Button>
        </div>
      ) : (
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border bg-card p-6 shadow-[var(--shadow-elegant)]">
            <h2 className="text-lg font-medium">{t("booking.title", "Booking Details")}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">{t("checkout.summary.date", "Date")}</dt>
              <dd>{pending.date}</dd>
              <dt className="text-muted-foreground">{t("checkout.summary.slot", "Time Slot")}</dt>
              <dd>{Array.isArray(pending.slots) ? pending.slots.join(", ") : pending.slot}</dd>
              <dt className="text-muted-foreground">{t("checkout.summary.name", "Name")}</dt>
              <dd>{pending.name}</dd>
              <dt className="text-muted-foreground">{t("checkout.summary.email", "Email")}</dt>
              <dd>{pending.email}</dd>
              <dt className="text-muted-foreground">{t("checkout.summary.level", "Level")}</dt>
              <dd>{pending.level}</dd>
              {pending.notes && (
                <>
                  <dt className="text-muted-foreground">{t("checkout.summary.notes", "Notes")}</dt>
                  <dd>{pending.notes}</dd>
                </>
              )}
            </dl>
          </article>

          <aside>
            <div className="flex gap-3">
              <Button onClick={handlePay} className="flex-1">
                {t("checkout.proceed", "Proceed to Payment")}
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => navigate("/book")}>
                {t("checkout.back", "Back to Booking")}
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {t("checkout.paymentNote", "After successful payment you'll be redirected and your booking will be confirmed.")}
            </p>
          </aside>
        </section>
      )}
    </main>
  );
};

export default Checkout;
