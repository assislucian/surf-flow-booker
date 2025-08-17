import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { createPaymentSession } from "@/lib/payments";

const Checkout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pending, setPending] = React.useState<any | null>(null);

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

  return (
    <main className="container py-10">
      <Helmet>
        <title>Surfskate Hall – {t("checkout.title")}</title>
        <meta name="description" content={t("checkout.subtitle") as string} />
        <link rel="canonical" href="/checkout" />
      </Helmet>

      <h1 className="font-display text-3xl md:text-4xl font-semibold">{t("checkout.title")}</h1>
      <p className="mt-2 text-muted-foreground">
        {t("checkout.subtitle")}
      </p>

      {!pending ? (
        <div className="mt-6">
          <p className="text-destructive">{t("checkout.missing")}</p>
          <Button asChild className="mt-4">
            <Link to="/book">{t("checkout.back")}</Link>
          </Button>
        </div>
      ) : (
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border bg-card p-6 shadow-[var(--shadow-elegant)]">
            <h2 className="text-lg font-medium">{t("booking.title")}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">{t("checkout.summary.date")}</dt>
              <dd>{pending.date}</dd>
              <dt className="text-muted-foreground">{t("checkout.summary.slot")}</dt>
              <dd>{Array.isArray(pending.slots) ? pending.slots.join(", ") : pending.slot}</dd>
              <dt className="text-muted-foreground">{t("checkout.summary.name")}</dt>
              <dd>{pending.name}</dd>
              <dt className="text-muted-foreground">{t("checkout.summary.email")}</dt>
              <dd>{pending.email}</dd>
              <dt className="text-muted-foreground">{t("checkout.summary.level")}</dt>
              <dd>{pending.level}</dd>
              {pending.notes && (
                <>
                  <dt className="text-muted-foreground">{t("checkout.summary.notes")}</dt>
                  <dd>{pending.notes}</dd>
                </>
              )}
            </dl>
          </article>

          <aside>
            <div className="flex gap-3">
              <Button onClick={handlePay} className="flex-1">
                {t("checkout.proceed")}
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => navigate("/book")}>{t("checkout.back")}</Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {t("checkout.paymentNote")}
            </p>
          </aside>
        </section>
      )}
    </main>
  );
};

export default Checkout;
