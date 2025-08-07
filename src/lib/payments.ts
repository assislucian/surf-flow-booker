// Payment integration placeholder utilities
// Replace implementations after connecting Supabase and Stripe

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

export async function createPaymentSession(_pending: PendingBooking): Promise<{ url: string }>{
  // Example after setup:
  // const { data, error } = await supabase.functions.invoke('create-payment', { body: { pending: _pending } });
  // if (error) throw error;
  // return { url: data.url };
  throw new Error("Stripe edge function 'create-payment' not configured");
}
