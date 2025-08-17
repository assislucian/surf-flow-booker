import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CalendarDays, Crown, Mail, Settings, CreditCard, Clock, Star, LogOut, 
  Shield, Trash2, AlertTriangle, Key, UserX 
} from "lucide-react";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [cancelingSubscription, setCancelingSubscription] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  // Calculate remaining days
  const getRemainingDays = () => {
    if (!subscriptionStatus.subscription_end) return null;
    const endDate = new Date(subscriptionStatus.subscription_end);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const remainingDays = getRemainingDays();

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

  const handleCancelSubscription = async () => {
    if (!user) return;
    
    setCancelingSubscription(true);
    try {
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {
        body: { language: i18n.language }
      });
      
      if (error) {
        toast({
          title: t("common.error"),
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t("profile.subscriptionCanceled"),
        description: t("profile.subscriptionCanceledDesc"),
      });
      
      // Refresh subscription status
      await checkSubscriptionStatus();
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCancelingSubscription(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setDeletingAccount(true);
    try {
      const { error } = await supabase.functions.invoke('delete-user-account', {
        body: { language: i18n.language }
      });
      
      if (error) {
        toast({
          title: t("common.error"),
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t("profile.accountDeleted"),
        description: t("profile.accountDeletedDesc"),
      });
      
      // User will be automatically signed out
      navigate("/");
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user || !newPassword || !confirmPassword) {
      toast({
        title: t("common.error"),
        description: t("auth.fillAllFields"),
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: t("common.error"),
        description: t("auth.passwordsNotMatch"),
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: t("common.error"),
        description: t("auth.passwordRequirements"),
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        toast({
          title: t("common.error"),
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t("profile.passwordChanged"),
        description: t("profile.passwordChangedDesc"),
      });
      
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
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
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("auth.logout")}
                  </Button>
                </div>
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
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{t("subscription.expires")}: {subscriptionEndDate}</span>
                        </div>
                        
                        {remainingDays !== null && (
                          <div className={`p-3 rounded-lg border ${
                            remainingDays <= 7 
                              ? 'bg-orange-50 border-orange-200 text-orange-800' 
                              : 'bg-green-50 border-green-200 text-green-800'
                          }`}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                remainingDays <= 7 ? 'bg-orange-500' : 'bg-green-500'
                              }`} />
                              <span className="font-medium text-sm">
                                {remainingDays === 0 
                                  ? (i18n.language === 'de' ? 'Läuft heute ab' : 'Expires today')
                                  : remainingDays === 1 
                                    ? (i18n.language === 'de' ? '1 Tag verbleibend' : '1 day remaining')
                                    : (i18n.language === 'de' 
                                        ? `${remainingDays} Tage verbleibend` 
                                        : `${remainingDays} days remaining`
                                      )
                                }
                              </span>
                            </div>
                          </div>
                        )}
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

                    <div className="space-y-3">
                      <Button
                        onClick={handleManageSubscription}
                        disabled={loading}
                        className="w-full"
                        variant="outline"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        {loading ? t("subscription.loading") : t("subscription.managePlan")}
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full" size="sm">
                            <UserX className="h-4 w-4 mr-2" />
                            {t("profile.cancelSubscription")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-orange-500" />
                              {t("profile.cancelSubscriptionTitle")}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="space-y-3">
                              <p>{t("profile.cancelSubscriptionConfirm")}</p>
                              
                              {remainingDays !== null && subscriptionEndDate && (
                                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                                  <div className="text-center">
                                    <p className="font-medium text-orange-800 text-sm">
                                      {i18n.language === 'de' 
                                        ? `Du kannst Premium noch ${remainingDays} ${remainingDays === 1 ? 'Tag' : 'Tage'} nutzen`
                                        : `You can still use Premium for ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`
                                      }
                                    </p>
                                    <p className="text-orange-600 text-xs mt-1">
                                      {i18n.language === 'de' 
                                        ? `Bis zum ${subscriptionEndDate}`
                                        : `Until ${subscriptionEndDate}`
                                      }
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                <h4 className="font-medium text-red-800 text-sm mb-2">
                                  {i18n.language === 'de' ? 'Was du verlierst:' : 'What you\'ll lose:'}
                                </h4>
                                <ul className="text-red-700 text-xs space-y-1">
                                  <li>• {t("subscription.features.0")}</li>
                                  <li>• {t("subscription.features.1")}</li>
                                  <li>• {t("subscription.features.2")}</li>
                                </ul>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleCancelSubscription}
                              disabled={cancelingSubscription}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {cancelingSubscription ? t("common.loading") : t("profile.confirmCancel")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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

            {/* Security Settings Card */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {t("profile.securitySettings")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Change Password */}
                <div className="space-y-4">
                  <h3 className="font-semibold">{t("profile.changePassword")}</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="newPassword">{t("profile.newPassword")}</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t("profile.newPasswordPlaceholder")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t("profile.confirmPasswordPlaceholder")}
                      />
                    </div>
                    <Button
                      onClick={handleChangePassword}
                      disabled={changingPassword || !newPassword || !confirmPassword}
                      className="w-full"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      {changingPassword ? t("common.loading") : t("profile.updatePassword")}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Danger Zone */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <h3 className="font-semibold text-destructive">{t("profile.dangerZone")}</h3>
                  </div>
                  
                  <div className="bg-destructive/5 p-4 rounded-lg border border-destructive/20">
                    <p className="text-sm text-muted-foreground mb-4">
                      {i18n.language === 'de' 
                        ? 'Diese Aktionen können nicht rückgängig gemacht werden. Bitte sei vorsichtig.'
                        : 'These actions cannot be undone. Please be careful.'
                      }
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("profile.deleteAccount")}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-destructive">
                            {t("profile.deleteAccountTitle")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("profile.deleteAccountConfirm")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={deletingAccount}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            {deletingAccount ? t("common.loading") : t("profile.confirmDelete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;