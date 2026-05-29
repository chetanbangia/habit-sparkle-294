import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/Logo";
import { Heart, Users, MessageCircle, Crown, User as UserIcon, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <p className="font-serif text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    throw redirect({ to: "/login" });
  }

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/browse" className="text-foreground/70 hover:text-primary" activeProps={{ className: "text-primary" }}>
              <Users className="w-4 h-4 inline mr-1.5" />Browse
            </Link>
            <Link to="/interests" className="text-foreground/70 hover:text-primary" activeProps={{ className: "text-primary" }}>
              <Heart className="w-4 h-4 inline mr-1.5" />Interests
            </Link>
            <Link to="/matches" className="text-foreground/70 hover:text-primary" activeProps={{ className: "text-primary" }}>
              <MessageCircle className="w-4 h-4 inline mr-1.5" />Matches
            </Link>
            <Link to="/membership" className="text-foreground/70 hover:text-primary" activeProps={{ className: "text-primary" }}>
              <Crown className="w-4 h-4 inline mr-1.5" />Premium
            </Link>
            <Link to="/profile" className="text-foreground/70 hover:text-primary" activeProps={{ className: "text-primary" }}>
              <UserIcon className="w-4 h-4 inline mr-1.5" />Profile
            </Link>
            <button onClick={handleSignOut} className="text-foreground/70 hover:text-primary">
              <LogOut className="w-4 h-4 inline" />
            </button>
          </nav>
        </div>
      </header>
      <Outlet />

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border grid grid-cols-5 text-xs">
        <Link to="/browse" className="py-3 flex flex-col items-center gap-0.5 text-muted-foreground" activeProps={{ className: "py-3 flex flex-col items-center gap-0.5 text-primary" }}>
          <Users className="w-5 h-5" /> Browse
        </Link>
        <Link to="/interests" className="py-3 flex flex-col items-center gap-0.5 text-muted-foreground" activeProps={{ className: "py-3 flex flex-col items-center gap-0.5 text-primary" }}>
          <Heart className="w-5 h-5" /> Interests
        </Link>
        <Link to="/matches" className="py-3 flex flex-col items-center gap-0.5 text-muted-foreground" activeProps={{ className: "py-3 flex flex-col items-center gap-0.5 text-primary" }}>
          <MessageCircle className="w-5 h-5" /> Matches
        </Link>
        <Link to="/membership" className="py-3 flex flex-col items-center gap-0.5 text-muted-foreground" activeProps={{ className: "py-3 flex flex-col items-center gap-0.5 text-primary" }}>
          <Crown className="w-5 h-5" /> Premium
        </Link>
        <Link to="/profile" className="py-3 flex flex-col items-center gap-0.5 text-muted-foreground" activeProps={{ className: "py-3 flex flex-col items-center gap-0.5 text-primary" }}>
          <UserIcon className="w-5 h-5" /> Profile
        </Link>
      </nav>
      <div className="md:hidden h-20" />
    </div>
  );
}
