import { flexRender } from "@tanstack/react-table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { memo, useCallback } from "react";
import { variantStyles } from "./constants";

interface TableHeaderProps {
  header: any;
  enableSort: boolean;
  enableSelection: boolean;
  controls: boolean;
  showNumbering: boolean;
  numberingText: string;
  variant: string;
  onSort: (header: any) => void;
}

export const TableHeader = memo(function TableHeader({
  header,
  enableSort,
  enableSelection,
  controls,
  showNumbering,
  numberingText,
  variant,
  onSort,
}: TableHeaderProps) {
  const handleClick = useCallback(() => {
    if (enableSort) {
      onSort(header);
    }
  }, [enableSort, onSort, header]);

  const headerStyle = variantStyles[variant as keyof typeof variantStyles]?.header || '';
  const isSorted = header.column.getIsSorted();

  // Skip selection column header
  if (header.id === "select") {
    return (
      <th className="px-4 py-2 border-b border-border">
        <input type="checkbox" aria-label="Select all rows" />
      </th>
    );
  }

  // Skip numbering column header
  if (header.id === "numbering") {
    return (
      <th className="px-4 py-2 border-b border-border font-semibold text-center">
        {numberingText}
      </th>
    );
  }

  return (
    <th
      className={`px-4 py-2 border-b border-border font-semibold ${
        enableSort ? 'cursor-pointer select-none' : ''
      } ${headerStyle}`}
      onClick={handleClick}
      style={{ userSelect: 'none' }}
    >
      <div className="flex items-center gap-1">
        {flexRender(header.column.columnDef.header, header.getContext())}
        {isSorted && (
          isSorted === "asc" ? (
            <ArrowUp size={14} aria-label="Sorted ascending" />
          ) : (
            <ArrowDown size={14} aria-label="Sorted descending" />
          )
        )}
      </div>
    </th>
  );
});