/**
 * 📊 AFUED Table Component v3.0 (Optimized)
 * Description: Enterprise-grade table with instant sort, filter, selection, export, and smooth UX.
 * Fully token-based and theme-compliant.
 */

"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import * as XLSX from "xlsx";
import theme from "@/styles/theme";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

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
  }) => void;
  onBulkAction?: (action: string, selectedRows: TData[]) => void;
  pageSize?: number;
  isLoading?: boolean;
  error?: string | null;
  pagination: any
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
  pageSize = 10,
  isLoading = false,
  error = null,
  pagination
}: TableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sortInfo, setSortInfo] = useState<{ field: string; order: string }>({
    field: "",
    order: "",
  });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
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
  const handlePageChange = (next: boolean) => {
    const newPage =
      table.getState().pagination.pageIndex + (next ? 1 : -1);
    if (serverMode && onServerQuery) {
      onServerQuery({
        page: newPage + 1,
        pageSize,
        search: globalFilter,
        sortField: sortInfo.field,
        sortOrder: sortInfo.order as "asc" | "desc",
      });
    } else {
      next ? table.nextPage() : table.previousPage();
    }
  };

  /** ✅ Filter Handling */
  const applyFilters = (key: string, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
  };

  /** ✅ Show All Records Toggle */
  const visibleData = showAll ? data : table.getRowModel().rows;

  return (
    <div className="w-full p-4 bg-surface  ">
      {/* Top Controls */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
        <div className="flex gap-3 items-center">
          {enableSearch && (
            <Input
              placeholder="Search..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-xs"
            />
          )}

          {enableFilter && (
            <Select onValueChange={(e) => { }}>
              <SelectTrigger className="w-full sm:w-80">
                <SelectValue placeholder="Choose a course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"h"}>All status</SelectItem>
                <SelectItem value={"active"}>Active</SelectItem>
                <SelectItem value={"Probation"}>Probation</SelectItem>
                <SelectItem value={"inactive"}>Inactive</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Export Buttons */}
        {enableExport && (
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
      {pagination &&
        pagination.total_items > 0 &&
        pagination.total_pages > 1 && (
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

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === 1}
                onClick={() => handlePageChange(pagination.current_page - 1)}
              >
                Previous
              </Button>

              <span className="text-sm font-medium">
                Page {pagination.current_page} of {pagination.total_pages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === pagination.total_pages}
                onClick={() => handlePageChange(pagination.current_page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}


      {/* 🌀 Loading / Error */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : error ? (
        <div className="text-center text-error py-8 font-medium">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border text-left">
            <thead className="bg-surfaceElevated">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {enableSelection && (
                    <th className="px-4 py-2 border-b border-border">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === data.length}
                        onChange={toggleSelectAll}
                      />
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
                    No records found.
                  </td>
                </tr>
              ) : (
                visibleData.map((row: any, rowIndex: number) => (
                  <tr
                    key={row.id || rowIndex}
                    className={`transition-all ${selectedRows.has(rowIndex.toString())
                      ? "bg-accent/10"
                      : "hover:bg-surfaceElevated"
                      }`}
                  >
                    {enableSelection && (
                      <td className="px-4 py-2 border-b border-border">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(rowIndex.toString())}
                          onChange={() => toggleSelect(rowIndex.toString())}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.accessorKey}
                        className="px-4 py-2 border-b border-border"
                      >
                        {flexRender(
                          col.cell ?? row.original[col.accessorKey],
                          { row, column: col }
                        )}

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
      {enablePagination && (
        <div className="flex justify-between items-center mt-4">
          <Button variant="secondary" onClick={() => handlePageChange(false)}>
            Previous
          </Button>
          <div className="flex items-center gap-3 text-sm text-textSecondary">
            <label>Show all</label>
            <input
              type="checkbox"
              checked={showAll}
              onChange={() => setShowAll(!showAll)}
            />
          </div>
          <Button variant="secondary" onClick={() => handlePageChange(true)}>
            Next
          </Button>
        </div>
      )}

      {/* 🧩 Bulk Actions */}
      {enableSelection && selectedRows.size > 0 && (
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
