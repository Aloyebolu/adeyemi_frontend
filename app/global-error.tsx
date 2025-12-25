// app/global-error.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  ChevronDown, 
  ChevronUp,
  Copy,
  XCircle,
  Info,
  ExternalLink,
  Bug
} from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorTime] = useState(new Date().toLocaleString());

  // Optional: Send error to monitoring service
  useEffect(() => {
    console.error("Global error captured:", error);
    
    // Example error reporting (uncomment and configure your service)
    /*
    reportErrorToService({ 
      message: error.message, 
      digest: error.digest,
      stack: error.stack,
      url: window.location.href,
      timestamp: errorTime
    });
    */
  }, [error]);

  const copyErrorDetails = () => {
    const errorDetails = `
Error Time: ${errorTime}
URL: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}
Message: ${error.message}
Digest: ${error.digest || 'N/A'}
Stack: ${error.stack || 'N/A'}
    `.trim();

    navigator.clipboard.writeText(errorDetails).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openSupportTicket = () => {
    const subject = encodeURIComponent(`Application Error: ${error.message.substring(0, 50)}...`);
    const body = encodeURIComponent(`
Error Details:
- Message: ${error.message}
- Time: ${errorTime}
- URL: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}
- Digest: ${error.digest || 'N/A'}

Please describe what you were doing when the error occurred:
    `);
    window.open(`mailto:support@example.com?subject=${subject}&body=${body}`);
  };

  return (
    <html>
      <head>
        <title>Something went wrong | Application Error</title>
      </head>
      <body className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 max-w-2xl w-full border border-gray-200">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Something went wrong
              </h1>
              <p className="text-gray-600">
                We apologize for the inconvenience. Please try the actions below.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => reset()}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <RefreshCw className="h-5 w-5" />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = "/"}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
              >
                <Home className="h-5 w-5" />
                Go Home
              </button>
              
              <button
                onClick={openSupportTicket}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
              >
                <ExternalLink className="h-5 w-5" />
                Report Issue
              </button>
            </div>

            {/* Error Details Toggle */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Bug className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-gray-900">Error Details</span>
                  {process.env.NODE_ENV === "development" && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium">
                      Development Mode
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {isDetailsOpen ? "Hide" : "Show"} details
                  </span>
                  {isDetailsOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </button>

              {/* Error Details Content */}
              {isDetailsOpen && (
                <div className="p-4 space-y-4 bg-white border-t border-gray-200">
                  {/* Error Message */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">Error Message</span>
                      <button
                        onClick={copyErrorDetails}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                      <code className="text-red-700 font-mono text-sm break-words">
                        {error.message}
                      </code>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-700 text-sm">Error Digest</span>
                      <div className="mt-1 bg-gray-50 border border-gray-200 rounded p-2">
                        <code className="text-gray-600 font-mono text-xs">
                          {error.digest || "No digest available"}
                        </code>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 text-sm">Time</span>
                      <div className="mt-1 bg-gray-50 border border-gray-200 rounded p-2">
                        <span className="text-gray-600 text-sm">{errorTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stack Trace (Development only) */}
                  {process.env.NODE_ENV === "development" && error.stack && (
                    <div>
                      <span className="font-medium text-gray-700 text-sm">Stack Trace</span>
                      <div className="mt-1">
                        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-auto max-h-60">
                          {error.stack}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Helpful Tips */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900 mb-1">What can you do?</p>
                        <ul className="text-blue-700 text-sm space-y-1">
                          <li>• Try refreshing the page or clicking "Try Again"</li>
                          <li>• Clear your browser cache and cookies</li>
                          <li>• Ensure you have a stable internet connection</li>
                          <li>• Contact support if the issue persists</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Help */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                If the problem continues, please contact our support team.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-3">
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Hard Refresh
                </button>
                <span className="text-gray-300">•</span>
                <button
                  onClick={() => window.history.back()}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Go Back
                </button>
                <span className="text-gray-300">•</span>
                <a
                  href="/help"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                >
                  Help Center
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              Error ID: {error.digest || "N/A"} • {typeof window !== 'undefined' && window.location.hostname}
            </p>
          </div>
        </div>

        {/* Hidden for screen readers */}
        <div className="sr-only" aria-live="assertive" role="alert">
          An error occurred: {error.message}. Please try again or contact support if the issue persists.
        </div>
      </body>
    </html>
  );
}

/**
 * Enhanced Global Error Component
 * -------------------------------
 * Features:
 * 1. Collapsible error details dropdown (closed by default)
 * 2. Copy error details to clipboard
 * 3. Report issue via email
 * 4. Multiple recovery options
 * 5. Better visual hierarchy and UX
 * 6. Development/production mode handling
 * 7. Accessibility improvements
 * 8. Timestamp and context information
 * 9. Helpful tips for users
 * 
 * Usage: Place in `app/global-error.tsx`
 * Next.js App Router automatically uses this component for global errors.
 * 
 * Note: This component only handles UI/render errors.
 * API errors should be handled in specific error boundaries or API routes.
 */