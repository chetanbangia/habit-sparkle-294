import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { sanitizeText } from "@/lib/sanitize";
import { RELIGIONS, MARITAL_STATUS, GENDERS, ageFromDob } from "@/lib/saanjh";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "My Profile · Saanjh" }] }),
  component: ProfileEditPage,
});

interface ProfileForm {
  display_name: string;
  dob: string;
  gender: string;
  city: string;
  district: string;
  religion: string;
  community: string;
  education: string;
  occupation: string;
  height_cm: string;
  marital_status: string;
  about_me: string;
  partner_preference: string;
}

const EMPTY: ProfileForm = {
  display_name: "", dob: "", gender: "", city: "", district: "", religion: "",
  community: "", education: "", occupation: "", height_cm: "",
  marital_status: "", about_me: "", partner_preference: "",
};

function ProfileEditPage() {
  const { user } = useAuth();
  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) {
        setForm({
          display_name: data.display_name || "",
          dob: data.dob || "",
          gender: data.gender || "",
          city: data.city || "",
          district: data.district || "",
          religion: data.religion || "",
          community: data.community || "",
          education: data.education || "",
          occupation: data.occupation || "",
          height_cm: data.height_cm?.toString() || "",
          marital_status: data.marital_status || "",
          about_me: data.about_me || "",
          partner_preference: data.partner_preference || "",
        });
        setAvatarUrl(data.avatar_url || null);
      }
      setLoading(false);
    })();
  }, [user]);

  const upd = <K extends keyof ProfileForm>(k: K, v: ProfileForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const aboutClean = sanitizeText(form.about_me);
      const prefClean = sanitizeText(form.partner_preference);
      if (aboutClean.hadViolations || prefClean.hadViolations) {
        toast.warning(`Removed contact info from your text: ${[...aboutClean.violations, ...prefClean.violations].join(", ")}`);
      }

      const payload: any = {
        id: user.id,
        display_name: form.display_name.trim().slice(0, 80) || null,
        dob: form.dob || null,
        gender: form.gender || null,
        city: form.city.trim().slice(0, 60) || null,
        district: form.district.trim().slice(0, 60) || null,
        religion: form.religion || null,
        community: form.community.trim().slice(0, 60) || null,
        education: form.education.trim().slice(0, 120) || null,
        occupation: form.occupation.trim().slice(0, 120) || null,
        height_cm: form.height_cm ? parseInt(form.height_cm) : null,
        marital_status: form.marital_status || null,
        about_me: aboutClean.cleaned.slice(0, 2000) || null,
        partner_preference: prefClean.cleaned.slice(0, 2000) || null,
      };
      const { error } = await supabase.from("profiles").upsert(payload);
      if (error) throw error;
      toast.success("Profile saved. Awaiting admin approval before going live.");
    } catch (err: any) {
      toast.error(err.message || "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("profile-photos").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("profile-photos").createSignedUrl
        ? await supabase.storage.from("profile-photos").createSignedUrl(path, 60 * 60 * 24 * 365)
        : { data: null };
      const publicUrl = urlData?.signedUrl || supabase.storage.from("profile-photos").getPublicUrl(path).data.publicUrl;
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
      setAvatarUrl(publicUrl);
      toast.success("Photo uploaded");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="text-center py-12 text-muted-foreground">Loading...</p>;

  const age = ageFromDob(form.dob);

  return (
    <main className="max-w-3xl mx-auto px-5 sm:px-8 py-8 space-y-8">
      <div>
        <h1 className="font-serif text-4xl">My Profile</h1>
        <p className="font-gurmukhi text-base text-primary/80 mt-1">ਮੇਰਾ ਪ੍ਰੋਫਾਈਲ</p>
        <p className="text-sm text-muted-foreground mt-2">
          Complete your profile to be visible. All photos and details are reviewed before going live.
        </p>
      </div>

      {/* Photo */}
      <section className="bg-card border border-border rounded-lg p-6">
        <h2 className="font-serif text-xl mb-4">Profile photo</h2>
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary grid place-items-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Upload className="w-7 h-7 text-muted-foreground" />
            )}
          </div>
          <label className="cursor-pointer px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            {uploading ? "Uploading..." : "Upload photo"}
            <input type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
              disabled={uploading} />
          </label>
        </div>
      </section>

      {/* Basics */}
      <section className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="font-serif text-xl">Basics</h2>
        <Field label="Name">
          <input value={form.display_name} onChange={(e) => upd("display_name", e.target.value)} maxLength={80} className={inp} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={`Date of birth${age ? ` (age ${age})` : ""}`}>
            <input type="date" value={form.dob} onChange={(e) => upd("dob", e.target.value)} className={inp} />
          </Field>
          <Field label="Gender">
            <select value={form.gender} onChange={(e) => upd("gender", e.target.value)} className={inp}>
              <option value="">Select</option>
              {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </Field>
          <Field label="City">
            <input value={form.city} onChange={(e) => upd("city", e.target.value)} maxLength={60} className={inp} />
          </Field>
          <Field label="District / State">
            <input value={form.district} onChange={(e) => upd("district", e.target.value)} maxLength={60} className={inp} />
          </Field>
          <Field label="Height (cm)">
            <input type="number" min={120} max={230} value={form.height_cm} onChange={(e) => upd("height_cm", e.target.value)} className={inp} />
          </Field>
          <Field label="Marital status">
            <select value={form.marital_status} onChange={(e) => upd("marital_status", e.target.value)} className={inp}>
              <option value="">Select</option>
              {MARITAL_STATUS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </Field>
        </div>
      </section>

      {/* Background */}
      <section className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="font-serif text-xl">Background</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Religion (optional)">
            <select value={form.religion} onChange={(e) => upd("religion", e.target.value)} className={inp}>
              <option value="">Prefer not to say</option>
              {RELIGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Community (optional)">
            <input value={form.community} onChange={(e) => upd("community", e.target.value)} maxLength={60} className={inp} />
          </Field>
          <Field label="Education">
            <input value={form.education} onChange={(e) => upd("education", e.target.value)} maxLength={120} className={inp} />
          </Field>
          <Field label="Occupation">
            <input value={form.occupation} onChange={(e) => upd("occupation", e.target.value)} maxLength={120} className={inp} />
          </Field>
        </div>
      </section>

      {/* Story */}
      <section className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="font-serif text-xl">Your story</h2>
        <p className="text-xs text-muted-foreground -mt-2">
          Phone numbers, emails, links, and social handles are automatically removed.
        </p>
        <Field label="About me">
          <textarea value={form.about_me} onChange={(e) => upd("about_me", e.target.value)} rows={5} maxLength={2000} className={inp + " resize-none"} />
        </Field>
        <Field label="Partner preference">
          <textarea value={form.partner_preference} onChange={(e) => upd("partner_preference", e.target.value)} rows={4} maxLength={2000} className={inp + " resize-none"} />
        </Field>
      </section>

      <button onClick={save} disabled={saving}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50">
        {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save profile</>}
      </button>
    </main>
  );
}

const inp = "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground/80">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
