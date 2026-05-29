import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageCircle, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/matches")({
  head: () => ({ meta: [{ title: "Matches · Saanjh" }] }),
  component: MatchesPage,
});

function MatchesPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("matches").select("*").or(`user_a.eq.${user.id},user_b.eq.${user.id}`).order("created_at", { ascending: false });
      const otherIds = (data || []).map((m) => (m.user_a === user.id ? m.user_b : m.user_a));
      const { data: profiles } = await supabase.from("profiles").select("id, display_name, avatar_url, city").in("id", otherIds);
      const pMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      setMatches((data || []).map((m) => ({ ...m, other: pMap.get(m.user_a === user.id ? m.user_b : m.user_a) })));
    })();
  }, [user]);

  return (
    <main className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
      <h1 className="font-serif text-4xl">Matches</h1>
      <p className="font-gurmukhi text-base text-primary/80 mt-1">ਜੋੜੀਆਂ</p>

      <div className="mt-8 space-y-3">
        {matches.length === 0 ? (
          <div className="text-center py-16 bg-secondary/20 rounded-lg">
            <Heart className="w-10 h-10 text-primary/30 mx-auto" />
            <p className="font-serif text-xl mt-4">No matches yet</p>
            <p className="text-sm text-muted-foreground mt-1">When two hearts say yes, magic happens here.</p>
          </div>
        ) : matches.map((m) => (
          <Link key={m.id} to="/chat/$matchId" params={{ matchId: m.id }}
            className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-md transition">
            <div className="w-14 h-14 rounded-full bg-secondary overflow-hidden shrink-0">
              {m.other?.avatar_url ? <img src={m.other.avatar_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center"><Heart className="w-5 h-5 text-primary/30" /></div>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{m.other?.display_name || "Saanjh member"}</p>
              <p className="text-xs text-muted-foreground">{m.other?.city || "—"} · Matched {new Date(m.created_at).toLocaleDateString()}</p>
            </div>
            <MessageCircle className="w-5 h-5 text-primary" />
          </Link>
        ))}
      </div>
    </main>
  );
}
