import React from 'react';
import { sentryService } from '../services/sentryService';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  message?: string;
  showReportButton?: boolean;
}

export function ErrorFallback({ 
  error, 
  resetError, 
  message = 'Something went wrong', 
  showReportButton = true 
}: ErrorFallbackProps) {
  const handleReport = () => {
    if (error) {
      // Capture the error in Sentry if it hasn't been captured already
      sentryService.captureException(error);
    }
    
    // Show feedback dialog if available
    if (typeof Sentry !== 'undefined' && Sentry.showReportDialog) {
      Sentry.showReportDialog();
    } else {
      alert('Thank you for reporting this issue. Our team has been notified.');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{message}</h2>
      <p className="text-gray-600 mb-6">
        We've encountered an unexpected error. Our team has been notified and is working to fix the issue.
      </p>
      
      {error && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg text-left">
          <p className="text-sm font-medium text-gray-700">Error details:</p>
          <p className="text-sm text-gray-600 font-mono overflow-auto">{error.message}</p>
        </div>
      )}
      
      <div className="space-y-3">
        {resetError && (
          <button
            onClick={resetError}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try again
          </button>
        )}
        
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
        >
          Refresh the page
        </button>
        
        {showReportButton && (
          <button
            onClick={handleReport}
            className="w-full text-primary-600 hover:text-primary-800 transition-colors"
          >
            Report this issue
          </button>
        )}
      </div>
    </div>
  );
}