import { Link, useInRouterContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut, User, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { i18n, t } = useTranslation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const inRouter = useInRouterContext();
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const isActive = (path: string) => currentPath === path;
  const setLang = (lng: "de" | "en") => i18n.changeLanguage(lng);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: t("auth.logoutSuccess"),
      description: t("auth.logoutSuccess"),
    });
  };

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary-foreground hover:bg-primary/10 ml-2">
                    <User className="h-4 w-4 mr-2" />
                    <span className="truncate max-w-24">
                      {user.email?.split('@')[0] || user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {inRouter ? (
                    <Link to="/profile">
                      <DropdownMenuItem>
                        <User className="h-4 w-4 mr-2" />
                        {t("nav.profile")}
                      </DropdownMenuItem>
                    </Link>
                  ) : (
                    <a href="/profile">
                      <DropdownMenuItem>
                        <User className="h-4 w-4 mr-2" />
                        {t("nav.profile")}
                      </DropdownMenuItem>
                    </a>
                  )}
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive hover:text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("auth.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              inRouter ? (
                <Link to="/auth">
                  <Button variant="default" size="sm" className="bg-gradient-primary hover:opacity-90 ml-2">
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t("nav.auth")}
                  </Button>
                </Link>
              ) : (
                <a href="/auth">
                  <Button variant="default" size="sm" className="bg-gradient-primary hover:opacity-90 ml-2">
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t("nav.auth")}
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
