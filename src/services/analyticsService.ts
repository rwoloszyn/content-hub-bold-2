import ReactGA from 'react-ga4';
import ReactPixel from 'react-facebook-pixel';
import { supabase } from './supabaseClient';
import { User } from '../types';

// Configuration
const GA_TRACKING_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
const FB_PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID;
const CLARITY_ID = import.meta.env.VITE_MICROSOFT_CLARITY_ID;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Analytics event types
export interface AnalyticsEvent {
  id?: string;
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

export interface PageView {
  id?: string;
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

class AnalyticsService {
  private initialized = false;
  private gaEnabled = false;
  private fbPixelEnabled = false;
  private clarityEnabled = false;
  private supabaseEnabled = false;
  private sessionId: string;
  private currentUser: User | null = null;
  private pageViewStartTime: number | null = null;
  private lastPageUrl: string | null = null;
  private useEdgeFunction = true; // Set to true to use Edge Function, false to use direct Supabase calls

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  initialize(): void {
    if (this.initialized) return;

    // Initialize Google Analytics
    if (GA_TRACKING_ID) {
      try {
        ReactGA.initialize(GA_TRACKING_ID);
        this.gaEnabled = true;
        console.log('Google Analytics initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Google Analytics:', error);
      }
    }

    // Initialize Facebook Pixel
    if (FB_PIXEL_ID) {
      try {
        const options = {
          autoConfig: true,
          debug: false,
        };
        ReactPixel.init(FB_PIXEL_ID, undefined, options);
        this.fbPixelEnabled = true;
        console.log('Facebook Pixel initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Facebook Pixel:', error);
      }
    }

    // Initialize Microsoft Clarity
    if (CLARITY_ID) {
      try {
        this.loadClarityScript(CLARITY_ID);
        this.clarityEnabled = true;
        console.log('Microsoft Clarity initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Microsoft Clarity:', error);
      }
    }

    // Initialize Supabase Analytics
    try {
      // Check if Supabase is configured
      if (supabase && SUPABASE_URL) {
        this.supabaseEnabled = true;
        console.log('Supabase Analytics initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize Supabase Analytics:', error);
    }

    this.initialized = true;
  }

  private loadClarityScript(clarityId: string): void {
    // Create script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${clarityId}`;
    
    // Append to head
    document.head.appendChild(script);
  }

  setUser(user: User | null): void {
    this.currentUser = user;

    // Set user ID in Google Analytics
    if (this.gaEnabled && user) {
      ReactGA.set({ userId: user.id });
    }

    // Set user data in Facebook Pixel
    if (this.fbPixelEnabled && user) {
      ReactPixel.setUserProperties({
        userId: user.id,
        email: user.email,
      });
    }
  }

  private getDeviceInfo(): { deviceType: string; browser: string; os: string } {
    const userAgent = navigator.userAgent;
    
    // Determine device type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
    const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';
    
    // Determine browser
    let browser = 'unknown';
    if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
    else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) browser = 'IE';
    else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';
    
    // Determine OS
    let os = 'unknown';
    if (userAgent.indexOf('Windows') > -1) os = 'Windows';
    else if (userAgent.indexOf('Mac') > -1) os = 'MacOS';
    else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
    else if (userAgent.indexOf('Android') > -1) os = 'Android';
    else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) os = 'iOS';
    
    return { deviceType, browser, os };
  }

