import { Plus, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { LoadingState } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/Error";
import type {
  ListQueryParams,
  PaginatedResponse,
  SortOrder,
} from "../../types/common";
import type {
  BaseUser,
  User,
} from "../../types/user.type";
import useDebounce from "../../lib/useDebounce";
import { userService } from "../../services/user.service";
import { EmptyState } from "../../components/common/EmptyRecord";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { SortableTableHead } from "../../components/common/SortableTableHead";
import { Badge } from "../../components/ui/badge";
import { formatRole } from "../../lib/roleutils";
import { UserTableActions } from "../../components/user/userTableActions";
import { DataPagination } from "../../components/common/Pagination";
import { UserFormDialog } from "../../components/user/userDialog";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PaginatedResponse<User> | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState<SortOrder>("asc");
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.getAll({
        page,
        limit: pageSize,
        search: debouncedSearch,
        sortBy,
        order,
      } as ListQueryParams);

      setData(response);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load users");
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

  const handleCreateOrUpdate = async (values: BaseUser) => {
    const payload: BaseUser = {
      name: values.name,
      email: values.email,
      role: values.role,
    };

    try {
      if (selectedUser) {
        await userService.update(selectedUser.id, payload);
      } else {
        await userService.create(payload);
      }

      await fetchData();
    } catch (error) {
      console.error("Failed to save user:", error);
      // toast needed 
    }
  };
  const handleDelete = async () => {
    if (!selectedUser) return;

    setDeleting(true);

    try {
      await userService.remove(selectedUser.id);
      await fetchData();

      setDeleteOpen(false);
      setSelectedUser(null);
    } finally {
      setDeleting(false);
    }
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users</CardTitle>
        <Button
          onClick={() => {
            setSelectedUser(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </CardHeader>

      <CardContent>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email"
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
              Showing {data.data.length} of {data.pagination.totalRecords} users
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableTableHead
                        label="Name"
                        column="name"
                        sortBy={sortBy}
                        sortOrder={order}
                        onSort={handleSort}
                      />
                      <SortableTableHead
                        label="Email"
                        column="email"
                        sortBy={sortBy}
                        sortOrder={order}
                        onSort={handleSort}
                      />
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {data.data.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {formatRole(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <UserTableActions
                            onEdit={() => {
                              // do edit
                              setSelectedUser(user);
                              setFormOpen(true);
                            }}
                            onDelete={() => {
                              // do delete
                              setSelectedUser(user);
                              setDeleteOpen(true);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

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

      {/* dialogue  for edit and add*/}
      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={selectedUser}
        onSubmit={handleCreateOrUpdate}
      />

      {/* confirm dialogue */}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete user"
        description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Card>
  );
}
