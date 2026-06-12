import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { authorValidation } from "../../lib/validation";

import { Button } from "../ui/button";
import type { Author, BaseAuthor } from "../../types/author.types";
import { Textarea } from "../ui/textarea";
import { getNames } from "country-list";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { cn } from "../../lib/utils";

interface AuthorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  author?: Author | null;
  onSubmit: (values: BaseAuthor) => Promise<void>;
}

export function AuthorFormDialog({
  open,
  onOpenChange,
  author,
  onSubmit,
}: AuthorFormDialogProps) {
  const isEdit = Boolean(author);
  const countries = getNames().sort();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BaseAuthor>({
    defaultValues: {
      name: "",
      nationality: "",
      bio: "",
    },
  });

  const [countryOpen, setCountryOpen] = useState(false);

  useEffect(() => {
    if (open) {
      reset({
        name: author?.name ?? "",
        nationality: author?.nationality ?? "",
        bio: author?.bio ?? "",
      });
    }
  }, [open, author, reset]);

  const submitHandler = async (values: BaseAuthor) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    register("nationality", authorValidation.nationality);
  }, [register]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Create User"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name", authorValidation.name)} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            {/*<Input
              id="nationality"
              {...register("nationality", authorValidation.nationality)}
            /> */}

            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between font-normal"
                >
                  {watch("nationality") || "Select nationality"}

                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-(--radix-popover-trigger-width) p-0"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Search country..." />

                  <CommandEmpty>No country found.</CommandEmpty>

                  <CommandGroup className="max-h-64 overflow-y-auto">
                    {countries.map((country) => (
                      <CommandItem
                        key={country}
                        value={country}
                        onSelect={() => {
                          setValue("nationality", country, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });

                          setCountryOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            watch("nationality") === country
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {country}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.nationality && (
              <p className="text-sm text-destructive">
                {errors.nationality.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              id="bio"
              placeholder="Enter author biography..."
              {...register("bio", authorValidation.bio)}
            />

            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
