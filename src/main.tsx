import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { analyticsService } from './services/analyticsService.ts';
import { supabase } from './services/supabaseClient.ts';

// Initialize analytics
analyticsService.initialize();

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
            
            // Track login event
            analyticsService.trackLogin('supabase');
          }
        } else if (event === 'SIGNED_OUT') {
          // Clear user in analytics service
          analyticsService.setUser(null);
          
          // Track logout event
          analyticsService.event('User', 'Logout');
        }
      }
    );

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <App />
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithAnalytics />
  </StrictMode>
);