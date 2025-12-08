"use client";

import { usePrintStore } from "@/lib/printStore";
import { ReactNode } from "react";

export default function PrintPreviewPage({
  children,
}: {
  children: ReactNode;
}) {
const { paperSize, format, watermark, setPaperSize, setFormat, setWatermark } = usePrintStore();

  const handleExport = () => {
    if (format === "print") {
      window.print();
    } else if (format === "pdf") {
      alert("PDF export coming soon");
    } else if (format === "docx") {
      alert("DOCX export coming soon");
    }
  };

  return (
    <div className="p-4 space-y-4">

      {/* CONTROL PANEL */}
      <div className="no-print flex items-center gap-4 bg-gray-100 p-3 rounded">

        {/* Paper Size */}
        <div>
          <label className="block text-sm font-semibold">Paper Size</label>
          <select
            className="border rounded px-2 py-1"
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value as any)}
          >
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
            <option value="Legal">Legal</option>
          </select>
        </div>

        {/* Format */}
        <div>
          <label className="block text-sm font-semibold">Export Format</label>
          <select
            className="border rounded px-2 py-1"
            value={format}
            onChange={(e) => setFormat(e.target.value as any)}
          >
            <option value="print">Print</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
          </select>
        </div>
        {/* Watermark Type */}
<div>
  <label className="block text-sm font-semibold">Watermark</label>
  <select
    className="border rounded px-2 py-1"
    value={watermark}
    onChange={(e) => setWatermark(e.target.value as any)}
  >
    <option value="none">None</option>
    <option value="text">Text</option>
    <option value="logo">Logo</option>
    <option value="diagonal">Diagonal</option>
    <option value="repeat">Repeated</option>
  </select>
</div>


        <button
          className="no-print bg-black text-white px-3 py-2 rounded"
          onClick={handleExport}
        >
          Export
        </button>
      </div>

      {/* PRINT DOCUMENT */}
      {children}
    </div>
  );
}
