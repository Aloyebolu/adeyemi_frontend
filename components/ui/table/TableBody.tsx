import { memo } from "react";
import { TableRow } from "./TableRow";
import type { TableColumn } from "./types";

interface TableBodyProps<TData> {
  rows: any[];
  columns: TableColumn[];
  enableSelection: boolean;
  controls: boolean;
  showNumbering: boolean;
  formatNumber: (index: number) => string;
  selectedRows: Set<string>;
  onToggleSelect: (id: string) => void;
  onCellEdit?: (rowIndex: number, columnId: string, newValue: string) => void;
  variant: string;
  tableEmptyMessage: string;
}

export const TableBody = memo(function TableBody<TData extends object>({
  rows,
  columns,
  enableSelection,
  controls,
  showNumbering,
  formatNumber,
  selectedRows,
  onToggleSelect,
  onCellEdit,
  variant,
  tableEmptyMessage,
}: TableBodyProps<TData>) {
  if (rows.length === 0) {
    const colspan = columns.length + 
      (enableSelection ? 1 : 0) + 
      (showNumbering ? 1 : 0);
    
    return (
      <tbody>
        <tr>
          <td
            colSpan={colspan}
            className="text-center py-6 text-textSecondary"
          >
            {tableEmptyMessage}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {rows.map((row, index) => (
        <TableRow
          key={row.id || index}
          row={row}
          index={index}
          columns={columns}
          enableSelection={enableSelection}
          controls={controls}
          showNumbering={showNumbering}
          formatNumber={formatNumber}
          isSelected={selectedRows.has(row.id || index.toString())}
          onToggleSelect={onToggleSelect}
          onCellEdit={onCellEdit}
          variant={variant}
        />
      ))}
    </tbody>
  );
});