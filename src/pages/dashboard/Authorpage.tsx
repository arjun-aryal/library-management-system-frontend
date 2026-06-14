import { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { BookOpen, Download, Plus, Search, Upload } from "lucide-react";
import type {
  Author,
  CreateAuthorPayload,
  UpdateAuthorPayload,
} from "../../types/author.types";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/input";
import useDebounce from "../../lib/useDebounce";
import type {
  ListQueryParams,
  PaginatedResponse,
  SortOrder,
} from "../../types/common";
import { LoadingState } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/Error";
import { DataPagination } from "../../components/common/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { EmptyState } from "../../components/common/EmptyRecord";
import { SortableTableHead } from "../../components/common/SortableTableHead";
import { TableActions } from "../../components/common/TableActions";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { AuthorFormDialog } from "../../components/author/authorDialog";
import { authorService } from "../../services/author.service";
import { isReadOnly } from "../../lib/permission";

export function AuthorsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importing, setImporting] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const { user } = useAuth();
  const readOnly = isReadOnly(user);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedResponse<Author> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState<SortOrder>("asc");
  const [pageSize, setPageSize] = useState(10);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleImport = async (file: File) => {
    setImporting(true);

    try {
      await authorService.importCsv(file);
      await fetchData();
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    const csv = await authorService.exportCsv();

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "authors.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authorService.getAll({
        page,
        limit: pageSize,
        search: debouncedSearch,
        sortBy,
        order,
      } as ListQueryParams);

      setData(response);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load Auth");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, sortBy, order]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const showTable = !loading && !error && data;
  const hasSearch = debouncedSearch.trim() !== "";

  const handleSort = useCallback(
    (column: string) => {
      setPage(1);
      if (sortBy === column) {
        setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        return;
      }
      setSortBy(column);
      setOrder("asc");
    },
    [sortBy],
  );

  const handleCreateOrUpdate = async (values: CreateAuthorPayload) => {
    try {
      if (selectedAuthor) {
        const payload: UpdateAuthorPayload = {
          name: values.name,
          bio: values.bio,
          nationality: values.nationality,
        };

        await authorService.update(selectedAuthor.id, payload);
      } else {
        const payload: CreateAuthorPayload = {
          name: values.name,
          email: values.email,
          bio: values.bio,
          nationality: values.nationality,
        };

        await authorService.create(payload);
      }

      await fetchData(); // refresh list

      setFormOpen(false);
      setSelectedAuthor(null);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async () => {
    if (!selectedAuthor) return;

    setDeleting(true);

    try {
      await authorService.remove(selectedAuthor.id);
      await fetchData();

      setDeleteOpen(false);
      setSelectedAuthor(null);
    } finally {
      setDeleting(false);
    }
  };
  return (
    <Card>
      <CardHeader className="flex flex-row gap-4  justify-between">
        <CardTitle>Author</CardTitle>

        <div className="flex items-center gap-2 ml-auto">
          {!readOnly && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleImport(file);
                  e.target.value = "";
                }}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
              >
                <Upload className="h-4 w-4" />
                {importing ? "Importing..." : "Import CSV"}
              </Button>
              <Button variant="outline" onClick={() => void handleExport()}>
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button
                onClick={() => {
                  setSelectedAuthor(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Add Author
              </Button>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or nationality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading && <LoadingState message="Loading users..." />}
        {!loading && error && (
          <ErrorState message={error} onRetry={fetchData} />
        )}

        {showTable && (
          <>
            <p className="text-sm text-muted-foreground">
              Showing {data.data.length} of {data.pagination.totalRecords}{" "}
              authors
            </p>

            {data.data.length === 0 ? (
              <EmptyState
                title={
                  hasSearch ? "No matching records found" : "No users found"
                }
                description={
                  hasSearch
                    ? "Try adjusting your search terms."
                    : "Create your first user to get started."
                }
              />
            ) : (
              <>
                <div className="px-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortableTableHead
                          label="Name"
                          column="name"
                          sortBy={sortBy}
                          sortOrder={order}
                          onSort={handleSort}
                          className="w-auto"
                        />
                        <SortableTableHead
                          label="Nationality"
                          column="nationality"
                          sortBy={sortBy}
                          sortOrder={order}
                          onSort={handleSort}
                          className="w-auto"
                        />
                        <TableHead>Bio</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {/*  need a correct  maping when api is ready */}
                      {data.data.map((author) => (
                        <TableRow key={author.id}>
                          <TableCell>{author.name}</TableCell>
                          <TableCell>{author.nationality} </TableCell>
                          <TableCell className="max-w-xs pl-0 pr-2 py-1 whitespace-normal wrap-break-words">
                            {author.bio}
                          </TableCell>

                          <TableCell className="w-25">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link
                                  to={`/dashboard/authors/${author.id}/books`}
                                >
                                  <BookOpen className="h-4 w-4" />
                                  View Books
                                </Link>
                              </Button>
                              {!readOnly && (
                                <TableActions
                                  onEdit={() => {
                                    // do edit
                                    setSelectedAuthor(author); //set author later
                                    setFormOpen(true);
                                  }}
                                  onDelete={() => {
                                    // do delete
                                    setSelectedAuthor(author); //change user to author
                                    setDeleteOpen(true);
                                  }}
                                />
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <DataPagination
                  // page={data.pagination.page}
                  page={page}
                  totalPages={data.pagination.totalPages}
                  pageSize={pageSize}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              </>
            )}
          </>
        )}
      </CardContent>
      {!readOnly && (
        <>
          <AuthorFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            author={selectedAuthor}
            onSubmit={handleCreateOrUpdate}
          />

          <ConfirmDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title="Delete author"
            description={`Are you sure you want to delete ${selectedAuthor?.name}? Their books will also be removed.`}
            onConfirm={handleDelete}
            loading={deleting}
          />
        </>
      )}
    </Card>
  );
}
