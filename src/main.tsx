import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { analyticsService } from './services/analyticsService.ts';
import { supabase } from './services/supabaseClient.ts';
import { sentryService } from './services/sentryService.ts';
import { LingoProvider } from './components/LingoProvider.tsx';

// Initialize services
analyticsService.initialize();
sentryService.initialize();

// App wrapper to handle analytics
function AppWithAnalytics() {
  useEffect(() => {
    // Track initial page view
    analyticsService.pageView(window.location.pathname);
    
    // Set up navigation tracking
    const handleLocationChange = () => {
      analyticsService.pageView(window.location.pathname);
    };

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', handleLocationChange);
    
    // Set up auth state change listener for analytics
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Get user profile data
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();
              
            const userObj = {
              id: user.id,
              name: profileData?.name || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              avatar: profileData?.avatar_url || '',
            };
            
            // Set user in analytics service
            analyticsService.setUser(userObj);
            
            // Set user in Sentry
            sentryService.setUser(userObj);
            
            // Track login event
            analyticsService.trackLogin('supabase');
          }
        } else if (event === 'SIGNED_OUT') {
          // Clear user in analytics service
          analyticsService.setUser(null);
          
          // Clear user in Sentry
          sentryService.setUser(null);
          
          // Track logout event
          analyticsService.event('User', 'Logout');
        }
      }
    );

    // Set up global error handler
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      // Send to Sentry
      if (error) {
        sentryService.captureException(error, {
          source,
          lineno,
          colno,
        });
      } else {
        sentryService.captureMessage(message.toString(), 'error', {
          source,
          lineno,
          colno,
        });
      }
      
      // Call original handler if it exists
      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error);
      }
      
      // Return false to let the error propagate
      return false;
    };

    // Set up unhandled promise rejection handler
    const originalOnUnhandledRejection = window.onunhandledrejection;
    window.onunhandledrejection = (event) => {
      // Send to Sentry
      if (event.reason instanceof Error) {
        sentryService.captureException(event.reason, {
          unhandledRejection: true,
        });
      } else {
        sentryService.captureMessage(`Unhandled Promise Rejection: ${event.reason}`, 'error', {
          unhandledRejection: true,
        });
      }
      
      // Call original handler if it exists
      if (originalOnUnhandledRejection) {
        originalOnUnhandledRejection.call(window, event);
      }
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      subscription.unsubscribe();
      
      // Restore original error handlers
      window.onerror = originalOnError;
      window.onunhandledrejection = originalOnUnhandledRejection;
    };
  }, []);

  return (
    <sentryService.ErrorBoundary fallback={<ErrorFallback />}>
      <LingoProvider>
        <App />
      </LingoProvider>
    </sentryService.ErrorBoundary>
  );
}

// Error fallback component
function ErrorFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We've encountered an unexpected error. Our team has been notified and is working to fix the issue.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh the page
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full text-gray-600 hover:text-gray-800 transition-colors"
          >
            Go to homepage
          </button>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithAnalytics />
  </StrictMode>
);