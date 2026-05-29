import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import detail2 from "@/assets/wedding-detail-2.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · Saanjh — Our Story" },
      { name: "description", content: "Why Saanjh exists — a modern matrimonial platform built on dignity, trust, and the Punjabi & Indian cultural values that bind families." },
      { property: "og:title", content: "About Saanjh" },
      { property: "og:description", content: "Why Saanjh exists — dignity, trust, and modern matrimony." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <article className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
        <p className="text-xs uppercase tracking-[0.3em] text-primary text-center">About</p>
        <h1 className="font-serif text-5xl sm:text-6xl mt-4 leading-tight text-center">
          The story behind <em className="text-primary not-italic">Saanjh</em>.
        </h1>
        <p className="font-gurmukhi text-xl text-center mt-3 text-primary/80">ਸਾਡੀ ਕਹਾਣੀ</p>

        <div className="my-12 aspect-[16/10] rounded-lg overflow-hidden">
          <img src={detail2} alt="Sikh couple at their wedding" className="w-full h-full object-cover" loading="lazy" />
        </div>

        <div className="prose prose-lg max-w-none text-foreground/85 leading-relaxed space-y-6">
          <p>
            <span className="font-gurmukhi text-2xl text-primary">ਸਾਂਝ</span> means a shared bond — the
            quiet sense of belonging that two people grow into when their lives become one.
            We built Saanjh because we believe finding that bond should feel sacred, not transactional.
          </p>
          <p>
            Today, most matrimony platforms feel either dated or impersonal. Saanjh is neither.
            It's modern, calm, and serious — designed for families who care about culture, but
            want the freedom to browse, message, and connect on their own terms.
          </p>
          <h2 className="font-serif text-3xl mt-12 mb-4">What we promise</h2>
          <ul className="space-y-3 list-disc pl-6">
            <li><strong>Verified profiles only.</strong> Every account is reviewed by our team before going live.</li>
            <li><strong>Privacy by default.</strong> Phone numbers and contact details are visible only after a match and an active premium plan.</li>
            <li><strong>Safe conversations.</strong> All chat is monitored for misuse; contact information is automatically removed.</li>
            <li><strong>No spam, no shouting.</strong> No swiping, no public feeds — just thoughtful one-to-one connection.</li>
          </ul>

          <h2 className="font-serif text-3xl mt-12 mb-4">Made in India, for Indian families</h2>
          <p>
            Saanjh is built with respect for our community — bilingual in Punjabi and English,
            culturally aware, and free to start. Our team is small, our hearts are full, and our
            promise is simple: we work for the families who trust us, not for advertisers.
          </p>
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
          >
            Start your journey
          </Link>
        </div>
      </article>
      <Footer />
    </div>
  );
}
