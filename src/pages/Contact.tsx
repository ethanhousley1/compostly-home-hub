import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-display text-4xl font-bold text-center mb-4">Contact Us</h1>
        <p className="text-center text-muted-foreground mb-10">Have a question or want to get involved? We'd love to hear from you.</p>

        <div className="grid gap-10 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-card p-6">
            <div><Label htmlFor="name">Name</Label><Input id="name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div><Label htmlFor="message">Message</Label><Textarea id="message" required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} /></div>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>

          <div className="space-y-6">
            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground">hello@compostly.com</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-sm text-muted-foreground">(555) 123-4567</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-sm text-muted-foreground">123 Green St, New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
