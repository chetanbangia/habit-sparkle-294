import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ShieldCheck, Users, UserCheck, UserX, Heart, MessageCircle,
  Crown, AlertTriangle, LogOut, Check, X, Trash2, RefreshCw,
  TrendingUp, Clock, Ban, IndianRupee, Search,
} from "lucide-react";

export const Route = createFileRoute("/administrator")({
  head: () => ({ meta: [{ title: "Admin Console · Saanjh" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminAccessPage,
});

type Stats = {
  totalUsers: number;
  approvedProfiles: number;
  pendingProfiles: number;
  blockedProfiles: number;
  totalInterests: number;
  acceptedInterests: number;
  totalMatches: number;
  totalMessages: number;
  activeMemberships: number;
  revenuePaise: number;
  openReports: number;
};

function AdminAccessPage() {
  const [phase, setPhase] = useState<"checking" | "login" | "ready" | "denied">("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const checkAccess = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setPhase("login"); return; }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
    const isAdmin = (roles || []).some((r: any) => r.role === "admin");
    setPhase(isAdmin ? "ready" : "denied");
  }, []);

  useEffect(() => { checkAccess(); }, [checkAccess]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    await checkAccess();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPhase("login");
  };

  if (phase === "checking") {
    return <div className="min-h-screen grid place-items-center bg-background"><p className="text-muted-foreground">Loading…</p></div>;
  }

  if (phase === "login") {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-5">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h1 className="font-serif text-2xl">Admin Access</h1>
          </div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <button disabled={submitting} className="w-full rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50">
            {submitting ? "Signing in…" : "Sign in"}
          </button>
          <p className="text-xs text-muted-foreground mt-4 text-center">Restricted area. Authorized personnel only.</p>
        </form>
      </div>
    );
  }

  if (phase === "denied") {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-5 text-center">
        <div>
          <Ban className="w-12 h-12 text-destructive mx-auto" />
          <h1 className="font-serif text-3xl mt-4">Access denied</h1>
          <p className="text-muted-foreground mt-2">Your account does not have admin privileges.</p>
          <button onClick={handleLogout} className="mt-6 px-4 py-2 text-sm rounded-md border border-border">Sign out</button>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pending, setPending] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [recentInterests, setRecentInterests] = useState<any[]>([]);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [tab, setTab] = useState<"overview" | "users" | "pending" | "reports" | "matches" | "memberships">("overview");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [profilesAll, pendingP, reportsR, interestsI, matchesM, messagesMs, membershipsMb, paymentsP] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(500),
        supabase.from("profiles").select("*").eq("status", "pending").order("updated_at", { ascending: false }),
        supabase.from("reports").select("*").eq("resolved", false).order("created_at", { ascending: false }),
        supabase.from("interests").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("matches").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("memberships").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(100),
      ]);

      const all = profilesAll.data || [];
      setUsers(all);
      setPending(pendingP.data || []);
      setReports(reportsR.data || []);
      setRecentInterests(interestsI.data || []);
      setRecentMatches(matchesM.data || []);
      setMemberships(membershipsMb.data || []);
      setPayments(paymentsP.data || []);

      const interests = interestsI.data || [];
      const successfulPayments = (paymentsP.data || []).filter((p: any) => p.status === "success" || p.status === "paid" || p.status === "completed");
      const revenuePaise = successfulPayments.reduce((sum: number, p: any) => sum + (p.amount_paise || 0), 0);

      setStats({
        totalUsers: all.length,
        approvedProfiles: all.filter((p: any) => p.status === "approved").length,
        pendingProfiles: all.filter((p: any) => p.status === "pending").length,
        blockedProfiles: all.filter((p: any) => p.status === "blocked").length,
        totalInterests: interests.length,
        acceptedInterests: interests.filter((i: any) => i.status === "accepted").length,
        totalMatches: (matchesM.data || []).length,
        totalMessages: messagesMs.count || 0,
        activeMemberships: (membershipsMb.data || []).filter((m: any) => m.status === "active" && new Date(m.expires_at) > new Date()).length,
        revenuePaise,
        openReports: (reportsR.data || []).length,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const setProfileStatus = async (id: string, status: "approved" | "blocked" | "pending") => {
    const { error } = await supabase.from("profiles").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Profile ${status}`);
    loadAll();
  };

  const resolveReport = async (id: string) => {
    const { error } = await supabase.from("reports").update({ resolved: true }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Report resolved");
    loadAll();
  };

  const filteredUsers = users.filter((u: any) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (u.display_name || "").toLowerCase().includes(q)
      || (u.city || "").toLowerCase().includes(q)
      || (u.religion || "").toLowerCase().includes(q)
      || (u.id || "").toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h1 className="font-serif text-xl">Saanjh · Admin Console</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadAll} className="p-2 rounded-md border border-border text-foreground/70 hover:text-primary" title="Refresh">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={onLogout} className="px-3 py-2 text-sm rounded-md border border-border inline-flex items-center gap-1.5">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex gap-1 overflow-x-auto border-t border-border/60">
          {([
            ["overview", "Overview"],
            ["users", `Users (${users.length})`],
            ["pending", `Pending (${pending.length})`],
            ["reports", `Reports (${reports.length})`],
            ["matches", "Matches"],
            ["memberships", "Memberships"],
          ] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k as any)}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${tab === k ? "border-primary text-primary" : "border-transparent text-foreground/60 hover:text-foreground"}`}>
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 space-y-8">
        {tab === "overview" && stats && (
          <>
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<Users className="w-5 h-5" />} label="Total Users" value={stats.totalUsers} />
              <StatCard icon={<UserCheck className="w-5 h-5 text-emerald-500" />} label="Approved" value={stats.approvedProfiles} />
              <StatCard icon={<Clock className="w-5 h-5 text-amber-500" />} label="Pending" value={stats.pendingProfiles} />
              <StatCard icon={<UserX className="w-5 h-5 text-destructive" />} label="Blocked" value={stats.blockedProfiles} />
              <StatCard icon={<Heart className="w-5 h-5 text-rose-500" />} label="Interests Sent" value={stats.totalInterests} />
              <StatCard icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} label="Accepted" value={stats.acceptedInterests} />
              <StatCard icon={<MessageCircle className="w-5 h-5 text-primary" />} label="Matches" value={stats.totalMatches} />
              <StatCard icon={<MessageCircle className="w-5 h-5" />} label="Messages" value={stats.totalMessages} />
              <StatCard icon={<Crown className="w-5 h-5 text-amber-500" />} label="Active Premium" value={stats.activeMemberships} />
              <StatCard icon={<IndianRupee className="w-5 h-5 text-emerald-500" />} label="Revenue" value={`₹${(stats.revenuePaise / 100).toLocaleString("en-IN")}`} />
              <StatCard icon={<AlertTriangle className="w-5 h-5 text-destructive" />} label="Open Reports" value={stats.openReports} />
              <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Match Rate" value={`${stats.totalInterests ? Math.round((stats.acceptedInterests / stats.totalInterests) * 100) : 0}%`} />
            </section>

            <section className="grid md:grid-cols-2 gap-6">
              <Panel title="Recent signups">
                <ul className="divide-y divide-border">
                  {users.slice(0, 8).map((u) => (
                    <li key={u.id} className="py-3 flex items-center gap-3">
                      <Avatar url={u.avatar_url} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{u.display_name || "Unnamed"}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.city || "—"} · {new Date(u.created_at).toLocaleDateString()}</p>
                      </div>
                      <StatusBadge status={u.status} />
                    </li>
                  ))}
                  {users.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">No users yet.</li>}
                </ul>
              </Panel>

              <Panel title="Recent matches">
                <ul className="divide-y divide-border">
                  {recentMatches.slice(0, 8).map((m) => (
                    <li key={m.id} className="py-3 text-sm">
                      <p className="font-mono text-xs">{m.user_a.slice(0, 8)} ↔ {m.user_b.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</p>
                    </li>
                  ))}
                  {recentMatches.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">No matches yet.</li>}
                </ul>
              </Panel>
            </section>
          </>
        )}

        {tab === "users" && (
          <Panel title={`All users (${filteredUsers.length})`}>
            <div className="mb-4 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, city, religion, or ID…"
                className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <tr><th className="text-left py-2">User</th><th className="text-left py-2">City</th><th className="text-left py-2">Religion</th><th className="text-left py-2">Joined</th><th className="text-left py-2">Status</th><th className="text-right py-2">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.slice(0, 100).map((u) => (
                    <tr key={u.id}>
                      <td className="py-3"><div className="flex items-center gap-2"><Avatar url={u.avatar_url} /><div><p className="font-medium">{u.display_name || "Unnamed"}</p><p className="text-xs text-muted-foreground font-mono">{u.id.slice(0, 8)}</p></div></div></td>
                      <td className="py-3">{u.city || "—"}</td>
                      <td className="py-3">{u.religion || "—"}</td>
                      <td className="py-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="py-3"><StatusBadge status={u.status} /></td>
                      <td className="py-3 text-right space-x-1">
                        {u.status !== "approved" && <button onClick={() => setProfileStatus(u.id, "approved")} className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" title="Approve"><Check className="w-3.5 h-3.5" /></button>}
                        {u.status !== "blocked" && <button onClick={() => setProfileStatus(u.id, "blocked")} className="p-1.5 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20" title="Block"><Ban className="w-3.5 h-3.5" /></button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No users match your search.</p>}
            </div>
          </Panel>
        )}

        {tab === "pending" && (
          <Panel title={`Pending approvals (${pending.length})`}>
            <div className="space-y-3">
              {pending.length === 0 ? <p className="py-8 text-center text-muted-foreground text-sm">Nothing pending. </p> :
                pending.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
                    <Avatar url={p.avatar_url} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{p.display_name || "Unnamed"}</p>
                      <p className="text-xs text-muted-foreground">{p.city || "—"} · {p.religion || "—"} · {p.education || "—"}</p>
                      {p.about_me && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.about_me}</p>}
                    </div>
                    <button onClick={() => setProfileStatus(p.id, "approved")} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm inline-flex items-center gap-1"><Check className="w-4 h-4" /> Approve</button>
                    <button onClick={() => setProfileStatus(p.id, "blocked")} className="px-3 py-1.5 rounded-md border border-border text-destructive text-sm inline-flex items-center gap-1"><X className="w-4 h-4" /> Reject</button>
                  </div>
                ))}
            </div>
          </Panel>
        )}

        {tab === "reports" && (
          <Panel title={`Open reports (${reports.length})`}>
            <div className="space-y-3">
              {reports.length === 0 ? <p className="py-8 text-center text-muted-foreground text-sm">No open reports.</p> :
                reports.map((r) => (
                  <div key={r.id} className="p-4 bg-card border border-border rounded-lg">
                    <p className="text-sm"><strong>Reason:</strong> {r.reason}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">Reporter: {r.reporter_id.slice(0, 8)} · Reported: {r.reported_id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleString()}</p>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => setProfileStatus(r.reported_id, "blocked")} className="px-3 py-1.5 text-xs rounded-md bg-destructive text-destructive-foreground inline-flex items-center gap-1"><Trash2 className="w-3 h-3" /> Block user</button>
                      <button onClick={() => resolveReport(r.id)} className="px-3 py-1.5 text-xs rounded-md border border-border">Mark resolved</button>
                    </div>
                  </div>
                ))}
            </div>
          </Panel>
        )}

        {tab === "matches" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Panel title={`Recent matches (${recentMatches.length})`}>
              <ul className="divide-y divide-border">
                {recentMatches.map((m) => (
                  <li key={m.id} className="py-3 text-sm">
                    <p className="font-mono text-xs">{m.user_a.slice(0, 8)} ↔ {m.user_b.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</p>
                  </li>
                ))}
                {recentMatches.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">None yet.</li>}
              </ul>
            </Panel>
            <Panel title={`Recent interests (${recentInterests.length})`}>
              <ul className="divide-y divide-border">
                {recentInterests.slice(0, 30).map((i) => (
                  <li key={i.id} className="py-3 text-sm flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs">{i.sender_id.slice(0, 8)} → {i.receiver_id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(i.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${i.status === "accepted" ? "bg-emerald-500/10 text-emerald-600" : i.status === "declined" ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-600"}`}>{i.status}</span>
                  </li>
                ))}
                {recentInterests.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">None yet.</li>}
              </ul>
            </Panel>
          </div>
        )}

        {tab === "memberships" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Panel title={`Memberships (${memberships.length})`}>
              <ul className="divide-y divide-border">
                {memberships.map((m) => (
                  <li key={m.id} className="py-3 text-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-xs">{m.user_id.slice(0, 8)}</p>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">{m.plan_code}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Expires {new Date(m.expires_at).toLocaleDateString()} · {m.status}</p>
                  </li>
                ))}
                {memberships.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">None yet.</li>}
              </ul>
            </Panel>
            <Panel title={`Payments (${payments.length})`}>
              <ul className="divide-y divide-border">
                {payments.map((p) => (
                  <li key={p.id} className="py-3 text-sm flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs">{p.user_id.slice(0, 8)} · {p.plan_code}</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{(p.amount_paise / 100).toLocaleString("en-IN")}</p>
                      <p className="text-xs text-muted-foreground">{p.status}</p>
                    </div>
                  </li>
                ))}
                {payments.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">None yet.</li>}
              </ul>
            </Panel>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-2 text-muted-foreground">{icon}<span className="text-xs uppercase tracking-wider">{label}</span></div>
      <p className="font-serif text-3xl">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-xl p-6">
      <h2 className="font-serif text-xl mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Avatar({ url, size = "md" }: { url?: string | null; size?: "md" | "lg" }) {
  const s = size === "lg" ? "w-12 h-12" : "w-9 h-9";
  return (
    <div className={`${s} rounded-full bg-secondary overflow-hidden flex-shrink-0`}>
      {url ? <img src={url} alt="" className="w-full h-full object-cover" /> : null}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-emerald-500/10 text-emerald-600",
    pending: "bg-amber-500/10 text-amber-600",
    blocked: "bg-destructive/10 text-destructive",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs ${map[status] || "bg-secondary"}`}>{status}</span>;
}
