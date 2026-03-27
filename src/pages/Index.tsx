import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Leaf, Recycle, Sprout } from "lucide-react";
import heroImage from "@/assets/hero-composting.jpg";
import whatToCompostImage from "@/assets/what-to-compost.jpg";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const [email, setEmail] = useState("");
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
      toast.info("You are already subscribed");
    } else {
      navigate("/signup");
    }
  };

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
          <img
            src={heroImage}
            alt="Rich compost soil with sprouting plants"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
        </div>
        <div className="container relative mx-auto px-4 py-28 md:py-40">
          <div className="max-w-xl animate-fade-in">
            <h1 className="font-display text-4xl font-bold leading-tight text-primary-foreground md:text-6xl">
              Welcome to
              <br />
              Compostly
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Transform your kitchen scraps into garden gold. Start composting
              at home today — it's easier than you think.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-10">
        <div className="container mx-auto grid gap-6 px-4 text-center md:grid-cols-3">
          {[
            {
              stat: "43%",
              label: "of food waste in the US comes from households",
            },
            {
              stat: "30%",
              label: "of landfill waste could be composted instead",
            },
            {
              stat: "1 ton",
              label: "of compost can save 1,000 gallons of water",
            },
          ].map((item, i) => (
            <div key={i}>
              <p className="font-display text-3xl font-bold text-primary-foreground">
                {item.stat}
              </p>
              <p className="mt-1 text-sm text-primary-foreground/70">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-20 pb-8">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-4">
            Simple Grass-Roots Pricing
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Compostly is a subscription service. Dig in for one low monthly
            price.
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="rounded-xl border bg-card p-8 text-center transition-shadow hover:shadow-lg w-full max-w-sm">
              <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3 invisible">
                Coming Soon
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Basic</h3>
              <p className="font-display text-4xl font-bold text-primary mb-1">
                $10
                <span className="text-lg font-normal text-muted-foreground">
                  /mo
                </span>
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Access to guides, tips, composting tracker, rebate tracking, a
                complimentary bin and more.
              </p>
              <Button className="w-full gap-2" onClick={handleGetStarted}>
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            What you need to do:
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Leaf,
                title: "1. Collect Scraps",
                desc: "Gather your fruit peels, veggie scraps, coffee grounds, and more in a countertop bin.",
              },
              {
                icon: Recycle,
                title: "2. Compost at Home",
                desc: "Follow our simple guide to turn waste into nutrient-rich compost.",
              },
              {
                icon: Sprout,
                title: "3. Rebates",
                desc: "Earn kickbacks for composting and being a subscriber!",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="rounded-xl border bg-card p-6 text-center transition-shadow hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Compost CTA */}
      <section className="bg-muted py-20">
        <div className="container mx-auto grid gap-10 px-4 items-center md:grid-cols-2">
          <img
            src={whatToCompostImage}
            alt="Food scraps for composting"
            className="rounded-xl shadow-lg"
          />
          <div>
            <h2 className="font-display text-3xl font-bold mb-4">
              What Can You Compost?
            </h2>
            <p className="text-muted-foreground mb-6">
              From banana peels to coffee filters — we'll help you separate the
              wheat from the chaff.
            </p>
            <Link to="/what-to-compost">
              <Button className="gap-2">
                Learn More <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
