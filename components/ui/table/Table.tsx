/**
 * 📊 AFUED Table Component v3.0 (Optimized)
 * Description: Enterprise-grade table with instant sort, filter, selection, export, and smooth UX.
 * Fully token-based and theme-compliant.
 */

"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Download,
  FileSpreadsheet,
  FileText,
  ArrowUp,
  ArrowDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as XLSX from "xlsx";
import theme from "@/styles/theme";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { AccessDeniedError, EmptyStateError, NetworkError, TableError } from "./table-error";

// import { useMemo, useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  compact = false,
  allowPageJump = true,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  compact?: boolean;
  allowPageJump?: boolean;
}) => {
  const [jumpValue, setJumpValue] = useState("");

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const paginationRange = useMemo(() => {
    if (totalPages <= 1) return [1];

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    const middleRange = range(leftSiblingIndex, rightSiblingIndex);

    let pages: (number | string)[] = [1];

    if (showLeftDots) pages.push("...");
    pages.push(...middleRange);
    if (showRightDots) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages, siblingCount]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex  sm:items-center justify-between gap-3 mt-4">

      {/* Navigation */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          // size="sm"
          className="flex min-w-[30px]"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} className="mt-1"/>
                    <span className="hidden sm:flex ">

          Prev
          </span>
        </Button>
      </div>

      {/* Page numbers */}
      {!compact && (
        <div className="flex items-center flex-wrap justify-center gap-1">
          {paginationRange.map((item, i) =>
            item === "..." ? (
              <span key={i} className="px-2 text-gray-500">
                ..
              </span>
            ) : (
              <Button
                key={i}
                variant={item === currentPage ? "default" : "outline"}
                size="sm"
                disabled={item === currentPage}
                onClick={() => onPageChange(Number(item))}
                className="min-w-[30px]"
              >
                {item}
              </Button>
            )
          )}
        </div>
      )}

      {/* Next button */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="flex min-w-[30px]"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          
        >
          <span className="hidden sm:flex ">

          Next
          </span>
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Jump input */}
      {allowPageJump && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && jumpValue) {
                const num = Number(jumpValue);
                if (num >= 1 && num <= totalPages) onPageChange(num);
                setJumpValue("");
              }
            }}
            className="w-20 px-2 py-1 border rounded-md text-sm"
            placeholder="Jump..."
          />
          {jumpValue && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const num = Number(jumpValue);
                if (num >= 1 && num <= totalPages) onPageChange(num);
                setJumpValue("");
              }}
            >
              Go
            </Button>
          )}
        </div>
      )}
    </div>
  );
};



