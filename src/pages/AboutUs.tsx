import aboutImage from "@/assets/about-hero-composting.png";
import garrettHeadshot from "@/assets/headshot-garrett.jpg";
import brocHeadshot from "@/assets/headshot-broc.jpeg";
import ethanHeadshot from "@/assets/headshot-ethan.jpg";
import michaelHeadshot from "@/assets/headshot-michael.jpg";
import dawsonHeadshot from "@/assets/headshot-dawson.jpg";
import { Leaf, Heart, TreePine } from "lucide-react";

const AboutUs = () => (
  <div className="min-h-screen">
    {/* Hero Banner */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={aboutImage}
          alt="Backyard composting setup"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
      </div>
      <div className="container relative mx-auto px-4 py-28 md:py-36">
        <div className="max-w-xl animate-fade-in">
          <h1 className="font-display text-4xl font-bold leading-tight text-primary-foreground md:text-5xl">
            About Compostly
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80">
            We're on a mission to give back to the Earth.
          </p>
        </div>
      </div>
    </section>

    {/* Stats Bar */}
    <section className="bg-primary py-10">
      <div className="container mx-auto grid gap-6 px-4 text-center md:grid-cols-3">
        {[
          { num: "5k", label: "Active Tree Lovers", icon: Heart },
          { num: "10 Tons", label: "Waste Diverted", icon: Leaf },
          { num: "100+", label: "Trees Hugged", icon: TreePine },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <s.icon className="h-6 w-6 text-primary-foreground/70 mb-2" />
            <p className="font-display text-3xl font-bold text-primary-foreground">
              {s.num}
            </p>
            <p className="mt-1 text-sm text-primary-foreground/70">{s.label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Our Story */}
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Leaf className="h-5 w-5 text-primary" />
          <h2 className="font-display text-3xl font-bold text-center">Our Story</h2>
          <Leaf className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-6 text-muted-foreground leading-relaxed text-center">
          <p>
            Compostly was founded with one thing in mind: Give back to the Earth.
            By turning food scraps and yard waste into nutrient-rich compost, we help families contribute to having more trees to hug.
          </p>
          <p>
            Our platform provides everything you need — from learning what to compost, to tracking your schedule and finding
            community composting locations near you. Whether you're a beginner or an experienced gardener, Compostly makes
            the process simple and rewarding.
          </p>
          <p>
            Together, we've helped divert thousands of pounds of organic waste from landfills. Join our growing community
            and start hugging some trees, probably.
          </p>
        </div>
      </div>
    </section>

    {/* Meet the Team */}
    <section className="bg-muted py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="font-display text-3xl font-bold text-center mb-3">
          Meet the Team Behind Compostly
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          The passionate people behind Compostly.
        </p>

        <div className="grid gap-10 grid-cols-2 md:grid-cols-4 justify-items-center">
          {[
            { name: "Garrett Nelson", role: "Investor | Analyst", img: garrettHeadshot },
            { name: "Logan Reeder", role: "CEO | Co-Founder" },
            { name: "Ethan Housley", role: "CTO | Founder", img: ethanHeadshot },
            { name: "Dawson Broadbent", role: "CMO", img: dawsonHeadshot },
            { name: "Michael Jones", role: "CFO", img: michaelHeadshot },
            { name: "Garret Safsten", role: "CRO" },
            { name: "Joaquin Elizalde ", role: "President | Co-Founder" },
            { name: "Broc Cuartas", role: "Investor | Advisor", img: brocHeadshot },
          ].map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center group">
              <div className="w-32 h-32 rounded-full border-4 border-primary/30 bg-card overflow-hidden mb-4 shadow-md transition-transform group-hover:scale-105 group-hover:border-primary/60 flex items-center justify-center">
                {member.img ? (
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover object-[center_20%]" />
                ) : (
                  <span className="text-3xl text-primary/50">🌱</span>
                )}
              </div>
              <p className="font-display font-semibold text-lg">{member.name}</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default AboutUs;

