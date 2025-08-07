import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { i18n, t } = useTranslation();
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path;
  const setLang = (lng: "de" | "en") => i18n.changeLanguage(lng);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl">Surfskate Hall</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4">
          <Link
            to="/"
            className={
              "px-3 py-2 rounded-md text-sm " +
              (isActive("/") ? "bg-secondary text-foreground" : "hover:bg-secondary/60")
            }
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/book"
            className={
              "px-3 py-2 rounded-md text-sm " +
              (isActive("/book") ? "bg-secondary text-foreground" : "hover:bg-secondary/60")
            }
          >
            {t("nav.book")}
          </Link>

          <div className="ml-2 flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setLang("de")}>DE</Button>
            <Button variant="outline" size="sm" onClick={() => setLang("en")}>EN</Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
