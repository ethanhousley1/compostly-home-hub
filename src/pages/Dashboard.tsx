import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, DollarSign, MapPin } from "lucide-react";
import CompostMap from "@/components/CompostMap";
import { Button } from "@/components/ui/button";

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

const Dashboard = () => {
  const [tab, setTab] = useState("schedule");

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl font-bold mb-6">Dashboard</h1>
        <Link to="/pickup">
          <Button>Pickup Instructions</Button>
        </Link>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="schedule" className="gap-2">
              <Calendar className="h-4 w-4" /> Schedule
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
