"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Optional: Send error to monitoring service
  useEffect(() => {
    console.error("Global error captured:", error);
    // Example:
    // reportErrorToService({ message: error.message, digest: error.digest });
  }, [error]);

  return (
    <html>
      <body className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center border border-gray-200">
          <h2 className="text-2xl font-semibold text-red-600 mb-3">
            Something went wrong
          </h2>

          <p className="text-gray-600 mb-4">
            An unexpected error occurred. You can try again or go back.
          </p>

          {/* Optional: Show useful internal error info in dev mode */}
          {process.env.NODE_ENV === "development" && (
            <pre className="text-left bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm overflow-auto mb-4">
              {error.message}
            </pre>
          )}

          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}

/**
 * global-error.tsx
 *
 * Global Error Boundary for the Next.js App Router.
 * -----------------------------------------------
 * Catches all UI/rendering errors across the app and displays
 * a friendly error page with a reset button.
 *
 * Key Points:
 * 1. Handles React/UI errors (dashboard, components, pages).
 * 2. Shows full error info in development only.
 * 3. Reset button lets users retry failed actions.
 * 4. Does NOT catch API/backend errors or auth/role issues.
 *    Those must be handled in API routes and middleware.
 * 5. Optional: integrate with error reporting services.
 *
 * Usage:
 * Place in `app/global-error.tsx` — Next.js App Router automatically uses it.
 */