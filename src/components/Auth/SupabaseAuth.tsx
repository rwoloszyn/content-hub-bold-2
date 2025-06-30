import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { 
  Auth,
  OAuthProvider
} from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../services/supabaseClient';
import { analyticsService } from '../../services/analyticsService';

export function SupabaseAuth() {
  const [view, setView] = useState<'sign_in' | 'sign_up' | 'forgotten_password'>('sign_in');
  
  // Track authentication events
  const handleViewChange = (newView: 'sign_in' | 'sign_up' | 'forgotten_password') => {
    setView(newView);
    analyticsService.event('Auth', 'View Change', newView);
  };

  return (
    <AuthLayout
      title={view === 'sign_in' ? 'Welcome back' : view === 'sign_up' ? 'Create your account' : 'Reset your password'}
      subtitle={view === 'sign_in' ? 'Sign in to your ContentHub account' : view === 'sign_up' ? 'Start your content creation journey today' : 'Enter your email to receive reset instructions'}
    >
      <div className="space-y-6">
        {/* Demo Account Info */}
        {view === 'sign_in' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Demo Account</h4>
                <p className="text-sm text-blue-800 mb-2">
                  Try the demo with these credentials:
                </p>
                <div className="text-sm text-blue-700 font-mono bg-blue-100 rounded px-2 py-1">
                  Email: demo@contenthub.com<br />
                  Password: password
                </div>
              </div>
            </div>
          </div>
        )}

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#3b82f6',
                  brandAccent: '#2563eb',
                }
              }
            },
            className: {
              button: 'w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors',
              input: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              label: 'block text-sm font-medium text-gray-700 mb-2',
              anchor: 'text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors',
            }
          }}
          providers={['google', 'facebook', 'linkedin']}
          view={view}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email address',
                password_label: 'Password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: "Don't have an account? Sign up",
              },
              sign_up: {
                email_label: 'Email address',
                password_label: 'Password',
                button_label: 'Sign up',
                loading_button_label: 'Signing up...',
                social_provider_text: 'Sign up with {{provider}}',
                link_text: 'Already have an account? Sign in',
              },
              forgotten_password: {
                email_label: 'Email address',
                button_label: 'Send reset instructions',
                loading_button_label: 'Sending reset instructions...',
                link_text: 'Back to sign in',
              },
            }
          }}
          redirectTo={`${window.location.origin}/auth/callback`}
          onViewChange={(newView) => {
            if (newView === 'sign_in' || newView === 'sign_up' || newView === 'forgotten_password') {
              handleViewChange(newView);
            }
          }}
        />
      </div>
    </AuthLayout>
  );
}