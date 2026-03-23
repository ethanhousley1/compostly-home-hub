import { Link } from "react-router-dom";
import compostlyLogo from "@/assets/compostly-logo.png";

const Footer = () => (
  <footer className="border-t bg-card py-10">
    <div className="container mx-auto px-4">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src={compostlyLogo} alt="Compostly" className="h-7" />
          </div>
          <p className="text-sm text-muted-foreground">
            Making home composting simple, sustainable, and rewarding.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Quick Links</h4>
          <div className="flex flex-col gap-1">
            {[
              { label: "Home", to: "/" },
              { label: "About Us", to: "/about" },
              { label: "FAQ", to: "/faq" },
              { label: "What to Compost", to: "/what-to-compost" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Contact Us</h4>
          <a href="mailto:help@compostly.org" className="text-sm text-primary hover:underline">help@compostly.org</a>
        </div>
      </div>
      <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
        © 2026 Compostly. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
