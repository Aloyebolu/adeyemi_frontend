// export default function PrintContainer({
//     children,
//     paperSize
// }: {
//     children: React.ReactNode;
//     paperSize: "A4" | "Letter" | "Legal";
// }) {
//     const sizes = {
//         A4: "794px",
//         Letter: "816px",
//         Legal: "816px",
//     };
//     const styles = `
//   /* Remove browser header/footer */
//         @page {
//         margin: 0 !important;
//         }

//         /* Screen-only border */
//         .print-wrapper {
//         border: 1px solid black;
//         }

//         /* Remove border in print mode */
//         @media print {
//         .no-print {
//             display: none !important;
//         }

//         .print-wrapper {
//             border: none !important;
//         }

//         body {
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//         }
//     }

//   `

//     return (
//         <>
//             <style>{styles}</style>
//             <div
//                 className="bg-white text-black mx-auto print-wrapper"
//                 style={{
//                     width: sizes[paperSize],
//                     padding: "40px",
//                     fontFamily: "serif",

//                 }}
//             >
//                 {children}
//             </div>
//         </>
//     );
// }
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
        }

        /* Screen-only border */
        .print-wrapper {
        border: 1px solid black;
        }

        /* Remove border in print mode */
        @media print {
        .no-print {
            display: none !important;
        }

        .print-wrapper {
            border: none !important;
        }

        body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
    }`


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
