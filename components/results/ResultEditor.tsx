// components/ResultEditor.tsx
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";

interface ResultEditorProps {
  studentId: string;
  tempScore: number | string;
  tempGrade: string;
  tempRemark: string;
  onFieldChange: (studentId: string, field: string, value: string) => void;
  calculateGrade: (score: number) => string;
}

export function ResultEditor({
  studentId,
  tempScore,
  tempGrade,
  tempRemark,
  onFieldChange,
  calculateGrade
}: ResultEditorProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="number"
          min="0"
          max="100"
          value={tempScore || ""}
          onChange={(e) => {
            const newScore = parseFloat(e.target.value);
            onFieldChange(studentId, "score", e.target.value);
            const newGrade = calculateGrade(newScore);
            onFieldChange(studentId, "grade", newGrade);
          }}
          className="w-20"
          placeholder="Score"
        />
        <Input
          value={tempGrade || ""}
          onChange={(e) => onFieldChange(studentId, "grade", e.target.value)}
          className="w-16"
          placeholder="Grade"
          maxLength={2}
        />
      </div>
      <Textarea
        value={tempRemark || ""}
        onChange={(e) => onFieldChange(studentId, "remark", e.target.value)}
        placeholder="Remark"
        className="text-xs"
        rows={2}
      />
    </div>
  );
}