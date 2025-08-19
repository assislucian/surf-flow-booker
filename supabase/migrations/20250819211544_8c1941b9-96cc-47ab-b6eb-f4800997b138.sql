-- Strengthen bookings RLS: remove email-based access and require authenticated ownership by user_id
-- Also ensure RLS is enabled

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing owner policies if they exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'bookings' AND policyname = 'select_own_bookings'
  ) THEN
    DROP POLICY "select_own_bookings" ON public.bookings;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'bookings' AND policyname = 'insert_own_bookings'
  ) THEN
    DROP POLICY "insert_own_bookings" ON public.bookings;
  END IF;
END $$;

-- Recreate strict owner policies based solely on user_id
CREATE POLICY "select_own_bookings"
ON public.bookings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "insert_own_bookings"
ON public.bookings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- NOTE:
-- 1) Admin policies remain unchanged (admin_select_all_bookings, admin_update_bookings, admin_delete_bookings)
-- 2) This removes email-based access which could leak data if an email is known.
-- 3) For even tighter financial data controls (stripe_session_id/amount_cents),
--    we can optionally move them to a separate booking_payments table with admin-only access.
