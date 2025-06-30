import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

interface PageViewData {
  user_id?: string;
  page_url: string;
  page_title?: string;
  timestamp: string;
  session_id: string;
  referrer?: string;
  time_on_page?: number;
  device_type: string;
  browser: string;
  os: string;
}

interface EventData {
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

interface PurchaseData {
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

interface UserPropertiesData {
  user_id: string;
  properties: Record<string, any>;
  updated_at: string;
}

interface TimeUpdateData {
  session_id: string;
  page_url: string;
  time_on_page: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname

    // Health check endpoint
    if (path.includes('/health')) {
      return new Response(
        JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      // Set the auth token for RLS
      supabaseClient.auth.setSession({
        access_token: authHeader.replace('Bearer ', ''),
        refresh_token: ''
      })
    }

    // Route based on the path
    if (path.includes('/pageview')) {
      const data: PageViewData = await req.json()
      
      const { error } = await supabaseClient
        .from('page_views')
        .insert({
          user_id: data.user_id || null,
          page_url: data.page_url,
          page_title: data.page_title || null,
          timestamp: data.timestamp,
          session_id: data.session_id,
          referrer: data.referrer || null,
          time_on_page: data.time_on_page || null,
          device_type: data.device_type,
          browser: data.browser,
          os: data.os,
          ip_address: req.headers.get('x-forwarded-for') || null,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error inserting page view:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (path.includes('/event')) {
      const data: EventData = await req.json()
      
      const { error } = await supabaseClient
        .from('events')
        .insert({
          user_id: data.user_id || null,
          event_name: data.event_name,
          category: data.category,
          action: data.action,
          label: data.label || null,
          value: data.value || null,
          properties: data.properties || null,
          timestamp: data.timestamp,
          session_id: data.session_id,
          page_url: data.page_url,
          referrer: data.referrer || null,
          device_type: data.device_type,
          browser: data.browser,
          os: data.os,
          ip_address: req.headers.get('x-forwarded-for') || null,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error inserting event:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (path.includes('/purchase')) {
      const data: PurchaseData = await req.json()
      
      const { error } = await supabaseClient
        .from('purchases')
        .insert({
          user_id: data.user_id || null,
          product_id: data.product_id,
          currency: data.currency,
          price: data.price,
          timestamp: data.timestamp,
          session_id: data.session_id,
          device_type: data.device_type,
          browser: data.browser,
          os: data.os,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error inserting purchase:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (path.includes('/user-properties')) {
      const data: UserPropertiesData = await req.json()
      
      const { error } = await supabaseClient
        .from('user_properties')
        .upsert({
          user_id: data.user_id,
          properties: data.properties,
          updated_at: data.updated_at
        }, {
          onConflict: 'user_id'
        })

      if (error) {
        console.error('Error upserting user properties:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (path.includes('/update-time')) {
      const data: TimeUpdateData = await req.json()
      
      // Find the most recent page view for this URL and session
      const { data: pageViews, error: selectError } = await supabaseClient
        .from('page_views')
        .select('id')
        .eq('session_id', data.session_id)
        .eq('page_url', data.page_url)
        .order('timestamp', { ascending: false })
        .limit(1)

      if (selectError || !pageViews || pageViews.length === 0) {
        console.error('Failed to find page view to update:', selectError)
        return new Response(
          JSON.stringify({ error: 'Page view not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Update the page view with the time spent
      const { error: updateError } = await supabaseClient
        .from('page_views')
        .update({ time_on_page: data.time_on_page })
        .eq('id', pageViews[0].id)

      if (updateError) {
        console.error('Failed to update page view with time on page:', updateError)
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // If no matching route found
    return new Response(
      JSON.stringify({ error: 'Route not found' }),
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})