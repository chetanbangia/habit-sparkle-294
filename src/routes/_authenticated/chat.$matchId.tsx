import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, ArrowLeft, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { sanitizeText } from "@/lib/sanitize";
import { getActiveMembership } from "@/lib/membership";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/chat/$matchId")({
  head: () => ({ meta: [{ title: "Chat · Saanjh" }] }),
  component: ChatPage,
});

function ChatPage() {
  const { matchId } = Route.useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [canChat, setCanChat] = useState(false);
  const [other, setOther] = useState<any>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const mem = await getActiveMembership(user.id);
      setCanChat(mem.features.chat);

      const { data: match } = await supabase.from("matches").select("*").eq("id", matchId).maybeSingle();
      if (match) {
        const otherId = match.user_a === user.id ? match.user_b : match.user_a;
        const { data: p } = await supabase.from("profiles").select("id, display_name, avatar_url").eq("id", otherId).maybeSingle();
        setOther(p);
      }

      const { data: msgs } = await supabase.from("messages").select("*").eq("match_id", matchId).order("created_at");
      setMessages(msgs || []);
    })();

    const channel = supabase.channel(`chat-${matchId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` },
        (payload) => setMessages((m) => [...m, payload.new]))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, matchId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!text.trim() || !user) return;
    const clean = sanitizeText(text);
    if (clean.hadViolations) toast.warning(`Removed: ${clean.violations.join(", ")}`);
    if (!clean.cleaned) { toast.error("Message empty after filtering"); return; }
    const { error } = await supabase.from("messages").insert({ match_id: matchId, sender_id: user.id, body: clean.cleaned.slice(0, 1000) });
    if (error) toast.error(error.message); else setText("");
  };

  if (!canChat) {
    return (
      <main className="max-w-2xl mx-auto px-5 py-16 text-center">
        <Crown className="w-12 h-12 text-primary mx-auto" />
        <h1 className="font-serif text-3xl mt-4">Chat is a premium feature</h1>
        <p className="text-muted-foreground mt-2 mb-6">Upgrade to start messaging with your matches.</p>
        <Link to="/membership" className="inline-block px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90">
          View plans
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto h-[calc(100vh-9rem)] md:h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-card">
        <Link to="/matches" className="text-muted-foreground hover:text-primary"><ArrowLeft className="w-5 h-5" /></Link>
        <div className="w-9 h-9 rounded-full bg-secondary overflow-hidden">
          {other?.avatar_url && <img src={other.avatar_url} alt="" className="w-full h-full object-cover" />}
        </div>
        <p className="font-medium">{other?.display_name || "Match"}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${m.sender_id === user?.id ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>
              {m.body}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="border-t border-border bg-card p-3 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..." maxLength={1000}
          className="flex-1 rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        <button onClick={send} className="px-4 rounded-md bg-primary text-primary-foreground hover:opacity-90"><Send className="w-4 h-4" /></button>
      </div>
    </main>
  );
}
