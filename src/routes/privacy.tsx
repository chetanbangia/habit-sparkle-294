import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy · Saanjh" },
      { name: "description", content: "How Saanjh collects, uses, and protects your personal information." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <article className="max-w-3xl mx-auto px-5 sm:px-8 py-20 prose prose-lg">
        <h1 className="font-serif text-5xl">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="mt-10 space-y-6 text-foreground/85 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl">What we collect</h2>
            <p>When you create a Saanjh profile, we collect: your name, date of birth, gender, city, religion (optional), education, occupation, height, marital status, your "about me" text, partner preferences, photos, and email address. If you sign in with Google, we receive your basic profile information.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">How we use it</h2>
            <p>Your information is used to display your profile to other Saanjh members, suggest matches, and allow communication. We never sell your data to third parties. We never use your data for advertising outside Saanjh.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Who can see your data</h2>
            <p>Only logged-in Saanjh members can browse approved profiles. Free users see blurred photos and limited details. Premium users can see full profiles and contact details only after a mutual match. Phone numbers are never shared until both parties have a match and an active premium plan.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Security</h2>
            <p>All data is stored on encrypted servers. Passwords are hashed. Photos are stored in private cloud storage and served with signed URLs. We use industry-standard security practices but no system is 100% secure.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Your rights</h2>
            <p>You can edit your profile, hide it, or delete it at any time. To delete your account entirely, contact care@saanjh.in. We remove all personal data within 30 days of a delete request.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Contact</h2>
            <p>Questions about privacy: care@saanjh.in</p>
          </section>
        </div>
      </article>
      <Footer />
    </div>
  );
}
