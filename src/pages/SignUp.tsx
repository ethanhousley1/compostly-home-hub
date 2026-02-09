import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

const SignUp = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    signup(form);
    navigate("/signup-complete");
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
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">Create Account</Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
