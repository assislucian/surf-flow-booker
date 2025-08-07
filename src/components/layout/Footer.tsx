import { Link, useInRouterContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import site from "@/config/site";

const Footer = () => {
  const { t } = useTranslation();
  const inRouter = useInRouterContext();
  const year = new Date().getFullYear();

  const LegalLink = ({ to, children }: { to: string; children: React.ReactNode }) =>
    inRouter ? (
      <Link to={to} className="text-sm text-muted-foreground hover:text-foreground">
        {children}
      </Link>
    ) : (
      <a href={to} className="text-sm text-muted-foreground hover:text-foreground">
        {children}
      </a>
    );

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 grid gap-6 md:grid-cols-2">
        <div>
          <p className="font-medium">{site.name}</p>
          <p className="text-sm text-muted-foreground">
            {site.address.street}, {site.address.postalCode} {site.address.city}
          </p>
          <p className="text-sm text-muted-foreground">{t("footer.hours", { defaultValue: "Öffnungszeiten" })}: {site.openingHours}</p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <LegalLink to="/impressum">{t("legal.imprint.short", { defaultValue: "Impressum" })}</LegalLink>
          <LegalLink to="/datenschutz">{t("legal.privacy.short", { defaultValue: "Datenschutz" })}</LegalLink>
          <LegalLink to="/agb">{t("legal.terms.short", { defaultValue: "AGB" })}</LegalLink>
          <LegalLink to="/widerruf">{t("legal.withdrawal.short", { defaultValue: "Widerruf" })}</LegalLink>
          <LegalLink to="/kontakt">{t("legal.contact.short", { defaultValue: "Kontakt" })}</LegalLink>
        </nav>
      </div>
      <div className="border-t py-4">
        <div className="container flex items-center justify-between text-xs text-muted-foreground">
          <span>© {year} {site.name}. {t("footer.rights", { defaultValue: "Alle Rechte vorbehalten." })}</span>
          <span>Wiesbaden</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
