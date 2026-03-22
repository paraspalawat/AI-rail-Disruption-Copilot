import { Link, useLocation } from "react-router-dom";
import { Train, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/system-reliability", label: "System Reliability" },
    { path: "/security-privacy", label: "Security & Privacy" },
  ];

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      {/* Top bar with government-style text */}
      <div className="bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] text-primary-foreground/80 text-xs py-1">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span>भारतीय रेल | Indian Railways</span>
          <span>Ministry of Railways, Government of India</span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container bg-gradient-to-r from-[#232526] to-[#414345] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#c31432] to-[#240b36] p-2 rounded-lg">
              <Train className="h-6 w-6 text-accent-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold leading-tight">Rail Disruption Co-pilot</h1>
              <p className="text-xs text-primary-foreground/70">Intelligent Monitoring System</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  isActive(link.path) ? "text-accent" : "text-primary-foreground/90"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Login Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="railway-outline" size="sm" asChild className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/passenger-login">Passenger Login</Link>
            </Button>
            <Button variant="saffron" size="sm" asChild>
              <Link to="/admin-login">Admin Login</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-foreground/20 animate-fade-in">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium py-2 ${
                    isActive(link.path) ? "text-accent" : "text-primary-foreground/90"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-primary-foreground/20">
                <Button variant="railway-outline" size="sm" asChild className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Link to="/passenger-login" onClick={() => setMobileMenuOpen(false)}>
                    Passenger Login
                  </Link>
                </Button>
                <Button variant="saffron" size="sm" asChild>
                  <Link to="/admin-login" onClick={() => setMobileMenuOpen(false)}>
                    Admin Login
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
