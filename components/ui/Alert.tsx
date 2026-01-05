import React, { ReactNode, useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, TriangleAlert, X } from "lucide-react";

interface AlertProps {
  variant: "success" | "error" | "info" | "warning"| "destructive";
  message: string;
  duration?: number;
  onClose: () => void; // remove from parent
}

type VariantConfig = {
  icon: ReactNode;
  gradient: string;
  border: string;
  text: string;
};
type Variant = "success" | "error" | "info" | "warning" | "destructive";

export const Alert: React.FC<AlertProps> = ({ variant, message, duration = 4000, onClose }) => {
  const [state, setState] = useState<"enter" | "exit">("exit");

  // trigger entrance on mount
  useEffect(() => {
    const enter = setTimeout(() => setState("enter"), 20);
    const autoExit = setTimeout(() => setState("exit"), duration);
    return () => {
      clearTimeout(enter);
      clearTimeout(autoExit);
    };
  }, [duration]);

  // remove after exit animation
  useEffect(() => {
    if (state === "exit") {
      const t = setTimeout(() => onClose(), 420); // match CSS duration
      return () => clearTimeout(t);
    }
  }, [state, onClose]);

const variants: Record<Variant, VariantConfig> = {
  success: {
    icon: <CheckCircle2 className="text-green-500" />,
    gradient:
      "from-green-50 via-green-100 to-green-200 dark:from-green-900 dark:via-green-800 dark:to-green-700",
    border: "border-green-400",
    text: "text-green-900 dark:text-green-100",
  },
  error: {
    icon: <AlertCircle className="text-red-500" />,
    gradient:
      "from-red-50 via-red-100 to-red-200 dark:from-red-900 dark:via-red-800 dark:to-red-700",
    border: "border-red-400",
    text: "text-red-900 dark:text-red-100",
  },
  info: {
    icon: <Info className="text-blue-500" />,
    gradient:
      "from-blue-50 via-blue-100 to-blue-200 dark:from-blue-900 dark:via-blue-800 dark:to-blue-700",
    border: "border-blue-400",
    text: "text-blue-900 dark:text-blue-100",
  },
  warning: {
    icon: <TriangleAlert className="text-yellow-500" />,
    gradient:
      "from-yellow-50 via-yellow-100 to-yellow-200 dark:from-yellow-900 dark:via-yellow-800 dark:to-yellow-700",
    border: "border-yellow-400",
    text: "text-yellow-900 dark:text-yellow-100",
  },
  destructive: {
    icon: <AlertCircle className="text-red-600" />,
    gradient:
      "from-red-100 via-red-200 to-red-300 dark:from-red-900 dark:via-red-800 dark:to-red-700",
    border: "border-red-500",
    text: "text-red-900 dark:text-red-100",
  },
};

  // const { icon, gradient, border, text } = variants[variant];
  let safeVariant: Variant;
  if(variant && Object.keys(variants).includes(variant)){
    safeVariant = variant

  }else{
    safeVariant = "info"
  }

const { icon, gradient, border, text } = variants[safeVariant];


  const isEntering = state === "enter";

  return (
    <div
      style={{
        transform: isEntering ? "translateX(0) scale(1)" : "translateX(120%) scale(0.96)",
        opacity: isEntering ? 1 : 0,
        transition: "transform 420ms cubic-bezier(0.22,1,0.36,1), opacity 300ms ease",
      }}
    >
<div
  className={`flex items-start gap-3 p-4 rounded-xl border-l-4 ${border} ${text}
    bg-white/20 dark:bg-gray-900/20
    bg-gradient-to-br ${gradient}
    backdrop-blur-md
    shadow-lg
    relative overflow-hidden pointer-events-auto`}
>

        <div className="mt-0.5">{icon}</div>
        <div className="flex-1 text-sm font-medium">{message}</div>
        <button
          onClick={() => setState("exit")}
          className="ml-2 hover:scale-110 transition-transform"
          aria-label="close notification"
        >
          <X size={16} />
        </button>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