const variantStyles = {
  // 🧊 1. Default
  default: {
    wrapper: "bg-surface",
    table: "border border-border",
    header: "bg-surfaceElevated",
    row: "hover:bg-surfaceElevated",
  },

  // 🦓 2. Striped
  striped: {
    wrapper: "bg-white",
    table: "border border-gray-200",
    header: "bg-gray-100",
    row: "even:bg-gray-50 hover:bg-gray-100",
  },

  // 🪶 3. Borderless
  borderless: {
    wrapper: "bg-transparent",
    table: "border-0 shadow-none",
    header: "bg-transparent font-semibold",
    row: "hover:bg-gray-50",
  },

  // 🧩 4. Compact
  compact: {
    wrapper: "bg-surface text-xs",
    table: "border border-border",
    header: "bg-surfaceElevated py-1",
    row: "py-1 hover:bg-surfaceElevated",
  },

  // 🌚 5. Dark
  dark: {
    wrapper: "bg-gray-900 text-white",
    table: "border border-gray-700",
    header: "bg-gray-800 text-gray-100",
    row: "hover:bg-gray-800",
  },

  // 💼 6. Corporate
  corporate: {
    wrapper: "bg-white",
    table: "border border-gray-300 shadow-sm rounded-lg",
    header: "bg-blue-50 text-blue-900",
    row: "hover:bg-blue-50",
  },

  // 🧠 7. Minimal
  minimal: {
    wrapper: "bg-transparent",
    table: "border-0",
    header: "border-b border-gray-200 text-sm font-medium uppercase",
    row: "hover:bg-gray-100",
  },

  // 🌈 8. Colorful
  colorful: {
    wrapper: "bg-gradient-to-br from-blue-50 to-pink-50",
    table: "border border-transparent shadow-md",
    header: "bg-gradient-to-r from-indigo-500 to-pink-500 text-white",
    row: "hover:bg-white/30 backdrop-blur",
  },

  // 📜 9. Paper
  paper: {
    wrapper: "bg-[#fffefb] text-gray-800",
    table: "border border-gray-200 shadow-sm",
    header: "bg-[#fff8e7] text-gray-900",
    row: "hover:bg-[#fffaf0]",
  },

  // 🪄 10. Glass
  glass: {
    wrapper: "backdrop-blur-lg bg-white/30",
    table: "border border-white/40 shadow-sm",
    header: "bg-white/40 text-gray-900",
    row: "hover:bg-white/30",
  },

  // 🩵 11. Ocean
  ocean: {
    wrapper: "bg-sky-50",
    table: "border border-sky-200",
    header: "bg-sky-100 text-sky-900",
    row: "hover:bg-sky-50 even:bg-sky-50",
  },

  // 🌿 12. Nature
  nature: {
    wrapper: "bg-green-50",
    table: "border border-green-200",
    header: "bg-green-100 text-green-900",
    row: "hover:bg-green-50",
  },

  // 🔥 13. Fire
  fire: {
    wrapper: "bg-orange-50",
    table: "border border-orange-200",
    header: "bg-orange-100 text-orange-900",
    row: "hover:bg-orange-50",
  },

  // 💻 14. Tech
  tech: {
    wrapper: "bg-slate-950 text-gray-100",
    table: "border border-slate-800",
    header: "bg-slate-900 text-blue-400 uppercase text-xs",
    row: "hover:bg-slate-800",
  },

  // 🎨 15. Pastel
  pastel: {
    wrapper: "bg-pink-50",
    table: "border border-pink-100 rounded-xl shadow-sm",
    header: "bg-pink-100 text-pink-900",
    row: "hover:bg-pink-50",
  },

  // 🖤 16. Monochrome
  monochrome: {
    wrapper: "bg-neutral-100 text-neutral-800",
    table: "border border-neutral-300",
    header: "bg-neutral-200 font-semibold",
    row: "hover:bg-neutral-200",
  },

  // 🧬 17. Futuristic
  futuristic: {
    wrapper: "bg-gradient-to-br from-slate-900 to-slate-700 text-sky-100",
    table: "border border-sky-700/30",
    header: "bg-slate-800 text-sky-400",
    row: "hover:bg-slate-700/50",
  },

  // 🪷 18. Soft
  soft: {
    wrapper: "bg-gray-50 text-gray-800",
    table: "border border-gray-100 shadow-sm",
    header: "bg-gray-100 font-semibold text-gray-900",
    row: "hover:bg-gray-50",
  },

  // 🎯 19. Dashboard
  dashboard: {
    wrapper: "bg-gray-50",
    table: "border border-gray-200 rounded-md shadow-sm",
    header: "bg-gray-100 uppercase tracking-wider text-gray-700",
    row: "hover:bg-gray-50 even:bg-gray-50",
  },

  // 🧃 20. Neon
  neon: {
    wrapper: "bg-black text-green-400",
    table: "border border-green-500/30 shadow-[0_0_10px_#22ff88]",
    header: "bg-black text-green-300",
    row: "hover:bg-green-500/10",
  },

  // 🌸 21. Elegant
  elegant: {
    wrapper: "bg-white text-gray-800",
    table: "border border-gray-300 rounded-md shadow-md",
    header: "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900",
    row: "hover:bg-gray-50",
  },

  // 📘 22. BluePrint
  blueprint: {
    wrapper: "bg-blue-950 text-blue-100",
    table: "border border-blue-700",
    header: "bg-blue-800 text-blue-200",
    row: "hover:bg-blue-900",
  },

  // 💫 23. Gradient
  gradient: {
    wrapper: "bg-gradient-to-br from-purple-50 to-indigo-100",
    table: "border border-transparent",
    header: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
    row: "hover:bg-white/40 backdrop-blur",
  },
};
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


interface TableProps<TData extends object> {
  columns: any[];
  data: TData[];
  enableSearch?: boolean;
  enableSort?: boolean;
  enablePagination?: boolean;
  enableFilter?: boolean;
  enableSelection?: boolean;
  enableExport?: boolean;
  serverMode?: boolean;
  onServerQuery?: (query: {
    page: number;
    pageSize: number;
    search?: string;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    filterId?: string;
  }) => void;
  onBulkAction?: (action: string, selectedRows: TData[]) => void;
  pageSize?: number;
  isLoading?: boolean;
  error?: string | null;
  pagination?: any;
  enableDropDown: boolean;
  dropDownData: { text: string; id: string }[];
  // pagination?: {
  //   current_page: number;
  //   total_pages: number;
  //   total_items: number;
  //   limit: number;
  // };

