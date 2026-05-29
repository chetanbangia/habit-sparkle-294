import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface-alt mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              <span className="font-gurmukhi">ਸਾਂਝ</span> · Saanjh is a modern matrimonial home for the
              Punjabi and Indian community — built on trust, dignity, and lasting connections.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-base font-medium mb-3 text-foreground">Saanjh</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition">About</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition">Pricing</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base font-medium mb-3 text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-primary transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Saanjh. Made with care in India.</p>
          <p className="font-gurmukhi">ਪਿਆਰ · ਵਿਸ਼ਵਾਸ · ਸਾਂਝ</p>
        </div>
      </div>
    </footer>
  );
}
