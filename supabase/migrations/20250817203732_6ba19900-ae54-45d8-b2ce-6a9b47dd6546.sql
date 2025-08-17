-- Create prices table to manage booking and subscription prices
CREATE TABLE public.prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('booking', 'subscription')),
  name TEXT NOT NULL,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL DEFAULT 'eur',
  stripe_price_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(type, name)
);

-- Enable RLS
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage all prices
CREATE POLICY "admin_manage_prices" ON public.prices
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow everyone to read active prices
CREATE POLICY "read_active_prices" ON public.prices
FOR SELECT
USING (is_active = true);

-- Add trigger for updated_at
CREATE TRIGGER update_prices_updated_at
BEFORE UPDATE ON public.prices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default prices
INSERT INTO public.prices (type, name, amount_cents, currency, is_active) VALUES
('booking', 'Standard Booking', 1499, 'eur', true),
('subscription', 'Premium Membership', 2999, 'eur', true);