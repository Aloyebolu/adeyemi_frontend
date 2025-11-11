// SuperAssignment.tsx
// Consumed tokens: theme.colors.primary, theme.colors.accent, spacing scale, border radii
// This component is a highly-configurable two-pane assignment UI used across AFUED dashboards.
// - Uses Tailwind utility classes mapped to design tokens (see styles/theme.ts)
// - Rounded corners: rounded-xl, shadows: shadow-md
// - Accessibility: focus rings, keyboard navigable

import React, { useEffect, useMemo, useState } from "react";
import theme from "@/styles/theme";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { usePage } from "@/hooks/usePage";
import { useNotifications } from "@/hooks/useNotification";
import { motion } from "framer-motion";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Search as SearchIcon } from "lucide-react";

// Types
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total?: number;
}

export interface SuperAssignmentProps<TLeft = any, TRight = any> {
  leftTitle?: string;
  rightTitle?: string;
  fetchLeftData?: (params?: { page?: number; q?: string }) => Promise<{ data: TLeft[]; meta?: PaginationMeta }>;
  fetchRightData?: (params?: { page?: number; q?: string }) => Promise<{ data: TRight[]; meta?: PaginationMeta }>;
  leftData?: TLeft[]; // static fallback
  rightData?: TRight[]; // static fallback
  renderLeftItem?: (item: TLeft) => React.ReactNode;
  renderRightItem?: (item: TRight) => React.ReactNode;
  keyLeft?: (item: TLeft) => string;
  keyRight?: (item: TRight) => string;
  onAssign?: (left: TLeft[], right: TRight[]) => Promise<void> | void;
  onUnassign?: (left: TLeft[], right: TRight[]) => Promise<void> | void;
  allowMultiSelect?: boolean;
  enableSearch?: boolean;
  enablePagination?: boolean; // renders pagination controls
  useInfiniteScroll?: boolean; // alternate for huge lists
  assignLabel?: string;
  loadingText?: string;
  emptyState?: React.ReactNode;
}

