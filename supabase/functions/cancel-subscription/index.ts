import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CANCEL-SUBSCRIPTION] ${step}${detailsStr}`);
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

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { language = "de" } = await req.json();

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Get customer and subscription info in parallel
    const [customerResult, subscriptionResult] = await Promise.all([
      stripe.customers.list({ email: user.email, limit: 1 }),
      (async () => {
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        if (customers.data.length === 0) return null;
        return stripe.subscriptions.list({
          customer: customers.data[0].id,
          status: "active",
          limit: 1,
        });
      })()
    ]);
    
    if (customerResult.data.length === 0) {
      throw new Error("No Stripe customer found for this user");
    }
    
    const customerId = customerResult.data[0].id;
    logStep("Found Stripe customer", { customerId });

    if (!subscriptionResult || subscriptionResult.data.length === 0) {
      throw new Error("No active subscription found");
    }

    const subscription = subscriptionResult.data[0];
    const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
    logStep("Found active subscription", { subscriptionId: subscription.id, endDate: subscriptionEnd });

    // Perform cancellation, database update, and email in parallel for better performance
    const [canceledSubscription] = await Promise.allSettled([
      // Cancel at period end
      stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: true,
      }),
      
      // Update database
      supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: customerId,
        subscribed: true, // Still subscribed until period end
        subscription_end: subscriptionEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' }),
      
      // Send cancellation email
      (async () => {
        try {
          await supabaseClient.functions.invoke("send-cancellation-email", {
            body: { 
              email: user.email, 
              name: user.email.split('@')[0], 
              language,
              subscription_end: subscriptionEnd
            }
          });
          logStep("Sent cancellation confirmation email");
        } catch (emailError) {
          logStep("Failed to send cancellation email", { error: emailError });
          // Continue even if email fails
        }
      })()
    ]);

    if (canceledSubscription.status === 'fulfilled') {
      logStep("Subscription set to cancel at period end", { subscriptionId: canceledSubscription.value.id });
    } else {
      throw new Error("Failed to cancel subscription");
    }
    
    logStep("Updated database with cancellation info");

    return new Response(JSON.stringify({
      success: true,
      subscription_end: subscriptionEnd,
      message: "Subscription will be canceled at the end of the current billing period"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in cancel-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