  dropDownText: string;
  variant?: TableVariant;
  controls?: boolean;
  onCellEdit?: (rowIndex: number, columnId: string, newValue: string) => void;
  tableEmptyMessage?: string;
  showNumbering?: boolean;
  numberingType?: "1" | "(1)" | "{1}" | "a" | "A" | "i" | "I";
  numberingText?: string;


  // Error
  onRetry?: () => void;
  onErrorDismiss?: () => void;
  errorTitle?: string;
  errorVariant?: "default" | "compact" | "banner" | "card" | "minimal";

}

export function Table<TData extends object>({
  columns,
  data,
  enableSearch = true,
  enableSort = true,
  enablePagination = true,
  enableFilter = true,
  enableSelection = true,
  enableExport = true,
  serverMode = false,
  onServerQuery,
  onBulkAction,
  pagination,
  pageSize = pagination?.limit || 100,
  isLoading = false,
  error = null,
  enableDropDown = false,
  dropDownData = [{ text: "", id: "0" }],
  dropDownText = "Dropdown",
  variant = "default",
  controls = true,
  tableEmptyMessage = "No records found.",
  showNumbering = false,
  numberingType = "1",
  numberingText = "#",
  onCellEdit,

  // error
    onRetry,
  onErrorDismiss,
  errorTitle,
  errorVariant = "default",
}: TableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sortInfo, setSortInfo] = useState<{ field: string; order: string }>({
    field: "",
    order: "",
  });
  const [selectedDropDownId, setSelectedDropDownId] = useState<string>("");

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [paginationState, setPaginationState] = useState({
    pageIndex: 0,
    pageSize: pageSize, // 👈 use your prop
  });

  useEffect(() => {
    console.log(pagination, data)

  }, [pagination])


  useEffect(() => {
    if (!serverMode || !onServerQuery) return;

    const handler = setTimeout(() => {
      if (!globalFilter && !selectedDropDownId) return;

      onServerQuery({
        page: 1,
        pageSize,
        search: globalFilter,
        sortField: sortInfo.field,
        sortOrder: sortInfo.order as "asc" | "desc",
        // You can include the dropdown ID in your query payload
        // (Make sure your backend expects it!)
        filterId: selectedDropDownId,
      });
    }, 500); // 🕒 500 ms delay

    return () => clearTimeout(handler);
  }, [globalFilter, selectedDropDownId, sortInfo, pageSize, serverMode]);



  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, pagination: paginationState },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPaginationState,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: enableSort ? getSortedRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
  });

  /** ✅ Row Selection Handlers */
  const toggleSelectAll = () => {
    if (selectedRows.size === data.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(data.map((_, i) => i.toString())));
  };

  const toggleSelect = (rowId: string) => {
    const updated = new Set(selectedRows);
    if (updated.has(rowId)) updated.delete(rowId);
    else updated.add(rowId);
    setSelectedRows(updated);
  };

  /** ✅ Instant Local Sort + Optional Remote Fetch */
  const handleSort = (header: any) => {
    if (!enableSort) return;
    header.column.toggleSorting();
    const order = header.column.getIsSorted() === "desc" ? "desc" : "asc";
    const field = header.column.id;
    setSortInfo({ field, order });
    // ⚡ Local sort feels instant
    if (serverMode && onServerQuery) {
      setTimeout(() => {
        onServerQuery({
          page: 1,
          pageSize,
          search: globalFilter,
          sortField: field,
          sortOrder: order as "asc" | "desc",
        });
      }, 300);
    }
  };

  /** ✅ Exports */
  const exportToCSV = () => {
    const csv = [
      Object.keys(data[0] || {}).join(","),
      ...data.map((r) => Object.values(r).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "table.csv";
    a.click();
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "table.xlsx");
  };

  const exportToTxt = () => {
    const txt = data.map((r) => JSON.stringify(r)).join("\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "table.txt";
    a.click();
  };

  /** ✅ Pagination Handlers */
  /** ✅ Pagination Handlers */
  const handlePageChange = useCallback((page: number) => {
    if (serverMode && onServerQuery && pagination) {
      onServerQuery({
        page,
        pageSize: pagination.limit,
        search: globalFilter,
        sortField: sortInfo.field,
        sortOrder: sortInfo.order as "asc" | "desc",
      });
    } else {
      const pageIndex = page - 1;
      table.setPagination({
        pageIndex,
        pageSize: paginationState.pageSize,
      });
    }
  }, [serverMode, onServerQuery, pagination, globalFilter, sortInfo, table, paginationState.pageSize]);

  /** ✅ Filter Handling */
  const applyFilters = (key: string, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
  };

  /** ✅ Show All Records Toggle */
  const visibleData = showAll ? data : table.getRowModel().rows;
  // ✅ Helper to convert number to various formats
  const formatNumber = (index: number): string => {
    const n = index + 1; // start from 1

    switch (numberingType) {
      case "a":
        return String.fromCharCode(96 + n); // a, b, c...
      case "A":
        return String.fromCharCode(64 + n); // A, B, C...
      case "i":
        return n.toString().toLowerCase().replace(/\d+/g, toRoman(n).toLowerCase());
      case "I":
        return n.toString().replace(/\d+/g, toRoman(n));
      case "(1)":
        return `(${n})`;
      case "{1}":
        return `{${n}}`;
      default:
        return n.toString();
    }
  };

  // ✅ Roman numeral converter
  const toRoman = (num: number): string => {
    const romans: [number, string][] = [
      [1000, "M"],
      [900, "CM"],
      [500, "D"],
      [400, "CD"],
      [100, "C"],
      [90, "XC"],
      [50, "L"],
      [40, "XL"],
      [10, "X"],
      [9, "IX"],
      [5, "V"],
      [4, "IV"],
      [1, "I"],
    ];
    let result = "";
    for (const [value, symbol] of romans) {
      while (num >= value) {
        result += symbol;
        num -= value;
      }
    }
    return result;
  };
  const displayInfo = useMemo(() => {
    if (serverMode && pagination) {
      return {
        currentPage: pagination.current_page,
        totalPages: pagination.total_pages,
        startItem: (pagination.current_page - 1) * pagination.limit + 1,
        endItem: Math.min(pagination.current_page * pagination.limit, pagination.total_items),
        totalItems: pagination.total_items,
      };
    } else {
      const pageIndex = paginationState.pageIndex;
      const pageSize = paginationState.pageSize;
      const startItem = pageIndex * pageSize + 1;
      const endItem = Math.min((pageIndex + 1) * pageSize, data.length);

      return {
        currentPage: pageIndex + 1,
        totalPages: Math.ceil(data.length / pageSize),
        startItem,
        endItem,
        totalItems: data.length,
      };
    }
  }, [serverMode, pagination, paginationState, data.length]);
  // Helper to get nested value by path (e.g., 'course.lecturer.name')
  function getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  const getErrorComponent = () => {
    if (!error) return null;

    // Network-related errors
    if (error.includes("network") || error.includes("connection") || error.includes("fetch")) {
      return (
        <NetworkError
          onRetry={onRetry} 
          onDismiss={onErrorDismiss} 
        />
      );
    }

    // Permission errors
    if (error.includes("permission") || error.includes("access") || error.includes("unauthorized")) {
      return (
        <AccessDeniedError
          onRetry={onRetry} 
        />
      );
    }

    // Empty state (treat as informational)
    if (error.includes("No records") || error.includes("No data")) {
      return (
        <EmptyStateError
          message={error} 
          onAction={onRetry}
          actionText="Refresh Data"
        />
      );
    }

    // Generic error with enhanced display
    return (
      <TableError
        error={error}
        title={errorTitle}
        variant={errorVariant}
        showRetry={!!onRetry}
        onRetry={onRetry}
        showDismiss={!!onErrorDismiss}
        onDismiss={onErrorDismiss}
        severity="error"
      />
    );
  };



  return (
    // <div className="w-full p-4 bg-surface  ">
    // <div className={`w-full p-4 rounded-lg ${variantStyles[variant].wrapper}`}>
    <div className={`w-full p-4 ${variantStyles[variant].wrapper}`}>

      {/* Top Controls */}
      <div className="flex  flex-wrap justify-between items-center mb-4 gap-3">
        <div className="flex gap-3 items-center">
          {(enableSearch && controls) && (
            <Input
              placeholder="Search..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-xs"
            />
          )}

          {(enableFilter && controls) && (
            <Select onValueChange={(value) => setSelectedDropDownId(value)}>
              <SelectTrigger className="w-full sm:w-80">
                <SelectValue placeholder={dropDownText} />
              </SelectTrigger>
              <SelectContent>
                {
                  dropDownData.map((value) => (
                    <SelectItem key={value.id} value={value.id}>{value.text}</SelectItem>

                  ))
                }
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Export Buttons */}
        {(enableExport && controls) && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={exportToExcel}>
              <FileSpreadsheet size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={exportToTxt}>
              <FileText size={16} />
            </Button>
          </div>
        )}
      </div>

      {/* Pagination Section (Safe Rendering) */}


      {/* 🌀 Loading / Error */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : error ? (
        // <div className="text-center text-error py-8 font-medium">{error}</div>
        getErrorComponent()
      ) : (
        <div className="overflow-x-auto">
          {/* <table className="min-w-full text-sm border border-border text-left"> */}
          <table className={`min-w-full text-sm ${variantStyles[variant].table} text-left`}>

            {/* <thead className="bg-surfaceElevated"> */}
            <thead className={variantStyles[variant].header}>

              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {(enableSelection && controls) && (
                    <th className="px-4 py-2 border-b border-border">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === data.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                  )}
                  {showNumbering && ( // 👈 add this block
                    <th className="px-4 py-2 border-b border-border font-semibold text-center">
                      {numberingText}
                    </th>
                  )}
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 border-b border-border font-semibold cursor-pointer select-none"
                      onClick={() => handleSort(header)}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() && (
                          header.column.getIsSorted() === "asc" ? (
                            <ArrowUp size={14} />
                          ) : (
                            <ArrowDown size={14} />
                          )
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {visibleData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (enableSelection ? 1 : 0)}
                    className="text-center py-6 text-textSecondary"
                  >
                    {tableEmptyMessage ? tableEmptyMessage : " No records found."}
                  </td>
                </tr>
              ) : (
                visibleData.map((row: any, rowIndex: number) => (
                  // <tr
                  //   key={row.id || rowIndex}
                  //   className={`transition-all ${selectedRows.has(rowIndex.toString())
                  //     ? "bg-accent/10"
                  //     : "hover:bg-surfaceElevated"
                  //     }`}
                  // >
                  <tr
                    key={row.id || rowIndex}
                    className={`transition-all ${variantStyles[variant].row} ${selectedRows.has(rowIndex.toString())
                      ? "bg-accent/10"
                      : ""
                      }`}
                  >

                    {(enableSelection && controls) && (
                      <td className="px-4 py-2 border-b border-border">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(rowIndex.toString())}
                          onChange={() => toggleSelect(rowIndex.toString())}
                        />
                      </td>
                    )}
                    {showNumbering && (
                      <td className="px-4 py-2 border-b border-border text-center font-medium">
                        {formatNumber(rowIndex)}
                      </td>
                    )}

                    {columns.map((col) => (
                      <td
                        key={col.accessorKey}
                        className="px-4 py-2 text-text border-b border-border"
                        contentEditable={col.editable ? "true" : "false"}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => {
                          if (col.editable) {
                            const newValue = e.target.textContent;
                            row.original[col.accessorKey] = newValue;
                            onCellEdit?.(row.index, col.accessorKey, newValue);
                          }
                        }}
                      >
                        {/* Support nested accessorKey like 'course.lecturer' */}
                        {col.cell
                          ? flexRender(col.cell, { row, column: col })
                          : getNestedValue(row.original, col.accessorKey)}
                      </td>
                    ))}

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 📄 Pagination */}
      {displayInfo.totalPages > 1 && pagination && (
                  <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
            {/* Pagination Info */}
            <p className="text-sm text-muted-foreground">
              Showing {(pagination.current_page - 1) * pagination.limit + 1}–
              {Math.min(
                pagination.current_page * pagination.limit,
                pagination.total_items
              )}{" "}
              of {pagination.total_items} items
            </p>

            <PaginationControls
              currentPage={displayInfo.currentPage}
              totalPages={displayInfo.totalPages}
              onPageChange={handlePageChange}
            />

          </div>
      )}

      {/* 🧩 Bulk Actions */}
      {(enableSelection && controls) && selectedRows.size > 0 && (
        <div className="flex justify-end items-center mt-4 gap-2">
          <Button
            variant="outline"
            onClick={() =>
              onBulkAction?.("export", Array.from(selectedRows))
            }
          >
            Export Selected
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              onBulkAction?.("delete", Array.from(selectedRows))
            }
          >
            Delete Selected
          </Button>
        </div>
      )}
    </div>
  );
}
