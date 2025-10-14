"use client";

import { useEffect, useState } from "react";
import { usePage } from "@/hooks/usePage";
import { Card, CardContent } from "@/components/ui/Card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog/dialog";
import { FileSpreadsheet, Upload, CheckCircle2, Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotification";
import UniversalDialog from "@/components/ui/dialog/UniversalDialog";

// Tokens used: bg-surface, text-primary, text-muted, border, surfaceElevated

interface StudentResult {
  id: string;
  name: string;
  matric_no: string;
  score: number | "";
  grade: string;
}

export default function UploadResultsPage() {
  const { setPage } = usePage();
  const [course, setCourse] = useState("");
  const [students, setStudents] = useState<StudentResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const {addNotification} = useNotifications()

  useEffect(() => {
    setPage("Upload Results");

    // Load saved draft from localStorage (auto-save simulation)
    const draft = localStorage.getItem("result_draft");
    if (draft) {
      const parsed = JSON.parse(draft);
      setCourse(parsed.course);
      setStudents(parsed.students);
    }
  }, [setPage]);

  // Simulated courses
  const courses = [
    { id: "csc201", name: "CSC 201 - Data Structures" },
    { id: "csc203", name: "CSC 203 - Database Systems" },
  ];

  const handleCourseSelect = (value: string) => {
    setCourse(value);
    setStudents([
      { id: "1", name: "Aloye Breakthrough", matric_no: "CSC/22/001", score: "", grade: "" },
      { id: "2", name: "Muna Love", matric_no: "CSC/22/002", score: "", grade: "" },
      { id: "3", name: "James Bright", matric_no: "CSC/22/003", score: "", grade: "" },
    ]);
  };

  const computeGrade = (score: number): string => {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    if (score >= 40) return "E";
    return "F";
  };

  const handleScoreChange = (id: string, value: string) => {
    const num = Number(value);
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, score: value === "" ? "" : num, grade: value === "" ? "" : computeGrade(num) }
          : s
      )
    );

    // Auto-save draft
    localStorage.setItem(
      "result_draft",
      JSON.stringify({ course, students })
    );
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate CSV/Excel reading
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split("\n").slice(1); // Skip header
      const imported = lines
        .filter((line) => line.trim())
        .map((line, idx) => {
          const [name, matric_no, scoreStr] = line.split(",");
          const score = Number(scoreStr.trim());
          return {
            id: String(idx + 1),
            name: name.trim(),
            matric_no: matric_no.trim(),
            score,
            grade: computeGrade(score),
          };
        });
      setStudents(imported);
      alert(`Imported ${imported.length} records successfully!`);
    };
    reader.readAsText(file);
  };

  const handleConfirmSubmit = () => {
    setShowConfirm(true);
  };

  const handleSubmit = () => {
    setShowConfirm(false);
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          localStorage.removeItem("result_draft");
          addNotification({message: "Upload Success", variant: 'success'})
          return 100;
        }
        return prev + 20;
      });
    }, 400);

    // TODO: Replace this with API call
    console.log("Uploading results:", { course, students });
  };

  return (
    <div className="max-w-6xl mx-auto ">
      <div >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-semibold text-primary">
              Upload Results
            </h1>
            <div className="flex items-center gap-2">
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Upload className="w-4 h-4" />
                Import CSV
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileImport}
                className="hidden"
              />
            </div>
          </div>

          {/* Course Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted mb-2">
              Select Course
            </label>
            <Select onValueChange={handleCourseSelect}>
              <SelectTrigger className="w-full sm:w-80">
                <SelectValue placeholder="Choose a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {course && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-border rounded-xl overflow-hidden">
                <thead className="bg-surfaceElevated text-sm text-muted">
                  <tr>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Matric No</th>
                    <th className="text-left py-3 px-4">Score</th>
                    <th className="text-left py-3 px-4">Grade</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {students.map((s) => (
                    <tr
                      key={s.id}
                      className="border-t border-border hover:bg-surfaceElevated"
                    >
                      <td className="py-3 px-4">{s.name}</td>
                      <td className="py-3 px-4">{s.matric_no}</td>
                      <td className="py-3 px-4">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={s.score}
                          onChange={(e) =>
                            handleScoreChange(s.id, e.target.value)
                          }
                          className="w-24"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium">{s.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Submit */}
          {course && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleConfirmSubmit}
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Submit Results
              </Button>
            </div>
          )}
        </CardContent>
      </div>

      {/* Confirmation Modal */}
<UniversalDialog
  open={showConfirm}
  onOpenChange={setShowConfirm}
  type="confirm"
  title="Confirm Upload"
  message={`Are you sure you want to submit results for ${course}?`}
  onConfirm={handleSubmit}
  onCancel={() => setShowConfirm(false)}
  confirmText="Yes, Submit"
  cancelText="Cancel"
/>


      {/* Upload Progress Modal */}
      <Dialog open={isUploading}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="flex justify-center items-center gap-2 text-primary">
              <Loader2 className="animate-spin w-5 h-5" />
              Uploading Results...
            </DialogTitle>
          </DialogHeader>
          <div className="w-full bg-surfaceElevated h-2 rounded-xl mt-4 mb-2 overflow-hidden">
            <div
              className="bg-primary h-2 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          {uploadProgress >= 100 && (
            <div className="flex justify-center items-center gap-2 text-green-600 mt-2">
              <CheckCircle2 className="w-4 h-4" /> Upload Complete
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
