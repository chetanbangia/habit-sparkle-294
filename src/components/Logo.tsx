import { Link } from "@tanstack/react-router";
import logoUrl from "@/assets/saanjh-logo.png";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export function Logo({ className = "", showTagline = false }: LogoProps) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 group ${className}`}>
      <img
        src={logoUrl}
        alt="Saanjh — where meaningful relationships begin"
        className="h-14 sm:h-16 w-auto object-contain -my-2 group-hover:opacity-90 transition-opacity"
        loading="eager"
      />
      {showTagline && (
        <span className="hidden sm:inline ml-2 text-xs text-muted-foreground italic">
          where two souls meet
        </span>
      )}
    </Link>
  );
}
