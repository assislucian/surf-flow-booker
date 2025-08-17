import * as React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "cookie_consent";

const CookieBanner: React.FC = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    // Delay cookie banner to not interrupt initial user experience
    const timer = setTimeout(() => {
      try {
        const v = localStorage.getItem(STORAGE_KEY);
        if (!v) setVisible(true);
      } catch {}
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, "accepted"); } catch {}
    setVisible(false);
  };
  const decline = () => {
    try { localStorage.setItem(STORAGE_KEY, "declined"); } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="container mb-4 rounded-xl border bg-card p-4 shadow-[var(--shadow-elegant)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {t("cookies.message", { defaultValue: "Wir verwenden nur notwendige Cookies, um Ihr Erlebnis zu verbessern." })}
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={accept}>{t("cookies.accept", { defaultValue: "Akzeptieren" })}</Button>
            <Button size="sm" variant="secondary" onClick={decline}>{t("cookies.decline", { defaultValue: "Ablehnen" })}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
