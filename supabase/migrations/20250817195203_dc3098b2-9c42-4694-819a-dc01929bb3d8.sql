-- Tighten INSERT policy and add validation trigger for bookings

-- Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Remove permissive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON public.bookings;

-- Restrict INSERTs to authenticated users inserting their own email only
CREATE POLICY "insert_own_bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (auth.email() = email);

-- Validation function (use search_path hardening)
CREATE OR REPLACE FUNCTION public.validate_bookings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Basic required fields
  IF NEW.name IS NULL OR btrim(NEW.name) = '' THEN
    RAISE EXCEPTION 'Name is required';
  END IF;
  IF NEW.email IS NULL OR btrim(NEW.email) = '' THEN
    RAISE EXCEPTION 'Email is required';
  END IF;
  IF NEW.slot IS NULL OR NOT (NEW.slot ~ '^[0-2][0-9]:00$') THEN
    RAISE EXCEPTION 'Invalid slot format, expected HH:00';
  END IF;

  -- Date must be today or future
  IF NEW.booking_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Booking date must be today or later';
  END IF;

  -- Amount must be non-negative
  IF NEW.amount_cents IS NULL OR NEW.amount_cents < 0 THEN
    RAISE EXCEPTION 'Amount must be >= 0';
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger (idempotent)
DROP TRIGGER IF EXISTS trg_validate_bookings ON public.bookings;
CREATE TRIGGER trg_validate_bookings
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.validate_bookings();
