import { Link, useInRouterContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut, User } from "lucide-react";

const Header = () => {
  const { i18n, t } = useTranslation();
  const { user, signOut } = useAuth();
  const inRouter = useInRouterContext();
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const isActive = (path: string) => currentPath === path;
  const setLang = (lng: "de" | "en") => i18n.changeLanguage(lng);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container h-16 flex items-center justify-between">
        {inRouter ? (
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl">Surfskate Hall</span>
          </Link>
        ) : (
          <a href="/" className="flex items-center gap-2">
            <span className="font-display text-xl">Surfskate Hall</span>
          </a>
        )}

        <nav className="flex items-center gap-1 sm:gap-4">
          {inRouter ? (
            <Link
              to="/"
              className={
                "px-3 py-2 rounded-md text-sm " +
                (isActive("/") ? "bg-secondary text-foreground" : "hover:bg-secondary/60")
              }
            >
              {t("nav.home")}
            </Link>
          ) : (
            <a
              href="/"
              className={
                "px-3 py-2 rounded-md text-sm " +
                (isActive("/") ? "bg-secondary text-foreground" : "hover:bg-secondary/60")
              }
            >
              {t("nav.home")}
            </a>
          )}
          {inRouter ? (
            <Link
              to="/about"
              className={
                "px-3 py-2 rounded-md text-sm " +
                (isActive("/about") ? "bg-secondary text-foreground" : "hover:bg-secondary/60")
              }
            >
              {t("nav.about")}
            </Link>
          ) : (
            <a
              href="/about"
              className={
                "px-3 py-2 rounded-md text-sm " +
                (isActive("/about") ? "bg-secondary text-foreground" : "hover:bg-secondary/60")
              }
            >
              {t("nav.about")}
            </a>
          )}
          {inRouter ? (
            <Link
              to="/blog"
              className={
                "px-3 py-2 rounded-md text-sm " +
                (isActive("/blog") ? "bg-secondary text-foreground" : "hover:bg-secondary/60")
              }
            >
              {t("nav.blog")}
            </Link>
          ) : (
            <a
              href="/blog"
              className={
                "px-3 py-2 rounded-md text-sm " +
                (isActive("/blog") ? "bg-secondary text-foreground" : "hover:bg-secondary/60")
              }
            >
              {t("nav.blog")}
            </a>
          )}
          {inRouter ? (
            <Link
              to="/book"
              className={
                "px-3 py-2 rounded-md text-sm " +
                (isActive("/book") ? "bg-secondary text-foreground" : "hover:bg-secondary/60")
              }
            >
              {t("nav.book")}
            </Link>
          ) : (
            <a
              href="/book"
              className={
                "px-3 py-2 rounded-md text-sm " +
                (isActive("/book") ? "bg-secondary text-foreground" : "hover:bg-secondary/60")
              }
            >
              {t("nav.book")}
            </a>
          )}

          <div className="ml-2 flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setLang("de")}>DE</Button>
            <Button variant="outline" size="sm" onClick={() => setLang("en")}>EN</Button>
            
            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-secondary/50 rounded-md">
                  <User className="h-4 w-4" />
                  <span className="text-sm truncate max-w-24">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              inRouter ? (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="flex items-center gap-1 ml-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              ) : (
                <a href="/auth">
                  <Button variant="outline" size="sm" className="flex items-center gap-1 ml-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </a>
              )
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
