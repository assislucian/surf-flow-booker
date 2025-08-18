import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[DELETE-ACCOUNT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Use service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { language = "de" } = await req.json();

    // Cancel Stripe subscription if exists
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length > 0) {
      const customerId = customers.data[0].id;
      logStep("Found Stripe customer", { customerId });
      
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
      });
      
      for (const subscription of subscriptions.data) {
        await stripe.subscriptions.cancel(subscription.id);
        logStep("Canceled subscription", { subscriptionId: subscription.id });
      }
    }

    // Send farewell email before deleting
    try {
      await supabaseAdmin.functions.invoke("send-account-deletion-email", {
        body: { 
          email: user.email, 
          name: user.email.split('@')[0], 
          language 
        }
      });
      logStep("Sent deletion confirmation email");
    } catch (emailError) {
      logStep("Failed to send deletion email", { error: emailError });
      // Continue with deletion even if email fails
    }

    // Delete user data from our tables (this will cascade due to foreign keys)
    await supabaseAdmin.from("subscribers").delete().eq("user_id", user.id);
    await supabaseAdmin.from("bookings").delete().eq("email", user.email);
    await supabaseAdmin.from("user_roles").delete().eq("user_id", user.id);
    logStep("Deleted user data from tables");

    // Delete the auth user (this is the final step)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (deleteError) throw new Error(`Failed to delete user: ${deleteError.message}`);
    logStep("Deleted auth user", { userId: user.id });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Account successfully deleted" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in delete-user-account", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});