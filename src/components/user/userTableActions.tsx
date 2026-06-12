import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function UserTableActions({ onEdit, onDelete }: TableActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onEdit}>
        <Pencil className="h-4 w-4" />

        Edit
      </Button>
      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}
