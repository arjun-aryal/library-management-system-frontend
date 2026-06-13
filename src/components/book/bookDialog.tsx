import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type {
  BaseBook,
  Book,
  CreateBookPayload,
  UpdateBookPayload,
} from "../../types/book.type";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { bookValidation } from "../../lib/validation";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

const currentYear = new Date().getFullYear();

interface BookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book | null;
  authorId: number;
  onSubmit: (values: CreateBookPayload | UpdateBookPayload) => Promise<void>;
}

export function BookFormDialog({
  open,
  onOpenChange,
  book,
  authorId,
  onSubmit,
}: BookFormDialogProps) {
  const isEdit = Boolean(book);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BaseBook>({
    defaultValues: {
      title: "",
      isbn: "",
      published_year: currentYear,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: book?.title ?? "",
        isbn: book?.isbn ?? "",
        published_year: book?.published_year ?? currentYear,
      });
    }
  }, [open, book, reset]);

  const submitHandler = async (values: BaseBook) => {
    if (isEdit && book) {
      const payload: UpdateBookPayload = {
        title: values.title,
        isbn: values.isbn,
        published_year: Number(values.published_year),
      };

      await onSubmit(payload);
    } else {
      const payload: CreateBookPayload = {
        title: values.title,
        isbn: values.isbn,
        published_year: Number(values.published_year),
        authorId,
      };

      await onSubmit(payload);
    }

    onOpenChange(false);
  };

  const years = Array.from(
    { length: currentYear - 1800 + 1 },
    (_, i) => currentYear - i,
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !isSubmitting && onOpenChange(v)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Book" : "Create Book"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter book title"
              {...register("title", bookValidation.title)}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* ISBN */}
          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              placeholder="9781234567890"
              {...register("isbn", bookValidation.isbn)}
            />
            {errors.isbn && (
              <p className="text-sm text-destructive">{errors.isbn.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Published Year</Label>

            <Controller
              name="published_year"
              control={control}
              rules={bookValidation.published_year}
              render={({ field }) => (
                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>

                  <SelectContent className="max-h-72">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.published_year && (
              <p className="text-sm text-destructive">
                {errors.published_year.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Update Book"
                  : "Create Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
