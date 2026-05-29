import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Register Free · Saanjh" },
      { name: "description", content: "Create your free Saanjh matrimonial profile in under a minute." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { lovable } = await import("@/integrations/lovable/index");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/profile`,
      });
      if (result.error) {
        toast.error(result.error instanceof Error ? result.error.message : "Google sign-up failed");
      } else if (!result.redirected) {
        navigate({ to: "/profile" });
      }
    } catch (err: any) {
      toast.error(err.message || "Google sign-up failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/profile`,
          data: { full_name: name.trim() },
        },
      });
      if (error) throw error;
      toast.success("Welcome to Saanjh! Check your email to confirm your account.");
      navigate({ to: "/login" });
    } catch (err: any) {
      toast.error(err.message || "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grain bg-background flex items-center justify-center px-5 py-12">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-10">
          <Logo />
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-xl shadow-primary/5">
          <div className="text-center mb-7">
            <h1 className="font-serif text-3xl">Begin your saanjh</h1>
            <p className="font-gurmukhi text-base mt-1 text-primary/80">ਆਪਣੀ ਸਾਂਝ ਸ਼ੁਰੂ ਕਰੋ</p>
            <p className="text-sm text-muted-foreground mt-2">Free forever. No credit card.</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 rounded-md border border-input bg-background py-3 text-sm font-medium hover:bg-secondary/40 transition disabled:opacity-40"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {googleLoading ? "Please wait..." : "Continue with Google"}
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name" required maxLength={80}
                className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required maxLength={120}
                className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)" required minLength={6} maxLength={128}
                className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full rounded-md bg-primary text-primary-foreground py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create free profile"}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-5 leading-relaxed">
            By signing up you agree to our <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{" "}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already a member?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
