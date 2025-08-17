import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYNC-STRIPE-PRICES] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use service role key for admin operations
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    // Verify admin access using anon key client
    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await anonClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      throw new Error("Access denied: Admin role required");
    }

    logStep("Admin access verified for user", { userId: user.id });

    const body = await req.json();
    const priceId = body?.priceId;

    if (!priceId) throw new Error("Price ID is required");

    // Get price details from database
    const { data: priceData, error: priceError } = await supabaseClient
      .from('prices')
      .select('*')
      .eq('id', priceId)
      .single();

    if (priceError) throw new Error(`Price not found: ${priceError.message}`);
    logStep("Price data retrieved", { priceId, name: priceData.name });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    let stripePrice;

    if (priceData.stripe_price_id) {
      // Update existing Stripe price (create new one since prices are immutable)
      logStep("Creating new Stripe price to replace existing", { oldPriceId: priceData.stripe_price_id });
      
      stripePrice = await stripe.prices.create({
        unit_amount: priceData.amount_cents,
        currency: priceData.currency,
        product_data: {
          name: priceData.name,
          description: priceData.type === 'subscription' 
            ? `Monthly ${priceData.name}` 
            : `One-time ${priceData.name}`
        },
        recurring: priceData.type === 'subscription' ? { interval: 'month' } : undefined,
      });

      // Archive the old price
      try {
        await stripe.prices.update(priceData.stripe_price_id, { active: false });
        logStep("Archived old Stripe price", { oldPriceId: priceData.stripe_price_id });
      } catch (error) {
        logStep("Warning: Could not archive old price", { error: error.message });
      }
    } else {
      // Create new Stripe price
      logStep("Creating new Stripe price");
      
      stripePrice = await stripe.prices.create({
        unit_amount: priceData.amount_cents,
        currency: priceData.currency,
        product_data: {
          name: priceData.name,
          description: priceData.type === 'subscription' 
            ? `Monthly ${priceData.name}` 
            : `One-time ${priceData.name}`
        },
        recurring: priceData.type === 'subscription' ? { interval: 'month' } : undefined,
      });
    }

    logStep("Stripe price created/updated", { stripePriceId: stripePrice.id });

    // Update database with new Stripe price ID
    const { error: updateError } = await supabaseClient
      .from('prices')
      .update({ 
        stripe_price_id: stripePrice.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', priceId);

    if (updateError) throw new Error(`Failed to update database: ${updateError.message}`);

    logStep("Database updated successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      stripe_price_id: stripePrice.id,
      message: "Price synced with Stripe successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in sync-stripe-prices", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});