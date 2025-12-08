// components/ResultRow.tsx
import { CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface ResultRowProps {
  student: {
    _id: string;
    isResultUploaded: boolean;
    result?: {
      score: number;
      grade: string;
      remark?: string;
    };
  };
}

export function ResultRow({ student }: ResultRowProps) {
  if (student.isResultUploaded && student.result) {
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
  }

  return (
    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
      <AlertCircle className="w-3 h-3 mr-1" />
      Not Uploaded
    </Badge>
  );
}