import { useDialog } from "@/context/DialogContext";
import { Trash2 } from "lucide-react";

export default function DeleteCourseButton() {
  const { openDialog } = useDialog();

  const handleDelete = () => {
    openDialog("confirm", {
      title: "Delete Course",
      message: "Are you sure you want to delete this course?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      icon: <Trash2 className="text-red-500" />,
      onConfirm: () => console.log("Course deleted ✅"),
    });
  };

  return <button onClick={handleDelete}>🗑️ Delete Course</button>;
}
