import ReactGA from 'react-ga4';
import ReactPixel from 'react-facebook-pixel';

// Configuration
const GA_TRACKING_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
const FB_PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID;
const CLARITY_ID = import.meta.env.VITE_MICROSOFT_CLARITY_ID;

class AnalyticsService {
  private initialized = false;
  private gaEnabled = false;
  private fbPixelEnabled = false;
  private clarityEnabled = false;

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

  pageView(path: string, title?: string): void {
    if (!this.initialized) {
      this.initialize();
    }

    // Google Analytics
    if (this.gaEnabled) {
      ReactGA.send({ hitType: "pageview", page: path, title });
    }

    // Facebook Pixel
    if (this.fbPixelEnabled) {
      ReactPixel.pageView();
    }

    // Microsoft Clarity (no specific pageview tracking needed)
  }

  event(category: string, action: string, label?: string, value?: number): void {
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
        value
      });
    }

    // Microsoft Clarity (uses automatic event tracking)
  }

  // Specific event tracking methods
  trackLogin(method: string): void {
    this.event('User', 'Login', method);
  }

  trackSignup(method: string): void {
    this.event('User', 'Signup', method);
  }

  trackContentCreated(contentType: string): void {
    this.event('Content', 'Created', contentType);
  }

  trackContentPublished(platform: string): void {
    this.event('Content', 'Published', platform);
  }

  trackSubscriptionChanged(plan: string): void {
    this.event('Subscription', 'Changed', plan);
  }

  trackFeatureUsed(feature: string): void {
    this.event('Feature', 'Used', feature);
  }

  // E-commerce tracking for RevenueCat
  trackPurchase(productId: string, currency: string, price: number): void {
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
  }
}

export const analyticsService = new AnalyticsService();