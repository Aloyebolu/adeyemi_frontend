import { usePrintStore } from "@/lib/printStore";
import Watermark from "./Watermark";

export default function PrintContainer({
  children,
  paperSize
}: {
  children: React.ReactNode;
  paperSize: "A4" | "Letter" | "Legal";
}) {
  const { watermark } = usePrintStore();

  const sizes = {
    A4: "794px",
    Letter: "816px",
    Legal: "816px",
  };

  const styles = `
    /* Remove browser header/footer */
    @page {
      margin: 0 !important;
      size: ${paperSize} portrait;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Remove default browser headers/footers */
    @media print {
      @page {
        margin: 0 !important;
        margin-top: 20mm !important;
        margin-bottom: 20mm !important;
        margin-left: 20mm !important;
        margin-right: 20mm !important;
        
        /* Remove default headers/footers */
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        
        /* Prevent browser from adding URL, date, page numbers */
        marks: none !important;
        prince-bleed: none !important;
        prince-trim: none !important;
      }
      
      body {
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        background: white !important;
      }
      
      html {
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      .no-print {
        display: none !important;
      }

      .print-wrapper {
        border: none !important;
        box-shadow: none !important;
        background: white !important;
      }
      
      /* Remove any browser-added headers/footers */
      ::after,
      ::before {
        content: none !important;
      }
    }

    /* Screen-only border */
    .print-wrapper {
      border: 1px solid black;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div
        className="bg-white text-black mx-auto relative print-wrapper"
        style={{
          width: sizes[paperSize],
          padding: "40px",
          fontFamily: "serif",
        }}
      >
        {/* WATERMARK */}
        {watermark !== "none" && (
          <Watermark type={watermark} />
        )}

        {/* CONTENT */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </>
  );
}