import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, GraduationCap, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ageFromDob } from "@/lib/saanjh";
import { getActiveMembership, type ActiveMembership } from "@/lib/membership";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/browse")({
  head: () => ({ meta: [{ title: "Browse Profiles · Saanjh" }] }),
  component: BrowsePage,
});

interface ProfileRow {
  id: string;
  display_name: string | null;
  dob: string | null;
  city: string | null;
  religion: string | null;
  education: string | null;
  occupation: string | null;
  marital_status: string | null;
  avatar_url: string | null;
}

const FREE_LIMIT = 10;

function BrowsePage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState<ActiveMembership | null>(null);
  const [filters, setFilters] = useState({ city: "", religion: "", marital: "" });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const m = await getActiveMembership(user.id);
      setMembership(m);

      let q = supabase
        .from("profiles")
        .select("id, display_name, dob, city, religion, education, occupation, marital_status, avatar_url")
        .eq("status", "approved")
        .neq("id", user.id)
        .order("created_at", { ascending: false });

      if (filters.city) q = q.ilike("city", `%${filters.city}%`);
      if (filters.religion) q = q.eq("religion", filters.religion);
      if (filters.marital) q = q.eq("marital_status", filters.marital as any);

      const limit = m.planCode === "free" ? FREE_LIMIT : 100;
      const { data, error } = await q.limit(limit);
      if (error) toast.error(error.message);
      setProfiles((data || []) as ProfileRow[]);
      setLoading(false);
    })();
  }, [user, filters]);

  const isFree = membership?.planCode === "free";

  return (
    <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-4xl">Discover</h1>
          <p className="font-gurmukhi text-base text-primary/80 mt-1">ਪ੍ਰੋਫਾਈਲ ਵੇਖੋ</p>
        </div>
        {isFree && (
          <Link to="/membership" className="text-sm px-4 py-2 rounded-md bg-gold/90 text-ink font-medium hover:opacity-90">
            Free tier: {FREE_LIMIT} profiles/day · Upgrade
          </Link>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-8 p-4 bg-secondary/30 rounded-lg">
        <input
          placeholder="City" value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          maxLength={60}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <select value={filters.religion} onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">Any religion</option>
          {["Sikh", "Hindu", "Muslim", "Christian", "Jain", "Buddhist", "Other"].map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={filters.marital} onChange={(e) => setFilters({ ...filters, marital: e.target.value })}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">Any marital status</option>
          <option value="never_married">Never married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center py-12">Loading profiles...</p>
      ) : profiles.length === 0 ? (
        <div className="text-center py-16 bg-secondary/20 rounded-lg">
          <p className="font-serif text-2xl">No profiles match your filters yet.</p>
          <p className="text-muted-foreground mt-2">Try widening your search or check back soon.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {profiles.map((p) => {
            const age = ageFromDob(p.dob);
            return (
              <Link key={p.id} to="/profile/$id" params={{ id: p.id }}
                className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition">
                <div className="aspect-[4/5] bg-secondary relative overflow-hidden">
                  {p.avatar_url ? (
                    <img src={p.avatar_url} alt={p.display_name || "Profile"}
                      className={`w-full h-full object-cover ${isFree ? "blur-xl scale-110" : "group-hover:scale-105 transition-transform duration-700"}`} />
                  ) : (
                    <div className="w-full h-full grid place-items-center bg-gradient-to-br from-secondary to-rose/20">
                      <Heart className="w-12 h-12 text-primary/30" />
                    </div>
                  )}
                  {isFree && (
                    <div className="absolute inset-0 bg-foreground/10 grid place-items-center">
                      <span className="text-xs bg-card/90 px-3 py-1 rounded-full text-foreground font-medium">Premium to view</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg">
                    {p.display_name || "Saanjh member"}{age ? `, ${age}` : ""}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {p.city || "—"}
                    {p.religion && <span className="text-primary/60">· {p.religion}</span>}
                  </p>
                  {p.occupation && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> {p.occupation}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
