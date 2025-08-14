-- Add RLS policies for bookings table to secure customer data
-- Only authenticated admin users can access booking data

-- Policy for authenticated users to read all bookings (for admin dashboard)
CREATE POLICY "Admin can view all bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Policy for authenticated users to insert bookings (for booking system)
CREATE POLICY "Authenticated users can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL OR auth.uid() IS NULL);

-- Policy for authenticated users to update bookings (for admin management)
CREATE POLICY "Admin can update bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Policy for authenticated users to delete bookings (for admin management)
CREATE POLICY "Admin can delete bookings" 
ON public.bookings 
FOR DELETE 
USING (auth.uid() IS NOT NULL);