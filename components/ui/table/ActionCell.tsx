// components/table/ActionsCell.tsx

import { Button } from "../Button";

interface ActionsCellProps {
  row: any;
  handlers?: {
    edit?: (row: any) => void;
    delete?: (id: string, name: string) => void;
    assign?: (name: string, currentHolder: string, id: string) => void;
    revoke?: (name: string, currentHolder: string, id: string) => void;
  };
  roleField: string;
  assignLabel?: string;
  revokeLabel?: string;
}

export const ActionsCell = ({ 
  row, 
  handlers, 
  roleField, 
  assignLabel = "Assign Role", 
  revokeLabel = "Revoke Role" 
}: ActionsCellProps) => {
  const hasRole = !!row.original[roleField];
  
  return (
    <div className="space-x-2">
      {handlers?.edit && (
        <Button
          onClick={() => handlers.edit?.(row.original)} 
          className="text-blue-600"
        >
          Edit
        </Button>
      )}
      
      {handlers?.delete && (
        <Button 
          onClick={() => handlers.delete?.(row.original._id, row.original.name)} 
          variant="outline" 
          className="text-red-600"
        >
          Delete
        </Button>
      )}
      
      <Button
        onClick={() => {
          if (hasRole && handlers?.revoke) {
            handlers.revoke(row.original.name, row.original[roleField], row.original._id);
          } else if (!hasRole && handlers?.assign) {
            handlers.assign(row.original.name, "", row.original._id);
          }
        }}
        variant="primary"
        size="sm"
      >
        {hasRole ? revokeLabel : assignLabel}
      </Button>
    </div>
  );
};