import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, DollarSign, MapPin, Leaf } from "lucide-react";
import CompostMap from "@/components/CompostMap";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

const scheduleData = [
  { day: "Monday", task: "Add greens (fruit/veggie scraps)", done: true },
  { day: "Tuesday", task: "Turn compost pile", done: false },
  { day: "Wednesday", task: "Add browns (dry leaves, cardboard)", done: false },
  { day: "Thursday", task: "Check moisture level", done: true },
  { day: "Friday", task: "Add kitchen scraps", done: false },
  { day: "Saturday", task: "Turn & aerate compost", done: false },
  { day: "Sunday", task: "Rest day — let it decompose!", done: false },
];

const financeData = [
  { item: "Compost Bin", cost: 45, date: "Jan 2026" },
  { item: "Worm Kit", cost: 30, date: "Jan 2026" },
  { item: "Soil Test Kit", cost: 15, date: "Feb 2026" },
  { item: "Compost Thermometer", cost: 12, date: "Feb 2026" },
];

type Rebate = {
  rebate_id: number;
  compost_weight: number | null;
  rebate_amount: number | null;
};

const Dashboard = () => {
  const [tab, setTab] = useState("schedule");
  const { user } = useAuth();
  const [rebates, setRebates] = useState<Rebate[]>([]);
  const [rebateLoading, setRebateLoading] = useState(true);
  const [pickupDate, setPickupDate] = useState<Date | undefined>();
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [upcomingPickups, setUpcomingPickups] = useState<Date[]>([]);

  const handleSchedulePickup = () => {
    if (!pickupDate) return;
    setUpcomingPickups(prev => [...prev, pickupDate].sort((a, b) => a.getTime() - b.getTime()));
    setIsPickupOpen(false);
    toast.success("Pickup Scheduled!", {
      description: `Your pickup is scheduled for ${pickupDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`
    });
    setPickupDate(undefined);
  };

  useEffect(() => {
    if (!user) return;
    setRebateLoading(true);
    supabase
      .from("rebate")
      .select("rebate_id, compost_weight, rebate_amount")
      .eq("account_id", user.id)
      .then(({ data, error }) => {
        if (!error && data) setRebates(data as Rebate[]);
        setRebateLoading(false);
      });
  }, [user]);

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl font-bold mb-6">Dashboard</h1>

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
                  disabled={!pickupDate}
                  className="w-full max-w-[280px]"
                >
                  Confirm Pickup Date
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {upcomingPickups.length > 0 && (
          <div className="mt-6 p-5 rounded-xl border bg-card text-card-foreground shadow-sm animate-fade-in">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" /> Upcoming Pickups
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground ml-7">
              {upcomingPickups.map((d, i) => (
                <li key={i} className="list-disc">
                  {d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </li>
              ))}
            </ul>
          </div>
        )}

        <br />
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="schedule" className="gap-2">
              <CalendarIcon className="h-4 w-4" /> Schedule
            </TabsTrigger>
            <TabsTrigger value="finances" className="gap-2">
              <DollarSign className="h-4 w-4" /> Finances
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <MapPin className="h-4 w-4" /> Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Composting Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scheduleData.map((s) => (
                    <div
                      key={s.day}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={s.done}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="font-medium min-w-[90px]">{s.day}</span>
                      <span className="text-sm text-muted-foreground">
                        {s.task}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                  <p className="text-sm text-muted-foreground">Loading rebates…</p>
                ) : rebates.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No rebates yet.</p>
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
                          <tr key={r.rebate_id} className="border-b last:border-0">
                            <td className="py-3">{r.compost_weight?.toFixed(1) ?? "—"}</td>
                            <td className="py-3">${r.rebate_amount?.toFixed(2) ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="font-semibold">
                          <td className="pt-3">
                            {rebates.reduce((sum, r) => sum + (r.compost_weight ?? 0), 0).toFixed(1)} lbs
                          </td>
                          <td className="pt-3">
                            ${rebates.reduce((sum, r) => sum + (r.rebate_amount ?? 0), 0).toFixed(2)}
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

          <TabsContent value="map">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
