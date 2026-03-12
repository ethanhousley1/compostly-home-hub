import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";

const SignUp = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "", address: "", pickupOrDropoff: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuthenticatedUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (!form.pickupOrDropoff) { setError("Please select pickup or dropoff."); return; }
    if (form.pickupOrDropoff === "Pickup" && !form.address.trim()) { setError("Address is required for pickup."); return; }

    setIsSubmitting(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const response = await fetch(`${apiBaseUrl}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          address: form.address,
          pickupOrDropoff: form.pickupOrDropoff,
        }),
      });

      if (!response.ok) {
        let message = "Unable to create account right now.";
        try {
          const data = await response.json();
          if (data?.message && typeof data.message === "string") {
            message = data.message;
          }
        } catch {
          // Ignore invalid JSON responses and use fallback message.
        }
        throw new Error(message);
      }

      const data = await response.json();
      const user = data?.user;

      if (user) {
        setAuthenticatedUser({
          id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          address: user.address,
          pickup_or_dropoff: user.pickup_or_dropoff,
        });
        navigate("/signup-complete", { state: { user } });
      } else {
        throw new Error("No user returned from server.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-center mb-6">Sign Up for Compostly</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} /></div>
            <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} /></div>
          </div>
          <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div><Label htmlFor="password">Password</Label><Input id="password" type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
          <div><Label htmlFor="confirm">Confirm Password</Label><Input id="confirm" type="password" required value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} /></div>
          <div>
            <Label htmlFor="pickupOrDropoff">Service Type</Label>
            <Select value={form.pickupOrDropoff} onValueChange={value => setForm({...form, pickupOrDropoff: value, address: value === "Pickup" ? form.address : ""})}>
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
            <div><Label htmlFor="address">Pickup Address</Label><Input id="address" required value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="123 Main St, City, State" /></div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
