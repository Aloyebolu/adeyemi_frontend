"use client";

/**
 * 🧩 AFUED Advanced Filter System
 * Generates complex Mongo/SQL-like filters and emits JSON to parent component.
 * Used for export, reports, and dynamic data queries.
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import theme from "@/styles/theme";

interface AdvancedFilterSystemProps {
  onFiltersChange?: (filters: any) => void;
}

const FIELD_CONFIG: Record<string, string> = {
  courses: "Student Courses",
  level: "Course Level",
  department: "Department",
  semester: "Semester",
  status: "Enrollment Status",
  credits: "Credit Hours",
  instructor: "Instructor Name",
  grade: "Grade",
  enrollmentDate: "Enrollment Date",
};

export const AdvancedFilterSystem: React.FC<AdvancedFilterSystemProps> = ({
  onFiltersChange,
}) => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [currentField, setCurrentField] = useState("");
  const [currentOperator, setCurrentOperator] = useState("=");
  const [currentValue, setCurrentValue] = useState("");
  const [currentLogic, setCurrentLogic] = useState("AND");

  const convertOperatorToQuery = (operator: string, value: any) => {
    const numValue = isNaN(value) ? value : Number(value);
    const map: Record<string, any> = {
      "=": numValue,
      "!=": { $ne: numValue },
      ">": { $gt: numValue },
      "<": { $lt: numValue },
      ">=": { $gte: numValue },
      "<=": { $lte: numValue },
      contains: { $regex: value, $options: "i" },
      startsWith: { $regex: `^${value}`, $options: "i" },
      endsWith: { $regex: `${value}$`, $options: "i" },
    };
    return map[operator] || numValue;
  };

  const buildQueryObject = (nodes: any[]) => {
    if (nodes.length === 0) return {};
    if (nodes.length === 1) {
      const n = nodes[0];
      return { [n.field]: convertOperatorToQuery(n.operator, n.value) };
    }

    const orGroups: any[] = [];
    let currentGroup: any[] = [];

    nodes.forEach((node, idx) => {
      const condition = { [node.field]: convertOperatorToQuery(node.operator, node.value) };
      currentGroup.push(condition);

      const isLast = idx === nodes.length - 1;
      const nextLogic = isLast ? null : node.logic;

      if (nextLogic === "OR" || isLast) {
        orGroups.push(currentGroup.length === 1 ? currentGroup[0] : { $and: currentGroup });
        currentGroup = [];
      }
    });

    return orGroups.length === 1 ? orGroups[0] : { $or: orGroups };
  };

  const addNode = () => {
    if (!currentField || !currentOperator || !currentValue.trim()) return;
    setNodes([
      ...nodes,
      { field: currentField, operator: currentOperator, value: currentValue.trim(), logic: currentLogic },
    ]);
    setCurrentField("");
    setCurrentValue("");
  };

  const removeNode = (i: number) => {
    setNodes(nodes.filter((_, idx) => idx !== i));
  };

  const clearAll = () => {
    setNodes([]);
    onFiltersChange?.({});
  };

  const query = buildQueryObject(nodes);

  useEffect(() => {
    onFiltersChange?.(query);
  }, [nodes]);

  return (
    <div className="p-4 bg-surface rounded-xl shadow-md border border-border">
      <div className="flex flex-wrap gap-3 mb-4 items-end">
        <div className="flex flex-col w-40">
          <label className="text-sm font-medium text-textSecondary mb-1">Field</label>
          <select
            value={currentField}
            onChange={(e) => setCurrentField(e.target.value)}
            className="border rounded-md p-2 text-sm"
          >
            <option value="">Select</option>
            {Object.entries(FIELD_CONFIG).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-32">
          <label className="text-sm font-medium text-textSecondary mb-1">Operator</label>
          <select
            value={currentOperator}
            onChange={(e) => setCurrentOperator(e.target.value)}
            className="border rounded-md p-2 text-sm"
          >
            {["=", "!=", ">", "<", ">=", "<=", "contains", "startsWith", "endsWith"].map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-40">
          <label className="text-sm font-medium text-textSecondary mb-1">Value</label>
          <input
            type="text"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNode()}
            className="border rounded-md p-2 text-sm"
          />
        </div>

        <div className="flex flex-col w-28">
          <label className="text-sm font-medium text-textSecondary mb-1">Logic</label>
          <select
            value={currentLogic}
            onChange={(e) => setCurrentLogic(e.target.value)}
            className="border rounded-md p-2 text-sm"
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </div>

        <Button variant="primary" onClick={addNode}>
          + Add
        </Button>
        {nodes.length > 0 && (
          <Button variant="outline" onClick={clearAll}>
            Clear
          </Button>
        )}
      </div>

      <div className="p-3 bg-surfaceElevated rounded-md border border-border text-sm font-mono min-h-[60px]">
        {nodes.length === 0 ? (
          <span className="text-muted">No filters added yet.</span>
        ) : (
          nodes.map((n, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 bg-surface px-2 py-1 rounded-md border border-border m-1"
            >
              <span className="text-primary font-medium">{FIELD_CONFIG[n.field] || n.field}</span>
              <span className="text-accent">{n.operator}</span>
              <span className="text-textSecondary">"{n.value}"</span>
              <button
                className="text-error text-xs font-bold px-2"
                onClick={() => removeNode(i)}
                aria-label="Remove filter"
              >
                ×
              </button>
              {i < nodes.length - 1 && (
                <span className="text-textMuted font-bold">{n.logic}</span>
              )}
            </span>
          ))
        )}
      </div>
    </div>
  );
};

export default AdvancedFilterSystem;
