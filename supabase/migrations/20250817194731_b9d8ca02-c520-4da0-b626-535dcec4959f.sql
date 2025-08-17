-- 1) Create app_role enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END$$;

-- 2) Create user_roles table if not exists
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- 3) Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4) Security definer function to check roles with fixed search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
  );
$$;

-- 5) RLS policies for user_roles
DROP POLICY IF EXISTS "select_own_user_roles" ON public.user_roles;
CREATE POLICY "select_own_user_roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_manage_user_roles" ON public.user_roles;
CREATE POLICY "admin_manage_user_roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6) Harden bookings policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Remove permissive admin policies
DROP POLICY IF EXISTS "Admin can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin can delete bookings" ON public.bookings;
-- We already removed view-all earlier, but drop again defensively
DROP POLICY IF EXISTS "Admin can view all bookings" ON public.bookings;

-- Allow admins full read access
DROP POLICY IF EXISTS "admin_select_all_bookings" ON public.bookings;
CREATE POLICY "admin_select_all_bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Keep existing user read policy (own by email) or create if missing
DROP POLICY IF EXISTS "select_own_bookings_by_email" ON public.bookings;
CREATE POLICY "select_own_bookings_by_email"
ON public.bookings
FOR SELECT
TO authenticated
USING (auth.email() = email);

-- Restrict updates and deletes to admins only
DROP POLICY IF EXISTS "admin_update_bookings" ON public.bookings;
CREATE POLICY "admin_update_bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin_delete_bookings" ON public.bookings;
CREATE POLICY "admin_delete_bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Note: INSERT policy remains unchanged to avoid breaking existing booking flows.
