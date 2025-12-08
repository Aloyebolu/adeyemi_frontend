"use client";

import { useEffect, useState } from "react";
import PrintPreviewPage from "@/components/print/PrintPreviewPage";
import ReceiptPrint from "@/print-templates/ReceiptPrint";

export default function PrintTestPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setData({
      receipt_no: "AFUED-2025-0001",
      student_name: "John Doe",
      matric_no: "AFU/22/0012",
      date: "2025-12-05",
      items: [
        { desc: "School Fees Payment", amount: "35,000" },
        { desc: "ICT Levy", amount: "5,000" },
      ],
      total: "40,000",
    });
  }, []);

  if (!data) return <p className="p-10">Loading...</p>;

  return (
    <PrintPreviewPage>
      <ReceiptPrint receipt={data} />
    </PrintPreviewPage>
  );
}
