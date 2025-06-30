import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.7'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface AnalyticsEvent {
  user_id?: string;
  event_name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  timestamp: string;
  session_id: string;
  page_url: string;
  referrer?: string;
  device_type: string;
  browser: string;
  os: string;
}

interface PageView {
  user_id?: string;
  page_url: string;
  page_title?: string;
  timestamp: string;
  session_id: string;
  referrer?: string;
  device_type: string;
  browser: string;
  os: string;
}

interface Purchase {
  user_id?: string;
  product_id: string;
  currency: string;
  price: number;
  timestamp: string;
  session_id: string;
  device_type: string;
  browser: string;
  os: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request path
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Handle different endpoints
    if (req.method === 'POST') {
      const body = await req.json();

      // Add IP address from request
      const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');

      switch (path) {
        case 'event':
          const eventData: AnalyticsEvent = {
            ...body,
            ip_address: clientIp || undefined,
          };
          
          const { error: eventError } = await supabase
            .from('events')
            .insert(eventData);
            
          if (eventError) {
            throw new Error(`Failed to insert event: ${eventError.message}`);
          }
          
          return new Response(
            JSON.stringify({ success: true }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          );

        case 'pageview':
          const pageViewData: PageView = {
            ...body,
            ip_address: clientIp || undefined,
          };
          
          const { error: pageViewError } = await supabase
            .from('page_views')
            .insert(pageViewData);
            
          if (pageViewError) {
            throw new Error(`Failed to insert page view: ${pageViewError.message}`);
          }
          
          return new Response(
            JSON.stringify({ success: true }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          );

        case 'purchase':
          const purchaseData: Purchase = {
            ...body,
          };
          
          const { error: purchaseError } = await supabase
            .from('purchases')
            .insert(purchaseData);
            
          if (purchaseError) {
            throw new Error(`Failed to insert purchase: ${purchaseError.message}`);
          }
          
          return new Response(
            JSON.stringify({ success: true }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          );

        default:
          throw new Error('Invalid endpoint');
      }
    } else if (req.method === 'GET') {
      // Get analytics data (for admin dashboard)
      switch (path) {
        case 'summary':
          // Verify admin access
          const authHeader = req.headers.get('Authorization');
          if (!authHeader) {
            throw new Error('Authorization header missing');
          }
          
          const token = authHeader.replace('Bearer ', '');
          const { data: { user }, error: authError } = await supabase.auth.getUser(token);
          
          if (authError || !user) {
            throw new Error('Unauthorized');
          }
          
          // Get analytics summary
          const [
            { data: pageViewsCount, error: pageViewsError },
            { data: eventsCount, error: eventsError },
            { data: purchasesCount, error: purchasesError },
            { data: usersCount, error: usersError },
          ] = await Promise.all([
            supabase.from('page_views').select('id', { count: 'exact', head: true }),
            supabase.from('events').select('id', { count: 'exact', head: true }),
            supabase.from('purchases').select('id', { count: 'exact', head: true }),
            supabase.from('user_properties').select('user_id', { count: 'exact', head: true }),
          ]);
          
          if (pageViewsError || eventsError || purchasesError || usersError) {
            throw new Error('Failed to get analytics summary');
          }
          
          return new Response(
            JSON.stringify({
              pageViews: pageViewsCount,
              events: eventsCount,
              purchases: purchasesCount,
              users: usersCount,
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          );

        default:
          throw new Error('Invalid endpoint');
      }
    }

    throw new Error(`Method ${req.method} not allowed`);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});