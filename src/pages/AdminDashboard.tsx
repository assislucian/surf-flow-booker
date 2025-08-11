import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Euro, Users, TrendingUp } from "lucide-react";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

interface Booking {
  id: string;
  booking_date: string;
  amount_cents: number;
  currency: string;
  slot: string;
  status: string;
  name: string;
  email: string;
  phone?: string;
  level?: string;
  notes?: string;
  created_at: string;
}

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  todayBookings: number;
  thisMonthRevenue: number;
}

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    todayBookings: 0,
    thisMonthRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Fehler beim Laden der Buchungen",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setBookings(data || []);
      calculateStats(data || []);
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookings: Booking[]) => {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    
    const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.amount_cents, 0);
    const todayBookings = confirmedBookings.filter(b => b.booking_date === today).length;
    
    const thisMonthRevenue = confirmedBookings
      .filter(b => {
        const bookingDate = new Date(b.booking_date);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
      })
      .reduce((sum, booking) => sum + booking.amount_cents, 0);

    setStats({
      totalBookings: confirmedBookings.length,
      totalRevenue,
      todayBookings,
      thisMonthRevenue,
    });
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd.MM.yyyy", { locale: de });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd.MM.yyyy HH:mm", { locale: de });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Lade Buchungsdaten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Admin Dashboard - Surfskate Hall</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Übersicht über alle Buchungen und Finanzen
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamte Buchungen</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">Bestätigte Buchungen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamtumsatz</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Alle bestätigten Buchungen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heute</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayBookings}</div>
            <p className="text-xs text-muted-foreground">Buchungen für heute</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dieser Monat</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.thisMonthRevenue)}</div>
            <p className="text-xs text-muted-foreground">Umsatz diesen Monat</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Buchungen</CardTitle>
          <CardDescription>
            Übersicht über alle Buchungen in chronologischer Reihenfolge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buchungsdatum</TableHead>
                  <TableHead>Slot</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Betrag</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Erstellt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Keine Buchungen gefunden
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {formatDate(booking.booking_date)}
                      </TableCell>
                      <TableCell>{booking.slot}</TableCell>
                      <TableCell>{booking.name}</TableCell>
                      <TableCell>{booking.email}</TableCell>
                      <TableCell>
                        {booking.level && (
                          <Badge variant="secondary">
                            {booking.level}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(booking.amount_cents)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(booking.created_at)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;