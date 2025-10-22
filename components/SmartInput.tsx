"use client";

import React, { useState, useEffect } from "react";
import { useDataFetcher } from "@/lib/dataFetcher";

interface SmartInputProps {
  fieldName: string;
  value: string;
  fetchData?: (field: string, input: string) => Promise<any[]>;
  fetchableFields?: string[];
  onValueChange: (value: string) => void;
  onSelect?: (record: any) => void; // 👈 optional callback for the full record or id
  label?: string;
  placeholder?: string;
  debounceMs?: number;
  displayFormat?: (record: any) => string; // 👈 optional formatter (e.g. name + email)
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

  // 🌟 Fetch suggestions (with debounce)
  useEffect(() => {

    if (!fieldName || !value || !fetchableFields.includes(fieldName)) return;
    
    const handler = setTimeout(async () => {
      console.log(32)
      setLoading(true);
      setError(null);

      try {
        let results: any[] = [];

        if (fetchData) {
          console.log(fetchData)
          results = await fetchData(fieldName, value);
        } else {
          console.log("hi")
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

        // 👇 Convert each result into { id, label, record }
        const formatted = results
          .map((item: any) => {
            const label = displayFormat
              ? displayFormat(item)
              : item.name || item.email || item.label || item.code || "";
            return {
              id: item.id || item._id || item.code || label,
              label,
              record: item,
            };
          })
          .filter((s) => Boolean(s.label));

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
  }, [fieldName, value, fetchData, fetchableFields, debounceMs]);

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
      if (highlightIndex >= 0) {
        const selected = suggestions[highlightIndex];
        onValueChange(selected.label);
        onSelect?.(selected.record);
        setSuggestions([]);
        setHighlightIndex(-1);
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setHighlightIndex(-1);
    }
  };

  // 🪄 Highlight matched substring
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

      <div className="relative">
        <input
          type="text"
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`border rounded-md p-2 text-sm w-full transition-all outline-none
            ${isFocused ? "border-primary shadow-sm shadow-primary/30" : "border-border"}
          `}
        />

        {loading && (
          <div className="absolute right-2 top-2.5 animate-spin w-4 h-4 border-2 border-t-transparent border-primary rounded-full" />
        )}
      </div>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && !loading && isFocused && (
        <ul className="absolute top-full left-0 right-0 bg-white border border-border rounded-md mt-1 max-h-48 overflow-y-auto z-50 shadow-lg">
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              className={`px-3 py-1.5 cursor-pointer text-sm transition-all ${
                i === highlightIndex
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-surfaceElevated"
              }`}
              onMouseEnter={() => setHighlightIndex(i)}
              onClick={() => {
                onValueChange(s.label);
                onSelect?.(s.record);
                setSuggestions([]);
                setHighlightIndex(-1);
              }}
            >
              {highlightMatch(s.label, value)}
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {suggestions.length === 0 && !loading && value && isFocused && !error && (
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
