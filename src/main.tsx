import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { analyticsService } from './services/analyticsService.ts';

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

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
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