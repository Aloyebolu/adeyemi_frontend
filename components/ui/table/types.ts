export type TableVariant =
  | "default"
  | "striped"
  | "borderless"
  | "compact"
  | "dark"
  | "corporate"
  | "minimal"
  | "colorful"
  | "paper"
  | "glass"
  | "ocean"
  | "nature"
  | "fire"
  | "tech"
  | "pastel"
  | "monochrome"
  | "futuristic"
  | "soft"
  | "dashboard"
  | "neon"
  | "elegant"
  | "blueprint"
  | "gradient";

export interface TableQuery {
  page: number;
  pageSize: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  filterId?: string;
}

export interface TablePagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  limit: number;
}

export interface TableColumn {
  accessorKey: string;
  header: string;
  cell?: any;
  editable?: boolean;
}

export interface TableProps<TData extends object> {
  columns: TableColumn[];
  data: TData[];
  enableSearch?: boolean;
  enableSort?: boolean;
  enablePagination?: boolean;
  enableFilter?: boolean;
  enableSelection?: boolean;
  enableExport?: boolean;
  serverMode?: boolean;
  onServerQuery?: (query: TableQuery) => void;
  onBulkAction?: (action: string, selectedRows: TData[]) => void;
  pageSize?: number;
  isLoading?: boolean;
  error?: string | null;
  pagination?: TablePagination;
  enableDropDown: boolean;
  dropDownData: { text: string; id: string }[];
  dropDownText: string;
  variant?: TableVariant;
  controls?: boolean;
  onCellEdit?: (rowIndex: number, columnId: string, newValue: string) => void;
  tableEmptyMessage?: string;
  showNumbering?: boolean;
  numberingType?: "1" | "(1)" | "{1}" | "a" | "A" | "i" | "I";
  numberingText?: string;
  onRetry?: () => void;
  onErrorDismiss?: () => void;
  errorTitle?: string;
  errorVariant?: "default" | "compact" | "banner" | "card" | "minimal";
}