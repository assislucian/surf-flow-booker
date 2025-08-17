-- Add unique index to prevent double bookings at database level
CREATE UNIQUE INDEX IF NOT EXISTS uniq_bookings_date_slot_confirmed 
ON public.bookings (booking_date, slot) 
WHERE status = 'confirmed';

-- Add index for faster lookups by stripe session
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session 
ON public.bookings (stripe_session_id);

-- Add user_id column to bookings table to properly link bookings to authenticated users
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update RLS policies for bookings to work with user_id
DROP POLICY IF EXISTS "select_own_bookings_by_email" ON public.bookings;
DROP POLICY IF EXISTS "insert_own_bookings" ON public.bookings;

-- Create new policies that work with both email and user_id for backward compatibility
CREATE POLICY "select_own_bookings" ON public.bookings
FOR SELECT
USING (
  auth.uid() = user_id OR 
  auth.email() = email
);

CREATE POLICY "insert_own_bookings" ON public.bookings
FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR 
  auth.email() = email
);