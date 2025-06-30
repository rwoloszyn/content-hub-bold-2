import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.7'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

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
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

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
    
    // Check if user is an admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (profileError || !profile || profile.role !== 'admin') {
      throw new Error('Unauthorized - Admin access required');
    }

    // Get request path
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Handle different dashboard endpoints
    if (req.method === 'GET') {
      switch (path) {
        case 'summary':
          // Get analytics summary
          const [
            { count: pageViewsCount, error: pageViewsError },
            { count: eventsCount, error: eventsError },
            { count: purchasesCount, error: purchasesError },
            { count: usersCount, error: usersError },
          ] = await Promise.all([
            supabase.from('page_views').select('*', { count: 'exact', head: true }),
            supabase.from('events').select('*', { count: 'exact', head: true }),
            supabase.from('purchases').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
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

        case 'top-pages':
          // Get top pages by views
          const { data: topPages, error: topPagesError } = await supabase
            .from('page_views')
            .select('page_url, page_title')
            .order('timestamp', { ascending: false })
            .limit(100);
            
          if (topPagesError) {
            throw new Error('Failed to get top pages');
          }
          
          // Aggregate page views
          const pageViewsMap = topPages.reduce((acc, page) => {
            const url = page.page_url;
            if (!acc[url]) {
              acc[url] = {
                url,
                title: page.page_title,
                views: 0,
              };
            }
            acc[url].views++;
            return acc;
          }, {});
          
          const topPagesAggregated = Object.values(pageViewsMap)
            .sort((a, b) => b.views - a.views)
            .slice(0, 10);
          
          return new Response(
            JSON.stringify(topPagesAggregated),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          );

        case 'top-events':
          // Get top events
          const { data: topEvents, error: topEventsError } = await supabase
            .from('events')
            .select('event_name, category, action')
            .order('timestamp', { ascending: false })
            .limit(100);
            
          if (topEventsError) {
            throw new Error('Failed to get top events');
          }
          
          // Aggregate events
          const eventsMap = topEvents.reduce((acc, event) => {
            const key = `${event.category}_${event.action}`;
            if (!acc[key]) {
              acc[key] = {
                category: event.category,
                action: event.action,
                count: 0,
              };
            }
            acc[key].count++;
            return acc;
          }, {});
          
          const topEventsAggregated = Object.values(eventsMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
          
          return new Response(
            JSON.stringify(topEventsAggregated),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          );

        case 'user-activity':
          // Get user activity over time
          const { data: userActivity, error: userActivityError } = await supabase
            .from('events')
            .select('timestamp, user_id')
            .order('timestamp', { ascending: true });
            
          if (userActivityError) {
            throw new Error('Failed to get user activity');
          }
          
          // Group by day
          const activityByDay = userActivity.reduce((acc, event) => {
            const date = new Date(event.timestamp).toISOString().split('T')[0];
            if (!acc[date]) {
              acc[date] = {
                date,
                activeUsers: new Set(),
                totalEvents: 0,
              };
            }
            if (event.user_id) {
              acc[date].activeUsers.add(event.user_id);
            }
            acc[date].totalEvents++;
            return acc;
          }, {});
          
          // Convert sets to counts
          const activityTimeline = Object.values(activityByDay).map(day => ({
            date: day.date,
            activeUsers: day.activeUsers.size,
            totalEvents: day.totalEvents,
          }));
          
          return new Response(
            JSON.stringify(activityTimeline),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          );

        case 'revenue':
          // Get revenue data
          const { data: purchases, error: purchasesError } = await supabase
            .from('purchases')
            .select('*')
            .order('timestamp', { ascending: true });
            
          if (purchasesError) {
            throw new Error('Failed to get purchase data');
          }
          
          // Group by day
          const revenueByDay = purchases.reduce((acc, purchase) => {
            const date = new Date(purchase.timestamp).toISOString().split('T')[0];
            if (!acc[date]) {
              acc[date] = {
                date,
                revenue: 0,
                transactions: 0,
              };
            }
            acc[date].revenue += purchase.price;
            acc[date].transactions++;
            return acc;
          }, {});
          
          const revenueTimeline = Object.values(revenueByDay);
          
          return new Response(
            JSON.stringify(revenueTimeline),
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