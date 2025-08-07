import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { de as deLocale, enUS as enLocale } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

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

const allSlots = generateSlots();

const Booking: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingForm>({
    defaultValues: { level: "beginner" },
  });

  const locale = i18n.language === "de" ? deLocale : enLocale;

  const bookedKey = (d: Date | undefined, s: string | null) =>
    d && s ? `${format(d, "yyyy-MM-dd")}|${s}` : "";

  const onSubmit = (data: BookingForm) => {
    if (!date) {
      toast({ title: t("booking.errors.selectDate") as string });
      return;
    }
    if (!selectedSlot) {
      toast({ title: t("booking.errors.selectSlot") as string });
      return;
    }

    const key = bookedKey(date, selectedSlot);
    const bookings = JSON.parse(localStorage.getItem("bookings") || "{}");
    if (bookings[key]) {
      toast({ title: "Slot bereits gebucht / Slot already booked" });
      return;
    }
    bookings[key] = { ...data, date: format(date, "yyyy-MM-dd"), slot: selectedSlot };
    localStorage.setItem("bookings", JSON.stringify(bookings));

    toast({ title: t("booking.success") as string });
    setSelectedSlot(null);
    reset();
  };

  const isBooked = (slot: string) => {
    if (!date) return false;
    const bookings = JSON.parse(localStorage.getItem("bookings") || "{}");
    return Boolean(bookings[bookedKey(date, slot)]);
  };

  return (
    <main className="container py-10">
      <Helmet>
        <title>Surfskate Hall – {t("booking.title")}</title>
        <meta name="description" content="Surfskate Buchung – Slots wählen, Daten eintragen, fertig. Deutsch/Englisch." />
        <link rel="canonical" href="/book" />
      </Helmet>

      <h1 className="font-display text-3xl md:text-4xl font-semibold">{t("booking.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("booking.subtitle")}</p>

      <section className="mt-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[220px] justify-start">
                  {date ? (
                    <span>
                      {t("booking.selectedDate")}: {format(date, "PPP", { locale })}
                    </span>
                  ) : (
                    <span>{t("booking.pickDate")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-medium">{t("booking.availableSlots")}</h2>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {allSlots.map((slot) => {
                const booked = isBooked(slot);
                const isSelected = selectedSlot === slot;
                return (
                  <Button
                    key={slot}
                    variant={isSelected ? "default" : "secondary"}
                    disabled={booked}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">{t("booking.form.name")}</Label>
              <Input id="name" {...register("name", { required: true })} />
              {errors.name && <p className="text-sm text-destructive mt-1">Required</p>}
            </div>
            <div>
              <Label htmlFor="email">{t("booking.form.email")}</Label>
              <Input id="email" type="email" {...register("email", { required: true })} />
              {errors.email && <p className="text-sm text-destructive mt-1">Required</p>}
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
