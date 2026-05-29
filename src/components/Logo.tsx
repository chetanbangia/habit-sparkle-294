import { Link } from "@tanstack/react-router";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export function Logo({ className = "", showTagline = false }: LogoProps) {
  return (
    <Link to="/" className={`inline-flex items-baseline gap-2 group ${className}`}>
      <span className="font-gurmukhi text-2xl text-primary group-hover:opacity-80 transition-opacity">
        ਸਾਂਝ
      </span>
      <span className="text-foreground/30">·</span>
      <span className="font-serif text-2xl font-medium tracking-tight text-foreground">
        Saanjh
      </span>
      {showTagline && (
        <span className="hidden sm:inline ml-2 text-xs text-muted-foreground italic">
          where two souls meet
        </span>
      )}
    </Link>
  );
}
