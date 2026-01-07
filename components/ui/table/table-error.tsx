// components/table-error.tsx
import { AlertCircle, RefreshCw, XCircle, Info, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface TableErrorProps {
  /** Error message to display */
  error: string;
  /** Error title (optional) */
  title?: string;
  /** Variant of the error display */
  variant?: "default" | "compact" | "banner" | "card" | "minimal";
  /** Whether to show a retry button */
  showRetry?: boolean;
  /** Retry button click handler */
  onRetry?: () => void;
  /** Whether to show a close/dismiss button */
  showDismiss?: boolean;
  /** Dismiss button click handler */
  onDismiss?: () => void;
  /** Custom icon to display */
  icon?: React.ComponentType<any>;
  /** Additional className */
  className?: string;
  /** Error severity level */
  severity?: "error" | "warning" | "info";
}

export function TableError({
  error,
  title,
  variant = "default",
  showRetry = false,
  onRetry = () => {window.location.reload()},
  showDismiss = false,
  onDismiss,
  icon: Icon,
  className,
  severity = "error",
}: TableErrorProps) {
  // Icon mapping based on severity
  const iconConfig = {
    error: {
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    warning: {
      icon: TriangleAlert,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    info: {
      icon: Info,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  };

  const { icon: SeverityIcon, color, bgColor, borderColor } = iconConfig[severity];
  const DisplayIcon = Icon || SeverityIcon;

  // Variant styles
  const variantStyles = {
    default: `py-8 px-6 rounded-lg border ${bgColor} ${borderColor} text-center`,
    compact: `py-4 px-4 rounded-md border ${bgColor} ${borderColor} text-center`,
    banner: `py-4 px-6 border-b ${bgColor} ${borderColor} text-center`,
    card: `py-6 px-6 rounded-lg border shadow-sm ${bgColor} ${borderColor} text-center`,
    minimal: `py-6 text-center`,
  };

  const renderContent = () => (
    <>
      <div className="flex justify-center mb-3">
        <DisplayIcon className={cn("w-8 h-8", color)} />
      </div>
      
      {title && (
        <h3 className={cn(
          "font-semibold mb-2",
          severity === "error" && "text-red-800",
          severity === "warning" && "text-amber-800",
          severity === "info" && "text-blue-800"
        )}>
          {title}
        </h3>
      )}
      
      <p className={cn(
        "mb-4",
        severity === "error" && "text-red-700",
        severity === "warning" && "text-amber-700",
        severity === "info" && "text-blue-700"
      )}>
        {error}
      </p>

      {(showRetry || showDismiss) && (
        <div className="flex justify-center gap-2">
          {showRetry && (
            <Button
              variant={severity === "error" ? "destructive" : "outline"}
              size="sm"
              onClick={onRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
          {showDismiss && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDismiss}
            >
              Dismiss
            </Button>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className={cn(variantStyles[variant], className)}>
      {renderContent()}
    </div>
  );
}

// Specialized error components for common scenarios
export function NetworkError({ onRetry, onDismiss }: { onRetry?: () => void; onDismiss?: () => void }) {
  return (
    <TableError
      title="Connection Error"
      error="Unable to connect to the server. Please check your internet connection and try again."
      severity="error"
      showRetry
      onRetry={onRetry}
      showDismiss
      onDismiss={onDismiss}
      variant="card"
    />
  );
}

export function EmptyStateError({ 
  message = "No data available", 
  actionText = "Refresh",
  onAction 
}: { 
  message?: string; 
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <TableError
      title="No Data Found"
      error={message}
      severity="info"
      showRetry={!!onAction}
      onRetry={onAction}
      icon={Info}
      variant="default"
    />
  );
}

export function AccessDeniedError({ onRetry }: { onRetry?: () => void }) {
  return (
    <TableError
      title="Access Denied"
      error="You don't have permission to view this data. Please contact your administrator if you believe this is an error."
      severity="warning"
      showRetry={!!onRetry}
      onRetry={onRetry}
      variant="card"
    />
  );
}