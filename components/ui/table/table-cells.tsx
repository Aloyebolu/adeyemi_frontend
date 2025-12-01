// components/table-cells.tsx
import { Building, BookText, GraduationCap, Users } from "lucide-react";
import { Badge } from "../Badge";
import { Button } from "../Button";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

// Icon with text cell
interface IconTextCellProps {
  row: any;
  icon: React.ComponentType<any>;
  valueKey: string;
  badgeKey?: string;
  fallback?: string | number;
}

export const IconTextCell = ({ 
  row, 
  icon: Icon, 
  valueKey, 
  badgeKey, 
  fallback = 0 
}: IconTextCellProps) => (
  <div className="flex items-center gap-2">
    <Icon className="w-4 h-4 text-muted-foreground" />
    <span className="font-medium">{row.original[valueKey] || fallback}</span>
    {badgeKey && row.original[badgeKey] && (
      <Badge variant="outline" className="text-xs">
        {row.original[badgeKey]}
      </Badge>
    )}
  </div>
);

// Faculty cell with building icon and code badge
export const FacultyCell = ({ row }: { row: any }) => (
  <IconTextCell 
    row={row} 
    icon={Building} 
    valueKey="name" 
    badgeKey="code" 
  />
);

// Count cell with icon
interface CountCellProps {
  row: any;
  icon: React.ComponentType<any>;
  valueKey: string;
  fallback?: number;
}

export const CountCell = ({ row, icon: Icon, valueKey, fallback = 0 }: CountCellProps) => (
  <div className="flex items-center gap-2">
    <Icon className="w-4 h-4 text-muted-foreground" />
    <span>{row.original[valueKey] || fallback}</span>
  </div>
);

// Dean cell with conditional rendering
interface DeanCellProps {
  row: any;
  fallbackText?: string;
}

export const DeanCell = ({ row, fallbackText = "Not Assigned" }: DeanCellProps) => (
  row.original.dean_name ? (
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4 text-muted-foreground" />
      <span>{row.original.dean_name}</span>
    </div>
  ) : (
    <Badge variant="secondary" className="text-xs">{fallbackText}</Badge>
  )
);

export const HODCell = ({ row, fallbackText = "No HOD assigned" }: { row: any; fallbackText?: string }) => (
  row.original.hod_name ? (
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4 text-muted-foreground" />
      <span>{row.original.hod_name}</span>
    </div>
  ) : (
    <Badge variant="secondary" className="text-xs">{fallbackText}</Badge>
  )
);

// Actions cell
interface ActionsCellProps {
  row: any;
  onEdit: (data: any) => void;
  onDelete: (id: string, name: string) => void;
  onAssignDean: (facultyName: string, deanName: string, facultyId: string) => void;
  onRevokeDean: (facultyName: string, deanName: string, facultyId: string) => void;
}

export const ActionsCell = ({ 
  row, 
  onEdit, 
  onDelete, 
  onAssignDean, 
  onRevokeDean 
}: ActionsCellProps) => (
  <div className="space-x-2 flex">
    <Button onClick={() => onEdit(row.original)} className="text-blue-600">
      Edit
    </Button>
    <Button 
      onClick={() => onDelete(row.original._id, row.original.name)} 
      variant="outline" 
      className="text-red-600"
    >
      Delete
    </Button>
    <Button
      onClick={() => {
        if (row.original.dean_name) {
          onRevokeDean(row.original.name, row.original.dean_name, row.original._id);
        } else {
          onAssignDean(row.original.name, "", row.original._id);
        }
      }}
      variant="primary"
      size="sm"
    >
      {row.original.dean_name ? "Revoke Dean" : "Assign Dean"}
    </Button>
  </div>

  
);