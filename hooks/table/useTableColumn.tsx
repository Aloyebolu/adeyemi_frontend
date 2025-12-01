// hooks/useTableColumns.ts
import { useMemo } from 'react';
import { ColumnConfig } from '@/types/table';
import { IconCell, CountCell, RoleCell,  } from '@/components/ui/table/CellComponents';
import { Building, BookText, GraduationCap, Users } from 'lucide-react';
import { ActionsCell } from '@/components/ui/table/ActionCell';

// Icon mappings for common types
const iconMap = {
  faculty: Building,
  department: BookText,
  student: GraduationCap,
  user: Users,
  lecturer: BookText,
  default: Users
};

export const useTableColumns = (columnsConfig: ColumnConfig[]) => {
  const columns = useMemo(() => {
    return columnsConfig.map((config) => {
      const baseColumn = {
        accessorKey: config.accessorKey,
        header: config.header,
      };

      switch (config.type) {
        case 'icon':
          return {
            ...baseColumn,
            cell: ({ row }: { row: any }) => (
              <IconCell
                value={row.original[config.accessorKey]}
                icon={config.icon || iconMap.default}
                badge={config.badgeField ? {
                  field: config.badgeField,
                  value: row.original[config.badgeField]
                } : undefined}
              />
            )
          };

        case 'count':
          return {
            ...baseColumn,
            cell: ({ row }: { row: any }) => (
              <CountCell
                value={row.original[config.accessorKey]}
                icon={config.icon || iconMap.default}
              />
            )
          };

        case 'badge':
          return {
            ...baseColumn,
            cell: ({ row }: { row: any }) => (
              <RoleCell
                value={row.original[config.accessorKey]}
                icon={config.icon || iconMap.default}
                fallback={config.fallback}
              />
            )
          };

        case 'actions':
          return {
            ...baseColumn,
            cell: ({ row }: { row: any }) => (
              <ActionsCell
                row={row}
                handlers={config.actionHandlers}
                roleField={config.accessorKey}
                assignLabel={config.assignRoleLabel}
                revokeLabel={config.revokeRoleLabel}
              />
            )
          };

        default:
          return baseColumn;
      }
    });
  }, [columnsConfig]);

  return columns;
};