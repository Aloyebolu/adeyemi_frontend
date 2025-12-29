import { memo, useCallback } from "react";
import { TableCell } from "./TableCell";
import { variantStyles } from "./constants";

interface TableRowProps<TData> {
  row: any;
  index: number;
  columns: any[];
  enableSelection: boolean;
  controls: boolean;
  showNumbering: boolean;
  formatNumber: (index: number) => string;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onCellEdit?: (rowIndex: number, columnId: string, newValue: string) => void;
  variant: string;
}

export const TableRow = memo(function TableRow<TData>({
  row,
  index,
  columns,
  enableSelection,
  controls,
  showNumbering,
  formatNumber,
  isSelected,
  onToggleSelect,
  onCellEdit,
  variant,
}: TableRowProps<TData>) {
  const handleToggle = useCallback(() => {
    onToggleSelect(row.id || index.toString());
  }, [onToggleSelect, row.id, index]);

  const rowStyle = variantStyles[variant as keyof typeof variantStyles]?.row || '';

  return (
    <tr
      key={row.id || index}
      className={`transition-colors ${rowStyle} ${isSelected ? 'bg-accent/10' : ''}`}
    >
      {enableSelection && controls && (
        <td className="px-4 py-2 border-b border-border">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleToggle}
            aria-label={`Select row ${index + 1}`}
          />
        </td>
      )}
      
      {showNumbering && (
        <td className="px-4 py-2 border-b border-border text-center font-medium">
          {formatNumber(index)}
        </td>
      )}

      {columns.map((column) => (
        <TableCell
          key={column.accessorKey}
          row={row}
          column={column}
          isSelected={isSelected}
          rowIndex={index}
          onCellEdit={onCellEdit}
        />
      ))}
    </tr>
  );
});