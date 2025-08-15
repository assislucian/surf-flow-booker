import hero from "@/assets/hero-surfskate.jpg";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SubscriptionPlan } from "@/components/subscription/SubscriptionPlan";
import site from "@/config/site";

const Index = () => {
  const { t } = useTranslation();
  const featuresRaw = t("features.items", { returnObjects: true }) as unknown;
  const featureItems = Array.isArray(featuresRaw) ? (featuresRaw as { title: string; desc: string }[]) : [];
  return (
    <main className="min-h-screen">
      <Helmet>
        <title>Surfskate Hall Wiesbaden – Buchung | Booking</title>
        <meta name="description" content="Buche deinen Surfskate-Slot in Wiesbaden. Benutzerfreundliche Buchung (DE/EN)." />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SportsActivityLocation",
          name: site.name,
          description: "Indoor Surfskate Halle in Wiesbaden mit flexiblem Buchungssystem (DE/EN)",
          url: site.websiteUrl || "/",
          sport: "Surfskating",
          areaServed: "Wiesbaden, Germany",
          telephone: site.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: site.address.street,
            postalCode: site.address.postalCode,
            addressLocality: site.address.city,
            addressCountry: "DE"
          },
          openingHours: site.openingHours
        })}</script>
      </Helmet>
      <section className="relative overflow-hidden rounded-b-[2rem]">
        <img src={hero} alt={t("hero.alt") as string} className="w-full h-[60vh] md:h-[70vh] object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 pb-12 md:pb-16">
          <div className="container">
            <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight animate-fade-in">
              {t("hero.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-muted-foreground animate-fade-in">
              {t("hero.subtitle")}
            </p>
            <div className="mt-6 animate-scale-in">
              <Button asChild size="lg">
                <a href="/book">{t("hero.cta")}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">{t("features.title")}</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureItems.map((f, i) => (
            <article key={i} className="rounded-xl border bg-card p-6 shadow-[var(--shadow-elegant)] transition-transform duration-200 hover:scale-105">
              <h3 className="font-medium text-lg">{f.title}</h3>
              <p className="mt-2 text-muted-foreground">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gradient-subtle py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("subscription.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("subscription.subtitle")}
            </p>
          </div>
          <div className="flex justify-center">
            <SubscriptionPlan />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