  private async makeEdgeFunctionRequest(endpoint: string, data: any): Promise<boolean> {
    if (!SUPABASE_URL) {
      console.warn('SUPABASE_URL not configured, skipping edge function call');
      return false;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/analytics${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken || ''}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Edge function request failed: ${response.status} ${response.statusText}`, errorText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Edge function request error:', error);
      return false;
    }
  }

  async pageView(path: string, title?: string): Promise<void> {
    if (!this.initialized) {
      this.initialize();
    }

    // If there was a previous page view, track the time spent on that page
    if (this.pageViewStartTime && this.lastPageUrl) {
      const timeOnPage = Date.now() - this.pageViewStartTime;
      await this.trackTimeOnPage(this.lastPageUrl, timeOnPage);
    }

    // Reset page view timer
    this.pageViewStartTime = Date.now();
    this.lastPageUrl = path;

    // Google Analytics
    if (this.gaEnabled) {
      ReactGA.send({ hitType: "pageview", page: path, title });
    }

    // Facebook Pixel
    if (this.fbPixelEnabled) {
      ReactPixel.pageView();
    }

    // Supabase Analytics
    if (this.supabaseEnabled) {
      try {
        const { deviceType, browser, os } = this.getDeviceInfo();
        
        const pageViewData: PageView = {
          user_id: this.currentUser?.id,
          page_url: path,
          page_title: title || document.title,
          timestamp: new Date().toISOString(),
          session_id: this.sessionId,
          referrer: document.referrer || undefined,
          device_type: deviceType,
          browser,
          os,
        };
        
        if (this.useEdgeFunction) {
          // Try edge function first, fallback to direct call if it fails
          const success = await this.makeEdgeFunctionRequest('/pageview', pageViewData);
          
          if (!success) {
            console.warn('Edge function failed, falling back to direct Supabase call');
            // Fallback to direct Supabase call
            const { error } = await supabase
              .from('page_views')
              .insert({
                ...pageViewData,
                ip_address: null,
                created_at: new Date().toISOString()
              });
              
            if (error) {
              console.error('Failed to track page view in Supabase:', error);
            }
          }
        } else {
          // Direct Supabase call
          const { error } = await supabase
            .from('page_views')
            .insert({
              ...pageViewData,
              ip_address: null,
              created_at: new Date().toISOString()
            });
            
          if (error) {
            console.error('Failed to track page view in Supabase:', error);
          }
        }
      } catch (error) {
        console.error('Error tracking page view in Supabase:', error);
      }
    }
  }

  private async trackTimeOnPage(pageUrl: string, timeOnPage: number): Promise<void> {
    if (!this.supabaseEnabled) return;
    
    try {
      if (this.useEdgeFunction) {
        // Try edge function first, fallback to direct call if it fails
        const success = await this.makeEdgeFunctionRequest('/update-time', {
          session_id: this.sessionId,
          page_url: pageUrl,
          time_on_page: Math.floor(timeOnPage / 1000) // Convert to seconds
        });

        if (!success) {
          console.warn('Edge function failed for time tracking, falling back to direct Supabase call');
          // Fallback to direct Supabase call
          const { data, error } = await supabase
            .from('page_views')
            .select('id')
            .eq('session_id', this.sessionId)
            .eq('page_url', pageUrl)
            .order('timestamp', { ascending: false })
            .limit(1);
            
          if (error || !data || data.length === 0) {
            console.error('Failed to find page view to update:', error);
            return;
          }
          
          // Update the page view with the time spent
          const { error: updateError } = await supabase
            .from('page_views')
            .update({ time_on_page: Math.floor(timeOnPage / 1000) }) // Convert to seconds
            .eq('id', data[0].id);
            
          if (updateError) {
            console.error('Failed to update page view with time on page:', updateError);
          }
        }
      } else {
        // Direct Supabase call
        const { data, error } = await supabase
          .from('page_views')
          .select('id')
          .eq('session_id', this.sessionId)
          .eq('page_url', pageUrl)
          .order('timestamp', { ascending: false })
          .limit(1);
          
        if (error || !data || data.length === 0) {
          console.error('Failed to find page view to update:', error);
          return;
        }
        
        // Update the page view with the time spent
        const { error: updateError } = await supabase
          .from('page_views')
          .update({ time_on_page: Math.floor(timeOnPage / 1000) }) // Convert to seconds
          .eq('id', data[0].id);
          
        if (updateError) {
          console.error('Failed to update page view with time on page:', updateError);
        }
      }
    } catch (error) {
      console.error('Error tracking time on page:', error);
    }
  }

  async event(category: string, action: string, label?: string, value?: number, properties?: Record<string, any>): Promise<void> {
    if (!this.initialized) {
      this.initialize();
    }

    // Google Analytics
    if (this.gaEnabled) {
      ReactGA.event({
        category,
        action,
        label,
        value
      });
    }

    // Facebook Pixel
    if (this.fbPixelEnabled) {
      ReactPixel.trackCustom(action, {
        category,
        label,
        value,
        ...properties
      });
    }

    // Supabase Analytics
    if (this.supabaseEnabled) {
      try {
        const { deviceType, browser, os } = this.getDeviceInfo();
        
        const eventData: AnalyticsEvent = {
          user_id: this.currentUser?.id,
          event_name: `${category}_${action}`.toLowerCase().replace(/\s+/g, '_'),
          category,
          action,
          label,
          value,
          properties,
          timestamp: new Date().toISOString(),
          session_id: this.sessionId,
          page_url: window.location.href,
          referrer: document.referrer || undefined,
          device_type: deviceType,
          browser,
          os,
        };
        
        if (this.useEdgeFunction) {
          // Try edge function first, fallback to direct call if it fails
          const success = await this.makeEdgeFunctionRequest('/event', eventData);
          
          if (!success) {
            console.warn('Edge function failed, falling back to direct Supabase call');
            // Fallback to direct Supabase call
            const { error } = await supabase
              .from('events')
              .insert({
                ...eventData,
                ip_address: null,
                created_at: new Date().toISOString()
              });
              
            if (error) {
              console.error('Failed to track event in Supabase:', error);
            }
          }
        } else {
          // Direct Supabase call
          const { error } = await supabase
            .from('events')
            .insert({
              ...eventData,
              ip_address: null,
              created_at: new Date().toISOString()
            });
            
          if (error) {
            console.error('Failed to track event in Supabase:', error);
          }
        }
      } catch (error) {
        console.error('Error tracking event in Supabase:', error);
      }
    }
  }

  // Specific event tracking methods
  async trackLogin(method: string): Promise<void> {
    await this.event('User', 'Login', method);
  }

  async trackSignup(method: string): Promise<void> {
    await this.event('User', 'Signup', method);
  }

  async trackContentCreated(contentType: string): Promise<void> {
    await this.event('Content', 'Created', contentType);
  }

  async trackContentPublished(platform: string): Promise<void> {
    await this.event('Content', 'Published', platform);
  }

  async trackSubscriptionChanged(plan: string): Promise<void> {
    await this.event('Subscription', 'Changed', plan);
  }

  async trackFeatureUsed(feature: string): Promise<void> {
    await this.event('Feature', 'Used', feature);
  }

  // E-commerce tracking for RevenueCat
  async trackPurchase(productId: string, currency: string, price: number): Promise<void> {
    if (!this.initialized) {
      this.initialize();
    }

    // Google Analytics
    if (this.gaEnabled) {
      ReactGA.event({
        category: 'Ecommerce',
        action: 'Purchase',
        label: productId,
        value: price
      });
    }

    // Facebook Pixel
    if (this.fbPixelEnabled) {
      ReactPixel.track('Purchase', {
        value: price,
        currency: currency,
        content_ids: [productId],
        content_type: 'product'
      });
    }

    // Supabase Analytics
    if (this.supabaseEnabled) {
      try {
        const { deviceType, browser, os } = this.getDeviceInfo();
        
        const purchaseData = {
          user_id: this.currentUser?.id,
          product_id: productId,
          currency,
          price,
          timestamp: new Date().toISOString(),
          session_id: this.sessionId,
          device_type: deviceType,
          browser,
          os,
        };
        
        if (this.useEdgeFunction) {
          // Try edge function first, fallback to direct call if it fails
          const success = await this.makeEdgeFunctionRequest('/purchase', purchaseData);
          
          if (!success) {
            console.warn('Edge function failed, falling back to direct Supabase call');
            // Fallback to direct Supabase call
            const { error } = await supabase
              .from('purchases')
              .insert({
                ...purchaseData,
                created_at: new Date().toISOString()
              });
              
            if (error) {
              console.error('Failed to track purchase in Supabase:', error);
            }
          }
        } else {
          // Direct Supabase call
          const { error } = await supabase
            .from('purchases')
            .insert({
              ...purchaseData,
              created_at: new Date().toISOString()
            });
            
          if (error) {
            console.error('Failed to track purchase in Supabase:', error);
          }
        }
      } catch (error) {
        console.error('Error tracking purchase in Supabase:', error);
      }
    }
  }

  // Track user properties
  async setUserProperties(properties: Record<string, any>): Promise<void> {
    if (!this.currentUser) return;

    // Google Analytics
    if (this.gaEnabled) {
      ReactGA.set(properties);
    }

    // Facebook Pixel
    if (this.fbPixelEnabled) {
      ReactPixel.setUserProperties(properties);
    }

    // Supabase Analytics
    if (this.supabaseEnabled) {
      try {
        if (this.useEdgeFunction) {
          // Try edge function first, fallback to direct call if it fails
          const success = await this.makeEdgeFunctionRequest('/user-properties', {
            user_id: this.currentUser.id,
            properties,
            updated_at: new Date().toISOString()
          });

          if (!success) {
            console.warn('Edge function failed, falling back to direct Supabase call');
            // Fallback to direct Supabase call
            const { error } = await supabase
              .from('user_properties')
              .upsert({
                user_id: this.currentUser.id,
                properties,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id'
              });
              
            if (error) {
              console.error('Failed to set user properties in Supabase:', error);
            }
          }
        } else {
          // Direct Supabase call
          const { error } = await supabase
            .from('user_properties')
            .upsert({
              user_id: this.currentUser.id,
              properties,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            });
            
          if (error) {
            console.error('Failed to set user properties in Supabase:', error);
          }
        }
      } catch (error) {
        console.error('Error setting user properties in Supabase:', error);
      }
    }
  }
}

export const analyticsService = new AnalyticsService();