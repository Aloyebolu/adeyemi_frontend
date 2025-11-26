// components/advanced-table-skeleton.tsx
import { cn } from "@/lib/utils";

interface AdvancedTableSkeletonProps {
  rows?: number;
  /** Column configurations for more accurate skeleton */
  columns?: Array<{
    width?: "auto" | "small" | "medium" | "large" | "xlarge";
    align?: "left" | "center" | "right";
  }>;
  showSearch?: boolean;
  showFilter?: boolean;
  showExport?: boolean;
  showSelection?: boolean;
  showNumbering?: boolean;
  showPagination?: boolean;
  variant?: "default" | "striped" | "compact" | "dark";
  className?: string;
}

export function AdvancedTableSkeleton({
  rows = 5,
  columns = Array(4).fill({}),
  showSearch = true,
  showFilter = true,
  showExport = true,
  showSelection = false,
  showNumbering = false,
  showPagination = true,
  variant = "default",
  className,
}: AdvancedTableSkeletonProps) {
  const variantStyles = {
    default: {
      wrapper: "bg-surface",
      table: "border border-border",
      header: "bg-surfaceElevated",
      row: "hover:bg-surfaceElevated",
    },
    striped: {
      wrapper: "bg-white",
      table: "border border-gray-200",
      header: "bg-gray-100",
      row: "even:bg-gray-50",
    },
    compact: {
      wrapper: "bg-surface text-xs",
      table: "border border-border",
      header: "bg-surfaceElevated py-1",
      row: "py-1",
    },
    dark: {
      wrapper: "bg-gray-900",
      table: "border border-gray-700",
      header: "bg-gray-800",
      row: "hover:bg-gray-800",
    },
  };

  const getWidthClass = (width?: string) => {
    switch (width) {
      case "small": return "w-16";
      case "medium": return "w-32";
      case "large": return "w-48";
      case "xlarge": return "w-64";
      default: return "w-24";
    }
  };

  const currentVariant = variantStyles[variant];

  return (
    <div className={cn("w-full p-4 rounded-lg", currentVariant.wrapper, className)}>
      {/* Top Controls */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3 animate-pulse">
        <div className="flex gap-3 items-center">
          {showSearch && (
            <div className="h-10 bg-gray-200 rounded-md w-64" />
          )}
          {showFilter && (
            <div className="h-10 bg-gray-200 rounded-md w-80" />
          )}
        </div>

        {showExport && (
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 w-9 bg-gray-200 rounded-md" />
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={cn("min-w-full text-sm", currentVariant.table)}>
          <thead className={currentVariant.header}>
            <tr>
              {showSelection && (
                <th className="px-4 py-2 border-b border-border w-12">
                  <div className="h-4 bg-gray-300 rounded mx-auto w-4" />
                </th>
              )}
              {showNumbering && (
                <th className="px-4 py-2 border-b border-border w-12">
                  <div className="h-4 bg-gray-300 rounded mx-auto w-4" />
                </th>
              )}
              {columns.map((col, index) => (
                <th key={index} className="px-4 py-2 border-b border-border">
                  <div
                    className={cn(
                      "h-4 bg-gray-300 rounded mx-auto",
                      getWidthClass(col.width),
                      col.align === "center" && "mx-auto",
                      col.align === "right" && "ml-auto"
                    )}
                  />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  "transition-all border-b border-border",
                  variant === "striped" && rowIndex % 2 === 0 && "even:bg-gray-50",
                  currentVariant.row
                )}
              >
                {showSelection && (
                  <td className="px-4 py-2">
                    <div className="h-4 bg-gray-200 rounded mx-auto w-4" />
                  </td>
                )}
                {showNumbering && (
                  <td className="px-4 py-2 text-center">
                    <div className="h-4 bg-gray-200 rounded mx-auto w-4" />
                  </td>
                )}
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-2">
                    <div
                      className={cn(
                        "h-4 bg-gray-200 rounded",
                        getWidthClass(col.width),
                        col.align === "center" && "mx-auto",
                        col.align === "right" && "ml-auto",
                        // Random slight variations for natural look
                        colIndex % 4 === 0 && "w-3/4",
                        colIndex % 4 === 1 && "w-1/2", 
                        colIndex % 4 === 2 && "w-5/6",
                        colIndex % 4 === 3 && "w-2/3"
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
          <div className="h-4 bg-gray-200 rounded w-48" />
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-9 w-9 bg-gray-200 rounded-md" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-20 bg-gray-200 rounded-md" />
            <div className="h-9 w-12 bg-gray-200 rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
}