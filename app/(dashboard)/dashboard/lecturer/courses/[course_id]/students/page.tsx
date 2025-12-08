"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo, useRef } from "react";
import { 
  BookOpen, 
  User, 
  Download, 
  Filter, 
  Search, 
  Users, 
  Mail, 
  Phone, 
  ChevronDown,
  RefreshCw,
  Eye,
  MoreVertical,
  Plus,
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  Edit,
  FileSpreadsheet,
  Trash2,
  Save,
  FileUp,
  FileCheck,
  FileX,
  Clock,
  Check,
  AlertTriangle,
  Send,
  FileWarning,
  UserX,
  AlertOctagon,
  Info
} from "lucide-react";
import { Table } from "@/components/ui/table/Table";
import { useDataFetcher } from "@/lib/dataFetcher";
import { useCourse } from "@/hooks/useCourse";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { usePage } from "@/hooks/usePage";
import { useDialog } from "@/context/DialogContext";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Student {
  _id: string;
  name: string;
  matric_no: string;
  department: string;
  level: string;
  email?: string;
  phone?: string;
  enrollment_date?: string;
  status?: "active" | "inactive" | "pending";
}

interface Result {
  _id?: string;
  student_id: string;
  matric_no: string;
  course_id: string;
  score: number;
  grade: string;
  remark?: string;
  uploaded_by?: string;
  uploaded_at?: string;
  is_uploaded: boolean;
  upload_status?: "uploaded" | "pending" | "failed";
}

interface PendingResult {
  matric_no: string;
  score: number;
  grade: string;
  remark?: string;
  student_id?: string;
  student_name?: string;
  department?: string;
  level?: string;
  existing_score?: number;
  existing_grade?: string;
  validation_errors?: string[];
  row_data?: any;
}

interface ValidationIssues {
  studentsNotFound: Array<{matric_no: string, name?: string, row?: number}>;
  studentsWithExistingResults: Array<{matric_no: string, name: string, existing_score: number, existing_grade: string, new_score: number, new_grade: string}>;
  invalidScores: Array<{matric_no: string, score: any, row?: number}>;
  missingMatricNos: Array<{row: number}>;
  fileFormatErrors: string[];
  generalErrors: string[];
}

interface MergedStudent extends Student {
  result?: Result;
  isResultUploaded: boolean;
  upload_status?: "uploaded" | "pending" | "failed";
}

type SortField = "name" | "matric_no" | "department" | "level" | "enrollment_date" | "score" | "grade";
type SortDirection = "asc" | "desc";

