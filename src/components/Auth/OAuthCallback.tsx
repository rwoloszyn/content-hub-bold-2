import React, { useEffect } from 'react';
import { oauthService } from '../../services/oauthService';

export function OAuthCallback() {
  useEffect(() => {
    // Handle the OAuth callback
    oauthService.handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}