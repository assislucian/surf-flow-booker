import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lock, AlertTriangle } from "lucide-react";

const ResetPassword: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [canReset, setCanReset] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    // Check for URL error parameters (expired link, invalid token, etc.)
    const urlParams = new URLSearchParams(location.hash.replace('#', '?'));
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error) {
      setHasError(true);
      if (error === 'access_denied' && errorDescription?.includes('expired')) {
        setErrorMessage(i18n.language === 'de' 
          ? 'Der Reset-Link ist abgelaufen. Bitte fordere einen neuen an.'
          : 'The reset link has expired. Please request a new one.');
      } else {
        setErrorMessage(i18n.language === 'de' 
          ? 'Der Reset-Link ist ungültig oder abgelaufen.'
          : 'The reset link is invalid or expired.');
      }
      return;
    }

    // Listen for recovery session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setCanReset(true);
        setHasError(false);
      }
    });

    // Also check existing session (in case of direct redirect)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setCanReset(true);
        setHasError(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [location.hash, i18n.language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canReset) {
      toast({
        title: i18n.language === 'de' ? 'Link ungültig' : 'Invalid link',
        description: i18n.language === 'de' ? 'Bitte öffne den Link aus deiner E-Mail erneut.' : 'Please open the link from your email again.',
        variant: 'destructive',
      });
      return;
    }

    if (!newPassword || newPassword !== confirmPassword) {
      toast({
        title: t('common.error', { defaultValue: 'Fehler' }) as string,
        description: i18n.language === 'de' ? 'Passwörter stimmen nicht überein.' : 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    // Basic strength check
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!strong.test(newPassword)) {
      toast({
        title: t('common.error', { defaultValue: 'Fehler' }) as string,
        description: i18n.language === 'de' 
          ? 'Bitte wähle ein stärkeres Passwort (8+ Zeichen, Groß-/Kleinbuchstaben, Zahl).' 
          : 'Use a stronger password (8+ chars, upper/lowercase, number).',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      toast({ title: t('common.error') as string, description: error.message, variant: 'destructive' });
      return;
    }

    toast({
      title: i18n.language === 'de' ? 'Passwort aktualisiert' : 'Password updated',
      description: i18n.language === 'de' ? 'Du kannst dich jetzt einloggen.' : 'You can now sign in.',
    });
    navigate('/auth');
  };

  const requestNewLink = () => {
    navigate('/auth');
    toast({
      title: i18n.language === 'de' ? 'Neuen Link anfordern' : 'Request new link',
      description: i18n.language === 'de' 
        ? 'Nutze "Passwort vergessen?" im Login-Bereich.' 
        : 'Use "Forgot password?" in the login area.',
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 py-12">
      <Helmet>
        <title>{i18n.language === 'de' ? 'Passwort zurücksetzen' : 'Reset Password'} - Surfskate Hall Wiesbaden</title>
        <meta name="description" content={i18n.language === 'de' ? 'Setze dein Passwort sicher zurück.' : 'Securely reset your password.'} />
        <link rel="canonical" href="/reset-password" />
      </Helmet>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {i18n.language === 'de' ? 'Passwort zurücksetzen' : 'Reset Password'}
          </CardTitle>
          <CardDescription>
            {hasError
              ? (i18n.language === 'de' ? 'Es gab ein Problem mit dem Link.' : 'There was a problem with the link.')
              : canReset
                ? (i18n.language === 'de' ? 'Neues Passwort vergeben.' : 'Set your new password.')
                : (i18n.language === 'de' ? 'Bitte öffne den Link aus deiner E-Mail.' : 'Please open the link from your email.')
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasError ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              <Button onClick={requestNewLink} className="w-full bg-gradient-primary hover:opacity-90">
                {i18n.language === 'de' ? 'Neuen Link anfordern' : 'Request New Link'}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-medium">
                  {i18n.language === 'de' ? 'Neues Passwort' : 'New Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10"
                    required
                    disabled={!canReset}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium">
                  {i18n.language === 'de' ? 'Passwort bestätigen' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                    disabled={!canReset}
                  />
                </div>
              </div>

              {!canReset && !hasError && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {i18n.language === 'de' 
                      ? 'Bitte öffne den Reset-Link aus deiner E-Mail, um fortzufahren.'
                      : 'Please open the reset link from your email to continue.'}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90" 
                disabled={!canReset || loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {i18n.language === 'de' ? 'Passwort speichern' : 'Save Password'}
              </Button>

              {!hasError && (
                <div className="text-center">
                  <Button variant="link" onClick={requestNewLink} className="text-sm">
                    {i18n.language === 'de' ? 'Neuen Reset-Link anfordern' : 'Request new reset link'}
                  </Button>
                </div>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default ResetPassword;
