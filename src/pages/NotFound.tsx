import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  console.error("404 Error: User attempted to access non-existent route:", path);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-4">{t("errors.pageNotFound")}</p>
        <a href="/" className="underline">
          {t("errors.returnHome")}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
