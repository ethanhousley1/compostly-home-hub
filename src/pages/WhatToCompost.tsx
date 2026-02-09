import whatToCompostImage from "@/assets/what-to-compost.jpg";

const greens = [
  "Fruit & vegetable scraps",
  "Coffee grounds & tea bags",
  "Fresh grass clippings",
  "Plant trimmings",
  "Eggshells",
];

const browns = [
  "Dry leaves",
  "Cardboard & newspaper (shredded)",
  "Straw & hay",
  "Wood chips & sawdust",
  "Dryer lint (natural fibers)",
];

const avoid = [
  "Meat & fish scraps",
  "Dairy products",
  "Oils & grease",
  "Diseased plants",
  "Pet waste",
  "Treated wood",
];

const WhatToCompost = () => (
  <div className="min-h-screen py-16">
    <div className="container mx-auto px-4 max-w-4xl">
      <h1 className="font-display text-4xl font-bold text-center mb-4">What to Compost</h1>
      <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
        Knowing what to add — and what to avoid — makes composting easy and effective.
      </p>

      <img src={whatToCompostImage} alt="Compostable food scraps" className="rounded-xl mb-12 w-full max-h-72 object-cover shadow" />

      <div className="grid gap-8 md:grid-cols-3 mb-12">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-display text-xl font-semibold text-primary mb-3">🟢 Greens (Nitrogen)</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {greens.map((g) => <li key={g}>• {g}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-display text-xl font-semibold text-earth-brown mb-3">🟤 Browns (Carbon)</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {browns.map((b) => <li key={b}>• {b}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-display text-xl font-semibold text-destructive mb-3">🔴 Avoid</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {avoid.map((a) => <li key={a}>• {a}</li>)}
          </ul>
        </div>
      </div>

      <div className="rounded-xl bg-primary/10 p-8 text-center">
        <h3 className="font-display text-xl font-semibold mb-2">Pro Tip</h3>
        <p className="text-muted-foreground">
          Aim for a 3:1 ratio of browns to greens. Keep your compost moist like a wrung-out sponge, and turn it every week for best results!
        </p>
      </div>
    </div>
  </div>
);

export default WhatToCompost;
