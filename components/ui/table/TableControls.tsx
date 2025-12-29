import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { memo } from "react";

interface TableControlsProps {
  enableSearch?: boolean;
  enableFilter?: boolean;
  dropDownData: { text: string; id: string }[];
  dropDownText: string;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  onDropDownChange: (value: string) => void;
}

export const TableControls = memo(function TableControls({
  enableSearch = true,
  enableFilter = true,
  dropDownData,
  dropDownText,
  globalFilter,
  onGlobalFilterChange,
  onDropDownChange,
}: TableControlsProps) {
  return (
    <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
      <div className="flex gap-3 items-center">
        {enableSearch && (
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
            className="max-w-xs"
            aria-label="Search table"
          />
        )}

        {enableFilter && (
          <Select onValueChange={onDropDownChange}>
            <SelectTrigger className="w-full sm:w-80">
              <SelectValue placeholder={dropDownText} />
            </SelectTrigger>
            <SelectContent>
              {dropDownData.map((value) => (
                <SelectItem key={value.id} value={value.id}>
                  {value.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
});