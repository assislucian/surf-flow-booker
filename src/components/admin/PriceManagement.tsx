import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Euro, Crown, Loader2, RefreshCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Price {
  id: string;
  type: 'booking' | 'subscription';
  name: string;
  amount_cents: number;
  currency: string;
  stripe_price_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const PriceManagement = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<Price | null>(null);
  const [formData, setFormData] = useState({
    type: 'booking' as 'booking' | 'subscription',
    name: '',
    amount_cents: 0,
    currency: 'eur'
  });
  const [submitting, setSubmitting] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('prices')
        .select('*')
        .order('type', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrices((data || []) as Price[]);
    } catch (error) {
      console.error('Error fetching prices:', error);
      toast({
        title: t("admin.priceManagement.error"),
        description: t("admin.priceManagement.fetchError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingPrice) {
        // Update existing price
        const { error } = await supabase
          .from('prices')
          .update({
            name: formData.name,
            amount_cents: formData.amount_cents,
            currency: formData.currency
          })
          .eq('id', editingPrice.id);

        if (error) throw error;
        
        toast({
          title: t("admin.priceManagement.success"),
          description: t("admin.priceManagement.updateSuccess"),
        });
      } else {
        // Create new price
        const { error } = await supabase
          .from('prices')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: t("admin.priceManagement.success"),
          description: t("admin.priceManagement.createSuccess"),
        });
      }

      setDialogOpen(false);
      setEditingPrice(null);
      setFormData({ type: 'booking', name: '', amount_cents: 0, currency: 'eur' });
      fetchPrices();
    } catch (error) {
      console.error('Error saving price:', error);
      toast({
        title: t("admin.priceManagement.error"),
        description: t("admin.priceManagement.saveError"),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (price: Price) => {
    setEditingPrice(price);
    setFormData({
      type: price.type,
      name: price.name,
      amount_cents: price.amount_cents,
      currency: price.currency
    });
    setDialogOpen(true);
  };

  const handleDelete = async (priceId: string) => {
    try {
      const { error } = await supabase
        .from('prices')
        .delete()
        .eq('id', priceId);

      if (error) throw error;
      
      toast({
        title: t("admin.priceManagement.success"),
        description: t("admin.priceManagement.deleteSuccess"),
      });
      
      fetchPrices();
    } catch (error) {
      console.error('Error deleting price:', error);
      toast({
        title: t("admin.priceManagement.error"),
        description: t("admin.priceManagement.deleteError"),
        variant: "destructive",
      });
    }
  };

  const syncWithStripe = async (priceId: string) => {
    try {
      setSyncing(priceId);
      
      const { data, error } = await supabase.functions.invoke('sync-stripe-prices', {
        body: { priceId }
      });

      if (error) throw error;
      
      toast({
        title: t("admin.priceManagement.success"),
        description: t("admin.priceManagement.syncSuccess"),
      });
      
      fetchPrices();
    } catch (error) {
      console.error('Error syncing with Stripe:', error);
      toast({
        title: t("admin.priceManagement.error"),
        description: t("admin.priceManagement.syncError"),
        variant: "destructive",
      });
    } finally {
      setSyncing(null);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{t("admin.priceManagement.title")}</h2>
            <p className="text-muted-foreground">{t("admin.priceManagement.description")}</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 p-6 rounded-lg border border-primary/20">
        <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          {t("admin.priceManagement.title")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("admin.priceManagement.description")}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {t("admin.priceManagement.totalPrices", { count: prices.length })}
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingPrice(null);
                setFormData({ type: 'booking', name: '', amount_cents: 0, currency: 'eur' });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("admin.priceManagement.newPrice")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPrice ? t("admin.priceManagement.editPrice") : t("admin.priceManagement.createPrice")}</DialogTitle>
              <DialogDescription>
                {editingPrice ? t("admin.priceManagement.editDescription") : t("admin.priceManagement.createDescription")}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="type">{t("admin.priceManagement.type")}</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'booking' | 'subscription' })}
                  className="w-full mt-1 p-2 border border-border rounded-md bg-background"
                  required
                  disabled={!!editingPrice}
                >
                  <option value="booking">{t("admin.priceManagement.typeBooking")}</option>
                  <option value="subscription">{t("admin.priceManagement.typeSubscription")}</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="name">{t("admin.priceManagement.name")}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="amount">{t("admin.priceManagement.amount")}</Label>
                <div className="relative">
                  <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount_cents / 100}
                    onChange={(e) => setFormData({ ...formData, amount_cents: Math.round(parseFloat(e.target.value || '0') * 100) })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingPrice ? t("common.update") : t("common.create")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {prices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">{t("admin.priceManagement.noPrices")}</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {t("admin.priceManagement.noPricesDescription")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {prices.map((price) => (
            <Card key={price.id} className="border-border/50 shadow-elegant hover:shadow-glow transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{price.name}</CardTitle>
                      <Badge variant={price.type === 'subscription' ? "default" : "secondary"} className="flex items-center gap-1">
                        {price.type === 'subscription' ? <Crown className="h-3 w-3" /> : <Euro className="h-3 w-3" />}
                        {t(`admin.priceManagement.type${price.type === 'subscription' ? 'Subscription' : 'Booking'}`)}
                      </Badge>
                      <Badge variant={price.is_active ? "default" : "outline"}>
                        {price.is_active ? t("admin.priceManagement.active") : t("admin.priceManagement.inactive")}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-primary">{formatCurrency(price.amount_cents)}</span>
                      <span className="text-sm text-muted-foreground">
                        {t("admin.priceManagement.updated")}: {formatDate(price.updated_at)}
                      </span>
                      {price.stripe_price_id && (
                        <Badge variant="outline" className="text-xs">
                          Stripe: {price.stripe_price_id.substring(0, 20)}...
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => syncWithStripe(price.id)}
                      disabled={syncing === price.id}
                      title={t("admin.priceManagement.syncWithStripe")}
                    >
                      {syncing === price.id ? 
                        <Loader2 className="h-4 w-4 animate-spin" /> : 
                        <RefreshCcw className="h-4 w-4" />
                      }
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(price)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("admin.priceManagement.deleteConfirm")}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("admin.priceManagement.deleteDescription", { name: price.name })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(price.id)}>
                            {t("common.delete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriceManagement;