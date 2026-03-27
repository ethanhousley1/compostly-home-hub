import { useEffect, useState, useCallback } from "react";
import { format, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  DollarSign,
  MapPin,
  Leaf,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  MapPinIcon,
} from "lucide-react";
import CompostMap from "@/components/CompostMap";
import type { CompostLocation } from "@/components/CompostMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

const financeData = [
  { item: "Compost Bin", cost: 0, date: "Jan 2026" },
  { item: "Worm Kit", cost: 15, date: "Jan 2026" },
  { item: "Soil Test Kit", cost: 15, date: "Feb 2026" },
];

type Rebate = {
  rebate_id: number;
  compost_weight: number | null;
  rebate_amount: number | null;
};

type ScheduledPickup = {
  pickup_id: number;
  pickup_date: string;
};

const toPickupDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatPickupDateLabel = (pickupDate: string) =>
  format(parseISO(pickupDate), "EEEE, MMMM d");

const sortScheduledPickups = (pickups: ScheduledPickup[]) =>
  [...pickups].sort((a, b) => a.pickup_date.localeCompare(b.pickup_date));

const Dashboard = () => {
  const [tab, setTab] = useState("schedule");
  const { user } = useAuth();
  const isPickupUser = user?.pickup_or_dropoff === "Pickup";
  const isAdmin = user?.email?.toLowerCase() === "admin@compostly.com";
  const [rebates, setRebates] = useState<Rebate[]>([]);
  const [rebateLoading, setRebateLoading] = useState(true);
  const [pickupDate, setPickupDate] = useState<Date | undefined>();
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [scheduledPickups, setScheduledPickups] = useState<ScheduledPickup[]>([]);
  const [pickupsLoading, setPickupsLoading] = useState(true);
  const [isSchedulingPickup, setIsSchedulingPickup] = useState(false);
  const [deletingPickupId, setDeletingPickupId] = useState<number | null>(null);

  // --- Dropoff Locations state ---
  const [locations, setLocations] = useState<CompostLocation[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [isEditLocationOpen, setIsEditLocationOpen] = useState(false);
  const [isDeleteLocationOpen, setIsDeleteLocationOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<CompostLocation | null>(null);
  const [locationForm, setLocationForm] = useState({ address: "" });
  const [isLocationSubmitting, setIsLocationSubmitting] = useState(false);

  const fetchLocations = useCallback(async () => {
    setLocationsLoading(true);
    try {
      const { data, error } = await supabase
        .from("dropoff_location")
        .select("location_id, address")
        .order("location_id", { ascending: true });

      if (error) throw error;
      setLocations(
        (data || []).filter((l: { address: string | null }) => l.address?.trim()) as CompostLocation[],
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to fetch locations",
      );
    } finally {
      setLocationsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const resetLocationForm = () => {
    setLocationForm({ address: "" });
    setEditingLocation(null);
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationForm.address.trim()) {
      toast.error("Address is required");
      return;
    }
    setIsLocationSubmitting(true);
    try {
      const { error } = await supabase
        .from("dropoff_location")
        .insert({ address: locationForm.address.trim() });
      if (error) throw error;
      toast.success("Location added successfully");
      setIsAddLocationOpen(false);
      resetLocationForm();
      fetchLocations();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add location",
      );
    } finally {
      setIsLocationSubmitting(false);
    }
  };

  const handleEditLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation || !locationForm.address.trim()) {
      toast.error("Address is required");
      return;
    }
    setIsLocationSubmitting(true);
    try {
      const { error } = await supabase
        .from("dropoff_location")
        .update({ address: locationForm.address.trim() })
        .eq("location_id", editingLocation.location_id);
      if (error) throw error;
      toast.success("Location updated successfully");
      setIsEditLocationOpen(false);
      resetLocationForm();
      fetchLocations();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update location",
      );
    } finally {
      setIsLocationSubmitting(false);
    }
  };

  const handleDeleteLocation = async () => {
    if (!editingLocation) return;
    setIsLocationSubmitting(true);
    try {
      const { error } = await supabase
        .from("dropoff_location")
        .delete()
        .eq("location_id", editingLocation.location_id);
      if (error) throw error;
      toast.success("Location deleted successfully");
      setIsDeleteLocationOpen(false);
      resetLocationForm();
      fetchLocations();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete location",
      );
    } finally {
      setIsLocationSubmitting(false);
    }
  };

  const openEditLocation = (loc: CompostLocation) => {
    setEditingLocation(loc);
    setLocationForm({ address: loc.address });
    setIsEditLocationOpen(true);
  };

  const openDeleteLocation = (loc: CompostLocation) => {
    setEditingLocation(loc);
    setIsDeleteLocationOpen(true);
  };

  const handleSchedulePickup = async () => {
    if (!pickupDate || !user) return;

    setIsSchedulingPickup(true);

    const pickupDateValue = toPickupDateValue(pickupDate);
    const { data, error } = await supabase
      .from("scheduled_pickup")
      .insert({
        account_id: user.id,
        pickup_date: pickupDateValue,
      })
      .select("pickup_id, pickup_date")
      .single();

    setIsSchedulingPickup(false);

    if (error || !data) {
      toast.error("Unable to schedule pickup", {
        description:
          error?.code === "23505"
            ? "You already have a pickup scheduled for that date."
            : "Please try again.",
      });
      return;
    }

    const scheduledPickup = data as ScheduledPickup;
    setScheduledPickups((prev) =>
      sortScheduledPickups([...prev, scheduledPickup])
    );
    setIsPickupOpen(false);
    toast.success("Pickup Scheduled!", {
      description: `Your pickup is scheduled for ${formatPickupDateLabel(pickupDateValue)}`,
    });
    setPickupDate(undefined);
  };

  const handleDeletePickup = async (pickupId: number) => {
    setDeletingPickupId(pickupId);

    const { error } = await supabase
      .from("scheduled_pickup")
      .delete()
      .eq("pickup_id", pickupId);

    setDeletingPickupId(null);

    if (error) {
      toast.error("Unable to delete pickup", {
        description: "Please try again.",
      });
      return;
    }

    setScheduledPickups((prev) =>
      prev.filter((pickup) => pickup.pickup_id !== pickupId)
    );

    toast.success("Pickup deleted");
  };

  useEffect(() => {
    let isCancelled = false;

    const loadDashboardData = async () => {
      if (!user) {
        setRebates([]);
        setScheduledPickups([]);
        setRebateLoading(false);
        setPickupsLoading(false);
        return;
      }

      setRebateLoading(true);
      setPickupsLoading(true);

      const todayValue = toPickupDateValue(new Date());
      const [rebateResult, pickupResult] = await Promise.all([
        supabase
          .from("rebate")
          .select("rebate_id, compost_weight, rebate_amount")
          .eq("account_id", user.id),
        supabase
          .from("scheduled_pickup")
          .select("pickup_id, pickup_date")
          .eq("account_id", user.id)
          .gte("pickup_date", todayValue)
          .order("pickup_date", { ascending: true }),
      ]);

      if (isCancelled) return;

      if (!rebateResult.error && rebateResult.data) {
        setRebates(rebateResult.data as Rebate[]);
      } else {
        setRebates([]);
      }

      if (!pickupResult.error && pickupResult.data) {
        setScheduledPickups(sortScheduledPickups(pickupResult.data as ScheduledPickup[]));
      } else {
        setScheduledPickups([]);
      }

      setRebateLoading(false);
      setPickupsLoading(false);
    };

    void loadDashboardData();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl font-bold mb-6">Dashboard</h1>

        <br />

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="schedule" className="gap-2">
              {isPickupUser ? (
                <>
                  <CalendarIcon className="h-4 w-4" /> Schedule
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" /> Map
                </>
              )}
            </TabsTrigger>
            <TabsTrigger value="finances" className="gap-2">
              <DollarSign className="h-4 w-4" /> Finances
            </TabsTrigger>
          </TabsList>

          {isAdmin && (
            <div className="mb-6">
              <Link to="/users">
                <Button variant="outline">Admin Dashboard</Button>
              </Link>
            </div>
          )}

        <TabsContent value="schedule">
          {isPickupUser ? (
            <>
              <div className="flex flex-wrap gap-4 items-center">
                <Link to="/pickup">
                  <Button variant="outline">Pickup Instructions</Button>
                </Link>

                <Dialog open={isPickupOpen} onOpenChange={setIsPickupOpen}>
                  <DialogTrigger asChild>
                    <Button>Schedule Pickup</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Schedule a Pickup</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center space-y-4 py-4">
                      <Calendar
                        mode="single"
                        selected={pickupDate}
                        onSelect={setPickupDate}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        className="rounded-md border shadow"
                      />
                      <Button
                        onClick={handleSchedulePickup}
                        disabled={!pickupDate || isSchedulingPickup}
                        className="w-full max-w-[280px]"
                      >
                        {isSchedulingPickup ? "Saving..." : "Confirm Pickup Date"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {pickupsLoading && (
                <div className="mt-6 p-5 rounded-xl border bg-card text-card-foreground shadow-sm">
                  <p className="text-sm text-muted-foreground">
                    Loading upcoming pickups...
                  </p>
                </div>
              )}

              {!pickupsLoading && scheduledPickups.length > 0 && (
                <div className="mt-6 p-5 rounded-xl border bg-card text-card-foreground shadow-sm">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" /> Upcoming Pickups
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {scheduledPickups.map((pickup) => (
                      <li
                        key={pickup.pickup_id}
                        className="flex items-center justify-between px-2 py-2"
                      >
                        <span>{formatPickupDateLabel(pickup.pickup_date)}</span>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePickup(pickup.pickup_id)}
                          disabled={deletingPickupId === pickup.pickup_id}
                        >
                          {deletingPickupId === pickup.pickup_id ? "Deleting..." : "Delete"}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!pickupsLoading && scheduledPickups.length === 0 && (
                <div className="mt-6 p-5 rounded-xl border bg-card text-card-foreground shadow-sm">
                  <p className="text-sm text-muted-foreground">
                    No pickups currently scheduled.
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Community Composting Locations</CardTitle>
                    {isAdmin && (
                      <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={resetLocationForm}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Location
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Add Composting Location</DialogTitle>
                            <DialogDescription>
                              Enter the full address for the new composting location.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleAddLocation} className="space-y-4">
                            <div>
                              <Label htmlFor="add-loc-address">Address *</Label>
                              <Input
                                id="add-loc-address"
                                value={locationForm.address}
                                onChange={(e) =>
                                  setLocationForm({ address: e.target.value })
                                }
                                placeholder="123 Main St, City, State 12345"
                                required
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddLocationOpen(false)}
                                disabled={isLocationSubmitting}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" disabled={isLocationSubmitting}>
                                {isLocationSubmitting && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Add Location
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white">
                    {locationsLoading && (
                      <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/80">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="text-sm font-medium text-gray-600">
                            Loading locations…
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="h-[500px]">
                      <CompostMap locations={locations} />
                    </div>
                  </div>

                  {!locationsLoading && locations.length === 0 && (
                    <p className="mt-4 text-center text-sm text-gray-500">
                      No composting locations available yet.
                    </p>
                  )}

                  {!locationsLoading && locations.length > 0 && (
                    <p className="mt-4 text-center text-sm text-gray-500">
                      Showing {locations.length} composting location{locations.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Locations List */}
              {!locationsLoading && locations.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPinIcon className="h-5 w-5 text-primary" />
                      All Locations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Address</TableHead>
                            {isAdmin && (
                              <TableHead className="text-right">Actions</TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {locations.map((loc) => (
                            <TableRow key={loc.location_id}>
                              <TableCell className="font-medium">
                                {loc.address}
                              </TableCell>
                              {isAdmin && (
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openEditLocation(loc)}
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 hover:text-red-800"
                                      onClick={() => openDeleteLocation(loc)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Edit Location Dialog */}
              <Dialog open={isEditLocationOpen} onOpenChange={setIsEditLocationOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Composting Location</DialogTitle>
                    <DialogDescription>
                      Update the address for this composting location.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEditLocation} className="space-y-4">
                    <div>
                      <Label htmlFor="edit-loc-address">Address *</Label>
                      <Input
                        id="edit-loc-address"
                        value={locationForm.address}
                        onChange={(e) =>
                          setLocationForm({ address: e.target.value })
                        }
                        placeholder="123 Main St, City, State 12345"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditLocationOpen(false)}
                        disabled={isLocationSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLocationSubmitting}>
                        {isLocationSubmitting && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Delete Location Dialog */}
              <AlertDialog
                open={isDeleteLocationOpen}
                onOpenChange={setIsDeleteLocationOpen}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Location</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the location at{" "}
                      <span className="font-semibold">
                        {editingLocation?.address}
                      </span>
                      ? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLocationSubmitting}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteLocation}
                      disabled={isLocationSubmitting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isLocationSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </TabsContent>

          <TabsContent value="finances">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" /> Compost Rebates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rebateLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Loading rebates…
                  </p>
                ) : rebates.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No rebates yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-muted-foreground">
                          <th className="pb-2">Compost Weight (lbs)</th>
                          <th className="pb-2">Rebate Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rebates.map((r) => (
                          <tr
                            key={r.rebate_id}
                            className="border-b last:border-0"
                          >
                            <td className="py-3">
                              {r.compost_weight?.toFixed(1) ?? "—"}
                            </td>
                            <td className="py-3">
                              ${r.rebate_amount?.toFixed(2) ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="font-semibold">
                          <td className="pt-3">
                            {rebates
                              .reduce(
                                (sum, r) => sum + (r.compost_weight ?? 0),
                                0
                              )
                              .toFixed(1)}{" "}
                            lbs
                          </td>
                          <td className="pt-3">
                            $
                            {rebates
                              .reduce(
                                (sum, r) => sum + (r.rebate_amount ?? 0),
                                0
                              )
                              .toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Composting Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-2">Item</th>
                        <th className="pb-2">Cost</th>
                        <th className="pb-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financeData.map((f) => (
                        <tr key={f.item} className="border-b last:border-0">
                          <td className="py-3">{f.item}</td>
                          <td className="py-3">${f.cost.toFixed(2)}</td>
                          <td className="py-3 text-muted-foreground">
                            {f.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-semibold">
                        <td className="pt-3">Total</td>
                        <td className="pt-3">
                          $
                          {financeData
                            .reduce((a, b) => a + b.cost, 0)
                            .toFixed(2)}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
