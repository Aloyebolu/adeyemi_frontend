import { useDialog } from "@/context/DialogContext";

export default function ImportButton() {
  const { openDialog } = useDialog();

  return (
    <button
      onClick={() =>
        openDialog("import", {
          apiUrl: "/api/import",
          onSuccess: (data: any) => console.log("Imported:", data),
        })
      }
    >
      📥 Import Data
    </button>
  );
}
