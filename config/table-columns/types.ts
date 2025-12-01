// config/table-columns/types.ts
import { LucideIcon } from 'lucide-react';

export interface ColumnConfig {
  accessorKey: string;
  header: string;
  type?: 'text' | 'badge' | 'icon' | 'actions' | 'count' | 'custom';
  icon?: LucideIcon;
  badgeField?: string;
  fallback?: string;
  customCell?: string; // Reference to shared custom cells
  actionHandlers?: {
    edit?: (row: any) => void;
    delete?: (id: string, name: string) => void;
    assign?: (name: string, currentHolder: string, id: string) => void;
    revoke?: (name: string, currentHolder: string, id: string) => void;
    custom?: (row: any) => void; // For additional actions
  };
  assignRoleLabel?: string;
  revokeRoleLabel?: string;
  width?: string;
  sortable?: boolean;
}

export interface TablePreset {
  name: string;
  columns: ColumnConfig[];
  defaultSort?: { id: string; desc: boolean };
}