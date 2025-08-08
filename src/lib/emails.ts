// Email confirmation utilities via Supabase Edge Function

import { supabase } from "@/integrations/supabase/client";
import type { PendingBooking } from "./payments";

export async function sendConfirmationEmail(booking: PendingBooking): Promise<void> {
  const { error } = await supabase.functions.invoke("send-confirmation-email", {
    body: { booking },
  });
  if (error) throw error;
}
