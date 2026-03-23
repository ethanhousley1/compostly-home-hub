import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { User, Pencil } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { isLoggedIn, user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  // Form state — initialized from current user
  const [form, setForm] = useState({
    firstName: user?.first_name ?? "",
    lastName: user?.last_name ?? "",
    email: user?.email ?? "",
    pickupOrDropoff: user?.pickup_or_dropoff ?? "",
    address: user?.address ?? "",
    emailNotifications: user?.email_notifications ?? true,
    weeklyReminders: user?.weekly_reminders ?? true,
    newPassword: "",
    confirmPassword: "",
  });

  if (!isLoggedIn || !user) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-3">Please sign in</h1>
          <p className="text-muted-foreground mb-4">You need to be signed in to view your profile.</p>
          <Link to="/signin"><Button>Sign In</Button></Link>
        </div>
      </div>
    );
  }

  const handleCancel = () => {
    setForm({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      pickupOrDropoff: user.pickup_or_dropoff ?? "",
      address: user.address ?? "",
      emailNotifications: user.email_notifications,
      weeklyReminders: user.weekly_reminders,
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    setError("");

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First and last name are required.");
      return;
    }
    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!form.pickupOrDropoff) {
      setError("Please select pickup or dropoff.");
      return;
    }
    if (form.pickupOrDropoff === "Pickup" && !form.address.trim()) {
      setError("Address is required for pickup.");
      return;
    }
    if (form.newPassword && form.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!user.id) {
      setError("Session is invalid. Please sign out and sign back in.");
      return;
    }

    setIsSaving(true);
    try {
      const updates: Record<string, unknown> = {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim(),
        pickup_or_dropoff: form.pickupOrDropoff,
        address: form.pickupOrDropoff === "Pickup" ? form.address.trim() : null,
        email_notifications: form.emailNotifications,
        weekly_reminders: form.weeklyReminders,
      };

      if (form.newPassword) {
        updates.password = form.newPassword;
      }

      const { data, error: updateError } = await supabase
        .from("user_account")
        .update(updates)
        .eq("user_id", user.id)
        .select("user_id, first_name, last_name, email, address, pickup_or_dropoff, email_notifications, weekly_reminders");

      if (updateError) {
        if (updateError.code === "23505") {
          throw new Error("An account with this email already exists.");
        }
        throw new Error(updateError.message);
      }

      if (!data || data.length === 0) {
        throw new Error("Update failed — your account was not found. Please sign out and sign back in.");
      }

      const row = data[0];
      updateUser({
        id: row.user_id,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        address: row.address,
        pickup_or_dropoff: row.pickup_or_dropoff,
        email_notifications: row.email_notifications ?? true,
        weekly_reminders: row.weekly_reminders ?? true,
      });

      setForm((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));
      setIsEditing(false);
      toast.success("Profile updated successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user.id) {
      toast.error("Session is invalid. Please sign out and sign back in.");
      return;
    }
    setIsDeleting(true);
    try {
      const { error: deleteError } = await supabase
        .from("user_account")
        .delete()
        .eq("user_id", user.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      logout();
      navigate("/");
      toast.success("Your account has been deleted.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete account.";
      toast.error(message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto max-w-lg px-4">
        <div className="rounded-xl border bg-card p-8 animate-fade-in">
          {/* Avatar & Header */}
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <User className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-center mb-6">My Profile</h1>

          {/* Profile Fields */}
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="pickupOrDropoff">Service Type</Label>
                  <Select
                    value={form.pickupOrDropoff}
                    onValueChange={(value) =>
                      setForm({ ...form, pickupOrDropoff: value, address: value === "Pickup" ? form.address : "" })
                    }
                  >
                    <SelectTrigger id="pickupOrDropoff">
                      <SelectValue placeholder="Select pickup or dropoff" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pickup">Pickup</SelectItem>
                      <SelectItem value="Dropoff">Dropoff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.pickupOrDropoff === "Pickup" && (
                  <div>
                    <Label htmlFor="address">Pickup Address</Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="123 Main St, City, State"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="newPassword">New Password (leave blank to keep current)</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={form.newPassword}
                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                    placeholder="••••••"
                  />
                </div>
                {form.newPassword && (
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="••••••"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div><Label>Name</Label><Input value={user.first_name + " " + user.last_name} readOnly /></div>
                <div><Label>Email</Label><Input value={user.email} readOnly /></div>
                <div><Label>Service Type</Label><Input value={user.pickup_or_dropoff ?? ""} readOnly /></div>
                {user.pickup_or_dropoff === "Pickup" && (
                  <div><Label>Address</Label><Input value={user.address ?? ""} readOnly /></div>
                )}
              </>
            )}
          </div>

          {/* Settings */}
          <h2 className="font-display text-lg font-semibold mt-8 mb-4">Profile Settings</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="emailNotifications" className="text-sm cursor-pointer">Email Notifications</Label>
              <Switch
                id="emailNotifications"
                checked={form.emailNotifications}
                onCheckedChange={(checked) => setForm({ ...form, emailNotifications: checked })}
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="weeklyReminders" className="text-sm cursor-pointer">Weekly Reminders</Label>
              <Switch
                id="weeklyReminders"
                checked={form.weeklyReminders}
                onCheckedChange={(checked) => setForm({ ...form, weeklyReminders: checked })}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-sm text-destructive mt-4">{error}</p>}

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            {isEditing ? (
              <div className="flex gap-3">
                <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="w-full gap-2">
                <Pencil className="h-4 w-4" /> Edit Profile
              </Button>
            )}
          </div>

          {/* Delete Account */}
          <div className="mt-8 border-t pt-6">
            <h2 className="font-display text-lg font-semibold text-destructive mb-2">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account and remove all of your data.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete My Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
