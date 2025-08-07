import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";

const Checkout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pending, setPending] = React.useState<any | null>(null);

  React.useEffect(() => {
    const raw = sessionStorage.getItem("pending_booking");
    if (raw) setPending(JSON.parse(raw));
  }, []);

  const handlePay = async () => {
    // Placeholder: integrate Stripe via Supabase Edge Function `create-payment`
    // Once connected, call: const { data } = await supabase.functions.invoke('create-payment', { body: { pending } })
    // Then: window.open(data.url, '_blank')
    toast({
      title: i18n.language === "de" ? "Stripe noch nicht verbunden" : "Stripe not connected yet",
      description:
        i18n.language === "de"
          ? "Verbinden Sie Supabase und richten Sie den Edge Function 'create-payment' ein."
          : "Connect Supabase and set up the 'create-payment' edge function.",
    });
  };

  return (
    <main className="container py-10">
      <Helmet>
        <title>Surfskate Hall – {t("checkout.title", { defaultValue: "Zur Kasse" })}</title>
        <meta name="description" content={t("checkout.subtitle", { defaultValue: "Bitte prüfe deine Angaben und starte die Zahlung." }) as string} />
        <link rel="canonical" href="/checkout" />
      </Helmet>

      <h1 className="font-display text-3xl md:text-4xl font-semibold">{t("checkout.title", { defaultValue: "Zur Kasse" })}</h1>
      <p className="mt-2 text-muted-foreground">
        {t("checkout.subtitle", { defaultValue: "Bitte prüfe deine Angaben und starte die Zahlung." })}
      </p>

      {!pending ? (
        <div className="mt-6">
          <p className="text-destructive">{t("checkout.missing", { defaultValue: "Keine ausstehende Buchung gefunden." })}</p>
          <Button asChild className="mt-4">
            <Link to="/book">{t("checkout.back", { defaultValue: "Zurück zur Buchung" })}</Link>
          </Button>
        </div>
      ) : (
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border bg-card p-6 shadow-[var(--shadow-elegant)]">
            <h2 className="text-lg font-medium">{t("booking.title")}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">{t("checkout.summary.date", { defaultValue: "Datum" })}</dt>
              <dd>{pending.date}</dd>
              <dt className="text-muted-foreground">{t("checkout.summary.slot", { defaultValue: "Zeitfenster" })}</dt>
              <dd>{pending.slot}</dd>
              <dt className="text-muted-foreground">{t("checkout.summary.name", { defaultValue: "Name" })}</dt>
              <dd>{pending.name}</dd>
              <dt className="text-muted-foreground">{t("checkout.summary.email", { defaultValue: "E-Mail" })}</dt>
              <dd>{pending.email}</dd>
              <dt className="text-muted-foreground">{t("checkout.summary.level", { defaultValue: "Level" })}</dt>
              <dd>{pending.level}</dd>
              {pending.notes && (
                <>
                  <dt className="text-muted-foreground">{t("checkout.summary.notes", { defaultValue: "Notizen" })}</dt>
                  <dd>{pending.notes}</dd>
                </>
              )}
            </dl>
          </article>

          <aside>
            <div className="flex gap-3">
              <Button onClick={handlePay} className="flex-1">
                {t("checkout.proceed", { defaultValue: "Zur Zahlung" })}
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => navigate("/book")}>{t("checkout.back", { defaultValue: "Zurück zur Buchung" })}</Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {i18n.language === "de"
                ? "Nach erfolgreicher Zahlung wirst du zurückgeleitet und die Buchung wird bestätigt."
                : "After successful payment you'll be redirected and your booking will be confirmed."}
            </p>
          </aside>
        </section>
      )}
    </main>
  );
};

export default Checkout;
