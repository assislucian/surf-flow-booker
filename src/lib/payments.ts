// Payment integration utilities
// Implemented via Supabase Edge Function 'create-payment'

import { supabase } from "@/integrations/supabase/client";

export type PendingBooking = {
  name: string;
  email: string;
  phone?: string;
  level: string;
  notes?: string;
  date: string; // yyyy-MM-dd
  slot: string; // HH:mm
  createdAt: number;
};

export async function createPaymentSession(
  pending: PendingBooking,
  opts?: { amountCents?: number; currency?: string }
): Promise<{ url: string }> {
  const amountCents = opts?.amountCents ?? 1499;
  const currency = (opts?.currency ?? "eur").toLowerCase();
  const origin = window.location.origin;
  const { data, error } = await supabase.functions.invoke("create-payment", {
    body: {
      pending,
      amountCents,
      currency,
      successUrl: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/payment-canceled`,
    },
  });
  if (error) throw error;
  return { url: (data as any).url };
}
