import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CUSTOMER-PORTAL-SETUP] ${step}${detailsStr}`);
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

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Configure the customer portal with professional settings
    const portalConfiguration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: "Manage your Surfskate Hall subscription",
        privacy_policy_url: "https://surfskate-hall.lovable.app/datenschutz",
        terms_of_service_url: "https://surfskate-hall.lovable.app/terms",
      },
      features: {
        customer_update: {
          enabled: true,
          allowed_updates: ["email", "address", "phone", "tax_id"],
        },
        payment_method_update: {
          enabled: true,
        },
        invoice_history: {
          enabled: true,
        },
        subscription_cancel: {
          enabled: true,
          mode: "at_period_end",
          proration_behavior: "none",
          cancellation_reason: {
            enabled: true,
            options: [
              "too_complex",
              "too_expensive", 
              "unused",
              "customer_service",
              "low_quality",
              "missing_features",
              "switched_service",
              "other"
            ]
          }
        },
        subscription_pause: {
          enabled: false, // We don't want pause, only cancel
        },
        subscription_update: {
          enabled: true,
          default_allowed_updates: ["price", "quantity", "promotion_code"],
          proration_behavior: "create_prorations",
        },
      },
      default_return_url: "https://surfskate-hall.lovable.app/profile?portal=success",
    });

    logStep("Portal configuration created", { configId: portalConfiguration.id });

    return new Response(JSON.stringify({ 
      success:true, 
      configurationId: portalConfiguration.id,
      message: "Customer portal configured successfully" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in customer-portal-setup", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});