// Helper small components
function PanelHeader({ title, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

function EmptyState({ children }: { children?: React.ReactNode }) {
  return <div className="p-6 text-center text-sm text-muted">{children || "No items found."}</div>;
}

// Main component
export default function SuperAssignment<TLeft = any, TRight = any>(props: SuperAssignmentProps<TLeft, TRight>) {
  const { setPage } = usePage();
  useEffect(() => setPage("Super Assignment"), [setPage]);

  const { addNotification } = useNotifications();

  const {
    leftTitle = "Left",
    rightTitle = "Right",
    fetchLeftData,
    fetchRightData,
    leftData: leftStatic,
    rightData: rightStatic,
    renderLeftItem,
    renderRightItem,
    keyLeft = (i: any) => i?.id || JSON.stringify(i),
    keyRight = (i: any) => i?.id || JSON.stringify(i),
    onAssign,
    allowMultiSelect = true,
    enableSearch = true,
    enablePagination = false,
    useInfiniteScroll = false,
    assignLabel = "Assign",
    loadingText = "Loading...",
    emptyState,
  } = props;

  // Left state
  const [leftItems, setLeftItems] = useState<TLeft[]>(leftStatic || []);
  const [rightItems, setRightItems] = useState<TRight[]>(rightStatic || []);

  const [selectedLeftIds, setSelectedLeftIds] = useState<string[]>([]);
  const [selectedRightIds, setSelectedRightIds] = useState<string[]>([]);

  const [leftQ, setLeftQ] = useState("");
  const [rightQ, setRightQ] = useState("");

  const [loadingLeft, setLoadingLeft] = useState(false);
  const [loadingRight, setLoadingRight] = useState(false);

  const [leftMeta, setLeftMeta] = useState<PaginationMeta>({ page: 1, pageSize: 20 });
  const [rightMeta, setRightMeta] = useState<PaginationMeta>({ page: 1, pageSize: 20 });

  useEffect(() => {
    // initial fetch if fetchers provided
    if (fetchLeftData) fetchLeft({ page: 1, q: "" });
    if (fetchRightData) fetchRight({ page: 1, q: "" });
    // otherwise use static data provided via props
  }, []);

  async function fetchLeft(params?: { page?: number; q?: string }) {
    if (!fetchLeftData) return;
    setLoadingLeft(true);
    try {
      const res = await fetchLeftData(params);
      setLeftItems(res.data || []);
      if (res.meta) setLeftMeta(res.meta);
    } catch (err) {
      addNotification({ message: "Failed to fetch left items", variant: "error" });
    } finally {
      setLoadingLeft(false);
    }
  }

  async function fetchRight(params?: { page?: number; q?: string }) {
    if (!fetchRightData) return;
    setLoadingRight(true);
    try {
      const res = await fetchRightData(params);
      setRightItems(res.data || []);
      if (res.meta) setRightMeta(res.meta);
    } catch (err) {
      addNotification({ message: "Failed to fetch right items", variant: "error" });
    } finally {
      setLoadingRight(false);
    }
  }

  function toggleSelectLeft(item: TLeft) {
    const id = keyLeft(item);
    setSelectedLeftIds((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id);
      return allowMultiSelect ? [...s, id] : [id];
    });
  }
  function toggleSelectRight(item: TRight) {
    const id = keyRight(item);
    setSelectedRightIds((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id);
      return allowMultiSelect ? [...s, id] : [id];
    });
  }

  const selectedLeft = useMemo(() => leftItems.filter((i) => selectedLeftIds.includes(keyLeft(i))), [leftItems, selectedLeftIds]);
  const selectedRight = useMemo(() => rightItems.filter((i) => selectedRightIds.includes(keyRight(i))), [rightItems, selectedRightIds]);

  async function handleAssign() {
    try {
      if (!onAssign) return addNotification({ message: "No assign handler provided", variant: "warning" });
      await onAssign(selectedLeft, selectedRight);
      addNotification({ message: "Assigned successfully", variant: "success" });
      // optional refresh
      if (fetchLeftData) fetchLeft({ page: leftMeta.page, q: leftQ });
      if (fetchRightData) fetchRight({ page: rightMeta.page, q: rightQ });
      // clear selections
      setSelectedLeftIds([]);
      setSelectedRightIds([]);
    } catch (err) {
      addNotification({ message: "Assignment failed", variant: "error" });
    }
  }

  // Drag and drop sensors
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over) return;
    if (active.id !== over.id) {
      // allow reordering within the right panel for priority, for example
      const oldIndex = rightItems.findIndex((r) => keyRight(r) === active.id);
      const newIndex = rightItems.findIndex((r) => keyRight(r) === over.id);
      if (oldIndex > -1 && newIndex > -1) {
        setRightItems((s) => arrayMove(s, oldIndex, newIndex));
      }
    }
  }

  // Render helpers
  function defaultRenderLeft(item: any) {
    return (
      <div className="flex flex-col">
        <span className="font-medium">{item?.code || item?.name || "—"}</span>
        <span className="text-sm text-muted">{item?.title || item?.description}</span>
      </div>
    );
  }
  function defaultRenderRight(item: any) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="font-medium">{item?.name || item?.title}</div>
          <div className="text-sm text-muted">{item?.role || item?.dept}</div>
        </div>
        {item?.status && <Badge variant={item.status === "active" ? "success" : "neutral"}>{item.status}</Badge>}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Panel */}
        <Card className="rounded-xl shadow-md p-4">
          <PanelHeader title={leftTitle}>
            {enableSearch && (
              <div className="flex items-center gap-2">
                <Input
                  placeholder={`Search ${leftTitle}`}
                  value={leftQ}
                  onChange={(e: any) => setLeftQ(e.target.value)}
                  onKeyDown={(e: any) => {
                    if (e.key === "Enter") fetchLeft({ page: 1, q: leftQ });
                  }}
                />
                <Button
                  onClick={() => fetchLeft({ page: 1, q: leftQ })}
                  aria-label="Search left"
                >
                  <SearchIcon className="w-4 h-4" />
                </Button>
              </div>
            )}
          </PanelHeader>

          <div className="space-y-2 max-h-[420px] overflow-auto">
            {loadingLeft ? (
              <div className="p-4">{loadingText}</div>
            ) : leftItems.length ? (
              leftItems.map((item, idx) => {
                const id = keyLeft(item);
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent ${selectedLeftIds.includes(id) ? "bg-primary/10" : "bg-surface"}`}
                    onClick={() => toggleSelectLeft(item)}
                    tabIndex={0}
                    role="button"
                  >
                    {renderLeftItem ? renderLeftItem(item) : defaultRenderLeft(item)}
                  </motion.div>
                );
              })
            ) : (
              <EmptyState>{emptyState}</EmptyState>
            )}
          </div>

          {enablePagination && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted">Page {leftMeta.page}</div>
              <div className="flex gap-2">
                <Button disabled={leftMeta.page <= 1} onClick={() => fetchLeft({ page: leftMeta.page - 1, q: leftQ })}>
                  Prev
                </Button>
                <Button onClick={() => fetchLeft({ page: leftMeta.page + 1, q: leftQ })}>Next</Button>
              </div>
            </div>
          )}
        </Card>

        {/* Right Panel */}
        <Card className="rounded-xl shadow-md p-4">
          <PanelHeader title={rightTitle}>
            {enableSearch && (
              <div className="flex items-center gap-2">
                <Input
                  placeholder={`Search ${rightTitle}`}
                  value={rightQ}
                  onChange={(e: any) => setRightQ(e.target.value)}
                  onKeyDown={(e: any) => {
                    if (e.key === "Enter") fetchRight({ page: 1, q: rightQ });
                  }}
                />
                <Button onClick={() => fetchRight({ page: 1, q: rightQ })} aria-label="Search right">
                  <SearchIcon className="w-4 h-4" />
                </Button>
              </div>
            )}
          </PanelHeader>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="space-y-2 max-h-[420px] overflow-auto">
              {loadingRight ? (
                <div className="p-4">{loadingText}</div>
              ) : rightItems.length ? (
                rightItems.map((item) => {
                  const id = keyRight(item);
                  return (
                    <motion.div
                      key={id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-md flex items-center justify-between gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent ${selectedRightIds.includes(id) ? "bg-primary/10" : "bg-surface"}`}
                      onClick={() => toggleSelectRight(item)}
                      tabIndex={0}
                      role="button"
                    >
                      <div className="flex-1">{renderRightItem ? renderRightItem(item) : defaultRenderRight(item)}</div>
                    </motion.div>
                  );
                })
              ) : (
                <EmptyState>{emptyState}</EmptyState>
              )}
            </div>
          </DndContext>

          {enablePagination && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted">Page {rightMeta.page}</div>
              <div className="flex gap-2">
                <Button disabled={rightMeta.page <= 1} onClick={() => fetchRight({ page: rightMeta.page - 1, q: rightQ })}>
                  Prev
                </Button>
                <Button onClick={() => fetchRight({ page: rightMeta.page + 1, q: rightQ })}>Next</Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Summary & Actions */}
      <div className="mt-6 rounded-xl shadow-md p-4 bg-surface">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-sm text-muted">Selected</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedLeft.map((s: any) => (
                <Badge key={keyLeft(s)} variant="info">
                  {s?.code || s?.name || keyLeft(s)}
                </Badge>
              ))}
              {selectedRight.map((s: any) => (
                <Badge key={keyRight(s)} variant="success">
                  {s?.name || s?.title || keyRight(s)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => { setSelectedLeftIds([]); setSelectedRightIds([]); }}>Clear</Button>
            <Button onClick={handleAssign}>
              {assignLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
