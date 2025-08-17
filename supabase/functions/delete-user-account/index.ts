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

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Perform all operations in parallel for better performance
    const [stripeResult, emailResult, dataResult] = await Promise.allSettled([
      // Cancel Stripe subscriptions
      (async () => {
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        if (customers.data.length > 0) {
          const customerId = customers.data[0].id;
          logStep("Found Stripe customer", { customerId });
          
          const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: "active",
          });
          
          // Cancel all subscriptions in parallel
          await Promise.all(
            subscriptions.data.map(async (subscription) => {
              await stripe.subscriptions.cancel(subscription.id);
              logStep("Canceled subscription", { subscriptionId: subscription.id });
            })
          );
        }
      })(),
      
      // Send farewell email
      (async () => {
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
          // Don't throw - email failure shouldn't stop deletion
        }
      })(),
      
      // Delete user data from all tables in parallel
      (async () => {
        await Promise.all([
          supabaseAdmin.from("subscribers").delete().eq("user_id", user.id),
          supabaseAdmin.from("bookings").delete().eq("email", user.email),
          supabaseAdmin.from("user_roles").delete().eq("user_id", user.id)
        ]);
        logStep("Deleted user data from tables");
      })()
    ]);

    // Log any failures but continue with deletion
    [stripeResult, emailResult, dataResult].forEach((result, index) => {
      if (result.status === 'rejected') {
        const stepNames = ['Stripe cleanup', 'Email sending', 'Data deletion'];
        logStep(`${stepNames[index]} failed but continuing`, { error: result.reason });
      }
    });

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