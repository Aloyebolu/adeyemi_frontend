// utils/table-config.ts
import React from "react";
import { BookText, GraduationCap } from "lucide-react";
import { 
  FacultyCell, 
  CountCell, 
  DeanCell, 
  ActionsCell,
  IconTextCell, 
  HODCell
} from "@/components/ui/table/table-cells";

export type CellType = 
  | "faculty" 
  | "count" 
  | "dean" 
  | "hod"
  | "actions" 
  | "iconText"
  | "custom"; // Add custom type

export interface BaseColumnConfig {
  accessorKey: string;
  header: string;
}

export interface ComponentColumnConfig extends BaseColumnConfig {
  cellType: Exclude<CellType, "custom">;
  cellProps?: Record<string, any>;
  handlers?: {
    onEdit?: (data: any) => void;
    onDelete?: (id: string, name: string) => void;
    onAssignDean?: (facultyName: string, deanName: string, facultyId: string) => void;
    onRevokeDean?: (facultyName: string, deanName: string, facultyId: string) => void;
  };
}

export interface CustomColumnConfig extends BaseColumnConfig {
  cellType: "custom";
  cell: ({ row }: { row: any }) => React.ReactNode;
}

export type ColumnConfig = ComponentColumnConfig | CustomColumnConfig;

// Cell component mapping
const cellComponents: Record<Exclude<CellType, "custom">, React.ComponentType<any>> = {
  faculty: FacultyCell,
  count: CountCell,
  dean: DeanCell,
  actions: ActionsCell,
  iconText: IconTextCell,
  hod: HODCell
};

// Create columns from configuration
export const createColumns = (config: ColumnConfig[]) => {
  return config.map(column => {
    // For custom cells, return as-is
    if (column.cellType === 'custom' || !column.cellType) {
      return {
        accessorKey: column.accessorKey,
        header: column.header,
        cell: column.cell
      };
    }
    
    // For component-based cells
    return {
      accessorKey: column.accessorKey,
      header: column.header,
      cell: ({ row }: { row: any }) => {
        const CellComponent = cellComponents[column.cellType];
        
        if (column.cellType === 'actions' && column.handlers) {
          return <CellComponent row={row} {...column.handlers} />;
        }
        
        if (column.cellProps) {
          return <CellComponent row={row} {...column.cellProps} />;
        }
        
        return <CellComponent row={row} />;
      }
    };
  });
};