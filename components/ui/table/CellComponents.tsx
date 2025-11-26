// components/table/CellComponents.tsx
import { Building, BookText, GraduationCap, Users } from 'lucide-react';
import { Badge } from '../Badge';
// import { Badge } from '@/components/ui/badge';

interface IconCellProps {
  value: any;
  icon: React.ComponentType<any>;
  badge?: {
    field: string;
    value: any;
  };
}

export const IconCell = ({ value, icon: Icon, badge }: IconCellProps) => (
  <div className="flex items-center gap-2">
    <Icon className="w-4 h-4 text-muted-foreground" />
    <span className="font-medium">{value}</span>
    {badge && (
      <Badge variant="outline" className="text-xs">
        {badge.value}
      </Badge>
    )}
  </div>
);

interface CountCellProps {
  value: number;
  icon: React.ComponentType<any>;
}

export const CountCell = ({ value, icon: Icon }: CountCellProps) => (
  <div className="flex items-center gap-2">
    <Icon className="w-4 h-4 text-muted-foreground" />
    <span>{value || 0}</span>
  </div>
);

interface RoleCellProps {
  value: string;
  icon: React.ComponentType<any>;
  fallback?: string;
}

export const RoleCell = ({ value, icon: Icon, fallback = "Not Assigned" }: RoleCellProps) => (
  value ? (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span>{value}</span>
    </div>
  ) : (
    <Badge variant="secondary" className="text-xs">{fallback}</Badge>
  )
);