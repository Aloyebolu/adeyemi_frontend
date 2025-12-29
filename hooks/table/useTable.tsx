import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { 
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import { debounce } from "lodash-es";
import { TableProps, TableQuery } from "@/components/ui/table";
// import type { TableProps, TableQuery } from "../types";

interface UseTableOptions<TData extends object> extends Pick<
  TableProps<TData>,
  | 'columns' | 'data' | 'enableSort' | 'enablePagination' 
  | 'serverMode' | 'onServerQuery' | 'pageSize' | 'pagination'
> {
  dataVersion?: number; // Add this to force re-initialization
}

export function useTable<TData extends object>({
  columns,
  data,
  enableSort = true,
  enablePagination = true,
  serverMode = false,
  onServerQuery,
  pageSize = 100,
  pagination,
  dataVersion = 0, // Default value
}: UseTableOptions<TData>) {
  console.log('useTable called with data length:', data?.length, 'version:', dataVersion);

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedDropDownId, setSelectedDropDownId] = useState<string>("");
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  // Refs to track previous values
  const prevGlobalFilterRef = useRef("");
  const prevSelectedDropDownIdRef = useRef("");
  const prevSortingRef = useRef<SortingState>([]);
  const isInitialMount = useRef(true);
  const prevDataVersionRef = useRef(dataVersion);

  // Force reset when dataVersion changes
  useEffect(() => {
    if (prevDataVersionRef.current !== dataVersion) {
      console.log('Data version changed, resetting table state');
      // Reset pagination to first page when data changes
      setPaginationState({
        pageIndex: 0,
        pageSize,
      });
      setSorting([]);
      setGlobalFilter("");
      prevDataVersionRef.current = dataVersion;
    }
  }, [dataVersion, pageSize]);

  // Debounced server query - memoized to prevent recreation
  const debouncedServerQuery = useMemo(
    () => debounce((query: TableQuery) => {
      console.log('Server query triggered:', query);
      onServerQuery?.(query);
    }, 300),
    [onServerQuery]
  );

  // Server query effect
  useEffect(() => {
    console.log('Server query effect triggered', {
      serverMode,
      hasOnServerQuery: !!onServerQuery,
      globalFilter,
      selectedDropDownId,
      sorting,
    });

    // Don't trigger on initial mount if no filter/search is set
    if (isInitialMount.current && !globalFilter && !selectedDropDownId) {
      isInitialMount.current = false;
      console.log('Initial mount, skipping server query');
      return;
    }

    // Check if values actually changed
    const globalFilterChanged = globalFilter !== prevGlobalFilterRef.current;
    const dropDownChanged = selectedDropDownId !== prevSelectedDropDownIdRef.current;
    const sortingChanged = JSON.stringify(sorting) !== JSON.stringify(prevSortingRef.current);

    console.log('Change detection:', {
      globalFilterChanged,
      dropDownChanged,
      sortingChanged,
      serverMode,
      onServerQuery: !!onServerQuery,
    });

    // Only trigger if something actually changed and we're in server mode
    if ((globalFilterChanged || dropDownChanged || sortingChanged) && serverMode && onServerQuery) {
      console.log('Changes detected, triggering server query');
      
      const timeoutId = setTimeout(() => {
        debouncedServerQuery({
          page: 1,
          pageSize,
          search: globalFilter,
          sortField: sorting[0]?.id,
          sortOrder: sorting[0]?.desc ? "desc" : "asc",
          filterId: selectedDropDownId,
        });
      }, 500);

      // Update refs
      prevGlobalFilterRef.current = globalFilter;
      prevSelectedDropDownIdRef.current = selectedDropDownId;
      prevSortingRef.current = [...sorting];

      return () => {
        console.log('Clearing timeout');
        clearTimeout(timeoutId);
      };
    }
  }, [
    globalFilter, 
    selectedDropDownId, 
    sorting, 
    pageSize, 
    serverMode, 
    onServerQuery, 
    debouncedServerQuery
  ]);

  // TanStack Table instance - ensure it updates when data changes
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting: enableSort ? sorting : [],
      pagination: enablePagination ? paginationState : { pageIndex: 0, pageSize: 10000 },
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPaginationState,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: enableSort ? getSortedRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    manualSorting: serverMode,
    manualPagination: serverMode,
    manualFiltering: serverMode,
    // Force re-initialization when dataVersion changes
    autoResetPageIndex: false,
  });

  // Debug effect
  useEffect(() => {
    console.log('Table state updated:', {
      rows: table.getRowModel().rows.length,
      dataLength: data?.length,
      globalFilter,
      sorting,
      paginationState,
    });
  }, [table, data, globalFilter, sorting, paginationState]);

  // Cleanup
  useEffect(() => {
    return () => {
      console.log('Cleaning up useTable');
      debouncedServerQuery.cancel();
    };
  }, [debouncedServerQuery]);

  return {
    table,
    globalFilter,
    setGlobalFilter,
    selectedDropDownId,
    setSelectedDropDownId,
    paginationState,
    setPaginationState,
    sorting,
    debouncedServerQuery,
  };
}