import * as React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

const Datenschutz: React.FC = () => {
  const { t } = useTranslation();
  const title = t("legal.privacy.title", { defaultValue: "Datenschutzerklärung" }) as string;
  const desc = t("legal.privacy.desc", { defaultValue: "Informationen gemäß DSGVO." }) as string;

  return (
    <main className="container py-10">
      <Helmet>
        <title>Surfskate Hall – {title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href="/datenschutz" />
      </Helmet>

      <h1 className="font-display text-3xl md:text-4xl font-semibold">{title}</h1>
      <section className="mt-6 space-y-4 text-sm">
        <p>
          {t(
            "legal.privacy.intro",
            {
              defaultValue:
                "Wir verarbeiten personenbezogene Daten ausschließlich im Rahmen der gesetzlichen Bestimmungen (DSGVO, BDSG).",
            }
          )}
        </p>
        <h2 className="text-lg font-medium">{t("legal.privacy.controller", { defaultValue: "Verantwortlicher" })}</h2>
        <p>{t("legal.privacy.controllerText", { defaultValue: "Verantwortlicher ist der im Impressum genannte Anbieter." })}</p>
        <h2 className="text-lg font-medium">{t("legal.privacy.data", { defaultValue: "Verarbeitete Daten" })}</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t("legal.privacy.bookingData", { defaultValue: "Buchungsdaten (Name, E-Mail, gewählter Slot)" })}</li>
          <li>{t("legal.privacy.payment", { defaultValue: "Zahlungsabwicklung via Stripe (separate Datenschutzerklärung)" })}</li>
        </ul>
        <h2 className="text-lg font-medium">{t("legal.privacy.rights", { defaultValue: "Ihre Rechte" })}</h2>
        <p>{t("legal.privacy.rightsText", { defaultValue: "Sie haben das Recht auf Auskunft, Berichtigung, Löschung u.a." })}</p>
      </section>
    </main>
  );
};

export default Datenschutz;
