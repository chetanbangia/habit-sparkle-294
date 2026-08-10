import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { Check, Clock, IndianRupee, QrCode, Upload, X } from "lucide-react";

export const Route = createFileRoute("/membership")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Upgrade Membership · Saanjh" },
      { name: "description", content: "Pay for your Saanjh membership using UPI QR and upload the payment screenshot for quick verification." },
      { property: "og:title", content: "Upgrade your Saanjh membership" },
      { property: "og:description", content: "Scan the UPI QR, pay your plan amount and upload the screenshot. Membership activates after verification." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    plan: typeof s.plan === "string" ? s.plan : "",
  }),
  component: MembershipPage,
});

type Plan = {
  code: string;
  name: string;
  price_paise: number;
  duration_days: number;
  sort_order: number;
};

type Settings = {
  upi_id: string | null;
  payee_name: string | null;
  qr_path: string | null;
  instructions: string | null;
};

function MembershipPage() {
  const { plan: planParam } = Route.useSearch();
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(planParam || "month");
  const [requests, setRequests] = useState<any[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setReady(true); return; }
    setUserId(session.user.id);

    const [{ data: planRows }, { data: setting }, { data: reqs }] = await Promise.all([
      supabase.from("plans").select("code,name,price_paise,duration_days,sort_order").eq("active", true).gt("price_paise", 0).order("sort_order"),
      supabase.from("payment_settings").select("upi_id,payee_name,qr_path,instructions").maybeSingle(),
      supabase.from("payment_requests").select("*").order("created_at", { ascending: false }).limit(10),
    ]);

    setPlans((planRows as Plan[]) || []);
    setSettings((setting as Settings) || null);
    setRequests(reqs || []);

    if (setting?.qr_path) {
      const { data: signed } = await supabase.storage.from("payment-proofs").createSignedUrl(setting.qr_path, 3600);
      setQrUrl(signed?.signedUrl ?? null);
    }
    setReady(true);
  }, []);

  useEffect(() => { load(); }, [load]);

  const activePlan = useMemo(() => plans.find((p) => p.code === selected) || plans[0], [plans, selected]);
  const pendingReq = requests.find((r) => r.status === "pending");

  const onPick = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("Please upload an image file");
    if (f.size > 5 * 1024 * 1024) return toast.error("Image must be under 5 MB");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async () => {
    if (!userId || !activePlan) return;
    if (!file) return toast.error("Payment screenshot upload karna zaroori hai");
    setSubmitting(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("payment-proofs").upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) throw upErr;

      const { error } = await supabase.from("payment_requests").insert({
        user_id: userId,
        plan_code: activePlan.code,
        amount_paise: activePlan.price_paise,
        screenshot_path: path,
        reference_no: reference.trim() || null,
        note: note.trim() || null,
        status: "pending",
      });
      if (error) throw error;

      toast.success("Payment submitted! Admin verification ke baad membership active ho jayegi.");
      setFile(null); setPreview(null); setReference(""); setNote("");
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch (e: any) {
      toast.error(e.message || "Could not submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) {
    return <div className="min-h-screen grid place-items-center bg-background"><p className="text-muted-foreground">Loading…</p></div>;
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="max-w-md mx-auto px-5 py-24 text-center">
          <h1 className="font-serif text-3xl">Sign in to upgrade</h1>
          <p className="text-muted-foreground mt-3">Membership lene ke liye pehle apne account mein sign in karein.</p>
          <button onClick={() => navigate({ to: "/login" })} className="mt-6 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium">Sign in</button>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <p className="text-[11px] uppercase tracking-[0.28em] text-primary font-medium">Manual UPI Payment</p>
        <h1 className="text-3xl sm:text-4xl mt-2 tracking-tight">Upgrade your membership</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Plan choose karein, QR scan karke payment karein, aur screenshot upload kar dein. Admin verify karte hi membership active.
        </p>

        {pendingReq && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Payment under verification</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Aapka {pendingReq.plan_code} plan ka payment ₹{(pendingReq.amount_paise / 100).toLocaleString("en-IN")} review mein hai.
              </p>
            </div>
          </div>
        )}

        {/* Step 1 — plan */}
        <h2 className="font-serif text-xl mt-10">1 · Choose your plan</h2>
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          {plans.map((p) => {
            const active = activePlan?.code === p.code;
            return (
              <button key={p.code} onClick={() => setSelected(p.code)}
                className={`text-left rounded-xl border p-4 transition-colors ${active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{p.name}</span>
                  {active && <Check className="w-4 h-4 text-primary" />}
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight">₹{(p.price_paise / 100).toLocaleString("en-IN")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{p.duration_days} days validity</p>
              </button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {/* Step 2 — pay */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl">2 · Pay ₹{activePlan ? (activePlan.price_paise / 100).toLocaleString("en-IN") : "—"}</h2>
            <div className="mt-4 grid place-items-center">
              {qrUrl ? (
                <img src={qrUrl} alt="UPI payment QR code for Saanjh membership" className="w-56 h-56 object-contain rounded-lg border border-border bg-white p-2" />
              ) : (
                <div className="w-56 h-56 grid place-items-center rounded-lg border border-dashed border-border text-center px-4">
                  <div>
                    <QrCode className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-xs text-muted-foreground mt-2">QR is being set up. Use the UPI ID below or contact support.</p>
                  </div>
                </div>
              )}
            </div>
            {settings?.upi_id && (
              <div className="mt-4 rounded-lg bg-secondary/60 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">UPI ID</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{settings.upi_id}</p>
                  <button onClick={() => { navigator.clipboard.writeText(settings.upi_id!); toast.success("UPI ID copied"); }}
                    className="text-xs px-2 py-1 rounded-md border border-border">Copy</button>
                </div>
                {settings.payee_name && <p className="text-xs text-muted-foreground mt-1">{settings.payee_name}</p>}
              </div>
            )}
            {settings?.instructions && (
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">{settings.instructions}</p>
            )}
          </div>

          {/* Step 3 — upload */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl">3 · Upload payment screenshot</h2>

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0] ?? null)} />

            {preview ? (
              <div className="mt-4 relative">
                <img src={preview} alt="Payment screenshot preview" className="w-full max-h-72 object-contain rounded-lg border border-border" />
                <button onClick={() => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-background/90 border border-border" aria-label="Remove screenshot">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()}
                className="mt-4 w-full rounded-lg border border-dashed border-border py-10 grid place-items-center hover:border-primary/50 transition-colors">
                <div className="text-center">
                  <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
                  <p className="text-sm mt-2">Tap to upload screenshot</p>
                  <p className="text-xs text-muted-foreground mt-0.5">JPG / PNG · max 5 MB</p>
                </div>
              </button>
            )}

            <label className="block text-xs uppercase tracking-wider text-muted-foreground mt-5 mb-1">UPI reference / UTR (optional)</label>
            <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. 4183XXXXXX21"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />

            <label className="block text-xs uppercase tracking-wider text-muted-foreground mt-4 mb-1">Note for admin (optional)</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />

            <button onClick={submit} disabled={submitting || !file}
              className="mt-5 w-full rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2">
              <IndianRupee className="w-4 h-4" />
              {submitting ? "Submitting…" : "Submit payment for verification"}
            </button>
          </div>
        </div>

        {requests.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-xl">Your payment history</h2>
            <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card px-5">
              {requests.map((r) => (
                <li key={r.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{r.plan_code} · ₹{(r.amount_paise / 100).toLocaleString("en-IN")}</p>
                    <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}{r.admin_note ? ` · ${r.admin_note}` : ""}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${r.status === "approved" ? "bg-emerald-500/10 text-emerald-600" : r.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-600"}`}>{r.status}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-10">
          Need help? <Link to="/contact" className="text-primary underline">Contact support</Link>.
        </p>
      </section>
      <Footer />
    </div>
  );
}
