import { useDialog } from "@/context/DialogContext";

export default function ExportButton() {
  const { openDialog } = useDialog();

  return (
    <button
      onClick={() =>
        openDialog("export", {
          onConfirm: (options: { format: string; filters: any }) => {
            console.log("Exporting with options:", options);
          },
        })
      }
    >
      📤 Export Records
    </button>
  );
}
