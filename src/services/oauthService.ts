// This file is kept for backward compatibility but is no longer used
// OAuth is now handled directly by Supabase

import { User } from '../types';
import { supabase } from './supabaseClient';
import { analyticsService } from './analyticsService';

export type OAuthProvider = 'google' | 'facebook' | 'linkedin';

class OAuthService {
  async authenticate(provider: OAuthProvider): Promise<User> {
    try {
      // Track OAuth login attempt
      analyticsService.event('Auth', 'OAuth Login Attempt', provider);
      
      // Use Supabase's OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        throw error;
      }
      
      // This won't actually return a user since the OAuth flow redirects the browser
      // The user will be handled in the callback
      return {} as User;
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      throw error;
    }
  }

  // Handle OAuth callback (for the popup window)
  handleCallback(): void {
    // This is now handled by Supabase
    console.log('OAuth callback handled by Supabase');
  }
}

export const oauthService = new OAuthService();