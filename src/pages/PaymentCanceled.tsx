import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PaymentCanceled: React.FC = () => {
  const { t } = useTranslation();
  return (
    <main className="container py-10">
      <Helmet>
        <title>Surfskate Hall – {t("payment.canceled.title", { defaultValue: "Zahlung abgebrochen" })}</title>
        <meta name="description" content={t("payment.canceled.desc", { defaultValue: "Du kannst die Zahlung erneut starten." }) as string} />
        <link rel="canonical" href="/payment-canceled" />
      </Helmet>

      <h1 className="font-display text-3xl md:text-4xl font-semibold">{t("payment.canceled.title", { defaultValue: "Zahlung abgebrochen" })}</h1>
      <p className="mt-2 text-muted-foreground">{t("payment.canceled.desc", { defaultValue: "Du kannst die Zahlung jederzeit erneut starten." })}</p>

      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link to="/checkout">{t("checkout.proceed", { defaultValue: "Zur Zahlung" })}</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/book">{t("checkout.back", { defaultValue: "Zurück zur Buchung" })}</Link>
        </Button>
      </div>
    </main>
  );
};

export default PaymentCanceled;
