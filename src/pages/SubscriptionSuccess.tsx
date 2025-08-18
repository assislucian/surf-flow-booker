import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Loader2, Calendar, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SubscriptionSuccess = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const handleSuccessfulSubscription = async () => {
      if (!user || !sessionId) {
        navigate("/");
        return;
      }

      try {
        // Wait a moment for Stripe to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check subscription status
        const { data, error } = await supabase.functions.invoke('check-subscription');
        if (error) throw error;
        
        setSubscriptionStatus(data);
        
        // Send welcome email
        try {
          await supabase.functions.invoke("send-welcome-email", {
            body: { 
              email: user.email, 
              name: user.email?.split('@')[0] || 'Surfer', 
              language: i18n.language,
              subscription_tier: data?.subscription_tier || "Premium"
            }
          });
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
        }

        toast({
          title: t("subscription.welcomeToPremium"),
          description: t("subscription.subscriptionConfirmed"),
        });
        
      } catch (error) {
        console.error("Error processing subscription:", error);
        toast({
          title: t("common.error"),
          description: t("subscription.confirmationError"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    handleSuccessfulSubscription();
  }, [user, sessionId, navigate, i18n.language, toast, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {t("subscription.processing")}
            </h2>
            <p className="text-muted-foreground text-center">
              {t("subscription.processingDesc")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subscriptionEndDate = subscriptionStatus?.subscription_end 
    ? new Date(subscriptionStatus.subscription_end).toLocaleDateString(
        i18n.language === 'de' ? 'de-DE' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : null;

  return (
    <main className="min-h-screen bg-gradient-subtle py-8">
      <Helmet>
        <title>{t("subscription.successTitle")} - Surfskate Hall</title>
        <meta name="description" content={t("subscription.subscriptionConfirmed")} />
      </Helmet>

      <div className="container max-w-2xl mx-auto px-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-primary text-white px-4 py-2 rounded-bl-lg">
            <Crown className="h-4 w-4 inline mr-1" />
            <span className="text-sm font-medium">Premium</span>
          </div>
          
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-600">
              {t("subscription.successTitle")}
            </CardTitle>
            <CardDescription className="text-lg">
              {t("subscription.subscriptionConfirmed")}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">
                  {t("subscription.currentPlan")}
                </h3>
                <Badge variant="default" className="bg-gradient-primary">
                  {subscriptionStatus?.subscription_tier || "Premium"}
                </Badge>
              </div>
              
              {subscriptionEndDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{t("subscription.nextBilling")}: {subscriptionEndDate}</span>
                </div>
              )}
              
              <div className="grid gap-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Gift className="h-4 w-4 text-primary" />
                  {t("subscription.benefits")}
                </h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t("subscription.features.0")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t("subscription.features.1")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t("subscription.features.2")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t("subscription.features.3")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t("subscription.features.4")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">
                {t("subscription.nextSteps")}
              </h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• {t("subscription.checkEmail")}</li>
                <li>• {t("subscription.bookFirstSlot")}</li>
                <li>• {t("subscription.manageProfile")}</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate("/book")}
                className="flex-1 bg-gradient-primary hover:opacity-90"
                size="lg"
              >
                {t("subscription.bookFirstSlot")}
              </Button>
              <Button
                onClick={() => navigate("/profile")}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                {t("subscription.viewProfile")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SubscriptionSuccess;