-- Ensure RLS security, idempotency, and performance for bookings
-- 1) Enable RLS (deny all by default)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 2) Unique constraints to enforce idempotent inserts and prevent overbooking
CREATE UNIQUE INDEX IF NOT EXISTS bookings_stripe_session_id_uidx
  ON public.bookings (stripe_session_id);

-- Prevent double-booking the same day+slot once confirmed
CREATE UNIQUE INDEX IF NOT EXISTS bookings_unique_slot_per_day
  ON public.bookings (booking_date, slot)
  WHERE status = 'confirmed';

-- 3) Helpful index for reads (used by get-booked-slots)
CREATE INDEX IF NOT EXISTS bookings_booking_date_status_idx
  ON public.bookings (booking_date, status);

-- 4) Keep updated_at current via trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bookings_updated_at ON public.bookings;
CREATE TRIGGER trg_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();