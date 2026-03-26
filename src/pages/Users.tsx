import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit2, Plus, Loader2, ChevronUp, ChevronDown, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";
import EditUserDialog, { type UserRecord } from "@/components/EditUserDialog";
import AdminSubNav from "@/components/AdminSubNav";

type User = UserRecord;

type SortField = "first_name" | "last_name" | "email" | null;
type SortDirection = "asc" | "desc";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 10;

  // Form state for create/edit
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    pickupOrDropoff: "",
    emailNotifications: true,
    weeklyReminders: true,
  });

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: fetchError } = await supabase
        .from("user_account")
        .select("*")
        .order("user_id", { ascending: true });

      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch users";
      setError(message);
      toast.error("Failed to fetch users: " + message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users by search term
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.first_name.toLowerCase().includes(searchLower) ||
      user.last_name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;

    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";

    const comparison = String(aVal).localeCompare(String(bVal));
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Paginate users
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="inline ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="inline ml-1 h-4 w-4" />
    );
  };

  // Handle checkbox selection
  const toggleUserSelection = (userId: number) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === paginatedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(paginatedUsers.map((u) => u.user_id)));
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      address: "",
      pickupOrDropoff: "",
      emailNotifications: true,
      weeklyReminders: true,
    });
    setEditingUser(null);
  };

  // Handle create user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError("First name, last name, and email are required");
      return;
    }

    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!form.pickupOrDropoff) {
      setError("Please select pickup or dropoff");
      return;
    }

    if (form.pickupOrDropoff === "Pickup" && !form.address.trim()) {
      setError("Address is required for pickup");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: insertError } = await supabase
        .from("user_account")
        .insert({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          password: form.password,
          address: form.address || null,
          pickup_or_dropoff: form.pickupOrDropoff || null,
          email_notifications: form.emailNotifications,
          weekly_reminders: form.weeklyReminders,
        });

      if (insertError) {
        if (insertError.code === "23505") {
          throw new Error("An account with this email already exists");
        }
        throw insertError;
      }

      toast.success("User created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create user";
      setError(message);
      toast.error("Failed to create user: " + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!editingUser) return;

    setIsSubmitting(true);
    try {
      const { error: deleteError } = await supabase
        .from("user_account")
        .delete()
        .eq("user_id", editingUser.user_id);

      if (deleteError) throw deleteError;

      toast.success("User deleted successfully");
      setIsDeleteDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete user";
      toast.error("Failed to delete user: " + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    setIsSubmitting(true);
    try {
      const userIds = Array.from(selectedUsers);
      const promises = userIds.map((id) =>
        supabase.from("user_account").delete().eq("user_id", id)
      );

      const results = await Promise.all(promises);
      const hasError = results.some((r) => r.error);

      if (hasError) {
        throw new Error("Some users failed to delete");
      }

      toast.success(`${userIds.length} user(s) deleted successfully`);
      setIsBulkDeleteDialogOpen(false);
      setSelectedUsers(new Set());
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete users";
      toast.error("Failed to delete users: " + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (user: User) => {
    setEditingUser(user);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminSubNav />
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              User Management
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage all users in the system
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Fill in the form to create a new user account.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4">
                {error && (
                  <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="create-firstName">First Name *</Label>
                    <Input
                      id="create-firstName"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-lastName">Last Name *</Label>
                    <Input
                      id="create-lastName"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="create-email">Email *</Label>
                  <Input
                    id="create-email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="create-password">Password *</Label>
                  <Input
                    id="create-password"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    placeholder="Min 6 characters"
                  />
                </div>
                <div>
                  <Label htmlFor="create-pickup">Pickup or Dropoff *</Label>
                  <Select
                    value={form.pickupOrDropoff}
                    onValueChange={(value) =>
                      setForm({ ...form, pickupOrDropoff: value })
                    }
                  >
                    <SelectTrigger id="create-pickup">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pickup">Pickup</SelectItem>
                      <SelectItem value="Dropoff">Dropoff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.pickupOrDropoff === "Pickup" && (
                  <div>
                    <Label htmlFor="create-address">Address *</Label>
                    <Input
                      id="create-address"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="Required for pickup"
                    />
                  </div>
                )}
                {form.pickupOrDropoff === "Dropoff" && (
                  <div>
                    <Label htmlFor="create-address">Address</Label>
                    <Input
                      id="create-address"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label htmlFor="create-emailNotifications">
                    Email Notifications
                  </Label>
                  <Switch
                    id="create-emailNotifications"
                    checked={form.emailNotifications}
                    onCheckedChange={(checked) =>
                      setForm({ ...form, emailNotifications: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="create-weeklyReminders">Weekly Reminders</Label>
                  <Switch
                    id="create-weeklyReminders"
                    checked={form.weeklyReminders}
                    onCheckedChange={(checked) =>
                      setForm({ ...form, weeklyReminders: checked })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create User
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {error && !isSubmitting && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Total Users OKR */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <UsersIcon className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="sm:max-w-sm"
          />
          {selectedUsers.size > 0 && (
            <AlertDialog
              open={isBulkDeleteDialogOpen}
              onOpenChange={setIsBulkDeleteDialogOpen}
            >
              <Button
                variant="destructive"
                onClick={() => setIsBulkDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedUsers.size})
              </Button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Selected Users</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {selectedUsers.size} user(s)?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isSubmitting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleBulkDelete}
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      paginatedUsers.length > 0 &&
                      selectedUsers.size === paginatedUsers.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("first_name")}>
                  Name {getSortIcon("first_name")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
                  Email {getSortIcon("email")}
                </TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-center">Pickup/Dropoff</TableHead>
                <TableHead className="text-center">Notifications</TableHead>
                <TableHead className="text-center">Reminders</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.has(user.user_id)}
                        onCheckedChange={() =>
                          toggleUserSelection(user.user_id)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell className="text-sm">
                      {user.address || "—"}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {user.pickup_or_dropoff || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.email_notifications ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          On
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          Off
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.weekly_reminders ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          On
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          Off
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => openDeleteDialog(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-600">
            Showing {paginatedUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, sortedUsers.length)} of{" "}
            {sortedUsers.length} users
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm font-medium">
              Page {currentPage} of {Math.max(1, totalPages)}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Edit Dialog (shared component) */}
        <EditUserDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          user={editingUser}
          onSuccess={fetchUsers}
        />

        {/* Delete Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {editingUser?.first_name} {editingUser?.last_name}
                </span>
                ? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Users;
