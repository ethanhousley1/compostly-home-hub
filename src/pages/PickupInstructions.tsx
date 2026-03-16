import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  MapPin,
  PackageCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Truck,
  Navigation,
  AlertTriangle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface FAQItem {
  q: string;
  a: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const dropOffLocations = [
  { name: "Green Earth Co-op", address: "142 Elm St", hours: "Mon–Sat, 8am–6pm" },
  { name: "Riverside Community Garden", address: "890 River Rd", hours: "Daily, 7am–8pm" },
  { name: "Northgate Farmers Market", address: "55 Market Pl", hours: "Sat only, 8am–1pm" },
  { name: "Westside Library", address: "310 Oak Ave", hours: "Mon–Fri, 9am–5pm" },
];

const faqs: FAQItem[] = [
  {
    q: "What if I miss my pickup day?",
    a: "No worries — your bin will be collected on the next scheduled pickup. You can also drop off at any partner location in the meantime. For urgent situations, contact us to request a one-time special pickup.",
  },
  {
    q: "What if my bin is too full to close?",
    a: "Do not overfill. Place overflow scraps in a sealed compostable bag beside your bin and our team will collect it. Bins with open lids may be skipped for sanitation reasons. Drop-off locations accept overflow bags too.",
  },
  {
    q: "Do I need to rinse my bin before pickup?",
    a: "Nope — that's our job. We sanitize every bin after each collection. You just need to use the provided compostable liner bag.",
  },
  {
    q: "Can I use the drop-off locations without a subscription?",
    a: "Drop-off locations are a subscriber-only perk. You'll need to show your Compostly membership card (digital or physical) when dropping off.",
  },
  {
    q: "What happens if my pickup is skipped?",
    a: "If your bin was properly set out and wasn't collected, report it in your dashboard within 24 hours and we'll arrange a same-week makeup pickup at no charge.",
  },
  {
    q: "Can I put compostable plastics (PLA) in my bin?",
    a: "Not in the bin — these require industrial composting and our current facility doesn't accept them. Check local drop-off options for certified compostable plastics.",
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y rounded-xl border bg-card overflow-hidden">
      {items.map((item, i) => (
        <div key={i}>
          <button
            className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold hover:bg-muted/50 transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{item.q}</span>
            {open === i ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 ml-4" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-4" />
            )}
          </button>
          {open === i && (
            <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const Pickup = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground leading-tight">
            Collection Instructions
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-lg">
            Drop it at the curb or drop it off yourself — here's everything you
            need to know to get your compost collected.
          </p>
          <div className="mt-8 inline-flex rounded-full bg-primary-foreground/20 p-1 gap-1">
            <a
              href="#curbside"
              className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-primary-foreground bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors"
            >
              <Truck className="h-4 w-4" /> Curbside Pickup
            </a>
            <a
              href="#drop-off"
              className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
            >
              <Navigation className="h-4 w-4" /> Drop-Off
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CURBSIDE PICKUP                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section id="curbside" className="py-20 scroll-mt-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold">Curbside Pickup</h2>
          </div>
          <p className="text-muted-foreground mb-10 ml-[52px]">
            We come to you. Follow these steps and your bin will be collected
            without a hitch.
          </p>

          <div className="space-y-4">
            {/* Step 1 — Prepare */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex gap-5 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Trash2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
                    Step 1
                  </p>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    Prepare Your Bin
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Use the compostable liner bag included in your starter kit —
                    no loose scraps. Tie off the full bag and place it inside
                    your bin before setting it out.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-muted p-4 text-sm">
                      <p className="font-semibold mb-2">✅ Accepted</p>
                      <ul className="text-muted-foreground space-y-1">
                        <li>Fruit & vegetable scraps</li>
                        <li>Coffee grounds & paper filters</li>
                        <li>Eggshells</li>
                        <li>Paper towels & napkins</li>
                        <li>Yard trimmings & dry leaves</li>
                      </ul>
                    </div>
                    <div className="rounded-lg bg-muted p-4 text-sm">
                      <p className="font-semibold mb-2">❌ Not Accepted</p>
                      <ul className="text-muted-foreground space-y-1">
                        <li>Meat, fish & bones</li>
                        <li>Dairy & oils</li>
                        <li>Pet waste or kitty litter</li>
                        <li>Plastic or foil</li>
                        <li>Compostable plastics (PLA)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 — Set Out */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex gap-5 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
                    Step 2
                  </p>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    Set Out Your Bin
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Place your sealed, latched bin at the curb by{" "}
                    <span className="font-semibold text-foreground">
                      7:00 AM on your pickup day
                    </span>
                    . Setting it out the night before is totally fine.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3 text-sm">
                    {[
                      {
                        label: "Single-family homes",
                        tip: "Place at the curb edge, lid facing the street. Keep 3 ft from other bins.",
                      },
                      {
                        label: "Apartments & condos",
                        tip: "Use your building's labeled compost area — typically the trash room or back entrance.",
                      },
                      {
                        label: "All placements",
                        tip: "Lid must be fully closed & latched. Do not block sidewalks or fire hydrants.",
                      },
                    ].map((t) => (
                      <div key={t.label} className="rounded-lg border bg-muted/40 p-3">
                        <p className="font-semibold mb-1">{t.label}</p>
                        <p className="text-muted-foreground">{t.tip}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-amber-800">
                      <span className="font-semibold">Bins set out after 7:00 AM may be missed.</span>{" "}
                      Our routes start early — set yours out the night before if you're not an early riser.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 — We Do the Rest */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex gap-5 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <PackageCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
                    Step 3
                  </p>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    We Do the Rest
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Our team collects your bin, empties it, sanitizes it, and
                    returns it to your door — ready for the next cycle. You'll
                    receive a confirmation notification once your bin has been
                    collected. If something looks off, contact us within 24
                    hours and we'll make it right.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* DROP-OFF                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section id="drop-off" className="py-20 bg-muted scroll-mt-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold">Drop-Off Locations</h2>
          </div>
          <p className="text-muted-foreground mb-10 ml-[52px]">
            Prefer to drop off yourself? Bring your sealed compostable bag to
            any of our partner locations below. Your Compostly membership card
            is required.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {dropOffLocations.map((loc) => (
              <div
                key={loc.name}
                className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{loc.name}</p>
                    <p className="text-sm text-muted-foreground">{loc.address}</p>
                    <p className="text-xs text-muted-foreground mt-1">🕐 {loc.hours}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border bg-card p-5 text-sm">
            <p className="font-semibold mb-2">What to bring</p>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li>Scraps sealed in a compostable liner bag (provided in your kit)</li>
              <li>Your Compostly membership card — digital or physical</li>
              <li>No loose scraps; bins at partner locations are shared</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            Have a question not answered here?{" "}
            <Link to="/contact" className="text-primary underline underline-offset-2">
              Reach out
            </Link>
            .
          </p>
          <FAQAccordion items={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            Not a subscriber yet?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Sign up and we'll ship your starter kit — bin, liners, and a full
            guide — right to your door.
          </p>
          <Link to="/sign-up">
            <Button size="lg" variant="secondary" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Pickup;