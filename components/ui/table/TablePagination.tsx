
import { memo, useCallback, useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export const TablePagination = memo(function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  siblingCount = 1,
}: TablePaginationProps) {
  const [jumpValue, setJumpValue] = useState("");

  const range = useCallback((start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  }, []);

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
  }, [currentPage, totalPages, siblingCount, range]);

  const handleJump = useCallback(() => {
    const num = Number(jumpValue);
    if (num >= 1 && num <= totalPages) {
      onPageChange(num);
      setJumpValue("");
    }
  }, [jumpValue, totalPages, onPageChange]);

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
      <p className="text-sm text-muted-foreground">
        Showing {startItem}–{endItem} of {totalItems} items
      </p>

      <div className="flex sm:items-center justify-between gap-3">
        {/* Previous Button */}
        <Button
          variant="outline"
          className="flex min-w-[30px]"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} className="mt-1"/>
          <span className="hidden sm:flex">Prev</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center flex-wrap justify-center gap-1">
          {paginationRange.map((item, i) =>
            item === "..." ? (
              <span key={i} className="px-2 text-gray-500">..</span>
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

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          className="flex min-w-[30px]"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span className="hidden sm:flex">Next</span>
          <ChevronRight size={16} />
        </Button>

        {/* Jump Input */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleJump();
            }}
            className="w-20 px-2 py-1 border rounded-md text-sm"
            placeholder="Jump..."
          />
          {jumpValue && (
            <Button size="sm" variant="outline" onClick={handleJump}>
              Go
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});