import { useState, useEffect } from 'react';
import { User } from '../types';
import { analyticsService } from '../services/analyticsService';
import { sentryService } from '../services/sentryService';
import { supabase } from '../services/supabaseClient';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        // First check local storage for compatibility with existing code
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Set user in analytics service
          analyticsService.setUser(user);
          
          // Set user in Sentry
          sentryService.setUser(user);
          
          return;
        }
        
        // Then check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: { user: supabaseUser } } = await supabase.auth.getUser();
          
          if (supabaseUser) {
            // Get user profile data
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supabaseUser.id)
              .single();
              
            const user: User = {
              id: supabaseUser.id,
              name: profileData?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
              email: supabaseUser.email || '',
              avatar: profileData?.avatar_url || supabaseUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.email?.split('@')[0] || 'User')}&background=3b82f6&color=fff`,
            };
            
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            
            // Set user in analytics service
            analyticsService.setUser(user);
            
            // Set user in Sentry
            sentryService.setUser(user);
            
            return;
          }
        }
        
        // No valid session found
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        
        // Clear user in analytics service
        analyticsService.setUser(null);
        
        // Clear user in Sentry
        sentryService.setUser(null);
      } catch (error) {
        console.error('Auth check failed:', error);
        sentryService.captureException(error instanceof Error ? error : new Error(String(error)));
        
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        
        // Clear user in analytics service
        analyticsService.setUser(null);
        
        // Clear user in Sentry
        sentryService.setUser(null);
      }
    };

    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          const { data: { user: supabaseUser } } = await supabase.auth.getUser();
          
          if (supabaseUser) {
            // Check if profile exists
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supabaseUser.id)
              .single();
              
            // If profile doesn't exist, create it
            if (profileError || !profileData) {
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: supabaseUser.id,
                  name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
                  email: supabaseUser.email,
                  avatar_url: supabaseUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.email?.split('@')[0] || 'User')}&background=3b82f6&color=fff`,
                });
                
              if (insertError) {
                console.error('Failed to create profile:', insertError);
                sentryService.captureException(insertError);
              }
            }
            
            // Get updated profile data
            const { data: updatedProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supabaseUser.id)
              .single();
              
            const user: User = {
              id: supabaseUser.id,
              name: updatedProfile?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
              email: supabaseUser.email || '',
              avatar: updatedProfile?.avatar_url || supabaseUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.email?.split('@')[0] || 'User')}&background=3b82f6&color=fff`,
            };
            
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            
            // Set user in analytics service
            analyticsService.setUser(user);
            
            // Set user in Sentry
            sentryService.setUser(user);
            
            // Track login event
            const provider = supabaseUser.app_metadata?.provider || 'email';
            analyticsService.trackLogin(provider);
          }
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          
          // Clear user in analytics service
          analyticsService.setUser(null);
          
          // Clear user in Sentry
          sentryService.setUser(null);
        } else if (event === 'USER_UPDATED') {
          // Refresh user data
          const { data: { user: supabaseUser } } = await supabase.auth.getUser();
          
          if (supabaseUser) {
            // Get updated profile data
            const { data: updatedProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supabaseUser.id)
              .single();
              
            const user: User = {
              id: supabaseUser.id,
              name: updatedProfile?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
              email: supabaseUser.email || '',
              avatar: updatedProfile?.avatar_url || supabaseUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.email?.split('@')[0] || 'User')}&background=3b82f6&color=fff`,
            };
            
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            
            // Update user in analytics service
            analyticsService.setUser(user);
            
            // Update user in Sentry
            sentryService.setUser(user);
          }
        }
      }
    );
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Add breadcrumb for login attempt
      sentryService.addBreadcrumb({
        category: 'auth',
        message: 'Login attempt',
        level: 'info',
      });
      
      // Try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Fall back to mock authentication for demo
        if (email === 'demo@contenthub.com' && password === 'password') {
          const user: User = {
            id: 'user-1',
            name: 'Sarah Johnson',
            email: email,
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          };
          
          // Store auth data
          localStorage.setItem('auth_token', 'mock_token_123');
          localStorage.setItem('user_data', JSON.stringify(user));
          
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Set user in analytics service
          analyticsService.setUser(user);
          
          // Set user in Sentry
          sentryService.setUser(user);
          
          // Track login event
          analyticsService.trackLogin('email');
          
          return;
        }
        
        // Log error to Sentry
        sentryService.captureException(error);
        
        throw error;
      }
    } catch (error) {
      console.error('Login failed:', error);
      sentryService.captureException(error instanceof Error ? error : new Error(String(error)));
      throw new Error('Invalid email or password');
    }
  };

  const loginWithOAuth = async (provider: 'google' | 'facebook' | 'linkedin'): Promise<void> => {
    try {
      // Add breadcrumb for OAuth login attempt
      sentryService.addBreadcrumb({
        category: 'auth',
        message: `OAuth login attempt with ${provider}`,
        level: 'info',
      });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        // Log error to Sentry
        sentryService.captureException(error);
        throw error;
      }
      
      // Track OAuth login attempt
      analyticsService.event('Auth', 'OAuth Login Attempt', provider);
    } catch (error) {
      console.error('OAuth login failed:', error);
      sentryService.captureException(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<void> => {
    try {
      // Add breadcrumb for signup attempt
      sentryService.addBreadcrumb({
        category: 'auth',
        message: 'Signup attempt',
        level: 'info',
      });
      
      // Try to sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        // Log error to Sentry
        sentryService.captureException(error);
        throw error;
      }
      
      // Track signup event
      analyticsService.trackSignup('email');
    } catch (error) {
      console.error('Signup failed:', error);
      sentryService.captureException(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Add breadcrumb for logout
      sentryService.addBreadcrumb({
        category: 'auth',
        message: 'Logout',
        level: 'info',
      });
      
      // Track logout event before clearing user
      analyticsService.event('User', 'Logout');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      // Clear user in analytics service
      analyticsService.setUser(null);
      
      // Clear user in Sentry
      sentryService.setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      sentryService.captureException(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    try {
      // Add breadcrumb for password reset request
      sentryService.addBreadcrumb({
        category: 'auth',
        message: 'Password reset request',
        level: 'info',
      });
      
      // Try to send password reset with Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        // Log error to Sentry
        sentryService.captureException(error);
        throw error;
      }
      
      // Track password reset request
      analyticsService.event('User', 'Password Reset Request');
    } catch (error) {
      console.error('Password reset failed:', error);
      sentryService.captureException(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  };

  return {
    ...authState,
    login,
    loginWithOAuth,
    signup,
    logout,
    sendPasswordReset,
  };
}