import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { analyticsService } from '../../services/analyticsService';

export function OAuthCallback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // The hash contains the access token and other auth info
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          // Track successful OAuth login
          const provider = data.session.user.app_metadata.provider || 'unknown';
          analyticsService.trackLogin(provider);
          
          // Redirect to dashboard
          window.location.href = '/dashboard';
        } else {
          throw new Error('No session found');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Please try again.');
        
        // Track failed OAuth login
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        analyticsService.event('Auth', 'OAuth Login Failed', errorMessage);
        
        // Redirect to login page after a delay
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-2">{error}</p>
            <p className="text-gray-600">Redirecting you back to login...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Completing authentication...</p>
          </>
        )}
      </div>
    </div>
  );
}