export default function CourseStudentsPage() {
  const { course_id } = useParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [mergedStudents, setMergedStudents] = useState<MergedStudent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<MergedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [resultFilter, setResultFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isReviewUploadOpen, setIsReviewUploadOpen] = useState(false);
  const [bulkUploadFile, setBulkUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmittingPending, setIsSubmittingPending] = useState(false);
  const [validationIssues, setValidationIssues] = useState<ValidationIssues>({
    studentsNotFound: [],
    studentsWithExistingResults: [],
    invalidScores: [],
    missingMatricNos: [],
    fileFormatErrors: [],
    generalErrors: []
  });
  const {setPage} = usePage();
  const { openDialog, closeDialog } = useDialog();
  
  const [pendingResults, setPendingResults] = useState<PendingResult[]>([]);
  
  const { fetchData, postData } = useDataFetcher();
  const [course, setCourse] = useState<any>(null);
  const { fetchCourseById } = useCourse();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data
  useEffect(() => {
    loadData();
  }, [course_id]);

  // Set page
  useEffect(() => {
    setPage(`${course?.code} - Students & Results Management`);
  }, [course]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [studentsRes, resultsRes, courseRes] = await Promise.all([
        fetchData(`/course/${course_id}/students`),
        fetchData(`/course/${course_id}/results`),
        fetchCourseById(course_id)
      ]);

      setCourse(Array.isArray(courseRes) ? courseRes[0] : courseRes || null);
      
      const studentsData = studentsRes?.data?.map((student: Student) => ({
        ...student,
        status: student.status || "active",
        enrollment_date: student.enrollment_date || new Date().toISOString().split('T')[0]
      })) || [];
      
      const resultsData = resultsRes?.data || [];
      
      setStudents(studentsData);
      setResults(resultsData);
      
      const merged = mergeStudentsWithResults(studentsData, resultsData);
      setMergedStudents(merged);
      setFilteredStudents(merged);
      toast.success("Data loaded successfully");
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load data. Please try again.");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Merge students with results and pending results
  const mergeStudentsWithResults = (studentsData: Student[], resultsData: Result[]): MergedStudent[] => {
    return studentsData.map((student: Student) => {
      const uploadedResult = resultsData.find((r: Result) => 
        r.student_id === student._id || r.matric_no === student.matric_no
      );
      
      const pendingResult = pendingResults.find(pr => pr.matric_no === student.matric_no);
      
      if (uploadedResult) {
        return {
          ...student,
          result: uploadedResult,
          isResultUploaded: true,
          upload_status: "uploaded"
        };
      } else if (pendingResult) {
        return {
          ...student,
          result: {
            student_id: student._id,
            matric_no: student.matric_no,
            course_id: course_id as string,
            score: pendingResult.score,
            grade: pendingResult.grade,
            remark: pendingResult.remark,
            is_uploaded: false,
            upload_status: "pending"
          },
          isResultUploaded: false,
          upload_status: "pending"
        };
      } else {
        return {
          ...student,
          result: undefined,
          isResultUploaded: false,
          upload_status: undefined
        };
      }
    });
  };

  // Update merged students when pending results change
  useEffect(() => {
    if (students.length > 0 && results.length > 0) {
      const merged = mergeStudentsWithResults(students, results);
      setMergedStudents(merged);
    }
  }, [pendingResults, students, results]);

  // ✅ Handle Excel import
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const binaryStr = evt.target?.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
        });

        // Find the first row that includes Q1–Q5 (real header row)
        let headerIndex = rows.findIndex((r) =>
          r.some(
            (cell) =>
              typeof cell === "string" &&
              cell.toLowerCase().includes("q1") &&
              r.join(" ").toLowerCase().includes("q2")
          )
        );

        if (headerIndex === -1) {
          // Try alternative header detection
          headerIndex = rows.findIndex((r) => {
            const rowText = r.join(" ").toLowerCase();
            return (
              rowText.includes("matric") || 
              rowText.includes("reg") ||
              rowText.includes("score") ||
              rowText.includes("total")
            );
          });
          
          if (headerIndex === -1) {
            setValidationIssues(prev => ({
              ...prev,
              fileFormatErrors: ["Could not find headers in the Excel file. Please ensure the file contains column headers."]
            }));
            setIsReviewUploadOpen(true);
            return;
          }
        }

        const headerRow = rows[headerIndex];
        const dataRows = rows.slice(headerIndex + 1);

        // Normalize header names
        const normalizeKey = (key: string): string => {
          if (!key || typeof key !== "string") return "";
          return key
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_")
            .replace(/_+/g, "_")
            .replace(/^_|_$/g, "");
        };

        const headers = headerRow.map((h: string) => normalizeKey(h));

        // Find matric_no column index
        const matricIndex = headers.findIndex(h => 
          h.includes("matric") || h.includes("reg") || h.includes("student") || h.includes("id")
        );

        if (matricIndex === -1) {
          setValidationIssues(prev => ({
            ...prev,
            fileFormatErrors: ["Could not find matric number column. Please ensure your file has a column for student matric numbers."]
          }));
          setIsReviewUploadOpen(true);
          return;
        }

        // Find score/total column
        const scoreIndices = headers.map((h, i) => 
          h.includes("score") || h.includes("total") || h.includes("mark") || h.includes("grade") ? i : -1
        ).filter(i => i !== -1);

        if (scoreIndices.length === 0) {
          setValidationIssues(prev => ({
            ...prev,
            fileFormatErrors: ["Could not find score/total column. Please ensure your file has a column for scores."]
          }));
          setIsReviewUploadOpen(true);
          return;
        }

        // Process data and validate
        const newPendingResults: PendingResult[] = [];
        const newValidationIssues: ValidationIssues = {
          studentsNotFound: [],
          studentsWithExistingResults: [],
          invalidScores: [],
          missingMatricNos: [],
          fileFormatErrors: [],
          generalErrors: []
        };

        dataRows.forEach((row, index) => {
          // Skip empty rows
          if (row.every(cell => !cell || cell.toString().trim() === "")) return;

          const rowNumber = headerIndex + 2 + index; // +2 for 1-based and header
          const matricNo = row[matricIndex]?.toString().trim();
          
          if (!matricNo) {
            newValidationIssues.missingMatricNos.push({ row: rowNumber });
            return;
          }

          // Find student
          const student = students.find(s => s.matric_no === matricNo);
          if (!student) {
            newValidationIssues.studentsNotFound.push({ 
              matric_no: matricNo, 
              name: row.find((cell, i) => headers[i]?.includes("name"))?.toString() || "Unknown",
              row: rowNumber 
            });
            return;
          }

          // Get score from the first available score column
          let score: number | null = null;
          for (const scoreIdx of scoreIndices) {
            const value = row[scoreIdx];
            if (value !== undefined && value !== null && value !== "") {
              const numValue = Number(value);
              if (!isNaN(numValue)) {
                score = numValue;
                break;
              }
            }
          }

          // If no score found, try to calculate from Q1-Q5
          if (score === null) {
            const qIndices = headers.map((h, i) => 
              h.includes("q1") || h.includes("q2") || h.includes("q3") || h.includes("q4") || h.includes("q5") ? i : -1
            ).filter(i => i !== -1);
            
            if (qIndices.length > 0) {
              let total = 0;
              let hasValidQs = false;
              qIndices.forEach(qIdx => {
                const qValue = Number(row[qIdx]);
                if (!isNaN(qValue)) {
                  total += qValue;
                  hasValidQs = true;
                }
              });
              
              if (hasValidQs) {
                score = total;
              }
            }
          }

          // Validate score
          if (score === null || isNaN(score)) {
            newValidationIssues.invalidScores.push({ 
              matric_no: matricNo, 
              score: row[scoreIndices[0]], 
              row: rowNumber 
            });
            return;
          }

          if (score < 0 || score > 100) {
            newValidationIssues.invalidScores.push({ 
              matric_no: matricNo, 
              score, 
              row: rowNumber 
            });
            return;
          }

          const grade = calculateGrade(score);
          
          // Check for existing result
          const existingResult = results.find(r => r.matric_no === matricNo);
          
          if (existingResult) {
            newValidationIssues.studentsWithExistingResults.push({
              matric_no: matricNo,
              name: student.name,
              existing_score: existingResult.score,
              existing_grade: existingResult.grade,
              new_score: score,
              new_grade: grade
            });
          }

          // Add to pending results
          newPendingResults.push({
            matric_no: matricNo,
            score: score,
            grade: grade,
            remark: "",
            student_id: student._id,
            student_name: student.name,
            department: student.department,
            level: student.level,
            existing_score: existingResult?.score,
            existing_grade: existingResult?.grade,
            row_data: row
          });
        });

        // Set validation issues
        setValidationIssues(newValidationIssues);
        
        // Set pending results (overwrite existing ones)
        if (newPendingResults.length > 0) {
          setPendingResults(newPendingResults);
        }

        // Show review modal if there are any issues or pending results
        if (newPendingResults.length > 0 || 
            newValidationIssues.studentsNotFound.length > 0 ||
            newValidationIssues.studentsWithExistingResults.length > 0 ||
            newValidationIssues.invalidScores.length > 0 ||
            newValidationIssues.missingMatricNos.length > 0) {
          setIsReviewUploadOpen(true);
        } else {
          toast.error("No valid data found in the Excel file");
        }

      } catch (error) {
        console.error("Error processing Excel file:", error);
        toast.error("Failed to process Excel file. Please check the format.");
        setValidationIssues(prev => ({
          ...prev,
          generalErrors: ["Failed to process the Excel file. Please ensure it's in the correct format."]
        }));
        setIsReviewUploadOpen(true);
      }
    };

    reader.readAsBinaryString(file);
  };

  // Calculate grade based on score
  const calculateGrade = (score: number): string => {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    if (score >= 40) return "E";
    return "F";
  };

  // Apply filters and search
  useEffect(() => {
    let result = [...mergedStudents];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(student => 
        student.name.toLowerCase().includes(query) ||
        student.matric_no.toLowerCase().includes(query) ||
        student.department.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query) ||
        student.phone?.includes(query)
      );
    }
    
    if (departmentFilter !== "all") {
      result = result.filter(student => student.department === departmentFilter);
    }
    
    if (levelFilter !== "all") {
      result = result.filter(student => student.level === levelFilter);
    }
    
    if (statusFilter !== "all") {
      result = result.filter(student => student.status === statusFilter);
    }
    
    if (resultFilter !== "all") {
      if (resultFilter === "uploaded") {
        result = result.filter(student => student.upload_status === "uploaded");
      } else if (resultFilter === "pending") {
        result = result.filter(student => student.upload_status === "pending");
      } else if (resultFilter === "not_uploaded") {
        result = result.filter(student => !student.upload_status && !student.isResultUploaded);
      }
    }
    
    result.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === "score") {
        aValue = a.result?.score || 0;
        bValue = b.result?.score || 0;
      } else if (sortField === "grade") {
        aValue = a.result?.grade || "";
        bValue = b.result?.grade || "";
      } else if (sortField === "enrollment_date") {
        aValue = new Date(aValue || "").getTime();
        bValue = new Date(bValue || "").getTime();
      }
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    
    setFilteredStudents(result);
  }, [mergedStudents, searchQuery, departmentFilter, levelFilter, statusFilter, resultFilter, sortField, sortDirection]);

  // Get unique departments and levels for filters
  const uniqueDepartments = useMemo(() => 
    Array.from(new Set(students.map(s => s.department))), [students]
  );
  
  const uniqueLevels = useMemo(() => 
    Array.from(new Set(students.map(s => s.level))), [students]
  );

  // Handle file upload via button
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBulkUploadFile(file);
      handleExcelImport(event);
    }
  };

  // Submit pending results to backend
  const submitPendingResults = async () => {
    if (pendingResults.length === 0) return;
    
    try {
      setIsSubmittingPending(true);
      
      const validResults = pendingResults.filter(pr => !pr.validation_errors || pr.validation_errors.length === 0);
      
      if (validResults.length === 0) {
        toast.error("No valid results to submit");
        return;
      }
      
      const resultsToSubmit = validResults.map(pr => ({
        matric_no: pr.matric_no,
        score: pr.score,
        grade: pr.grade,
        remark: pr.remark || "",
        course_id: course_id,
        uploaded_at: new Date().toISOString()
      }));
      
      const response = await postData(`/course/${course_id}/results/bulk`, {
        results: resultsToSubmit
      });
      
      if (response.success) {
        toast.success(`${validResults.length} results uploaded successfully`);
        setIsReviewUploadOpen(false);
        setPendingResults([]);
        setValidationIssues({
          studentsNotFound: [],
          studentsWithExistingResults: [],
          invalidScores: [],
          missingMatricNos: [],
          fileFormatErrors: [],
          generalErrors: []
        });
        loadData();
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error submitting results:", error);
      toast.error("Failed to submit results");
    } finally {
      setIsSubmittingPending(false);
    }
  };

  // Remove a pending result
  const removePendingResult = (matricNo: string) => {
    setPendingResults(prev => prev.filter(pr => pr.matric_no !== matricNo));
    toast.success("Result removed from pending list");
  };

  // Clear all pending results
  const clearPendingResults = () => {
    setPendingResults([]);
    setValidationIssues({
      studentsNotFound: [],
      studentsWithExistingResults: [],
      invalidScores: [],
      missingMatricNos: [],
      fileFormatErrors: [],
      generalErrors: []
    });
    setIsReviewUploadOpen(false);
    toast.success("All pending results cleared");
  };

  // Handle edit result using dialog
  const handleEditResult = (student: MergedStudent) => {
    const isEditing = student.isResultUploaded || student.upload_status === "pending";
    
    openDialog("form", {
      title: isEditing ? `Edit ${student.name}'s Result` : `Add ${student.name}'s Result`,
      confirmText: isEditing ? "Save Changes" : "Add Result",
      loaderOnSubmit: true,
      fields: [
        {
          name: "score",
          label: "Score",
          type: "number",
          defaultValue: student.result?.score || 0,
          placeholder: "Enter score (0-100)",
          required: true,
          min: 0,
          max: 100,
          onChange: (value: any, formData: any, setFieldValue: Function) => {
            const score = parseFloat(value) || 0;
            const calculatedGrade = calculateGrade(score);
            setFieldValue("grade", calculatedGrade);
          }
        },
        {
          name: "remark",
          label: "Remark",
          type: "textarea",
          defaultValue: student.result?.remark || "",
          placeholder: "Enter any remarks (optional)",
          rows: 3,
        },
      ],
      onSubmit: async (data: any) => {
        try {
          if (student.upload_status === "pending") {
            setPendingResults(prev => prev.map(pr => 
              pr.matric_no === student.matric_no ? {
                ...pr,
                score: parseFloat(data.score) || 0,
                grade: data.grade,
                remark: data.remark || ""
              } : pr
            ));
            toast.success("Pending result updated");
          } else {
            const resultData = {
              student_id: student._id,
              matricNumber: student.matric_no,
              course_id: course_id,
              score: parseFloat(data.score) || 0,
              grade: data.grade,
              remark: data.remark || ""
            };
            
            const endpoint = `/results/upload/${course_id}`;
            const method = isEditing ? 'PUT' : 'POST';
            
            const response = await fetchData(endpoint, method, resultData);
            
              toast.success(isEditing ? "Result updated successfully" : "Result added successfully");
              loadData();
          }
          closeDialog();
        } catch (error) {
          console.error("Error saving result:", error);
          throw new Error(isEditing ? "Failed to update result" : "Failed to add result");
        }
      },
    });
  };

  // Handle delete result
  const handleDeleteResult = (student: MergedStudent) => {
    if (student.upload_status === "pending") {
      openDialog("confirm", {
        title: "Remove Pending Result",
        message: `Are you sure you want to remove the pending result for ${student.name} (${student.matric_no})?`,
        confirmText: "Remove",
        confirmVariant: "destructive",
        onConfirm: () => {
          removePendingResult(student.matric_no);
        },
      });
    } else if (student.result?._id) {
      openDialog("confirm", {
        title: "Delete Result",
        message: `Are you sure you want to delete the result for ${student.name} (${student.matric_no})? This action cannot be undone.`,
        confirmText: "Delete",
        confirmVariant: "destructive",
        onConfirm: async () => {
          try {
            const response = await fetch(`/course/${course_id}/results/${student.result?._id}`, {
              method: 'DELETE',
            });
            
            if (response.ok) {
              toast.success("Result deleted successfully");
              loadData();
            } else {
              throw new Error("Delete failed");
            }
          } catch (error) {
            console.error("Error deleting result:", error);
            toast.error("Failed to delete result");
          }
        },
      });
    } else {
      toast.error("No result to delete");
    }
  };

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle export results
  const handleExportResults = () => {
    const dataToExport = mergedStudents.map(student => ({
      "Matric No": student.matric_no,
      "Name": student.name,
      "Department": student.department,
      "Level": student.level,
      "Score": student.result?.score || "",
      "Grade": student.result?.grade || "",
      "Remark": student.result?.remark || "",
      "Status": student.upload_status === "uploaded" ? "Uploaded" : 
                student.upload_status === "pending" ? "Pending Upload" : "Not Uploaded",
      "Uploaded At": student.result?.uploaded_at || ""
    }));
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, `${course?.code}_results_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast.success("Results exported successfully");
  };

  // Table columns
  const columns = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }: any) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: () => (
        <div 
          className="flex items-center gap-1 cursor-pointer hover:text-brand transition-colors"
          onClick={() => handleSort("name")}
        >
          Name
          <ChevronDown className={`w-4 h-4 transition-transform ${
            sortField === "name" && sortDirection === "desc" ? "rotate-180" : ""
          }`} />
        </div>
      ),
      cell: ({ row }: any) => {
        const student = row.original;
        const initials = student.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase();
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 bg-primary text-text">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{student.name}</div>
              {student.email && (
                <div className="text-xs text-text-muted flex items-center gap-1">
                  <Mail size={12} />
                  {student.email}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "matric_no",
      header: "Matric No",
      cell: ({ row }: any) => (
        <code className="bg-surface px-2 py-1 rounded text-sm">{row.original.matric_no}</code>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }: any) => (
        <Badge variant="outline">Level {row.original.level}</Badge>
      ),
    },
    {
      accessorKey: "result",
      header: () => (
        <div 
          className="cursor-pointer hover:text-brand transition-colors"
          onClick={() => handleSort("score")}
        >
          Result
        </div>
      ),
      cell: ({ row }: any) => {
        const student = row.original;
        
        if (student.upload_status === "uploaded" && student.result) {
          return (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Uploaded
                </Badge>
                <span className="font-semibold">{student.result.score}</span>
                <Badge variant="outline">{student.result.grade}</Badge>
              </div>
              {student.result.remark && (
                <p className="text-xs text-text-muted truncate">{student.result.remark}</p>
              )}
            </div>
          );
        } else if (student.upload_status === "pending" && student.result) {
          return (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending Upload
                </Badge>
                <span className="font-semibold">{student.result.score}</span>
                <Badge variant="outline">{student.result.grade}</Badge>
              </div>
              {student.result.remark && (
                <p className="text-xs text-text-muted truncate">{student.result.remark}</p>
              )}
            </div>
          );
        }
        
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-500/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            Not Uploaded
          </Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const student = row.original;
        
        return (
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="gap-2"
                  onClick={() => handleEditResult(student)}
                >
                  <Edit className="h-4 w-4" />
                  {student.upload_status === "pending" ? "Edit Pending Result" : 
                   student.isResultUploaded ? "Edit Result" : "Add Result"}
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Eye className="h-4 w-4" />
                  View Profile
                </DropdownMenuItem>
                {(student.isResultUploaded || student.upload_status === "pending") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="gap-2 text-red-600"
                      onClick={() => handleDeleteResult(student)}
                    >
                      <Trash2 className="h-4 w-4" />
                      {student.upload_status === "pending" ? "Remove Pending" : "Delete Result"}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Loading skeleton
  if (loading) {
    return (
      <div className=" ">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className=" mx-auto p-4 md:p-6 min-h-screen bg-bg text-text">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <BookOpen className="text-brand" />
            {course?.code} – Students & Results
            {course?.name && (
              <span className="text-lg font-normal text-text-muted">
                ({course.name})
              </span>
            )}
          </h1>
          <p className="text-text-muted mt-1">
            Manage students and upload results for this course
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {pendingResults.length > 0 && (
            <button onClick={()=>setIsReviewUploadOpen(true)}>



            <Badge  className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20 gap-2">
              <Clock className="w-3 h-3" />
              {pendingResults.length} Pending
            </Badge>
            </button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Excel
          </Button>
          <Button
            size="sm"
            onClick={handleExportResults}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-surface border-border hover:border-brand/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Total Students</p>
                <p className="text-2xl font-bold mt-1">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-brand/30" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-surface border-border hover:border-brand/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Results Uploaded</p>
                <p className="text-2xl font-bold mt-1">
                  {mergedStudents.filter(s => s.upload_status === "uploaded").length}
                </p>
              </div>
              <FileCheck className="h-8 w-8 text-green-500/30" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-surface border-border hover:border-brand/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Pending Upload</p>
                <p className="text-2xl font-bold mt-1">
                  {pendingResults.length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500/30" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-surface border-border hover:border-brand/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Not Uploaded</p>
                <p className="text-2xl font-bold mt-1">
                  {mergedStudents.filter(s => !s.upload_status && !s.isResultUploaded).length}
                </p>
              </div>
              <FileX className="h-8 w-8 text-gray-500/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Card className="mb-6 border-red-500/20 bg-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <X className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-red-600">Error Loading Data</p>
                  <p className="text-sm text-red-500/80">{error}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                className="border-red-500/30 text-red-600 hover:bg-red-500/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                <Input
                  placeholder="Search students by name, matric no, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {uniqueDepartments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {uniqueLevels.map(level => (
                    <SelectItem key={level} value={level}>Level {level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={resultFilter} onValueChange={setResultFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Result Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="uploaded">Uploaded</SelectItem>
                  <SelectItem value="pending">Pending Upload</SelectItem>
                  <SelectItem value="not_uploaded">Not Uploaded</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setDepartmentFilter("all");
                  setLevelFilter("all");
                  setStatusFilter("all");
                  setResultFilter("all");
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {filteredStudents.length > 0 ? (
        <Table
          columns={columns}
          data={filteredStudents}
          enableSearch={false}
          enableSort={true}
          enableExport={false}
          enablePagination={false}
          pageSize={10}
          enableSelection={true}
          // onSelectionChange={setSelectedStudents}
          controls={false}
          // className="border-0"
        />
      ) : (
        <Card className="border-dashed border-2 border-border/50 bg-transparent">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-text-muted/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No students found</h3>
            <p className="text-text-muted mb-6">
              {students.length === 0 
                ? "No students are enrolled in this course yet."
                : "No students match your current filters."}
            </p>
            {students.length === 0 ? (
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Students
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setDepartmentFilter("all");
                  setLevelFilter("all");
                  setStatusFilter("all");
                  setResultFilter("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Review Upload Dialog with Validation Issues */}
      <Dialog open={isReviewUploadOpen} onOpenChange={setIsReviewUploadOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-yellow-500" />
              Review Upload Results
            </DialogTitle>
            <DialogDescription>
              Please review the validation results before proceeding. Some issues need your attention.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending" className="gap-2">
                Pending Results ({pendingResults.length})
              </TabsTrigger>
              <TabsTrigger value="issues" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Issues (
                  {validationIssues.studentsNotFound.length + 
                   validationIssues.studentsWithExistingResults.length + 
                   validationIssues.invalidScores.length + 
                   validationIssues.missingMatricNos.length}
                )
              </TabsTrigger>
              <TabsTrigger value="overwrite" className="gap-2">
                <AlertOctagon className="h-4 w-4" />
                Overwrites ({validationIssues.studentsWithExistingResults.length})
              </TabsTrigger>
              <TabsTrigger value="notfound" className="gap-2">
                <UserX className="h-4 w-4" />
                Not Found ({validationIssues.studentsNotFound.length})
              </TabsTrigger>
            </TabsList>
            
            {/* Pending Results Tab */}
            <TabsContent value="pending" className="space-y-4">
              {pendingResults.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-muted">
                      {pendingResults.length} results ready for upload
                    </p>
                    <Badge className="bg-yellow-500/10 text-yellow-700">
                      Pending Review
                    </Badge>
                  </div>
                  
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {pendingResults.map((result, index) => (
                        <Card key={result.matric_no} className="border-border hover:border-brand/50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold">{result.student_name}</span>
                                  <code className="text-sm bg-surface px-2 py-1 rounded">
                                    {result.matric_no}
                                  </code>
                                  <Badge variant="outline">
                                    Level {result.level}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="space-y-1">
                                    <p className="text-xs text-text-muted">Score</p>
                                    <p className="font-semibold">{result.score}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs text-text-muted">Grade</p>
                                    <Badge variant="outline">{result.grade}</Badge>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs text-text-muted">Department</p>
                                    <p className="text-sm">{result.department}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs text-text-muted">Status</p>
                                    {result.existing_score ? (
                                      <Badge className="bg-orange-500/10 text-orange-700">
                                        Will Overwrite
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-green-500/10 text-green-700">
                                        New Upload
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                
                                {result.existing_score && (
                                  <div className="mt-2 p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                                    <p className="text-sm text-orange-700 flex items-center gap-2">
                                      <AlertOctagon className="h-4 w-4" />
                                      <span className="font-semibold">Warning:</span> This will overwrite existing result:
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 ml-6">
                                      <span className="text-sm">
                                        <span className="text-text-muted">Current:</span>{" "}
                                        <span className="font-semibold line-through">{result.existing_score}</span> 
                                        {" "}({result.existing_grade})
                                      </span>
                                      <span className="text-sm">
                                        <span className="text-text-muted">→ New:</span>{" "}
                                        <span className="font-semibold">{result.score}</span> 
                                        {" "}({result.grade})
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removePendingResult(result.matric_no)}
                                className="text-red-600 hover:text-red-700 ml-4"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-text-muted">No pending results to review</p>
                </div>
              )}
            </TabsContent>
            
            {/* All Issues Tab */}
            <TabsContent value="issues" className="space-y-6">
              {/* Students Not Found */}
              {validationIssues.studentsNotFound.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <UserX className="h-5 w-5 text-red-500" />
                    <h4 className="font-semibold">Students Not Found in Course</h4>
                    <Badge variant="destructive">
                      {validationIssues.studentsNotFound.length} students
                    </Badge>
                  </div>
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <p className="text-sm text-red-700 mb-3">
                        The following students are not enrolled in this course. Their results will be ignored.
                      </p>
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-2">
                          {validationIssues.studentsNotFound.map((student, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border border-red-200 rounded">
                              <div>
                                <p className="font-medium">{student.name || "Unknown"}</p>
                                <code className="text-xs bg-red-100 px-2 py-1 rounded">
                                  {student.matric_no}
                                </code>
                              </div>
                              {student.row && (
                                <span className="text-xs text-red-600">Row {student.row}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Students with Existing Results */}
              {validationIssues.studentsWithExistingResults.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="h-5 w-5 text-orange-500" />
                    <h4 className="font-semibold">Existing Results Will Be Overwritten</h4>
                    <Badge className="bg-orange-500/10 text-orange-700">
                      {validationIssues.studentsWithExistingResults.length} students
                    </Badge>
                  </div>
                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-4">
                      <p className="text-sm text-orange-700 mb-3">
                        The following students already have results. Uploading will overwrite their existing scores.
                      </p>
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-2">
                          {validationIssues.studentsWithExistingResults.map((student, index) => (
                            <div key={index} className="p-3 border border-orange-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-medium">{student.name}</p>
                                  <code className="text-xs bg-orange-100 px-2 py-1 rounded">
                                    {student.matric_no}
                                  </code>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-center">
                                    <p className="text-xs text-text-muted">Current</p>
                                    <p className="font-semibold line-through">{student.existing_score}</p>
                                    <Badge variant="outline" className="mt-1">{student.existing_grade}</Badge>
                                  </div>
                                  <div className="text-2xl text-orange-500">→</div>
                                  <div className="text-center">
                                    <p className="text-xs text-text-muted">New</p>
                                    <p className="font-semibold text-green-600">{student.new_score}</p>
                                    <Badge className="bg-green-500/10 text-green-700 mt-1">{student.new_grade}</Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Invalid Scores */}
              {validationIssues.invalidScores.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h4 className="font-semibold">Invalid Scores</h4>
                    <Badge variant="destructive">
                      {validationIssues.invalidScores.length} errors
                    </Badge>
                  </div>
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <p className="text-sm text-red-700 mb-3">
                        The following scores are invalid (must be between 0 and 100):
                      </p>
                      <ScrollArea className="h-[150px]">
                        <div className="space-y-2">
                          {validationIssues.invalidScores.map((score, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border border-red-200 rounded">
                              <code className="text-xs bg-red-100 px-2 py-1 rounded">
                                {score.matric_no}
                              </code>
                              <span className="text-red-600">
                                Invalid score: {score.score}
                              </span>
                              {score.row && (
                                <span className="text-xs text-red-600">Row {score.row}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Missing Matric Numbers */}
              {validationIssues.missingMatricNos.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h4 className="font-semibold">Missing Matric Numbers</h4>
                    <Badge variant="destructive">
                      {validationIssues.missingMatricNos.length} rows
                    </Badge>
                  </div>
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <p className="text-sm text-red-700 mb-3">
                        The following rows are missing matric numbers and will be ignored:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {validationIssues.missingMatricNos.map((row, index) => (
                          <Badge key={index} variant="destructive">
                            Row {row.row}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* File Format Errors */}
              {validationIssues.fileFormatErrors.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileWarning className="h-5 w-5 text-red-500" />
                    <h4 className="font-semibold">File Format Issues</h4>
                  </div>
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {validationIssues.fileFormatErrors.map((error, index) => (
                          <p key={index} className="text-sm text-red-700 flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            {error}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* General Errors */}
              {validationIssues.generalErrors.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h4 className="font-semibold">General Errors</h4>
                  </div>
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {validationIssues.generalErrors.map((error, index) => (
                          <p key={index} className="text-sm text-red-700">
                            {error}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {Object.values(validationIssues).every(arr => arr.length === 0) && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-text-muted">No validation issues found</p>
                </div>
              )}
            </TabsContent>
            
            {/* Overwrite Tab */}
            <TabsContent value="overwrite" className="space-y-4">
              {validationIssues.studentsWithExistingResults.length > 0 ? (
                <>
                  <Card className="border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertOctagon className="h-6 w-6 text-orange-500" />
                        <div>
                          <h4 className="font-semibold">Overwrite Warning</h4>
                          <p className="text-sm text-text-muted">
                            {validationIssues.studentsWithExistingResults.length} students will have their results overwritten
                          </p>
                        </div>
                      </div>
                      
                      <ScrollArea className="h-[350px]">
                        <div className="space-y-3">
                          {validationIssues.studentsWithExistingResults.map((student, index) => (
                            <div key={index} className="p-4 border border-orange-200 rounded-lg bg-orange-50/50">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="font-semibold">{student.name}</p>
                                  <code className="text-xs bg-orange-100 px-2 py-1 rounded">
                                    {student.matric_no}
                                  </code>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-center">
                                    <p className="text-xs text-text-muted">Current</p>
                                    <div className="flex items-center gap-2">
                                      <p className="font-semibold text-lg line-through text-red-600">
                                        {student.existing_score}
                                      </p>
                                      <Badge variant="outline" className="bg-red-100">
                                        {student.existing_grade}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="text-2xl text-orange-500">→</div>
                                  <div className="text-center">
                                    <p className="text-xs text-text-muted">New</p>
                                    <div className="flex items-center gap-2">
                                      <p className="font-semibold text-lg text-green-600">
                                        {student.new_score}
                                      </p>
                                      <Badge className="bg-green-100 text-green-700">
                                        {student.new_grade}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-center text-sm text-orange-700">
                                <AlertTriangle className="h-4 w-4 inline mr-1" />
                                Current result will be replaced
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-text-muted">No results will be overwritten</p>
                </div>
              )}
            </TabsContent>
            
            {/* Not Found Tab */}
            <TabsContent value="notfound" className="space-y-4">
              {validationIssues.studentsNotFound.length > 0 ? (
                <>
                  <Card className="border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <UserX className="h-6 w-6 text-red-500" />
                        <div>
                          <h4 className="font-semibold">Students Not Enrolled</h4>
                          <p className="text-sm text-text-muted">
                            {validationIssues.studentsNotFound.length} students in the Excel file are not enrolled in this course
                          </p>
                        </div>
                      </div>
                      
                      <ScrollArea className="h-[350px]">
                        <div className="space-y-3">
                          {validationIssues.studentsNotFound.map((student, index) => (
                            <div key={index} className="p-3 border border-red-200 rounded-lg bg-red-50/50">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-red-700">{student.name}</p>
                                  <code className="text-xs bg-red-100 px-2 py-1 rounded text-red-700">
                                    {student.matric_no}
                                  </code>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-red-600">Not enrolled</p>
                                  {student.row && (
                                    <p className="text-xs text-text-muted">Row {student.row}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 flex items-start gap-2">
                          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          These students are not enrolled in this course. Please ensure they are properly enrolled before uploading their results.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-text-muted">All students in the file are enrolled in this course</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <Separator />
          
          <DialogFooter className="flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="text-sm text-text-muted">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    Ready to upload: {pendingResults.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    Will overwrite: {validationIssues.studentsWithExistingResults.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    Errors: {validationIssues.studentsNotFound.length + validationIssues.invalidScores.length}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearPendingResults}
                disabled={pendingResults.length === 0}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear All
              </Button>
              
              <Button
                onClick={() => setIsReviewUploadOpen(false)}
                variant="outline"
                className="gap-2"
              >
                <Clock className="h-4 w-4" />
                Review Later
              </Button>
              
              <Button
                onClick={submitPendingResults}
                disabled={pendingResults.length === 0 || isSubmittingPending}
                className="gap-2"
              >
                {isSubmittingPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Results ({pendingResults.length})
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer Info */}
      {filteredStudents.length > 0 && (
        <div className="mt-6 text-center text-sm text-text-muted">
          <p>
            Results marked as "Pending Upload" are stored locally. Review and submit them when ready.
          </p>
        </div>
      )}
    </div>
  );
}