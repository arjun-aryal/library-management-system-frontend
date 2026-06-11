import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No data found",
  description = "There are no items to display yet.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <Inbox className="h-10 w-10" />
      <div className="text-center">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}
