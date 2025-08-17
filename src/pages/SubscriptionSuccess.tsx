import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Function to trigger subscriber email
const triggerSubscriberEmail = async (user: any, language: string) => {
  if (user?.email) {
    try {
      await supabase.functions.invoke("send-subscription-email", {
        body: { 
          email: user.email, 
          name: user.email.split('@')[0], 
          language 
        }
      });
    } catch (error) {
      console.error("Failed to send subscriber email:", error);
    }
  }
};

const SubscriptionSuccess = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        // Check subscription status to update the database
        await supabase.functions.invoke('check-subscription');
        
        // Send subscriber email
        if (user?.email) {
          await triggerSubscriberEmail(user, i18n.language);
        }
        
        toast({
          title: t("subscription.success"),
          description: "Welcome to Premium! Your subscription is now active.",
        });
      } catch (error) {
        console.error('Error verifying subscription:', error);
      } finally {
        setVerifying(false);
      }
    };

    verifySubscription();
  }, [t, toast, user, i18n.language]);

  return (
    <main className="min-h-screen flex items-center justify-center container py-12">
      <Helmet>
        <title>Subscription Success - Surfskate Hall Wiesbaden</title>
        <meta name="description" content="Premium subscription successful" />
      </Helmet>
      
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            {verifying ? (
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            ) : (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {verifying ? "Verifying..." : t("subscription.success")}
          </CardTitle>
          <CardDescription>
            {verifying 
              ? "We're confirming your premium subscription..."
              : "Welcome to Premium! Your subscription is now active."
            }
          </CardDescription>
        </CardHeader>
        
        {!verifying && (
          <CardContent>
            <Button asChild className="w-full">
              <a href="/">Back to Home</a>
            </Button>
          </CardContent>
        )}
      </Card>
    </main>
  );
};

export default SubscriptionSuccess;