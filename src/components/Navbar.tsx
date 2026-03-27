import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import compostlyLogo from "@/assets/compostly-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();

const navLinks = [
  { label: "Home", to: "/" },
  ...(isLoggedIn ? [{ label: "Dashboard", to: "/dashboard" }] : []),
  { label: "About Us", to: "/about" },
  { label: "FAQ", to: "/faq" },
  ...(isLoggedIn ? [{ label: "Profile", to: "/profile" }] : []),
];

  return (
    <nav className="sticky top-0 z-[1000] border-b bg-white backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={compostlyLogo} alt="Compostly" className="h-9" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center md:flex">
          {!isLoggedIn && (
            <div className="flex items-center">
              <Button asChild className="bg-[#3D5A40] text-white hover:bg-[#3D5A40]/90 mr-4">
                <Link to="/signup">
                  Sign Up
                </Link>
              </Button>
              <span className="text-muted-foreground mr-4">|</span>
            </div>
          )}
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => { logout(); navigate("/"); }}
              className="ml-2"
            >
              Sign Out
            </Button>
          ) : (
            <Link
              to="/signin"
              className="ml-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="border-t bg-card md:hidden animate-fade-in">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
            {!isLoggedIn && (
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium bg-[#3D5A40] text-white hover:bg-[#3D5A40]/90 mb-2 w-max"
              >
                Sign Up
              </Link>
            )}
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { logout(); navigate("/"); setIsOpen(false); }}
              >
                Sign Out
              </Button>
            ) : (
              <Link
                to="/signin"
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
