import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Loader2, UserPlus, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

export const SubscriptionPlan = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({ subscribed: false });
  const [showAuthRequired, setShowAuthRequired] = useState(false);

  const featuresRaw = t("subscription.features", { returnObjects: true }) as unknown;
  const features = Array.isArray(featuresRaw) ? (featuresRaw as string[]) : [];

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      setCheckingStatus(true);
      
      if (!user) {
        setSubscriptionStatus({ subscribed: false });
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        setSubscriptionStatus({ subscribed: false });
        return;
      }

      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Error:', error);
      setSubscriptionStatus({ subscribed: false });
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setShowAuthRequired(true);
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-subscription');
      
      if (error) throw error;
      
      // Open subscription checkout in new tab
      window.open(data.url, '_blank');
      
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      window.open(data.url, '_blank');
      
    } catch (error) {
      console.error('Portal error:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">{t("subscription.loading")}</span>
        </CardContent>
      </Card>
    );
  }

  // Show auth required card if user is not logged in
  if (!user && showAuthRequired) {
    return (
      <Card className="w-full max-w-md mx-auto border-primary/20 bg-gradient-to-br from-background to-secondary/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gradient-primary">
            {t("subscription.authRequired")}
          </CardTitle>
          <CardDescription className="text-base">
            {t("subscription.authRequiredDesc")}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center text-primary">
              <Star className="h-5 w-5 mr-2" />
              {t("subscription.whySignUp")}
            </h4>
            <ul className="space-y-2">
              {(t("subscription.signUpBenefits", { returnObjects: true }) as string[]).map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="space-y-3">
          <Button
            onClick={() => navigate('/auth')}
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            size="lg"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {t("subscription.signInToContinue")}
          </Button>
          <Button
            onClick={() => setShowAuthRequired(false)}
            variant="ghost"
            className="w-full"
          >
            {t("common.back")}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto relative overflow-hidden">
      {subscriptionStatus.subscribed && (
        <div className="absolute top-0 right-0 bg-gradient-primary text-white px-3 py-1 rounded-bl-lg">
          <Crown className="h-4 w-4 inline mr-1" />
          <span className="text-sm font-medium">Premium</span>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold">
          {t("subscription.title")}
        </CardTitle>
        <CardDescription className="text-base">
          {t("subscription.subtitle")}
        </CardDescription>
        <div className="flex items-baseline justify-center mt-4">
          <span className="text-4xl font-bold text-gradient-primary">
            {t("subscription.price")}
          </span>
          <span className="text-muted-foreground ml-1">
            {t("subscription.period")}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-3 flex items-center">
            <CheckCircle className="h-5 w-5 text-primary mr-2" />
            {t("subscription.benefits")}
          </h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {subscriptionStatus.subscribed && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{t("subscription.currentPlan")}</span>
              <Badge variant="secondary" className="bg-gradient-primary text-white">
                {t("subscription.subscribed")}
              </Badge>
            </div>
            {subscriptionStatus.subscription_end && (
              <p className="text-sm text-muted-foreground mt-1">
                {t("subscription.expires")} {new Date(subscriptionStatus.subscription_end).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {subscriptionStatus.subscribed ? (
          <Button
            onClick={handleManageSubscription}
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("subscription.managePlan")}
          </Button>
        ) : user ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              {t("subscription.ctaDescription")}
            </p>
            <Button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("subscription.cta")}
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setShowAuthRequired(true)}
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            size="lg"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {t("subscription.cta")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};