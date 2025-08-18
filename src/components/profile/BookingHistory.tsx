import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Mail, Phone, MessageSquare, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  level?: string;
  notes?: string;
  booking_date: string;
  slot: string;
  status: string;
  amount_cents: number;
  currency: string;
  created_at: string;
}

export const BookingHistory = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = i18n.language === 'de' ? de : enUS;

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setBookings([]);
        return;
      }

      console.log("Fetching bookings for user:", user.id, user.email);

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .order("booking_date", { ascending: false })
        .order("slot", { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        toast({
          title: t("common.error"),
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log("Found bookings:", data?.length || 0, data);
      setBookings(data || []);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">
          {i18n.language === 'de' ? 'Bestätigt' : 'Confirmed'}
        </Badge>;
      case "pending":
        return <Badge variant="secondary">
          {i18n.language === 'de' ? 'Ausstehend' : 'Pending'}
        </Badge>;
      case "cancelled":
        return <Badge variant="destructive">
          {i18n.language === 'de' ? 'Storniert' : 'Cancelled'}
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatPrice = (amountCents: number, currency: string) => {
    const amount = amountCents / 100;
    return new Intl.NumberFormat(i18n.language === 'de' ? 'de-DE' : 'en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, dd. MMMM yyyy", { locale });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd.MM.yyyy HH:mm", { locale });
  };

  const isUpcoming = (bookingDate: string) => {
    const today = new Date();
    const booking = new Date(bookingDate);
    return booking >= today;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {i18n.language === 'de' ? 'Meine Buchungen' : 'My Bookings'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {i18n.language === 'de' ? 'Meine Buchungen' : 'My Bookings'}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBookings}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">
              {i18n.language === 'de' 
                ? 'Noch keine Buchungen vorhanden.' 
                : 'No bookings yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className={`border-l-4 ${
                isUpcoming(booking.booking_date) 
                  ? 'border-l-primary bg-primary/5' 
                  : 'border-l-muted bg-muted/20'
              }`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {formatDate(booking.booking_date)}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{booking.slot.includes('-') ? booking.slot : (() => {
                          const [hour] = booking.slot.split(':');
                          const startHour = parseInt(hour);
                          const endHour = startHour + 1;
                          const endHourStr = endHour.toString().padStart(2, "0");
                          return `${booking.slot} - ${endHourStr}:00`;
                        })()}</span>
                        <span>•</span>
                        <span>{formatPrice(booking.amount_cents, booking.currency)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(booking.status)}
                      {isUpcoming(booking.booking_date) && (
                        <div className="text-xs text-primary font-medium mt-1">
                          {i18n.language === 'de' ? 'Bevorstehend' : 'Upcoming'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.email}</span>
                      </div>
                      {booking.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {booking.level && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">
                            {i18n.language === 'de' ? 'Level: ' : 'Level: '}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {booking.level === 'beginner' 
                              ? (i18n.language === 'de' ? 'Anfänger' : 'Beginner')
                              : booking.level === 'intermediate'
                              ? (i18n.language === 'de' ? 'Fortgeschritten' : 'Intermediate')
                              : (i18n.language === 'de' ? 'Experte' : 'Advanced')
                            }
                          </Badge>
                        </div>
                      )}
                      {booking.notes && (
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-xs text-muted-foreground">{booking.notes}</span>
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {i18n.language === 'de' ? 'Gebucht am: ' : 'Booked on: '}
                        {formatDateTime(booking.created_at)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};