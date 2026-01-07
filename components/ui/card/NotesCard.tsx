import { Card, CardContent } from "@/components/ui/Card";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

export interface NoteItem {
  text: string;
  type?: "default" | "success" | "warning" | "error" | "info"; 
  // type?: string
}

interface NotesCardProps {
  title?: string;
  notes?: NoteItem[]; // can pass array of objects for more control
  icon?: React.ReactNode;
  iconColor?: string;
}

const defaultNotes: NoteItem[] = [

];

const getIconForType = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-success" />;
    case "warning":
      return <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-500" />;
    case "error":
      return <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />;
    case "info":
      return <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />;
    default:
      return <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-success" />;
  }
};

const NotesCard: React.FC<NotesCardProps> = ({
  title = "Important Notes",
  notes = defaultNotes,
  icon = <AlertTriangle className="w-5 h-5" />,
  iconColor = "text-primary",
}) => {
  return (
    <Card className="bg-surface-elevated border-border">
      <CardContent className="p-6">
        <h4 className={`font-semibold mb-4 flex items-center gap-2 ${iconColor}`}>
          {icon}
          {title}
        </h4>

        <ul className="space-y-2 text-sm text-text2">
          {notes.map((note, idx) => (
            <li key={idx} className="flex items-start gap-2">
              {getIconForType(note.type || "default")}
              {note.text}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default NotesCard;
