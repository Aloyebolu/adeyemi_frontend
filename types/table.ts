// types/table.ts
export interface ColumnConfig {
  accessorKey: string;
  header: string;
  type?: 'text' | 'badge' | 'icon' | 'actions' | 'count';
  icon?: React.ComponentType<any>;
  badgeField?: string;
  fallback?: string;
  actionHandlers?: {
    edit?: (row: any) => void;
    delete?: (id: string, name: string) => void;
    assign?: (name: string, currentHolder: string, id: string) => void;
    revoke?: (name: string, currentHolder: string, id: string) => void;
  };
  assignRoleLabel?: string;
  revokeRoleLabel?: string;
}

export interface TableColumnsProps {
  columns: ColumnConfig[];
  data: any[];
}