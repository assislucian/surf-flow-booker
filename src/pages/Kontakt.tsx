import * as React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import site from "@/config/site";

const Kontakt: React.FC = () => {
  const { t } = useTranslation();
  const title = t("legal.contact.title", { defaultValue: "Kontakt" }) as string;
  const desc = t("legal.contact.desc", { defaultValue: "So erreichen Sie uns in Wiesbaden." }) as string;

  return (
    <main className="container py-10">
      <Helmet>
        <title>Surfskate Hall – {title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href="/kontakt" />
      </Helmet>

      <h1 className="font-display text-3xl md:text-4xl font-semibold">{title}</h1>
      <section className="mt-6 space-y-1 text-sm">
        <p>{site.legalName}</p>
        <p>
          {site.address.street}, {site.address.postalCode} {site.address.city}
        </p>
        <p>
          E-Mail: {site.email} · Tel.: {site.phone}
        </p>
      </section>
    </main>
  );
};

export default Kontakt;
