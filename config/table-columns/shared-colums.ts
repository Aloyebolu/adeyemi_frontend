// config/table-columns/shared-columns.ts
import { Building, BookText, GraduationCap, Users, User, Mail, Phone } from 'lucide-react';
import { ColumnConfig } from './types';

// Reusable column configurations
export const sharedColumns = {
  // Icon-based columns
  nameWithIcon: (icon = Building, badgeField?: string): ColumnConfig => ({
    accessorKey: "name",
    header: "Name",
    type: "icon",
    icon,
    badgeField
  }),

  codeWithIcon: (icon = Building): ColumnConfig => ({
    accessorKey: "code", 
    header: "Code",
    type: "icon",
    icon
  }),

  // Count-based columns
  countWithIcon: (accessorKey: string, header: string, icon: LucideIcon): ColumnConfig => ({
    accessorKey,
    header,
    type: "count",
    icon
  }),

  // Role-based columns
  roleWithIcon: (accessorKey: string, header: string, icon: LucideIcon, fallback = "Not Assigned"): ColumnConfig => ({
    accessorKey,
    header,
    type: "badge",
    icon,
    fallback
  }),

  // Action columns
  actionsWithRole: (
    roleField: string, 
    handlers: ColumnConfig['actionHandlers'],
    assignLabel = "Assign Role",
    revokeLabel = "Revoke Role"
  ): ColumnConfig => ({
    accessorKey: roleField,
    header: "Actions",
    type: "actions",
    actionHandlers: handlers,
    assignRoleLabel: assignLabel,
    revokeRoleLabel: revokeLabel
  }),

  // Simple text columns
  text: (accessorKey: string, header: string): ColumnConfig => ({
    accessorKey,
    header,
    type: "text"
  }),

  // User info columns
  email: (): ColumnConfig => ({
    accessorKey: "email",
    header: "Email",
    type: "icon",
    icon: Mail
  }),

  phone: (): ColumnConfig => ({
    accessorKey: "phone",
    header: "Phone",
    type: "icon", 
    icon: Phone
  }),

  userWithIcon: (): ColumnConfig => ({
    accessorKey: "username",
    header: "User",
    type: "icon",
    icon: User
  })
};