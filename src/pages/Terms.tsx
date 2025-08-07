import * as React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

const Terms: React.FC = () => {
  const { t } = useTranslation();
  const title = t("legal.terms.title", { defaultValue: "Allgemeine Geschäftsbedingungen" }) as string;
  const desc = t("legal.terms.desc", { defaultValue: "AGB für Buchungen und Nutzung der Halle." }) as string;

  return (
    <main className="container py-10">
      <Helmet>
        <title>Surfskate Hall – {title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href="/agb" />
      </Helmet>

      <h1 className="font-display text-3xl md:text-4xl font-semibold">{title}</h1>
      <section className="mt-6 space-y-4 text-sm">
        <h2 className="text-lg font-medium">{t("legal.terms.bookings", { defaultValue: "Buchungen & Zahlung" })}</h2>
        <p>{t("legal.terms.bookingsText", { defaultValue: "Buchungen werden erst mit Zahlung wirksam. Preise inkl. MwSt." })}</p>
        <h2 className="text-lg font-medium">{t("legal.terms.cancellations", { defaultValue: "Stornierung" })}</h2>
        <p>{t("legal.terms.cancellationsText", { defaultValue: "Stornierungen sind bis 24h vor Termin möglich, danach keine Erstattung." })}</p>
        <h2 className="text-lg font-medium">{t("legal.terms.rules", { defaultValue: "Hausordnung" })}</h2>
        <p>{t("legal.terms.rulesText", { defaultValue: "Sicherheit geht vor. Den Anweisungen des Personals ist Folge zu leisten." })}</p>
      </section>
    </main>
  );
};

export default Terms;
