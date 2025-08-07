import * as React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

const Widerruf: React.FC = () => {
  const { t } = useTranslation();
  const title = t("legal.withdrawal.title", { defaultValue: "Widerrufsbelehrung" }) as string;
  const desc = t("legal.withdrawal.desc", { defaultValue: "Hinweise zum Widerrufsrecht für Verbraucher." }) as string;

  return (
    <main className="container py-10">
      <Helmet>
        <title>Surfskate Hall – {title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href="/widerruf" />
      </Helmet>

      <h1 className="font-display text-3xl md:text-4xl font-semibold">{title}</h1>
      <section className="mt-6 space-y-4 text-sm">
        <p>
          {t(
            "legal.withdrawal.text",
            {
              defaultValue:
                "Verbraucher haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen (Ausnahmen bei terminbezogenen Freizeitdienstleistungen möglich).",
            }
          )}
        </p>
      </section>
    </main>
  );
};

export default Widerruf;
