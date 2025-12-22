import { create } from "zustand";

type PaperSize = "A4" | "Letter" | "Legal";
type ExportFormat = "print" | "pdf" | "docx";
type WatermarkType = "none" | "text" | "logo" | "diagonal" | "repeat";

interface PrintState {
  paperSize: PaperSize;
  format: ExportFormat;
  watermark: WatermarkType;
  setPaperSize: (s: PaperSize) => void;
  setFormat: (f: ExportFormat) => void;
  setWatermark: (w: WatermarkType) => void;
}

export const usePrintStore = create<PrintState>((set) => ({
  paperSize: "A4",
  format: "print",
  watermark: "none",
  setPaperSize: (paperSize) => set({ paperSize }),
  setFormat: (format) => set({ format }),
  setWatermark: (watermark) => set({ watermark }),
}));
