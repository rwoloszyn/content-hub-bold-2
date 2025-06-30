import { useState, useEffect } from 'react';
import { User } from '../types';

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
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock authentication - in real app, this would call your API
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
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const loginWithOAuth = async (user: User): Promise<void> => {
    // Store OAuth user data
    const token = `oauth_token_${user.id}`;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const signup = async (email: string, password: string, name: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock user creation
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
  };

  const logout = async (): Promise<void> => {
    // Clear auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would send a password reset email
    console.log('Password reset sent to:', email);
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