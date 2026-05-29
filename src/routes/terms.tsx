import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions · Saanjh" },
      { name: "description", content: "Saanjh terms of service — your agreement when using our matrimonial platform." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <article className="max-w-3xl mx-auto px-5 sm:px-8 py-20 prose prose-lg">
        <h1 className="font-serif text-5xl">Terms &amp; Conditions</h1>
        <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="mt-10 space-y-6 text-foreground/85 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl">Eligibility</h2>
            <p>You must be at least 18 years of age (women) or 21 years (men) — as per Indian marriage law — to register on Saanjh. You must be legally single (never married, divorced, or widowed). Saanjh is intended for individuals seeking marriage, not casual relationships.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Honest information</h2>
            <p>You agree to provide truthful, accurate information about yourself. Photos must be of you. Fake or misleading profiles will be deleted without refund. Sharing someone else's photos or impersonating another person is strictly prohibited.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Conduct</h2>
            <p>You agree not to share phone numbers, email addresses, social handles, or external links in your profile or chat — these are automatically filtered. Harassment, abuse, threats, or discriminatory language toward other members will result in immediate ban without refund.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Memberships &amp; refunds</h2>
            <p>Premium memberships are non-refundable once activated. Plans automatically expire at the end of the paid period; we do not auto-renew. If your account is banned for violating these terms, you forfeit any remaining premium time.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Liability</h2>
            <p>Saanjh is a platform that facilitates introductions; we do not vet the long-term suitability of any match. Decisions you make based on interactions on Saanjh are your own responsibility. Always meet in safe, public places and involve your family.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Changes</h2>
            <p>We may update these terms occasionally. Continued use after changes means you accept them.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Governing law</h2>
            <p>These terms are governed by the laws of India. Disputes will be resolved in the courts of Amritsar, Punjab.</p>
          </section>
        </div>
      </article>
      <Footer />
    </div>
  );
}
