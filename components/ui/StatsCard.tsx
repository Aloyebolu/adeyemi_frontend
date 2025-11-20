import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import React from "react";

type Variant = "primary" | "success" | "warning" | "danger" | "info";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  variant?: Variant;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-primary-10 text-primary",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
  danger: "bg-error/20 text-error",
  info: "bg-blue-100 text-blue-600"
};

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon,
  variant = "primary",
  loading = false
}) => {
  if (loading) {
    return <StatsCardSkeleton />;
  }

  return (
    <Card className="transition-all duration-300 hover:scale-[1.02] hover:shadow-md bg-background">
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text2 text-sm">{label}</p>
            <p className="text-2xl font-semibold text-text-primary mt-1">{value}</p>
          </div>

          <div className={cn("p-3 rounded-xl", variantStyles[variant])}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export const StatsCardSkeleton: React.FC = () => {
  return (
    <Card className="animate-pulse">
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded-md mb-3" />
            <div className="h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded-md" />
          </div>

          <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
};
export default StatsCard;
