import aboutImage from "@/assets/about-composting.jpg";

const AboutUs = () => (
  <div className="min-h-screen py-16">
    <div className="container mx-auto px-4 max-w-4xl">
      <h1 className="font-display text-4xl font-bold text-center mb-4">About Compostly</h1>
      <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
        We're on a mission to make composting accessible to every household.
      </p>

      <img src={aboutImage} alt="Backyard composting setup" className="rounded-xl mb-10 w-full max-h-80 object-cover shadow" />

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>
          Compostly was founded with a simple belief: every household can make a difference in reducing waste. 
          By turning food scraps and yard waste into nutrient-rich compost, we help families contribute to a healthier planet 
          while enriching their own gardens.
        </p>
        <p>
          Our platform provides everything you need — from learning what to compost, to tracking your schedule and finding 
          community composting locations near you. Whether you're a beginner or an experienced gardener, Compostly makes 
          the process simple and rewarding.
        </p>
        <p>
          Together, we've helped divert thousands of pounds of organic waste from landfills. Join our growing community 
          and start making an impact today.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          { num: "10K+", label: "Active Composters" },
          { num: "50 Tons", label: "Waste Diverted" },
          { num: "200+", label: "Community Sites" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-6 text-center">
            <p className="font-display text-2xl font-bold text-primary">{s.num}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AboutUs;
