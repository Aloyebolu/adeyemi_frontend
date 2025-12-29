"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import { FileUp, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/table/Table2";
import { Badge } from "@/components/ui/Badge";
import toast from "react-hot-toast";

type StudentResult = {
  id: number;
  reg_no: string;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  q5: number | null;
  course_mark: number | null;
  exam_mark: number | null;
  total: number | null;
  grade: string;
  remarks?: string;
};

// ✅ Grade calculator
const getGrade = (score: number | null): string => {
  if (score === null || isNaN(score)) return "-";
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 45) return "D";
  if (score >= 40) return "E";
  return "F";
};

// ✅ Safe parser helper
const normalizeKey = (key: string) => {
  const lower = key.toLowerCase().trim();

  const patterns: Record<string, RegExp> = {
    reg_no: /cand.*no|reg/i,
    q1: /\bq1\b/i,
    q2: /\bq2\b/i,
    q3: /\bq3\b/i,
    q4: /\bq4\b/i,
    q5: /\bq5\b/i,
    course_mark: /course.*mark/i,
    exam_mark: /exam.*mark/i,
    total: /total/i,
    remarks: /remark/i,
  };

  for (const [field, pattern] of Object.entries(patterns)) {
    if (pattern.test(lower)) return field;
  }
  return lower.replace(/\s+/g, "_");
};

const UploadResultsPage = () => {
  const router = useRouter();
  const [data, setData] = useState<StudentResult[]>([]);

  // ✅ Handle Excel import
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = evt.target?.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
      });

      // ✅ Find the first row that includes Q1–Q5 (real header row)
      let headerIndex = rows.findIndex((r) =>
        r.some(
          (cell) =>
            typeof cell === "string" &&
            cell.toLowerCase().includes("q1") &&
            r.join(" ").toLowerCase().includes("q2")
        )
      );

      if (headerIndex === -1) {
        toast.error("Could not find Q1–Q5 headers in file");
        return;
      }

      const headerRow = rows[headerIndex];
      const dataRows = rows.slice(headerIndex + 1);

      // ✅ Normalize header names
      const headers = headerRow.map((h: string) => normalizeKey(h));

      // ✅ Build structured objects
      const structured: StudentResult[] = dataRows
        .filter((r) => r.some((v) => v && v.toString().trim() !== ""))
        .map((r, index) => {
          const obj: any = {};
          headers.forEach((key: string, i: number) => {
            obj[key] = r[i];
          });

          const total =
            Number(obj.total || 0) ||
            Number(obj.course_mark || 0) + Number(obj.exam_mark || 0);

          return {
            id: index + 1,
            reg_no: obj.reg_no || "",
            q1: Number(obj.q1) || null,
            q2: Number(obj.q2) || null,
            q3: Number(obj.q3) || null,
            q4: Number(obj.q4) || null,
            q5: Number(obj.q5) || null,
            course_mark: Number(obj.course_mark) || null,
            exam_mark: Number(obj.exam_mark) || null,
            total,
            grade: getGrade(total),
            remarks: obj.remarks || "",
          };
        });

      setData(structured);
      toast.success("Excel file imported successfully!");
    };

    reader.readAsBinaryString(file);
  };

  // ✅ Handle manual edits
  const handleEdit = (rowIndex: number, accessor: string, value: string) => {
    const newData = [...data];
    const num = parseFloat(value);

    if (["course_mark", "exam_mark", "total"].includes(accessor)) {
      newData[rowIndex][accessor] = isNaN(num) ? null : num;
      const total =
        (newData[rowIndex].course_mark || 0) +
        (newData[rowIndex].exam_mark || 0);
      newData[rowIndex].total = total;
      newData[rowIndex].grade = getGrade(total);
    } else {
      (newData[rowIndex] as any)[accessor] = value;
    }

    setData(newData);
  };

  // ✅ Table columns
  const columns = [
    { accessorKey: "reg_no", header: "Reg No" },
    { accessorKey: "q1", header: "Q1", editable: true },
    { accessorKey: "q2", header: "Q2", editable: true },
    { accessorKey: "q3", header: "Q3", editable: true },
    { accessorKey: "q4", header: "Q4", editable: true },
    { accessorKey: "q5", header: "Q5", editable: true },
    { accessorKey: "course_mark", header: "Course Mark", editable: true },
    { accessorKey: "exam_mark", header: "Exam Mark", editable: true },
    { accessorKey: "total", header: "Total" },
    {
      accessorKey: "remarks",
      header: "Remarks",
      cell: ({ row }: any) => {
        const grade = row.original.grade;
        const colorMap: any = {
          A: "success",
          B: "info",
          C: "warning",
          D: "orange",
          E: "secondary",
          F: "error",
        };
        return <Badge variant={colorMap[grade] || "neutral"}>{grade}</Badge>;
      },
    },
    // { accessorKey: "remarks", header: "Remarks" },
  ];

  // ✅ Simulate Save
  const handleSave = () => {
    if (data.length === 0) {
      toast.error("No data to save!");
      return;
    }
    console.log("📊 Processed Results:", data);
    toast.success("Results saved successfully!");
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Upload Results</h2>
        <div className="flex gap-3">
<>
  <input
    type="file"
    id="excel-upload"
    accept=".xlsx, .xls"
    onChange={handleExcelImport}
    className="hidden"
  />
  <Button
    variant="outline"
    onClick={() => document.getElementById("excel-upload")?.click()}
  >
    <Upload size={16} className="mr-1" />
    Import Excel
  </Button>
          <Button onClick={handleSave}>
          <Save size={16} className="mr-1" />
          Save
        </Button>
</>

        </div>
      </div>

      <Table
        columns={columns}
        data={data}
        variant="corporate"
        onCellEdit={handleEdit}
        controls={false}
        pageSize={1000}
      />

    </div>
  );
};

export default UploadResultsPage;
