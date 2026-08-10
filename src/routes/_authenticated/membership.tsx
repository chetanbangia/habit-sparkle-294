import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Clock, Crown, IndianRupee, QrCode, Upload, X } from "lucide-react";
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
  const [settings, setSettings] = useState<any>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("month");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const [p, m, s, r] = await Promise.all([
      supabase.from("plans").select("*").eq("active", true).neq("code", "free").order("sort_order"),
      getActiveMembership(user.id),
      supabase.from("payment_settings").select("*").maybeSingle(),
      supabase.from("payment_requests").select("*").order("created_at", { ascending: false }).limit(10),
    ]);
    setPlans(p.data || []);
    setCurrent(m);
    setSettings(s.data || null);
    setRequests(r.data || []);
    if (s.data?.qr_path) {
      const { data: signed } = await supabase.storage.from("payment-proofs").createSignedUrl(s.data.qr_path, 3600);
      setQrUrl(signed?.signedUrl ?? null);
    } else {
      setQrUrl(null);
    }
  }, [user]);

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
    if (!user || !activePlan) return;
    if (!file) return toast.error("Payment screenshot is required");
    setSubmitting(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("payment-proofs")
        .upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) throw upErr;

      const { error } = await supabase.from("payment_requests").insert({
        user_id: user.id,
        plan_code: activePlan.code,
        amount_paise: activePlan.price_paise,
        screenshot_path: path,
        reference_no: reference.trim() || null,
        note: note.trim() || null,
        status: "pending",
      });
      if (error) throw error;

      toast.success("Payment submitted — membership activates after admin verification.");
      setFile(null); setPreview(null); setReference(""); setNote("");
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch (err: any) {
      toast.error(err.message || "Could not submit payment");
    } finally {
      setSubmitting(false);
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

      {pendingReq && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-gold/40 bg-gold/10 p-4">
          <Clock className="w-5 h-5 text-gold mt-0.5" />
          <div>
            <p className="text-sm font-medium">Payment under verification</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {pendingReq.plan_code} · {formatINR(pendingReq.amount_paise)} submitted on {new Date(pendingReq.created_at).toLocaleString()}.
            </p>
          </div>
        </div>
      )}

      {/* Step 1 — plan */}
      <h2 className="font-serif text-2xl mt-10">1 · Choose your plan</h2>
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        {plans.map((p) => {
          const isSelected = activePlan?.code === p.code;
          const isCurrent = current?.planCode === p.code;
          return (
            <button
              key={p.code}
              onClick={() => setSelected(p.code)}
              className={`text-left rounded-lg p-6 border transition-colors ${isSelected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl">{p.name}</h3>
                {isSelected && <Check className="w-4 h-4 text-primary" />}
              </div>
              <p className="font-serif text-4xl mt-3">{formatINR(p.price_paise)}</p>
              <p className="text-xs text-muted-foreground">{p.duration_days} days{isCurrent ? " · current plan" : ""}</p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {p.features?.chat && <li className="flex gap-2"><Check className="w-4 h-4" /> Chat with matches</li>}
                {p.features?.contact && <li className="flex gap-2"><Check className="w-4 h-4" /> Contact access</li>}
                {p.features?.full_photos && <li className="flex gap-2"><Check className="w-4 h-4" /> Full photos</li>}
                {p.features?.interests_per_day === -1 && <li className="flex gap-2"><Check className="w-4 h-4" /> Unlimited interests</li>}
                {p.features?.priority && <li className="flex gap-2"><Check className="w-4 h-4" /> Priority visibility</li>}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        {/* Step 2 — pay */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-serif text-2xl">
            2 · Pay {activePlan ? formatINR(activePlan.price_paise) : "—"}
          </h2>
          <div className="mt-4 grid place-items-center">
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="UPI payment QR code for Saanjh membership"
                className="w-56 h-56 object-contain rounded-lg border border-border bg-white p-2"
              />
            ) : (
              <div className="w-56 h-56 grid place-items-center rounded-lg border border-dashed border-border text-center px-4">
                <div>
                  <QrCode className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground mt-2">QR is being set up. Please use the UPI ID or contact support.</p>
                </div>
              </div>
            )}
          </div>

          {settings?.upi_id && (
            <div className="mt-4 rounded-md bg-secondary/50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">UPI ID</p>
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{settings.upi_id}</p>
                <button
                  onClick={() => { navigator.clipboard.writeText(settings.upi_id); toast.success("UPI ID copied"); }}
                  className="text-xs px-2 py-1 rounded-md border border-border"
                >
                  Copy
                </button>
              </div>
              {settings.payee_name && <p className="text-xs text-muted-foreground mt-1">{settings.payee_name}</p>}
            </div>
          )}

          {settings?.instructions && (
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">{settings.instructions}</p>
          )}
        </section>

        {/* Step 3 — upload */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-serif text-2xl">3 · Upload payment screenshot</h2>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0] ?? null)} />

          {preview ? (
            <div className="mt-4 relative">
              <img src={preview} alt="Payment screenshot preview" className="w-full max-h-72 object-contain rounded-md border border-border" />
              <button
                onClick={() => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-background/90 border border-border"
                aria-label="Remove screenshot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-4 w-full rounded-md border border-dashed border-border py-10 grid place-items-center hover:border-primary/50 transition-colors"
            >
              <div className="text-center">
                <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
                <p className="text-sm mt-2">Tap to upload screenshot</p>
                <p className="text-xs text-muted-foreground mt-0.5">JPG / PNG · max 5 MB</p>
              </div>
            </button>
          )}

          <label className="block text-xs uppercase tracking-wider text-muted-foreground mt-5 mb-1">UPI reference / UTR (optional)</label>
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. 4183XXXXXX21"
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <label className="block text-xs uppercase tracking-wider text-muted-foreground mt-4 mb-1">Note for admin (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <button
            onClick={submit}
            disabled={submitting || !file}
            className="mt-5 w-full rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            <IndianRupee className="w-4 h-4" />
            {submitting ? "Submitting…" : "Submit payment for verification"}
          </button>
        </section>
      </div>

      {requests.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl">Your payment history</h2>
          <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-card px-5">
            {requests.map((r) => (
              <li key={r.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{r.plan_code} · {formatINR(r.amount_paise)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}{r.admin_note ? ` · ${r.admin_note}` : ""}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    r.status === "approved"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : r.status === "rejected"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-gold/15 text-gold"
                  }`}
                >
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
