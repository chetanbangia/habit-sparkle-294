import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/use-auth";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border/60">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-24 md:h-28 flex items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-foreground/70 hover:text-primary transition-colors"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              to="/browse"
              className="px-5 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
            >
              My Saanjh
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm text-foreground/70 hover:text-primary transition">
                Sign in
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
              >
                Register Free
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 -mr-2 text-foreground"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <nav className="px-5 py-4 flex flex-col gap-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="text-foreground/80 py-2"
              >
                {n.label}
              </Link>
            ))}
            <div className="border-t border-border/60 pt-3 flex flex-col gap-2">
              {user ? (
                <Link
                  to="/browse"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium text-center"
                >
                  My Saanjh
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="py-2 text-foreground/80">
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium text-center"
                  >
                    Register Free
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
