import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { canManageBooks, isReadOnly } from "../../lib/permission";
import type { Book, CreateBookPayload } from "../../types/book.type";
import { Input } from "../../components/ui/input";
import { LoadingState } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/Error";
import { authorService } from "../../services/author.service";
import useDebounce from "../../lib/useDebounce";
import type { PaginatedResponse, SortOrder } from "../../types/common";
import { DataPagination } from "../../components/common/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { SortableTableHead } from "../../components/common/SortableTableHead";
import { EmptyState } from "../../components/common/EmptyRecord";
import { TableActions } from "../../components/common/TableActions";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { BookFormDialog } from "../../components/book/bookDialog";
import { bookService } from "../../services/book.service";
import type { Author } from "../../types/author.types";

export function BooksPage() {
  const { user } = useAuth();
  const { authorId } = useParams<{ authorId: string }>();

  const [author, setAuthor] = useState<Author | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState<SortOrder>("asc");

  const [data, setData] = useState<PaginatedResponse<Book> | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canManage = canManageBooks(user);
  const readOnly = isReadOnly(user);

  const fetchData = useCallback(async () => {
    if (!Number(authorId)) return;

    try {
      setLoading(true);
      setError(null);

      const [authorRes, booksRes] = await Promise.all([
        authorService.getById(Number(authorId)),
        bookService.getAll(Number(authorId), {
          page,
          limit: pageSize,
          search: debouncedSearch,
          sortBy,
          order,
        }),
      ]);

      setAuthor(authorRes.data);
      setData(booksRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [Number(authorId), page, pageSize, debouncedSearch, sortBy, order]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleSort = (column: string) => {
    setPage(1);

    if (sortBy === column) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  const handleCreateOrUpdate = async (values: CreateBookPayload) => {
    try {
      if (selectedBook) {
        await bookService.update(Number(authorId), selectedBook.id, values);
      } else {
        await bookService.create(Number(authorId), values);
      }

      await fetchData();

      setFormOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async () => {
    if (!selectedBook) return;

    setDeleting(true);

    try {
      await authorService.remove(selectedBook.id);
      await fetchData();

      setDeleteOpen(false);
      setSelectedBook(null);
    } finally {
      setDeleting(false);
    }
  };

  const showTable = !loading && !error && data;

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div className="space-y-2">
          {user?.role !== "author" && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/authors">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          )}

          <CardTitle>
            Books from{" "}
            {author?.name
              ? author.name.charAt(0).toUpperCase() + author.name.slice(1)
              : ""}
          </CardTitle>
        </div>

        <div>
          {canManage &&
            !readOnly && ( //negate readOnly
              <Button
                onClick={() => {
                  setSelectedBook(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Add Book
              </Button>
            )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />

          <Input
            className="pl-10"
            placeholder="Search books title or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <LoadingState message="Loading books..." />}

        {!loading && error && (
          <ErrorState message={error} onRetry={fetchData} />
        )}

        {showTable && (
          <>
            <p className="text-sm text-muted-foreground">
              Showing {data?.data?.length ?? 0} of{" "}
              {data?.pagination?.totalRecords ?? 0} books
            </p>

            {!data?.data?.length ? (
              <EmptyState
                title="No books found"
                description="Try adjusting your search or add a new book."
              />
            ) : (
              <>
                <Table className="w-full table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">
                        <SortableTableHead
                          label="Title"
                          column="title"
                          sortBy={sortBy}
                          sortOrder={order}
                          onSort={handleSort}
                        />
                      </TableHead>

                      <TableHead className="w-[20%]">ISBN</TableHead>

                      <TableHead className="w-[20%]">
                        <SortableTableHead
                          label="Year"
                          column="published_year"
                          sortBy={sortBy}
                          sortOrder={order}
                          onSort={handleSort}
                        />
                      </TableHead>

                      <TableHead className="w-[20%]  ">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {data?.data?.map((book) => (
                      <TableRow key={book.id} className="align-middle">
                        <TableCell className="truncate w-[40%]">
                          {book.title}
                        </TableCell>

                        <TableCell className="w-[20%]">{book.isbn}</TableCell>

                        <TableCell className="w-[20%]">
                          {book.published_year}
                        </TableCell>

                        <TableCell className="w-[20%] text-right">
                          {!readOnly && (
                            <TableActions
                              onEdit={() => {
                                setSelectedBook(book);
                                setFormOpen(true);
                              }}
                              onDelete={() => {
                                setSelectedBook(book);
                                setDeleteOpen(true);
                              }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <DataPagination
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

      {canManage && !readOnly && (
        <>
          <BookFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            book={selectedBook}
            authorId={Number(authorId)}
            onSubmit={handleCreateOrUpdate}
          />

          <ConfirmDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title="Delete book"
            description={`Delete "${selectedBook?.title}"?`}
            onConfirm={handleDelete}
            loading={deleting}
          />
        </>
      )}
    </Card>
  );
}
