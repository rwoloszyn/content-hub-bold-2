import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { OAuthCallback } from './OAuthCallback';
import { useAuth } from '../../hooks/useAuth';

type AuthView = 'login' | 'signup' | 'forgot-password' | 'oauth-callback';

export function AuthContainer() {
  const [currentView, setCurrentView] = useState<AuthView>(() => {
    // Check if this is an OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code') && urlParams.get('state')) {
      return 'oauth-callback';
    }
    return 'login';
  });
  
  const { login, loginWithOAuth, signup, sendPasswordReset } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };

  const handleOAuthLogin = async (user: any) => {
    await loginWithOAuth(user);
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    await signup(email, password, name);
  };

  const handleForgotPassword = async (email: string) => {
    await sendPasswordReset(email);
  };

  switch (currentView) {
    case 'login':
      return (
        <LoginForm
          onLogin={handleLogin}
          onOAuthLogin={handleOAuthLogin}
          onSwitchToSignup={() => setCurrentView('signup')}
          onForgotPassword={() => setCurrentView('forgot-password')}
        />
      );
    
    case 'signup':
      return (
        <SignupForm
          onSignup={handleSignup}
          onOAuthLogin={handleOAuthLogin}
          onSwitchToLogin={() => setCurrentView('login')}
        />
      );
    
    case 'forgot-password':
      return (
        <ForgotPasswordForm
          onSendReset={handleForgotPassword}
          onBackToLogin={() => setCurrentView('login')}
        />
      );
    
    case 'oauth-callback':
      return <OAuthCallback />;
    
    default:
      return null;
  }
}