// Email confirmation placeholder utilities
// Replace after connecting Supabase and an email provider (e.g., Resend, SendGrid)

import type { PendingBooking } from "./payments";

export async function sendConfirmationEmail(_booking: PendingBooking): Promise<void> {
  // Example after setup via Supabase Edge Function 'send-confirmation-email'
  // await supabase.functions.invoke('send-confirmation-email', { body: { booking: _booking } });
  throw new Error("Email edge function 'send-confirmation-email' not configured");
}
