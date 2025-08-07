import * as React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import site from "@/config/site";

const Impressum: React.FC = () => {
  const { t } = useTranslation();
  const title = t("legal.imprint.title", { defaultValue: "Impressum" }) as string;
  const desc = t("legal.imprint.desc", { defaultValue: "Anbieterkennzeichnung gemäß §5 TMG." }) as string;

  return (
    <main className="container py-10">
      <Helmet>
        <title>Surfskate Hall – {title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href="/impressum" />
      </Helmet>

      <h1 className="font-display text-3xl md:text-4xl font-semibold">{title}</h1>
      <section className="mt-6 space-y-1 text-sm">
        <p>{site.legalName}</p>
        <p>
          {site.address.street}, {site.address.postalCode} {site.address.city}, {site.address.country}
        </p>
        <p>
          {t("legal.imprint.contact", { defaultValue: "Kontakt" })}: {site.email} · {site.phone}
        </p>
        {site.vatId && <p>USt-IdNr.: {site.vatId}</p>}
      </section>

      <section className="mt-8 prose prose-sm max-w-none">
        <h2>{t("legal.imprint.responsibility", { defaultValue: "Verantwortlich für den Inhalt" })}</h2>
        <p>{site.legalName}</p>
        <h2>{t("legal.imprint.disclaimer", { defaultValue: "Haftungsausschluss" })}</h2>
        <p>
          {t(
            "legal.imprint.text",
            {
              defaultValue:
                "Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.",
            }
          )}
        </p>
      </section>
    </main>
  );
};

export default Impressum;
