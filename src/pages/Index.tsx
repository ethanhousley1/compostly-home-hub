import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Leaf, Recycle, Sprout } from "lucide-react";
import heroImage from "@/assets/hero-composting.jpg";
import whatToCompostImage from "@/assets/what-to-compost.jpg";
import { toast } from "sonner";

const Index = () => {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success("Thanks for subscribing! We'll be in touch.");
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Rich compost soil with sprouting plants" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
        </div>
        <div className="container relative mx-auto px-4 py-28 md:py-40">
          <div className="max-w-xl animate-fade-in">
            <h1 className="font-display text-4xl font-bold leading-tight text-primary-foreground md:text-6xl">
              Welcome to<br />Compostly
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Transform your kitchen scraps into garden gold. Start composting at home today — it's easier than you think.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-10">
        <div className="container mx-auto grid gap-6 px-4 text-center md:grid-cols-3">
          {[
            { stat: "43%", label: "of food waste in the US comes from households" },
            { stat: "30%", label: "of landfill waste could be composted instead" },
            { stat: "1 ton", label: "of compost can save 1,000 gallons of water" },
          ].map((item, i) => (
            <div key={i}>
              <p className="font-display text-3xl font-bold text-primary-foreground">{item.stat}</p>
              <p className="mt-1 text-sm text-primary-foreground/70">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Here's How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Leaf, title: "1. Collect Scraps", desc: "Gather your fruit peels, veggie scraps, coffee grounds, and more in a countertop bin." },
              { icon: Recycle, title: "2. Compost at Home", desc: "Follow our simple guide to turn waste into nutrient-rich compost in your backyard." },
              { icon: Sprout, title: "3. Feed Your Garden", desc: "Use your compost to enrich soil, grow healthier plants, and reduce landfill waste." },
            ].map((step, i) => (
              <div key={i} className="rounded-xl border bg-card p-6 text-center transition-shadow hover:shadow-lg">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Compost CTA */}
      <section className="bg-muted py-20">
        <div className="container mx-auto grid gap-10 px-4 items-center md:grid-cols-2">
          <img src={whatToCompostImage} alt="Food scraps for composting" className="rounded-xl shadow-lg" />
          <div>
            <h2 className="font-display text-3xl font-bold mb-4">What Can You Compost?</h2>
            <p className="text-muted-foreground mb-6">
              From banana peels to coffee filters — learn exactly what belongs in your compost bin and what to avoid.
            </p>
            <Link to="/what-to-compost">
              <Button className="gap-2">
                Learn More <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="container mx-auto max-w-md px-4 text-center">
          <h2 className="font-display text-3xl font-bold mb-3">Stay in the Loop</h2>
          <p className="text-muted-foreground mb-6">
            Get composting tips, seasonal guides, and community updates.
          </p>
          <form onSubmit={handleEmailSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Index;
