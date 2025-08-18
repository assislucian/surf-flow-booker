import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { format, getWeek } from "date-fns";
import { de as deLocale, enUS as enLocale } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface BookingForm {
  name: string;
  email: string;
  phone?: string;
  level: string;
  notes?: string;
}

const openingHours = { start: 10, end: 22 }; // 10:00 - 22:00

function generateSlots() {
  const slots: string[] = [];
  for (let h = openingHours.start; h < openingHours.end; h++) {
    const hour = h.toString().padStart(2, "0");
    slots.push(`${hour}:00`);
  }
  return slots;
}

// Helper function to format time slot with end time
function formatSlotTime(slot: string): string {
  const [hour] = slot.split(':');
  const startHour = parseInt(hour);
  const endHour = startHour + 1;
  const endHourStr = endHour.toString().padStart(2, "0");
  return `${slot} - ${endHourStr}:00`;
}

const allSlots = generateSlots();

const Booking: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedSlots, setSelectedSlots] = React.useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = React.useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingForm>({
    defaultValues: { level: "beginner" },
  });

  // Restore data when coming back from checkout
  React.useEffect(() => {
    const pendingData = sessionStorage.getItem("pending_booking");
    if (pendingData) {
      try {
        const parsed = JSON.parse(pendingData);
        if (parsed.date) {
          setDate(new Date(parsed.date));
        }
        if (parsed.slots && Array.isArray(parsed.slots)) {
          setSelectedSlots(parsed.slots);
        }
        // Restore form data
        if (parsed.name || parsed.email || parsed.phone || parsed.level || parsed.notes) {
          reset({
            name: parsed.name || "",
            email: parsed.email || "",
            phone: parsed.phone || "",
            level: parsed.level || "beginner",
            notes: parsed.notes || ""
          });
        }
      } catch (e) {
        console.error("Error restoring booking data:", e);
      }
    }
  }, [reset]);

  const locale = i18n.language === "de" ? deLocale : enLocale;

  React.useEffect(() => {
    const load = async () => {
      if (!date) {
        setBookedSlots([]);
        return;
      }
      try {
        const day = format(date, "yyyy-MM-dd");
        console.log(`Loading booked slots for ${day}`);
        const { data, error } = await supabase.functions.invoke("get-booked-slots", {
          body: { date: day },
        });
        if (error) {
          console.error("get-booked-slots error:", error);
          throw error;
        }
        const slots = ((data as any)?.slots ?? []) as string[];
        console.log(`Found ${slots.length} booked slots for ${day}:`, slots);
        setBookedSlots(slots);
      } catch (e) {
        console.error("get-booked-slots error", e);
        setBookedSlots([]);
        // Show toast on error for debugging
        if (date) {
          toast({
            title: "Fehler beim Laden der Buchungen",
            description: `Konnte reservierte Slots für ${format(date, "dd.MM.yyyy")} nicht laden.`,
            variant: "destructive"
          });
        }
      }
    };
    load();
  }, [date, toast]);

  const onSubmit = (data: BookingForm) => {
    if (!date) {
      toast({ title: t("booking.errors.selectDate") as string });
      return;
    }
    if (selectedSlots.length === 0) {
      toast({ title: t("booking.errors.selectSlot") as string });
      return;
    }

    // Store pending booking to complete after payment success
    const pending = {
      ...data,
      date: format(date, "yyyy-MM-dd"),
      slots: selectedSlots,
      createdAt: Date.now(),
    };
    sessionStorage.setItem("pending_booking", JSON.stringify(pending));

    toast({ title: t("booking.proceedingToPayment") });
    navigate("/checkout");
  };

  const isBooked = (slot: string) => {
    return bookedSlots.includes(slot);
  };

  // Check for time gaps in selected slots
  const checkForTimeGaps = (slots: string[]): boolean => {
    if (slots.length <= 1) return false;
    
    const sortedSlots = slots.sort();
    for (let i = 0; i < sortedSlots.length - 1; i++) {
      const currentHour = parseInt(sortedSlots[i].split(':')[0]);
      const nextHour = parseInt(sortedSlots[i + 1].split(':')[0]);
      const gap = nextHour - currentHour;
      
      // Allow consecutive slots (gap = 1) or gaps of 2+ hours
      // Disallow gaps of exactly 1 hour (too short for meaningful separation)
      if (gap === 1) {
        // This is consecutive, which is fine
        continue;
      } else if (gap === 2) {
        // This is exactly 1 hour gap, which we don't allow
        return true;
      }
      // Gap of 3+ hours is fine (2+ hour separation)
    }
    return false;
  };

  return (
    <main className="container py-10">
      <Helmet>
        <title>Surfskate Hall – {t("booking.title")}</title>
        <meta name="description" content={t("booking.metaDescription", { defaultValue: "Surfskate Buchung in Wiesbaden – Slots wählen, Daten eintragen, fertig. Deutsch/Englisch." }) as string} />
        <link rel="canonical" href="/book" />
      </Helmet>

      <h1 className="font-display text-3xl md:text-4xl font-semibold">{t("booking.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("booking.subtitle")}</p>

      {/* Debug Panel - Remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800">🔧 Debug Panel</h3>
          <p className="text-xs text-yellow-700 mt-1">
            Slots reservados hoje: {bookedSlots.length > 0 ? bookedSlots.join(", ") : "Nenhum"}
          </p>
          <p className="text-xs text-yellow-700">
            Data selecionada: {date ? format(date, "yyyy-MM-dd") : "Nenhuma"}
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-2 text-xs"
            onClick={async () => {
              if (!date) return;
              try {
                const day = format(date, "yyyy-MM-dd");
                const { data, error } = await supabase.functions.invoke("get-booked-slots", {
                  body: { date: day },
                });
                console.log("Debug - Direct API call result:", { data, error });
                toast({
                  title: "Debug API Call",
                  description: `Found ${(data as any)?.slots?.length || 0} slots. Check console for details.`
                });
              } catch (e) {
                console.error("Debug API call failed:", e);
              }
            }}
          >
            🔍 Test API Call
          </Button>
        </div>
      )}

      <section className="mt-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Date Selection */}
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <span className="bg-gradient-primary bg-clip-text text-transparent font-bold">1.</span>
                {t("booking.pickDate")}
              </CardTitle>
                <CardDescription>
                  {t("booking.selectDateDesc")}
                </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="min-w-[280px] justify-start text-left border-2 hover:border-primary/50 transition-colors"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {date ? (
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {format(date, "EEEE, dd. MMMM yyyy", { locale })}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {i18n.language === "de" 
                              ? `Kalenderwoche ${getWeek(date)}`
                              : `Week ${getWeek(date)}`
                            }
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">{t("booking.pickDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className="p-3 pointer-events-auto"
                      locale={locale}
                    />
                  </PopoverContent>
                </Popover>
                
                {date && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm text-primary font-medium">
                      {format(date, "dd.MM.yyyy", { locale })}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Time Slot Selection */}
          <Card className={`border-primary/20 transition-all duration-300 ${date ? 'opacity-100' : 'opacity-50'}`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                <span className="bg-gradient-primary bg-clip-text text-transparent font-bold">2.</span>
                {t("booking.availableSlots")}
              </CardTitle>
              <CardDescription>
                {date && (
                  <span className="font-medium">
                    {format(date, "EEEE, dd. MMMM", { locale })} • 
                    <span className="text-primary ml-1">
                      {i18n.language === "de" 
                        ? `KW ${getWeek(date)}`
                        : `Week ${getWeek(date)}`
                      }
                    </span>
                  </span>
                )}
                {date 
                  ? ` - ${t("booking.selectTimeDesc")}`
                  : t("booking.selectDateFirst")
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {date ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allSlots.map((slot) => {
                    const booked = isBooked(slot);
                    const isSelected = selectedSlots.includes(slot);
                    return (
                      <Button
                        key={slot}
                        variant={isSelected ? "default" : "outline"}
                        disabled={booked}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSlots(prev => prev.filter(s => s !== slot));
                          } else {
                            // Check for time gaps when adding new slots
                            const newSlots = [...selectedSlots, slot].sort();
                            const hasGaps = checkForTimeGaps(newSlots);
                            if (hasGaps) {
                              toast({
                                title: i18n.language === "de" ? "Zeitlücke erkannt" : "Time gap detected",
                                description: i18n.language === "de" 
                                  ? "Bitte wähle zusammenhängende Zeitslots oder lasse mindestens eine Stunde Pause zwischen den Buchungen."
                                  : "Please select consecutive time slots or leave at least one hour between bookings.",
                                variant: "destructive"
                              });
                              return;
                            }
                            setSelectedSlots(newSlots);
                          }
                        }}
                        className={`h-12 text-base font-medium transition-all duration-200 ${
                          isSelected 
                            ? 'bg-gradient-primary hover:opacity-90 text-white shadow-lg scale-105' 
                            : booked 
                              ? 'opacity-40 cursor-not-allowed bg-destructive/10 text-destructive-foreground border-destructive/20' 
                              : 'hover:border-primary hover:text-primary hover:bg-primary/5 hover:scale-102'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-medium">{formatSlotTime(slot)}</span>
                          {booked && (
                            <span className="text-xs font-medium text-destructive">
                              {t("booking.booked")}
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-xs opacity-90">
                              ✓ {t("booking.selected")}
                            </span>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <div className="text-center">
                    <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{t("booking.selectDateFirst")}</p>
                  </div>
                </div>
              )}
              
              {selectedSlots.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Clock className="h-4 w-4" />
                    <span>
                      {t("booking.selected")}: {selectedSlots.map(slot => formatSlotTime(slot)).join(", ")}
                      {date && ` - ${format(date, "dd.MM.yyyy")}`}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {selectedSlots.length} {selectedSlots.length === 1 ? t("booking.slot") : t("booking.slots")} {t("booking.selectedTotal")}
                  </div>
                  <div className="text-xs text-primary/70 mt-2">
                    {i18n.language === "de" 
                      ? "💡 Tipp: Wähle zusammenhängende Slots oder lasse mind. 2 Stunden Pause zwischen Buchungen"
                      : "💡 Tip: Select consecutive slots or leave at least 2 hours between bookings"
                    }
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Summary */}
          {date && selectedSlots.length > 0 && (
            <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">
                      {selectedSlots.length === 1 ? t("booking.sessionReady") : t("booking.sessionsReady")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {format(date, "EEEE, dd. MMMM yyyy", { locale })} • {selectedSlots.map(slot => formatSlotTime(slot)).join(", ")} • {" "}
                      {i18n.language === "de" 
                        ? `Kalenderwoche ${getWeek(date)}`
                        : `Week ${getWeek(date)}`
                      }
                    </p>
                    <p className="text-xs text-primary/70 mt-1">
                      {selectedSlots.length} {selectedSlots.length === 1 ? t("booking.slot") : t("booking.slots")} {t("booking.selectedTotal")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <aside className="lg:col-span-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">{t("booking.form.name")}</Label>
              <Input id="name" {...register("name", { required: true })} />
              {errors.name && <p className="text-sm text-destructive mt-1">{t("common.required", { defaultValue: "Required" })}</p>}
            </div>
            <div>
              <Label htmlFor="email">{t("booking.form.email")}</Label>
              <Input id="email" type="email" {...register("email", { required: true })} />
              {errors.email && <p className="text-sm text-destructive mt-1">{t("common.required", { defaultValue: "Required" })}</p>}
            </div>
            <div>
              <Label htmlFor="phone">{t("booking.form.phone")}</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div>
              <Label htmlFor="level">{t("booking.form.level")}</Label>
              <select
                id="level"
                className="w-full h-10 rounded-md border bg-background px-3"
                {...register("level")}
              >
                <option value="beginner">{t("booking.form.levelOptions.beginner")}</option>
                <option value="intermediate">{t("booking.form.levelOptions.intermediate")}</option>
                <option value="advanced">{t("booking.form.levelOptions.advanced")}</option>
              </select>
            </div>
            <div>
              <Label htmlFor="notes">{t("booking.form.notes")}</Label>
              <Input id="notes" {...register("notes")} />
            </div>
            <Button type="submit" className="w-full">{t("booking.form.submit")}</Button>
          </form>
        </aside>
      </section>
    </main>
  );
};

export default Booking;
