import { Button } from "@/components/ui/Button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";
import { memo, useCallback } from "react";

interface TableExportProps<TData> {
  data: TData[];
  enableExport?: boolean;
}

function TableExportComponent<TData extends object>({ 
  data, 
  enableExport = true 
}: TableExportProps<TData>) {
  const exportToCSV = useCallback(() => {
    if (data.length === 0) return;
    
    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((r) => Object.values(r).join(",")),
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "table.csv";
    a.click();
  }, [data]);

  const exportToExcel = useCallback(() => {
    if (data.length === 0) return;
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "table.xlsx");
  }, [data]);

  const exportToTxt = useCallback(() => {
    if (data.length === 0) return;
    
    const txt = data.map((r) => JSON.stringify(r)).join("\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "table.txt";
    a.click();
  }, [data]);

  if (!enableExport) return null;

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={exportToCSV} title="Export to CSV">
        <Download size={16} />
      </Button>
      <Button variant="outline" size="sm" onClick={exportToExcel} title="Export to Excel">
        <FileSpreadsheet size={16} />
      </Button>
      <Button variant="outline" size="sm" onClick={exportToTxt} title="Export to Text">
        <FileText size={16} />
      </Button>
    </div>
  );
}

export const TableExport = memo(TableExportComponent) as typeof TableExportComponent;