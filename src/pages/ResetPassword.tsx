import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lock } from "lucide-react";

const ResetPassword: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [canReset, setCanReset] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // Listen for recovery session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setCanReset(true);
      }
    });

    // Also check existing session (in case of direct redirect)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setCanReset(true);
    });

    return () => subscription.unsubscribe();
  }, []);

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
        description: i18n.language === 'de' ? 'Bitte wähle ein stärkeres Passwort (8+ Zeichen, Groß-/Kleinbuchstaben, Zahl).' : 'Use a stronger password (8+ chars, upper/lowercase, number).',
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

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 py-12">
      <Helmet>
        <title>{i18n.language === 'de' ? 'Passwort zurücksetzen' : 'Reset Password'} - Surfskate Hall Wiesbaden</title>
        <meta name="description" content={i18n.language === 'de' ? 'Setze dein Passwort sicher zurück.' : 'Securely reset your password.'} />
        <link rel="canonical" href="/reset-password" />
      </Helmet>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{i18n.language === 'de' ? 'Passwort zurücksetzen' : 'Reset Password'}</CardTitle>
          <CardDescription>
            {canReset
              ? (i18n.language === 'de' ? 'Neues Passwort vergeben.' : 'Set your new password.')
              : (i18n.language === 'de' ? 'Bitte öffne den Link aus deiner E-Mail.' : 'Please open the link from your email.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90" disabled={!canReset || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {i18n.language === 'de' ? 'Passwort speichern' : 'Save Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default ResetPassword;
