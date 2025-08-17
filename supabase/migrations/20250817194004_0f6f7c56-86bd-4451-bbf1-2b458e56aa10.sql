-- Secure bookings table RLS: restrict SELECT to record owners by email and remove permissive policy
-- Context: Sensitive customer data must not be readable by the public or other users.

-- Ensure RLS is enabled (safe if already enabled)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop overly permissive SELECT policy that allowed any authenticated user to read all bookings
DROP POLICY IF EXISTS "Admin can view all bookings" ON public.bookings;

-- Create a strict SELECT policy: users can only read their own bookings by matching their authenticated email
CREATE POLICY "select_own_bookings_by_email"
ON public.bookings
FOR SELECT
USING (auth.email() = email);

-- Note: We are not changing INSERT/UPDATE/DELETE policies in this migration to avoid breaking existing flows.
-- If desired, we can further tighten them after confirming the admin workflow (e.g., route all writes via Edge Functions using the service role).
