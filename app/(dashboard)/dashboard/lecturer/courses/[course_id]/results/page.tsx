"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Upload, FileSpreadsheet, Trash2 } from "lucide-react";
import theme from "@/styles/theme";

interface StudentResult {
  id: string;
  student_name: string;
  matric_no: string;
  score: number;
  grade: string;
}

export default function UploadResultsPage() {
  const { course_id } = useParams();
  const [results, setResults] = useState<StudentResult[]>([
    {
      id: "1",
      student_name: "John Doe",
      matric_no: "CSC/2020/001",
      score: 85,
      grade: "A",
    },
    {
      id: "2",
      student_name: "Mary Jane",
      matric_no: "CSC/2020/002",
      score: 72,
      grade: "B",
    },
  ]);
  const [newResult, setNewResult] = useState({
    student_name: "",
    matric_no: "",
    score: "",
  });
  const [uploading, setUploading] = useState(false);

  const getGrade = (score: number) => {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    if (score >= 40) return "E";
    return "F";
  };

  const handleAddResult = () => {
    if (!newResult.student_name || !newResult.matric_no || !newResult.score)
      return alert("Please fill in all fields.");

    const score = parseFloat(newResult.score);
    if (isNaN(score) || score < 0 || score > 100)
      return alert("Score must be between 0 and 100.");

    setUploading(true);
    setTimeout(() => {
      setResults([
        ...results,
        {
          id: String(results.length + 1),
          student_name: newResult.student_name,
          matric_no: newResult.matric_no,
          score,
          grade: getGrade(score),
        },
      ]);
      setNewResult({ student_name: "", matric_no: "", score: "" });
      setUploading(false);
    }, 800);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this result?")) {
      setResults(results.filter((r) => r.id !== id));
    }
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      alert(`File "${file.name}" uploaded successfully (mock).`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-bg text-text">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="text-brand" /> {course_id} - Upload Results
          </h1>
          <p className="text-text-muted">
            Manage and upload student grades for this course.
          </p>
        </div>
      </div>

      {/* Add New Result */}
      <div className="bg-surface border border-border rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add Single Result</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Student Name"
            value={newResult.student_name}
            onChange={(e) =>
              setNewResult({ ...newResult, student_name: e.target.value })
            }
            className="border border-border rounded-lg p-2 focus:ring-2 focus:ring-brand outline-none"
          />
          <input
            type="text"
            placeholder="Matric No"
            value={newResult.matric_no}
            onChange={(e) =>
              setNewResult({ ...newResult, matric_no: e.target.value })
            }
            className="border border-border rounded-lg p-2 focus:ring-2 focus:ring-brand outline-none"
          />
          <input
            type="number"
            placeholder="Score"
            value={newResult.score}
            onChange={(e) =>
              setNewResult({ ...newResult, score: e.target.value })
            }
            className="border border-border rounded-lg p-2 focus:ring-2 focus:ring-brand outline-none"
          />
        </div>

        <div className="mt-4 flex gap-4">
          <button
            onClick={handleAddResult}
            disabled={uploading}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-white transition ${
              uploading
                ? "bg-brand/70 cursor-not-allowed"
                : "bg-brand hover:bg-brand/90"
            }`}
            style={{ backgroundColor: theme.colors.primary }}
          >
            {uploading ? "Adding..." : "Add Result"}
          </button>

          <label className="flex items-center gap-2 px-5 py-2 border border-border rounded-lg cursor-pointer hover:bg-bg/60 transition">
            <Upload size={16} /> Bulk Upload (.csv)
            <input
              type="file"
              accept=".csv"
              onChange={handleBulkUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-surface border border-border rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-elevated border-b border-border text-text-muted">
            <tr>
              <th className="text-left p-3">#</th>
              <th className="text-left p-3">Student Name</th>
              <th className="text-left p-3">Matric No</th>
              <th className="text-left p-3">Score</th>
              <th className="text-left p-3">Grade</th>
              <th className="text-center p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr
                key={r.id}
                className="border-b border-border hover:bg-bg/60 transition-colors"
              >
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-medium">{r.student_name}</td>
                <td className="p-3">{r.matric_no}</td>
                <td className="p-3">{r.score}</td>
                <td className="p-3 font-semibold text-brand">{r.grade}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-2 rounded-md hover:bg-accent/10 text-accent"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
