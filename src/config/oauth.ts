// OAuth Configuration
export const oauthConfig = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
    redirectUri: `${window.location.origin}/auth/callback/google`,
    scope: 'openid email profile',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  },
  facebook: {
    appId: import.meta.env.VITE_FACEBOOK_APP_ID || 'your-facebook-app-id',
    redirectUri: `${window.location.origin}/auth/callback/facebook`,
    scope: 'email,public_profile',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
  },
  linkedin: {
    clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || 'your-linkedin-client-id',
    redirectUri: `${window.location.origin}/auth/callback/linkedin`,
    scope: 'openid profile email',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
  },
};

export type OAuthProvider = keyof typeof oauthConfig;