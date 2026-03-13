import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

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
      const { data, error: insertError } = await supabase
        .from("user_account")
        .insert({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          password: form.password,
          address: form.address || null,
          pickup_or_dropoff: form.pickupOrDropoff || null,
        })
        .select("user_id, first_name, last_name, email, address, pickup_or_dropoff")
        .single();

      if (insertError) {
        if (insertError.code === "23505") {
          throw new Error("An account with this email already exists.");
        }
        throw new Error(insertError.message);
      }

      if (!data) {
        throw new Error("No user returned from database.");
      }

      const user = {
        id: data.user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        address: data.address,
        pickup_or_dropoff: data.pickup_or_dropoff,
      };

      setAuthenticatedUser(user);
      navigate("/signup-complete", { state: { user } });
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
