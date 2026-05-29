import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, ArrowLeft, MapPin, GraduationCap, Briefcase, Flag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ageFromDob, heightLabel, MARITAL_STATUS } from "@/lib/saanjh";
import { getActiveMembership } from "@/lib/membership";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile/$id")({
  head: () => ({ meta: [{ title: "Profile · Saanjh" }] }),
  component: ProfileViewPage,
});

function ProfileViewPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [interestStatus, setInterestStatus] = useState<"none" | "sent" | "matched">("none");
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [p, i, m] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
        supabase.from("interests").select("status").eq("sender_id", user.id).eq("receiver_id", id).maybeSingle(),
        getActiveMembership(user.id),
      ]);
      setProfile(p.data);
      setIsPremium(m.planCode !== "free");
      if (i.data?.status === "accepted") setInterestStatus("matched");
      else if (i.data) setInterestStatus("sent");
      setLoading(false);
    })();
  }, [user, id]);

  const sendInterest = async () => {
    if (!user) return;
    const { error } = await supabase.from("interests").insert({ sender_id: user.id, receiver_id: id });
    if (error) toast.error(error.message); else { setInterestStatus("sent"); toast.success("Interest sent"); }
  };

  const reportUser = async () => {
    if (!user) return;
    const reason = prompt("Why are you reporting this profile?")?.trim();
    if (!reason) return;
    const { error } = await supabase.from("reports").insert({ reporter_id: user.id, reported_id: id, reason: reason.slice(0, 500) });
    if (error) toast.error(error.message); else toast.success("Reported. Our team will review.");
  };

  if (loading) return <p className="text-center py-12 text-muted-foreground">Loading...</p>;
  if (!profile) return <p className="text-center py-12 text-muted-foreground">Profile not found</p>;

  const age = ageFromDob(profile.dob);
  const marital = MARITAL_STATUS.find((m) => m.value === profile.marital_status)?.label;

  return (
    <main className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
      <Link to="/browse" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to browse
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-[4/5] bg-secondary rounded-lg overflow-hidden">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.display_name}
              className={`w-full h-full object-cover ${!isPremium ? "blur-xl scale-110" : ""}`} />
          ) : (
            <div className="w-full h-full grid place-items-center bg-gradient-to-br from-secondary to-rose/20">
              <Heart className="w-16 h-16 text-primary/30" />
            </div>
          )}
        </div>

        <div>
          <h1 className="font-serif text-4xl">{profile.display_name}{age ? `, ${age}` : ""}</h1>
          <ul className="mt-5 space-y-2.5 text-sm text-foreground/80">
            {profile.city && <li className="flex gap-2"><MapPin className="w-4 h-4 text-primary mt-0.5" />{profile.city}{profile.district ? `, ${profile.district}` : ""}</li>}
            {profile.religion && <li className="flex gap-2"><Heart className="w-4 h-4 text-primary mt-0.5" />{profile.religion}{profile.community ? ` · ${profile.community}` : ""}</li>}
            {profile.education && <li className="flex gap-2"><GraduationCap className="w-4 h-4 text-primary mt-0.5" />{profile.education}</li>}
            {profile.occupation && <li className="flex gap-2"><Briefcase className="w-4 h-4 text-primary mt-0.5" />{profile.occupation}</li>}
            {profile.height_cm && <li className="flex gap-2"><span className="w-4 h-4 text-primary text-xs mt-0.5">↕</span>{heightLabel(profile.height_cm)}</li>}
            {marital && <li className="flex gap-2"><span className="w-4 h-4 text-primary text-xs mt-0.5">○</span>{marital}</li>}
          </ul>

          <div className="mt-6 flex gap-3">
            {interestStatus === "matched" ? (
              <Link to="/matches" className="flex-1 px-5 py-3 rounded-md bg-primary text-primary-foreground font-medium text-center hover:opacity-90">
                Matched — view chat
              </Link>
            ) : interestStatus === "sent" ? (
              <button disabled className="flex-1 px-5 py-3 rounded-md bg-secondary text-muted-foreground font-medium">
                Interest sent
              </button>
            ) : (
              <button onClick={sendInterest}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90">
                <Heart className="w-4 h-4" /> Send interest
              </button>
            )}
            <button onClick={reportUser} className="px-4 py-3 rounded-md border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition" title="Report">
              <Flag className="w-4 h-4" />
            </button>
          </div>

          {!isPremium && (
            <Link to="/membership" className="mt-3 block text-center text-xs text-primary hover:underline">
              Upgrade to see full photos and contact details
            </Link>
          )}
        </div>
      </div>

      {profile.about_me && (
        <section className="mt-10 bg-card border border-border rounded-lg p-6">
          <h2 className="font-serif text-xl mb-3">About</h2>
          <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap">{profile.about_me}</p>
        </section>
      )}
      {profile.partner_preference && (
        <section className="mt-5 bg-card border border-border rounded-lg p-6">
          <h2 className="font-serif text-xl mb-3">Looking for</h2>
          <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap">{profile.partner_preference}</p>
        </section>
      )}
    </main>
  );
}
