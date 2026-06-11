import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { SortOrder } from "../../types/common";
import { TableHead } from "../ui/table";
import { cn } from "../../lib/utils";

interface SortableTableHeadProps {
  label: string;
  column: string;
  sortBy: string;
  sortOrder: SortOrder;
  onSort: (column: string) => void;
}

export function SortableTableHead({
  label,
  column,
  sortBy,
  sortOrder,
  onSort,
}: SortableTableHeadProps) {
  const isActive = sortBy === column;
  const Icon = isActive
    ? sortOrder === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "flex items-center gap-1 font-medium transition-colors hover:text-foreground",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
        <Icon className="h-4 w-4" />
      </button>
    </TableHead>
  );
}
