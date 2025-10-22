"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useDataFetcher } from "@/lib/dataFetcher";
import e from "express";

interface FieldConfig {
  [key: string]: string;
}

interface AdvancedFilterSystemProps {
  fields: FieldConfig;
  fetchData?: (field: string, input: string) => Promise<string[]>;
  fetchableFields?: string[];
  onFiltersChange?: (filters: any) => void;
}

export const AdvancedFilterSystem: React.FC<AdvancedFilterSystemProps> = ({
  fields,
  fetchData,
  fetchableFields = [],
  onFiltersChange,
}) => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [currentField, setCurrentField] = useState("");
  const [currentOperator, setCurrentOperator] = useState("=");
  const [currentValue, setCurrentValue] = useState("");
  const [currentLogic, setCurrentLogic] = useState("AND");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { fetchData: dataFetcher } = useDataFetcher()
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const handleFocus = () => setIsFocused(true);
const handleBlur = () => setIsFocused(false);


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
    if (!nodes.length) return {};
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
    setSuggestions([]);
    setHighlightIndex(-1);
  };

  const removeNode = (i: number) => {
    setNodes(nodes.filter((_, idx) => idx !== i));
  };

  const clearAll = () => {
    setNodes([]);
    onFiltersChange?.({});
  };


  useEffect(() => {
    if (!currentField || !currentValue || !fetchableFields.includes(currentField)) return;

    const handler = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        let res: string[] = [];

        if (fetchData) {
          res = await fetchData(currentField, currentValue);
        } else {
          const { data: response } = await dataFetcher("faculty", "POST", {
            fields: [currentField],
            search_term: currentValue,
          });

          // Safely extract array (handles multiple backend formats)
          const arr = Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
              ? response.data
              : [];

          // Convert to readable suggestion strings
          res = arr.map(
            (item: any) => item.name || item.code || item.label || ""
          );

          // Filter out empty values
          res = res.filter(Boolean);
        }

        setSuggestions(res);
      } catch (err: any) {
        console.error("❌ Fetch error:", err);
        setError(`Failed to load ${fields[currentField] || currentField}`);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }

    }, 700); // ⏱ delay in ms 

    // 🧹 cleanup: cancel the timeout when user keeps typing
    return () => clearTimeout(handler);
  }, [currentField, currentValue, fetchData, fetchableFields]);

  const query = buildQueryObject(nodes);

  useEffect(() => {
    onFiltersChange?.(query);
  }, [nodes]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0) {
        setCurrentValue(suggestions[highlightIndex]);
        setSuggestions([]);
        setHighlightIndex(-1);
        e.preventDefault();
      } else {
        addNode();
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setHighlightIndex(-1);
    }
  };

  const handleChange = async (currentField: string, currentValue: string) => {
  setLoading(true);
  setError(null);
  setCurrentValue(currentValue)

  try {
    let res: string[] = [];

    const { data: response } = await dataFetcher("faculty", "POST", {
      fields: [currentField],
      search_term: currentValue,
    });

    const data = response;
    const arr = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : [];

    res = arr.map(
      (item) => item.name || item.code || item.label || ""
    ).filter(Boolean);

    // ✅ Only show suggestions if still focused
    if (isFocused) {
      setSuggestions(res);
    }

  } catch (err: any) {
    if (isFocused) {
      setError(`Failed to load ${currentField}`);
      setSuggestions([]);
    }
  } finally {
    if (isFocused) setLoading(false);
  }
};

  return (
    <div className="p-4 bg-surface rounded-xl shadow-md border border-border">
      <div className="flex flex-wrap gap-3 mb-4 items-end">
        {/* Field */}
        <div className="flex flex-col w-40">
          <label className="text-sm font-medium text-textSecondary mb-1">Field</label>
          <select
            value={currentField}
            onChange={(e) => setCurrentField(e.target.value)}
            className="border rounded-md p-2 text-sm"
          >
            <option value="">Select</option>
            {Object.entries(fields).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Operator */}
        <div className="flex flex-col w-32">
          <label className="text-sm font-medium text-textSecondary mb-1">Operator</label>
          <select
            value={currentOperator}
            onChange={(e) => setCurrentOperator(e.target.value)}
            className="border rounded-md p-2 text-sm"
          >
            {["=", "!=", ">", "<", ">=", "<=", "contains", "startsWith", "endsWith"].map((op) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
        </div>

        {/* Value */}
        <div className="flex flex-col w-40 relative">
          <label className="text-sm font-medium text-textSecondary mb-1">Value</label>
<input
  type="text"
  value={currentValue}
  onFocus={handleFocus}
  onBlur={() => {
    // Delay hiding a bit so clicks on dropdown items still work
    setTimeout(() => setIsFocused(false), 150);
  }}
  onChange={(e) => setCurrentValue(e.target.value)}
  className="border rounded-md p-2 text-sm"
/>

          {loading && (
            <>
              <div className="absolute right-2 top-9 animate-spin w-4 h-4 border-2 border-t-transparent border-primary rounded-full" />
              <div className="absolute left-0 mt-1 text-xs text-muted">Loading...</div>
            </>
          )}

          {suggestions.length > 0 && !loading && isFocused && (
            <ul className="absolute top-full left-0 right-0 bg-white border border-border rounded-md mt-1 max-h-40 overflow-y-auto z-50">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className={`px-2 py-1 cursor-pointer text-sm ${i === highlightIndex ? "bg-surfaceElevated font-medium" : ""
                    }`}
                  onMouseEnter={() => setHighlightIndex(i)}
                  onClick={() => {
                    setCurrentValue(s);
                    setSuggestions([]);
                    setHighlightIndex(-1);
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
          {error && (
            <div className="absolute top-full left-0 mt-1 text-xs text-error bg-surface p-1 rounded-md border border-error/30 shadow-sm">
              {error}
            </div>
          )}

        </div>

        {/* Logic */}
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

        <Button variant="primary" onClick={addNode}>+ Add</Button>
        {nodes.length > 0 && <Button variant="outline" onClick={clearAll}>Clear</Button>}
      </div>

      {/* Display Nodes */}
      <div className="p-3 bg-surfaceElevated rounded-md border border-border text-sm font-mono min-h-[60px]">
        {nodes.length === 0 ? (
          <span className="text-muted">No filters added yet.</span>
        ) : (
          nodes.map((n, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 bg-surface px-2 py-1 rounded-md border border-border m-1"
            >
              <span className="text-primary font-medium">{fields[n.field] || n.field}</span>
              <span className="text-accent">{n.operator}</span>
              <span className="text-textSecondary">"{n.value}"</span>
              <button
                className="text-error text-xs font-bold px-2"
                onClick={() => removeNode(i)}
                aria-label="Remove filter"
              >
                ×
              </button>
              {i < nodes.length - 1 && <span className="text-textMuted font-bold">{n.logic}</span>}
            </span>
          ))
        )}
      </div>
    </div>
  );
};

export default AdvancedFilterSystem;
