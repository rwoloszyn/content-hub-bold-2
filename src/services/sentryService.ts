import * as Sentry from '@sentry/react';
import { User } from '../types';

// Configuration
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const SENTRY_ENVIRONMENT = import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development';
const SENTRY_RELEASE = import.meta.env.VITE_SENTRY_RELEASE || 'social-media-manager@1.0.0';

class SentryService {
  private initialized = false;

  initialize(): void {
    if (this.initialized || !SENTRY_DSN) return;

    try {
      Sentry.init({
        dsn: SENTRY_DSN,
        integrations: [
          new Sentry.BrowserTracing({
            // Set sampling rate for performance monitoring
            // This sets the percentage of transactions that will be traced
            tracesSampleRate: 0.2,
          }),
          new Sentry.Replay({
            // Capture 10% of all sessions
            sessionSampleRate: 0.1,
            // Capture 100% of sessions with errors
            errorSampleRate: 1.0,
            // Mask sensitive data in replays
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
        // Performance monitoring
        tracesSampleRate: 0.2,
        // Session replay
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        // Environment and release info
        environment: SENTRY_ENVIRONMENT,
        release: SENTRY_RELEASE,
        // Disable Sentry in development unless explicitly enabled
        enabled: import.meta.env.PROD || SENTRY_ENVIRONMENT !== 'development',
        // Ignore common errors
        ignoreErrors: [
          // Network errors
          'Network request failed',
          'Failed to fetch',
          'NetworkError',
          // Browser extensions
          'ResizeObserver loop limit exceeded',
          // React errors that are usually harmless
          'React does not recognize the `%s` prop on a DOM element',
          'Minified React error #',
        ],
        beforeSend(event) {
          // Don't send events in development unless explicitly enabled
          if (import.meta.env.DEV && SENTRY_ENVIRONMENT === 'development') {
            return null;
          }
          return event;
        },
      });

      console.log('Sentry initialized successfully');
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
  }

  setUser(user: User | null): void {
    if (!this.initialized) return;

    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.name,
      });
    } else {
      Sentry.setUser(null);
    }
  }

  captureException(error: Error, context?: Record<string, any>): string {
    if (!this.initialized) {
      console.error('Error captured but Sentry not initialized:', error);
      return '';
    }

    return Sentry.captureException(error, {
      contexts: context ? { additional: context } : undefined,
    });
  }

  captureMessage(message: string, level?: Sentry.SeverityLevel, context?: Record<string, any>): string {
    if (!this.initialized) {
      console.log('Message captured but Sentry not initialized:', message);
      return '';
    }

    return Sentry.captureMessage(message, {
      level,
      contexts: context ? { additional: context } : undefined,
    });
  }

  addBreadcrumb(breadcrumb: Sentry.Breadcrumb): void {
    if (!this.initialized) return;
    Sentry.addBreadcrumb(breadcrumb);
  }

  startTransaction(context: Sentry.TransactionContext): Sentry.Transaction | undefined {
    if (!this.initialized) return;
    return Sentry.startTransaction(context);
  }

  setTag(key: string, value: string): void {
    if (!this.initialized) return;
    Sentry.setTag(key, value);
  }

  setTags(tags: Record<string, string>): void {
    if (!this.initialized) return;
    Object.entries(tags).forEach(([key, value]) => {
      Sentry.setTag(key, value);
    });
  }

  setContext(name: string, context: Record<string, any>): void {
    if (!this.initialized) return;
    Sentry.setContext(name, context);
  }

  setExtra(key: string, value: any): void {
    if (!this.initialized) return;
    Sentry.setExtra(key, value);
  }

  withProfiler<P extends Record<string, any>>(
    Component: React.ComponentType<P>,
    options?: Sentry.ProfilerProps
  ): React.ComponentType<P> {
    if (!this.initialized) return Component;
    return Sentry.withProfiler(Component, options);
  }

  // Error boundary component
  ErrorBoundary = Sentry.ErrorBoundary;
}

export const sentryService = new SentryService();