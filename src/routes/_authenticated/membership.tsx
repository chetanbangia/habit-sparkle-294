import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Crown, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { getActiveMembership, formatINR, type ActiveMembership } from "@/lib/membership";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/membership")({
  head: () => ({ meta: [{ title: "Membership · Saanjh" }] }),
  component: MembershipPage,
});

function MembershipPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [current, setCurrent] = useState<ActiveMembership | null>(null);
  const [activating, setActivating] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [p, m] = await Promise.all([
        supabase.from("plans").select("*").eq("active", true).neq("code", "free").order("sort_order"),
        getActiveMembership(user.id),
      ]);
      setPlans(p.data || []);
      setCurrent(m);
    })();
  }, [user]);

  const choose = async (plan: any) => {
    if (!user) return;
    setActivating(plan.code);
    try {
      const expires = new Date(Date.now() + plan.duration_days * 86400000).toISOString();
      const { error: payErr } = await supabase.from("payments").insert({
        user_id: user.id, plan_code: plan.code, amount_paise: plan.price_paise,
        provider: "manual", status: "demo_completed",
      });
      if (payErr) throw payErr;
      const { error: memErr } = await supabase.from("memberships").insert({
        user_id: user.id, plan_code: plan.code, expires_at: expires, status: "active",
      });
      if (memErr) throw memErr;
      toast.success(`${plan.name} activated! Valid until ${new Date(expires).toLocaleDateString()}.`);
      const m = await getActiveMembership(user.id);
      setCurrent(m);
    } catch (err: any) {
      toast.error(err.message || "Could not activate plan");
    } finally {
      setActivating(null);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
      <h1 className="font-serif text-4xl">Membership</h1>
      <p className="font-gurmukhi text-base text-primary/80 mt-1">ਮੈਂਬਰਸ਼ਿਪ</p>

      {current && (
        <div className="mt-6 rounded-lg bg-secondary/40 border border-primary/20 p-5 flex items-center gap-3">
          <Crown className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium">Current plan: {current.planName}</p>
            {current.planCode !== "free" && (
              <p className="text-xs text-muted-foreground">Active until {new Date(current.expiresAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 p-4 rounded-md bg-gold/10 border border-gold/30 text-sm text-foreground/80">
        <strong>Demo mode:</strong> Razorpay/Stripe is not yet wired. Clicking a plan activates it instantly for testing.
        Real payments coming soon — your plan, your data, and pricing are all live.
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-8">
        {plans.map((p) => {
          const isCurrent = current?.planCode === p.code;
          return (
            <div key={p.code} className={`rounded-lg p-6 ${p.code === "month" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
              {p.code === "month" && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold text-ink mb-2">
                  <Sparkles className="w-3 h-3" /> Most popular
                </span>
              )}
              <h3 className="font-serif text-2xl">{p.name}</h3>
              <p className="font-serif text-4xl mt-3">{formatINR(p.price_paise)}</p>
              <p className={`text-xs ${p.code === "month" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{p.duration_days} days</p>
              <ul className={`mt-5 space-y-2 text-sm ${p.code === "month" ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                {(p.features?.chat) && <li className="flex gap-2"><Check className="w-4 h-4" /> Chat with matches</li>}
                {(p.features?.contact) && <li className="flex gap-2"><Check className="w-4 h-4" /> Contact access</li>}
                {(p.features?.full_photos) && <li className="flex gap-2"><Check className="w-4 h-4" /> Full photos</li>}
                {(p.features?.interests_per_day === -1) && <li className="flex gap-2"><Check className="w-4 h-4" /> Unlimited interests</li>}
                {(p.features?.priority) && <li className="flex gap-2"><Check className="w-4 h-4" /> Priority visibility</li>}
              </ul>
              <button onClick={() => choose(p)} disabled={activating === p.code || isCurrent}
                className={`mt-6 w-full py-2.5 rounded-md font-medium transition disabled:opacity-50 ${p.code === "month" ? "bg-background text-primary hover:opacity-90" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
                {isCurrent ? "Current plan" : activating === p.code ? "Activating..." : "Choose plan"}
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
