import { flexRender } from "@tanstack/react-table";
import { memo, useState, useRef, useCallback } from "react";

interface TableCellProps {
  row: any;
  column: any;
  isSelected: boolean;
  rowIndex: number;
  onCellEdit?: (rowIndex: number, columnId: string, newValue: string) => void;
}

export const TableCell = memo(function TableCell({
  row,
  column,
  isSelected,
  rowIndex,
  onCellEdit,
}: TableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const cellRef = useRef<HTMLTableCellElement>(null);

  const handleBlur = useCallback(() => {
    if (column.editable && cellRef.current) {
      const newValue = cellRef.current.textContent || '';
      onCellEdit?.(rowIndex, column.accessorKey, newValue);
    }
    setIsEditing(false);
  }, [column.editable, onCellEdit, rowIndex, column.accessorKey]);

  const handleDoubleClick = useCallback(() => {
    if (column.editable) {
      setIsEditing(true);
      setTimeout(() => {
        cellRef.current?.focus();
      }, 0);
    }
  }, [column.editable]);

  const value = column.cell
    ? flexRender(column.cell, { row, column })
    : row.getValue(column.accessorKey);

  return (
    <td
      ref={cellRef}
      className={`px-4 py-2 text-text border-b border-border ${
        isSelected ? 'bg-accent/10' : ''
      } ${column.editable ? 'cursor-text' : ''}`}
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      onDoubleClick={handleDoubleClick}
      tabIndex={column.editable ? 0 : -1}
    >
      {value}
    </td>
  );
});