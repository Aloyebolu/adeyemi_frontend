import { memo, useMemo, useState, useCallback, useEffect, useRef } from "react";
import { TableControls } from "./TableControls";
import { TableExport } from "./TableExport";
import { TableLoading } from "./TableLoading";
import { TableBody } from "./TableBody";
import { TablePagination } from "./TablePagination";
import { TableHeader } from "./TableHeader";
import { Button } from "@/components/ui/Button";
import { variantStyles, NUMBERING_TYPES } from "./constants";
import type { TableProps } from "./types";
import { useTable } from "@/hooks/table/useTable";

export const Table = memo(function Table<TData extends object>({
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
  pageSize = 100,
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
  onRetry,
  onErrorDismiss,
  errorTitle,
  errorVariant = "default",
}: TableProps<TData>) {
  console.log('Table rendering with data:', { dataLength: data?.length, columnsLength: columns?.length });
  
  // Selected rows state
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  
  // Track previous data to detect changes
  const prevDataRef = useRef<TData[]>([]);
  const dataVersionRef = useRef(0);

  // Increment version when data changes
  useEffect(() => {
    if (data !== prevDataRef.current) {
      prevDataRef.current = data;
      dataVersionRef.current += 1;
      console.log('Data changed, version:', dataVersionRef.current);
    }
  }, [data]);

  // Table hook for core functionality - pass dataVersion to force re-initialization
  const {
    table,
    globalFilter,
    setGlobalFilter,
    selectedDropDownId,
    setSelectedDropDownId,
    sorting,
    paginationState,
  } = useTable({
    columns,
    data,
    enableSort,
    enablePagination,
    serverMode,
    onServerQuery,
    pageSize,
    pagination,
    dataVersion: dataVersionRef.current, // Force re-initialization when data changes
  });

  // Format number helper
  const formatNumber = useCallback((index: number): string => {
    const n = index + 1;
    const formatter = NUMBERING_TYPES[numberingType] || NUMBERING_TYPES["1"];
    return formatter(n);
  }, [numberingType]);

  // Row selection handlers
  const toggleSelectAll = useCallback(() => {
    setSelectedRows(prev => {
      if (prev.size === data.length) return new Set();
      return new Set(data.map((_, i) => i.toString()));
    });
  }, [data.length]);

  const toggleSelect = useCallback((rowId: string) => {
    setSelectedRows(prev => {
      const updated = new Set(prev);
      if (updated.has(rowId)) updated.delete(rowId);
      else updated.add(rowId);
      return updated;
    });
  }, []);

  // Sorting handler
  const handleSort = useCallback((header: any) => {
    if (enableSort) {
      header.column.toggleSorting();
    }
  }, [enableSort]);

  // Get variant styles
  const variantStyle = variantStyles[variant] || variantStyles.default;

  // Get visible rows - FIXED: Use a stable reference
  const visibleRows = useMemo(() => {
    console.log('Getting visible rows, total:', table.getRowModel().rows.length);
    return table.getRowModel().rows;
  }, [table, dataVersionRef.current]); // Add dataVersion as dependency

  // Handle page change for server mode
  const handlePageChange = useCallback((page: number) => {
    console.log('Page change requested:', page);
    if (serverMode && onServerQuery && pagination) {
      onServerQuery({
        page,
        pageSize: pagination.limit,
        search: globalFilter,
        sortField: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
        filterId: selectedDropDownId,
      });
    }
  }, [serverMode, onServerQuery, pagination, globalFilter, sorting, selectedDropDownId]);

  // Reset selection when data changes
  useEffect(() => {
    setSelectedRows(new Set());
  }, [data]);

  // Debug effect
  useEffect(() => {
    if (visibleRows.length > 0) {
      console.log('First visible row data:', visibleRows[0]?.original);
    }
  }, [visibleRows]);

  // Loading state
  if (isLoading) {
    console.log('Table is loading...');
    return <TableLoading />;
  }

  // Error state
  if (error) {
    console.log('Table error:', error);
    return (
      <div className="p-4 text-center text-error">
        <div className="mb-2">{error}</div>
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="primary"
            className="mt-2"
          >
            Retry
          </Button>
        )}
      </div>
    );
  }

  // Check if we have data to display
  if (!data || data.length === 0) {
    console.log('No data to display');
    return (
      <div className={`w-full p-4 ${variantStyle.wrapper}`}>
        {controls && (
          <TableControls
            enableSearch={enableSearch}
            enableFilter={enableFilter}
            dropDownData={dropDownData}
            dropDownText={dropDownText}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            onDropDownChange={setSelectedDropDownId}
          />
        )}
        <div className="text-center py-10 text-textSecondary">
          {tableEmptyMessage}
        </div>
      </div>
    );
  }

  console.log('Rendering table with', visibleRows.length, 'visible rows');

  return (
    <div className={`w-full p-4 ${variantStyle.wrapper}`}>
      {/* Controls */}
      {controls && (
        <>
          <TableControls
            enableSearch={enableSearch}
            enableFilter={enableFilter}
            dropDownData={dropDownData}
            dropDownText={dropDownText}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            onDropDownChange={setSelectedDropDownId}
          />
          
          {enableExport && (
            <div className="flex justify-end mb-4">
              <TableExport data={data} enableExport={enableExport} />
            </div>
          )}
        </>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={`min-w-full text-sm ${variantStyle.table} text-left`}>
          {/* Header */}
          <thead className={variantStyle.header}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {enableSelection && controls && (
                  <th className="px-4 py-2 border-b border-border">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === data.length && data.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Select all rows"
                      disabled={data.length === 0}
                    />
                  </th>
                )}
                {showNumbering && (
                  <th className="px-4 py-2 border-b border-border font-semibold text-center">
                    {numberingText}
                  </th>
                )}
                {headerGroup.headers.map((header) => (
                  <TableHeader
                    key={header.id}
                    header={header}
                    enableSort={enableSort}
                    enableSelection={enableSelection}
                    controls={controls}
                    showNumbering={showNumbering}
                    numberingText={numberingText}
                    variant={variant}
                    onSort={handleSort}
                  />
                ))}
              </tr>
            ))}
          </thead>

          {/* Body */}
          <TableBody
            rows={visibleRows}
            columns={columns}
            enableSelection={enableSelection}
            controls={controls}
            showNumbering={showNumbering}
            formatNumber={formatNumber}
            selectedRows={selectedRows}
            onToggleSelect={toggleSelect}
            onCellEdit={onCellEdit}
            variant={variant}
            tableEmptyMessage={tableEmptyMessage}
          />
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && pagination && pagination.total_pages > 1 && (
        <TablePagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          totalItems={pagination.total_items}
          pageSize={pagination.limit}
          onPageChange={handlePageChange}
        />
      )}

      {/* Bulk Actions */}
      {enableSelection && controls && selectedRows.size > 0 && (
        <div className="flex justify-end items-center mt-4 gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const selectedData = Array.from(selectedRows)
                .map(id => data[parseInt(id)]);
              onBulkAction?.("export", selectedData);
            }}
          >
            Export Selected
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const selectedData = Array.from(selectedRows)
                .map(id => data[parseInt(id)]);
              onBulkAction?.("delete", selectedData);
            }}
          >
            Delete Selected
          </Button>
        </div>
      )}
    </div>
  );
}) as <TData extends object>(props: TableProps<TData>) => JSX.Element;