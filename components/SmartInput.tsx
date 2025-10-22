"use client";

import React, { useState, useEffect } from "react";
import { useDataFetcher } from "@/lib/dataFetcher";

interface SmartInputProps {
  fieldName: string;
  value: string;
  fetchData?: (field: string, input: string) => Promise<any[]>;
  fetchableFields?: string[];
  onValueChange: (value: string) => void;
  onSelect?: (record: any) => void;
  label?: string;
  placeholder?: string;
  debounceMs?: number;
  displayFormat?: (record: any) => React.ReactNode;
}

export const SmartInput: React.FC<SmartInputProps> = ({
  fieldName,
  value,
  fetchData,
  fetchableFields = [],
  onValueChange,
  onSelect,
  label = "Value",
  placeholder = "Type to search...",
  debounceMs = 500,
  displayFormat,
}) => {
  const { fetchData: dataFetcher } = useDataFetcher();
  const [suggestions, setSuggestions] = useState<{ id: string | number; label: string; record: any }[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [slidingOut, setSlidingOut] = useState(false);

  // 🌟 Fetch suggestions (with debounce)
  useEffect(() => {
    if (!fieldName || !value || !fetchableFields.includes(fieldName) || selectedRecord) return;

    const handler = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        let results: any[] = [];

        if (fetchData) {
          results = await fetchData(fieldName, value);
        } else {
          const { data: response } = await dataFetcher("faculty", "POST", {
            fields: [fieldName],
            search_term: value,
          });

          results = Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
            ? response.data
            : [];
        }

        const formatted = results.map((item: any) => {
          const content = displayFormat
            ? displayFormat(item)
            : item.name || item.email || item.label || item.code || "";
          const labelText =
            typeof content === "string"
              ? content
              : item.name || item.email || item.label || item.code || "";
          return {
            id: item.id || item._id || item.code || labelText,
            label: content,
            record: item,
          };
        });

        if (isFocused) setSuggestions(formatted);
      } catch (err: any) {
        console.error("❌ SmartInput fetch error:", err);
        if (isFocused) {
          setError(`Failed to load ${fieldName}`);
          setSuggestions([]);
        }
      } finally {
        if (isFocused) setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [fieldName, value, fetchData, fetchableFields, debounceMs, selectedRecord]);

  // 🎹 Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0) selectSuggestion(suggestions[highlightIndex]);
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setHighlightIndex(-1);
    }
  };

  const selectSuggestion = (s: any) => {
    onValueChange(typeof s.label === "string" ? s.label : s.record.name || "");
    setSelectedRecord(s.record);
    onSelect?.(s.record);
    setSuggestions([]);
    setHighlightIndex(-1);
    setSlidingOut(false);
  };

  const clearSelection = () => {
    setSlidingOut(true);
    setTimeout(() => {
      setSelectedRecord(null);
      onValueChange("");
      setSlidingOut(false);
      setIsFocused(true);
    }, 250); // match CSS duration
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "ig");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-primary font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col w-64 relative">
      {label && <label className="text-sm font-medium text-textSecondary mb-1">{label}</label>}

      <div className="relative flex items-center">
        {selectedRecord && (
          <button
            onClick={clearSelection}
            className="absolute left-1 text-red-500 hover:text-red-700 font-bold z-10 transition-all duration-200"
          >
            ✕
          </button>
        )}

        {/* Animated selected / input */}
        {selectedRecord ? (
          <div
            className={`border rounded-md p-2 text-sm w-full pl-6 bg-gray-100 cursor-not-allowed flex items-center
              transform transition-transform duration-250 ease-in-out ${
                slidingOut ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
              }`}
          >
            {displayFormat ? displayFormat(selectedRecord) : selectedRecord.name}
          </div>
        ) : (
          <input
            type="text"
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              if (!e.relatedTarget || !e.relatedTarget.closest(".smartinput-suggestion")) {
                setTimeout(() => setIsFocused(false), 150);
              }
            }}
            onChange={(e) => onValueChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="border rounded-md p-2 text-sm w-full transition-all outline-none"
          />
        )}

        {loading && !selectedRecord && (
          <div className="absolute right-2 top-2.5 animate-spin w-4 h-4 border-2 border-t-transparent border-primary rounded-full" />
        )}
      </div>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && !loading && isFocused && !selectedRecord && (
        <ul className="absolute top-full left-0 right-0 bg-white border border-border rounded-md mt-1 max-h-48 overflow-y-auto z-50 shadow-lg">
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              tabIndex={0}
              className={`smartinput-suggestion px-3 py-1.5 cursor-pointer text-sm transition-all ${
                i === highlightIndex
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-surfaceElevated"
              }`}
              onMouseEnter={() => setHighlightIndex(i)}
              onClick={() => selectSuggestion(s)}
            >
              {typeof s.label === "string" ? highlightMatch(s.label, value) : s.label}
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {suggestions.length === 0 && !loading && value && isFocused && !error && !selectedRecord && (
        <div className="absolute top-full left-0 mt-1 text-xs text-muted bg-surface p-2 rounded-md border border-border shadow-sm italic">
          No results found
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute top-full left-0 mt-1 text-xs text-error bg-surface p-1 rounded-md border border-error/30 shadow-sm">
          {error}
        </div>
      )}
    </div>
  );
};
