import { oauthConfig, OAuthProvider } from '../config/oauth';
import { User } from '../types';

export interface OAuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: OAuthProvider;
}

class OAuthService {
  private popupWindow: Window | null = null;

  // Generate OAuth URL with proper parameters
  private generateAuthUrl(provider: OAuthProvider): string {
    const config = oauthConfig[provider];
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scope,
      response_type: 'code',
      state: this.generateState(provider),
    });

    // Provider-specific parameters
    if (provider === 'google') {
      params.append('access_type', 'offline');
      params.append('prompt', 'consent');
    } else if (provider === 'facebook') {
      params.append('display', 'popup');
    }

    return `${config.authUrl}?${params.toString()}`;
  }

  // Generate secure state parameter
  private generateState(provider: OAuthProvider): string {
    const state = {
      provider,
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substring(2),
    };
    return btoa(JSON.stringify(state));
  }

  // Validate state parameter
  private validateState(state: string, expectedProvider: OAuthProvider): boolean {
    try {
      const decoded = JSON.parse(atob(state));
      return (
        decoded.provider === expectedProvider &&
        Date.now() - decoded.timestamp < 600000 // 10 minutes
      );
    } catch {
      return false;
    }
  }

  // Open OAuth popup window
  private openPopup(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      this.popupWindow = window.open(
        url,
        'oauth_popup',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      if (!this.popupWindow) {
        reject(new Error('Popup blocked. Please allow popups for this site.'));
        return;
      }

      // Listen for popup messages
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'OAUTH_SUCCESS') {
          window.removeEventListener('message', messageListener);
          this.popupWindow?.close();
          resolve(event.data.code);
        } else if (event.data.type === 'OAUTH_ERROR') {
          window.removeEventListener('message', messageListener);
          this.popupWindow?.close();
          reject(new Error(event.data.error || 'OAuth authentication failed'));
        }
      };

      window.addEventListener('message', messageListener);

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (this.popupWindow?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          reject(new Error('Authentication cancelled'));
        }
      }, 1000);
    });
  }

  // Exchange authorization code for user data
  private async exchangeCodeForUser(provider: OAuthProvider, code: string): Promise<OAuthUser> {
    // In a real application, this would make a secure server-side call
    // For demo purposes, we'll simulate the OAuth flow
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user data based on provider
    const mockUsers: Record<OAuthProvider, OAuthUser> = {
      google: {
        id: 'google_123456789',
        email: 'user@gmail.com',
        name: 'John Doe',
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        provider: 'google',
      },
      facebook: {
        id: 'facebook_987654321',
        email: 'user@facebook.com',
        name: 'Jane Smith',
        avatar: 'https://graph.facebook.com/v18.0/me/picture?type=large',
        provider: 'facebook',
      },
      linkedin: {
        id: 'linkedin_456789123',
        email: 'user@linkedin.com',
        name: 'Alex Johnson',
        avatar: 'https://media.licdn.com/dms/image/default-profile-pic',
        provider: 'linkedin',
      },
    };

    return mockUsers[provider];
  }

  // Main OAuth authentication method
  async authenticate(provider: OAuthProvider): Promise<User> {
    try {
      const authUrl = this.generateAuthUrl(provider);
      const code = await this.openPopup(authUrl);
      const oauthUser = await this.exchangeCodeForUser(provider, code);

      // Convert OAuth user to app user format
      const user: User = {
        id: oauthUser.id,
        name: oauthUser.name,
        email: oauthUser.email,
        avatar: oauthUser.avatar,
      };

      return user;
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      throw error;
    }
  }

  // Handle OAuth callback (for the popup window)
  handleCallback(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      window.opener?.postMessage({
        type: 'OAUTH_ERROR',
        error: error === 'access_denied' ? 'Authentication cancelled' : 'Authentication failed'
      }, window.location.origin);
      return;
    }

    if (code && state) {
      try {
        // In a real app, you'd validate the state parameter here
        window.opener?.postMessage({
          type: 'OAUTH_SUCCESS',
          code
        }, window.location.origin);
      } catch (error) {
        window.opener?.postMessage({
          type: 'OAUTH_ERROR',
          error: 'Invalid authentication response'
        }, window.location.origin);
      }
    } else {
      window.opener?.postMessage({
        type: 'OAUTH_ERROR',
        error: 'Missing authentication parameters'
      }, window.location.origin);
    }
  }
}

export const oauthService = new OAuthService();