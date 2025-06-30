import { useState, useEffect } from 'react';
import { User } from '../types';
import { analyticsService } from '../services/analyticsService';
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
              name: profileData?.name || supabaseUser.email?.split('@')[0] || 'User',
              email: supabaseUser.email || '',
              avatar: profileData?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.email?.split('@')[0] || 'User')}&background=3b82f6&color=fff`,
            };
            
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            
            // Set user in analytics service
            analyticsService.setUser(user);
            
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
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        
        // Clear user in analytics service
        analyticsService.setUser(null);
      }
    };

    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
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
              name: profileData?.name || supabaseUser.email?.split('@')[0] || 'User',
              email: supabaseUser.email || '',
              avatar: profileData?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.email?.split('@')[0] || 'User')}&background=3b82f6&color=fff`,
            };
            
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            
            // Set user in analytics service
            analyticsService.setUser(user);
          }
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          
          // Clear user in analytics service
          analyticsService.setUser(null);
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
          
          // Track login event
          analyticsService.trackLogin('email');
          
          return;
        }
        
        throw error;
      }
      
      if (data.user) {
        // Get user profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        const user: User = {
          id: data.user.id,
          name: profileData?.name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          avatar: profileData?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.email?.split('@')[0] || 'User')}&background=3b82f6&color=fff`,
        };
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // Set user in analytics service
        analyticsService.setUser(user);
        
        // Track login event
        analyticsService.trackLogin('email');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid email or password');
    }
  };

  const loginWithOAuth = async (user: User): Promise<void> => {
    try {
      // In a real implementation, this would be handled by Supabase OAuth
      // For this demo, we'll just store the user data
      
      // Store OAuth user data
      const token = `oauth_token_${user.id}`;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Set user in analytics service
      analyticsService.setUser(user);
      
      // Track login event with provider
      analyticsService.trackLogin('oauth');
    } catch (error) {
      console.error('OAuth login failed:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<void> => {
    try {
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
        throw error;
      }
      
      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email: data.user.email,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
          });
          
        if (profileError) {
          console.error('Failed to create profile:', profileError);
        }
        
        const user: User = {
          id: data.user.id,
          name,
          email: data.user.email || '',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
        };
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // Set user in analytics service
        analyticsService.setUser(user);
        
        // Track signup event
        analyticsService.trackSignup('email');
      } else {
        // Fall back to mock signup for demo
        const user: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
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
        
        // Track signup event
        analyticsService.trackSignup('email');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
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
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    try {
      // Try to send password reset with Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      // Track password reset request
      analyticsService.event('User', 'Password Reset Request');
    } catch (error) {
      console.error('Password reset failed:', error);
      
      // For demo purposes, we'll just log the request
      console.log('Password reset requested for:', email);
      
      // Track password reset request
      analyticsService.event('User', 'Password Reset Request');
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