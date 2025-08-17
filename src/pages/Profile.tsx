import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Crown, Mail, Settings, CreditCard, Clock, Star, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({ subscribed: false });
  const locale = i18n.language === 'de' ? de : enUS;

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    checkSubscriptionStatus();
  }, [user, navigate]);

  const checkSubscriptionStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }
      setSubscriptionStatus(data || { subscribed: false });
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        toast({
          title: t("common.error"),
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: t("auth.logoutSuccess"),
      description: t("auth.logoutSuccess"),
    });
    navigate("/");
  };

  if (!user) {
    return null;
  }

  const userInitials = user.email
    ? user.email.substring(0, 2).toUpperCase()
    : "U";

  const subscriptionEndDate = subscriptionStatus.subscription_end 
    ? format(new Date(subscriptionStatus.subscription_end), "PPP", { locale })
    : null;

  return (
    <>
      <Helmet>
        <title>{t("profile.title")} - Surfskate Hall</title>
        <meta name="description" content={t("profile.metaDescription")} />
      </Helmet>

      <div className="min-h-screen bg-gradient-subtle py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Info Card */}
            <Card className="md:col-span-1">
              <CardHeader className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg font-semibold bg-gradient-primary text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{t("profile.welcome")}</CardTitle>
                <CardDescription className="text-sm">
                  {user.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>{t("profile.memberSince")}: {format(new Date(user.created_at || new Date()), "PPP", { locale })}</span>
                </div>
                <Separator />
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("auth.logout")}
                </Button>
              </CardContent>
            </Card>

            {/* Subscription Status Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  {t("profile.subscriptionStatus")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {subscriptionStatus.subscribed ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-500" />
                          {t("subscription.subscribed")}
                        </h3>
                        <p className="text-muted-foreground">{t("profile.subscriptionActive")}</p>
                      </div>
                      <Badge variant="default" className="bg-gradient-primary">
                        {subscriptionStatus.subscription_tier || "Premium"}
                      </Badge>
                    </div>
                    
                    {subscriptionEndDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{t("subscription.expires")}: {subscriptionEndDate}</span>
                      </div>
                    )}

                    <div className="bg-gradient-subtle p-4 rounded-lg border">
                      <h4 className="font-medium mb-3">{t("profile.currentBenefits")}</h4>
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-primary rounded-full" />
                          <span>{t("subscription.features.0")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-primary rounded-full" />
                          <span>{t("subscription.features.1")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-primary rounded-full" />
                          <span>{t("subscription.features.2")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-primary rounded-full" />
                          <span>{t("subscription.features.3")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-primary rounded-full" />
                          <span>{t("subscription.features.4")}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleManageSubscription}
                      disabled={loading}
                      className="w-full"
                      variant="outline"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {loading ? t("subscription.loading") : t("subscription.managePlan")}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{t("subscription.notSubscribed")}</h3>
                      <p className="text-muted-foreground">{t("profile.subscriptionInactive")}</p>
                    </div>
                    
                    <div className="bg-gradient-subtle p-4 rounded-lg border">
                      <h4 className="font-medium mb-3">{t("profile.upgradeToUnlock")}</h4>
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2 opacity-60">
                          <div className="h-2 w-2 bg-muted rounded-full" />
                          <span>{t("subscription.features.0")}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-60">
                          <div className="h-2 w-2 bg-muted rounded-full" />
                          <span>{t("subscription.features.1")}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-60">
                          <div className="h-2 w-2 bg-muted rounded-full" />
                          <span>{t("subscription.features.2")}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => navigate("/")}
                      className="w-full bg-gradient-primary hover:opacity-90"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      {t("subscription.cta")}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;