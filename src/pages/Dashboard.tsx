import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  DollarSign,
  MapPin,
  Leaf,
} from "lucide-react";
import CompostMap from "@/components/CompostMap";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const isPickupUser = user?.pickup_or_dropoff === "pickup";
  const [rebates, setRebates] = useState<Rebate[]>([]);
  const [rebateLoading, setRebateLoading] = useState(true);
  const [pickupDate, setPickupDate] = useState<Date | undefined>();
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [scheduledPickups, setScheduledPickups] = useState<ScheduledPickup[]>([]);
  const [pickupsLoading, setPickupsLoading] = useState(true);
  const [isSchedulingPickup, setIsSchedulingPickup] = useState(false);

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
                  <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                    {scheduledPickups.map((pickup) => (
                      <li key={pickup.pickup_id} className="list-disc">
                        {formatPickupDateLabel(pickup.pickup_date)}
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
            <Card>
              <CardHeader>
                <CardTitle>Community Composting Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] rounded-lg overflow-hidden">
                  <CompostMap />
                </div>
              </CardContent>
            </Card>
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
