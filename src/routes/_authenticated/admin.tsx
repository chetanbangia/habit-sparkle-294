import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, X, Trash2, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin · Saanjh" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [pending, setPending] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const admin = (roles || []).some((r: any) => r.role === "admin");
      setIsAdmin(admin);
      if (admin) load();
    })();
  }, [user]);

  const load = async () => {
    const [p, r] = await Promise.all([
      supabase.from("profiles").select("*").eq("status", "pending").order("updated_at", { ascending: false }),
      supabase.from("reports").select("*").eq("resolved", false).order("created_at", { ascending: false }),
    ]);
    setPending(p.data || []);
    setReports(r.data || []);
  };

  const setStatus = async (id: string, status: "approved" | "blocked") => {
    const { error } = await supabase.from("profiles").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success(`Profile ${status}`); load(); }
  };

  const resolveReport = async (id: string) => {
    await supabase.from("reports").update({ resolved: true }).eq("id", id);
    toast.success("Report resolved"); load();
  };

  if (isAdmin === null) return <p className="text-center py-12">Checking access...</p>;
  if (!isAdmin) {
    return (
      <main className="max-w-xl mx-auto px-5 py-16 text-center">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
        <h1 className="font-serif text-3xl mt-4">Admin access required</h1>
        <p className="text-muted-foreground mt-2">
          Your account needs the <code className="px-1.5 py-0.5 bg-secondary rounded">admin</code> role. Add a row to <code className="px-1.5 py-0.5 bg-secondary rounded">user_roles</code> with your user_id and role 'admin' to unlock.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-5 sm:px-8 py-8 space-y-10">
      <h1 className="font-serif text-4xl">Admin Console</h1>

      <section>
        <h2 className="font-serif text-2xl mb-4">Pending profile approvals ({pending.length})</h2>
        <div className="space-y-3">
          {pending.length === 0 ? <p className="text-muted-foreground text-sm">Nothing pending.</p> :
            pending.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
                <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden">
                  {p.avatar_url && <img src={p.avatar_url} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{p.display_name || "Unnamed"}</p>
                  <p className="text-xs text-muted-foreground">{p.city || "—"} · {p.religion || "—"}</p>
                </div>
                <button onClick={() => setStatus(p.id, "approved")} className="p-2 rounded-md bg-primary text-primary-foreground"><Check className="w-4 h-4" /></button>
                <button onClick={() => setStatus(p.id, "blocked")} className="p-2 rounded-md border border-border text-destructive"><X className="w-4 h-4" /></button>
              </div>
            ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl mb-4">Open reports ({reports.length})</h2>
        <div className="space-y-3">
          {reports.length === 0 ? <p className="text-muted-foreground text-sm">No open reports.</p> :
            reports.map((r) => (
              <div key={r.id} className="p-4 bg-card border border-border rounded-lg">
                <p className="text-sm"><strong>Reason:</strong> {r.reason}</p>
                <p className="text-xs text-muted-foreground mt-1">Reporter: {r.reporter_id.slice(0, 8)} · Reported: {r.reported_id.slice(0, 8)}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setStatus(r.reported_id, "blocked")} className="px-3 py-1.5 text-xs rounded-md bg-destructive text-destructive-foreground inline-flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Block user
                  </button>
                  <button onClick={() => resolveReport(r.id)} className="px-3 py-1.5 text-xs rounded-md border border-border">Mark resolved</button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}
