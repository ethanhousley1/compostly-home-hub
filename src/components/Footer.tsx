import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-card py-10">
    <div className="container mx-auto px-4">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold">Compostly</span>
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
          <h4 className="font-display font-semibold mb-3">Contact</h4>
          <p className="text-sm text-muted-foreground">hello@compostly.com</p>
          <Link to="/contact" className="text-sm text-primary hover:underline">Contact Us</Link>
        </div>
      </div>
      <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
        © 2026 Compostly. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
