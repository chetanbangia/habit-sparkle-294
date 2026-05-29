import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, X, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/interests")({
  head: () => ({ meta: [{ title: "Interests · Saanjh" }] }),
  component: InterestsPage,
});

interface InterestRow {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  profile?: { display_name: string | null; avatar_url: string | null; city: string | null };
}

function InterestsPage() {
  const { user } = useAuth();
  const [received, setReceived] = useState<InterestRow[]>([]);
  const [sent, setSent] = useState<InterestRow[]>([]);
  const [tab, setTab] = useState<"received" | "sent">("received");

  const load = async () => {
    if (!user) return;
    const [r, s] = await Promise.all([
      supabase.from("interests").select("*").eq("receiver_id", user.id).eq("status", "pending").order("created_at", { ascending: false }),
      supabase.from("interests").select("*").eq("sender_id", user.id).order("created_at", { ascending: false }),
    ]);
    const allIds = [...(r.data || []).map((x) => x.sender_id), ...(s.data || []).map((x) => x.receiver_id)];
    const { data: profiles } = await supabase.from("profiles").select("id, display_name, avatar_url, city").in("id", allIds);
    const pMap = new Map(profiles?.map((p) => [p.id, p]) || []);
    setReceived((r.data || []).map((x: any) => ({ ...x, profile: pMap.get(x.sender_id) })));
    setSent((s.data || []).map((x: any) => ({ ...x, profile: pMap.get(x.receiver_id) })));
  };

  useEffect(() => { load(); }, [user]);

  const respond = async (id: string, status: "accepted" | "rejected") => {
    const { error } = await supabase.from("interests").update({ status, responded_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(status === "accepted" ? "Match! Check your matches page." : "Declined.");
    load();
  };

  const list = tab === "received" ? received : sent;

  return (
    <main className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
      <h1 className="font-serif text-4xl">Interests</h1>
      <p className="font-gurmukhi text-base text-primary/80 mt-1">ਦਿਲਚਸਪੀ</p>

      <div className="flex gap-1 mt-6 border-b border-border">
        {(["received", "sent"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {t === "received" ? `Received (${received.length})` : `Sent (${sent.length})`}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {list.length === 0 ? (
          <div className="text-center py-16 bg-secondary/20 rounded-lg">
            <Heart className="w-10 h-10 text-primary/30 mx-auto" />
            <p className="font-serif text-xl mt-4">Nothing here yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              {tab === "received" ? "When someone sends you an interest, it'll show up here." : "Send interests from the browse page."}
            </p>
          </div>
        ) : list.map((i) => (
          <div key={i.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-secondary overflow-hidden shrink-0">
              {i.profile?.avatar_url ? <img src={i.profile.avatar_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center"><Heart className="w-5 h-5 text-primary/30" /></div>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{i.profile?.display_name || "Saanjh member"}</p>
              <p className="text-xs text-muted-foreground">{i.profile?.city || "—"}</p>
            </div>
            {tab === "received" ? (
              <div className="flex gap-2">
                <button onClick={() => respond(i.id, "accepted")} className="p-2 rounded-md bg-primary text-primary-foreground hover:opacity-90" title="Accept">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => respond(i.id, "rejected")} className="p-2 rounded-md border border-border text-muted-foreground hover:text-destructive" title="Decline">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <span className={`text-xs px-2.5 py-1 rounded-full ${i.status === "accepted" ? "bg-primary/10 text-primary" : i.status === "rejected" ? "bg-muted text-muted-foreground" : "bg-secondary text-foreground/70"}`}>
                {i.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
