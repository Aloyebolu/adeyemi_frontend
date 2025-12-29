import { Loader2 } from "lucide-react";

interface TableLoadingProps {
  message?: string;
}

export function TableLoading({ message = "Loading..." }: TableLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Loader2 className="animate-spin text-primary" size={28} />
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}