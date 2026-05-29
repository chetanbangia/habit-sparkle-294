import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset password · Saanjh" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"request" | "set">("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash.includes("type=recovery")) {
      setMode("set");
    }
  }, []);

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Reset link sent. Check your email.");
    } catch (err: any) {
      toast.error(err.message || "Could not send reset link");
    } finally {
      setLoading(false);
    }
  };

  const setNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. Please sign in.");
      navigate({ to: "/login" });
    } catch (err: any) {
      toast.error(err.message || "Could not update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grain bg-background flex items-center justify-center px-5 py-12">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-10"><Logo /></div>
        <div className="bg-card border border-border rounded-xl p-8 shadow-xl shadow-primary/5">
          <h1 className="font-serif text-3xl text-center">
            {mode === "request" ? "Reset password" : "Set new password"}
          </h1>

          {mode === "request" ? (
            <form onSubmit={sendLink} className="mt-6 space-y-4">
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email" required maxLength={120}
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button disabled={loading} className="w-full rounded-md bg-primary text-primary-foreground py-3 text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          ) : (
            <form onSubmit={setNewPassword} className="mt-6 space-y-4">
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="New password (min 6 characters)" required minLength={6} maxLength={128}
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button disabled={loading} className="w-full rounded-md bg-primary text-primary-foreground py-3 text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/login" className="text-primary hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
