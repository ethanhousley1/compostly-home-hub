import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import AddressFields, { type AddressValue, validateAddress } from "@/components/AddressFields";

export interface UserRecord {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  street_address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  pickup_or_dropoff: string | null;
  email_notifications: boolean;
  weekly_reminders: boolean;
}

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserRecord | null;
  onSuccess: () => void;
}

const normalizeServiceType = (value: string | null | undefined) => {
  if (!value) return "";
  const normalized = value.trim().toLowerCase();
  if (normalized === "pickup") return "Pickup";
  if (normalized === "dropoff") return "Dropoff";
  return "";
};

const EditUserDialog = ({
  open,
  onOpenChange,
  user,
  onSuccess,
}: EditUserDialogProps) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    pickupOrDropoff: "",
    emailNotifications: true,
    weeklyReminders: true,
  });
  const [address, setAddress] = useState<AddressValue>({ street_address: "", city: "", state: "", zip_code: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || !open) return;

    setForm({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      pickupOrDropoff: normalizeServiceType(user.pickup_or_dropoff),
      emailNotifications: user.email_notifications,
      weeklyReminders: user.weekly_reminders,
    });
    setAddress({
      street_address: user.street_address || "",
      city: user.city || "",
      state: user.state || "",
      zip_code: user.zip_code || "",
    });
    setError("");
  }, [open, user?.user_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError("");

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError("First name, last name, and email are required");
      return;
    }

    if (!form.pickupOrDropoff) {
      setError("Please select pickup or dropoff");
      return;
    }

    if (form.pickupOrDropoff === "Pickup") {
      const addrError = validateAddress(address, true);
      if (addrError) {
        setError(addrError);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const hasAddress = address.street_address.trim() || address.city.trim() || address.state || address.zip_code.trim();
      const { error: updateError } = await supabase
        .from("user_account")
        .update({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          street_address: hasAddress ? address.street_address.trim() : null,
          city: hasAddress ? address.city.trim() : null,
          state: hasAddress ? address.state : null,
          zip_code: hasAddress ? address.zip_code.trim() : null,
          pickup_or_dropoff: form.pickupOrDropoff || null,
          email_notifications: form.emailNotifications,
          weekly_reminders: form.weeklyReminders,
        })
        .eq("user_id", user.user_id);

      if (updateError) {
        if (updateError.code === "23505") {
          throw new Error("An account with this email already exists");
        }
        throw updateError;
      }

      toast.success("User updated successfully");
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update user";
      setError(message);
      toast.error("Failed to update user: " + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information. Pickup/dropoff selection is required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-firstName">First Name *</Label>
              <Input
                id="edit-firstName"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-lastName">Last Name *</Label>
              <Input
                id="edit-lastName"
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-email">Email *</Label>
            <Input
              id="edit-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-pickup">Pickup or Dropoff *</Label>
            <Select
              value={form.pickupOrDropoff}
              onValueChange={(value) =>
                setForm({ ...form, pickupOrDropoff: value })
              }
            >
              <SelectTrigger id="edit-pickup">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pickup">Pickup</SelectItem>
                <SelectItem value="Dropoff">Dropoff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(form.pickupOrDropoff === "Pickup" || form.pickupOrDropoff === "Dropoff") && (
            <div>
              <Label className="mb-2 block">
                Address {form.pickupOrDropoff === "Pickup" && <span className="text-destructive">*</span>}
              </Label>
              <AddressFields
                value={address}
                onChange={setAddress}
                required={form.pickupOrDropoff === "Pickup"}
                idPrefix="edit-addr"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label htmlFor="edit-emailNotifications">Email Notifications</Label>
            <Switch
              id="edit-emailNotifications"
              checked={form.emailNotifications}
              onCheckedChange={(checked) =>
                setForm({ ...form, emailNotifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="edit-weeklyReminders">Weekly Reminders</Label>
            <Switch
              id="edit-weeklyReminders"
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
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
