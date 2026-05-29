import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Shield, Users, Sparkles, ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import heroImage from "@/assets/hero-wedding.jpg";
import detail1 from "@/assets/wedding-detail-1.jpg";
import detail2 from "@/assets/wedding-detail-2.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Saanjh · ਸਾਂਝ — Trusted Punjabi & Indian Matrimony" },
      {
        name: "description",
        content:
          "Find your life partner on Saanjh — a modern, verified matrimonial platform for Punjabi and Indian families.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* HERO — full-bleed image with glass morphism */}
      <section className="font-sf relative min-h-[92vh] w-full overflow-hidden">
        <img
          src={heroImage}
          alt="Punjabi bride and groom walking through marigold petals at their wedding"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Subtle darkening for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-28 sm:pt-36 pb-16 min-h-[92vh] flex flex-col justify-end">
          {/* Floating "New match" glass chip */}
          <div className="hidden md:flex absolute top-28 right-8 items-center gap-2 px-4 py-3 rounded-2xl backdrop-blur-xl bg-white/15 border border-white/25 shadow-2xl text-white">
            <Heart className="w-4 h-4 fill-white" />
            <span className="text-xs font-medium tracking-tight">New match today</span>
          </div>

          {/* Main glass card */}
          <div className="max-w-2xl rounded-3xl backdrop-blur-2xl bg-white/15 border border-white/25 shadow-2xl p-8 sm:p-10 text-white animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/15 border border-white/25 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs tracking-tight">Trusted by families across Punjab &amp; beyond</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-[-0.04em]">
              Where two<br />
              <span className="italic font-light text-white/95">souls</span> meet.
            </h1>

            <p className="font-gurmukhi text-2xl mt-4 text-white/90">
              ਜਿੱਥੇ ਦੋ ਰੂਹਾਂ ਮਿਲਦੀਆਂ ਹਨ
            </p>

            <p className="mt-6 text-base sm:text-lg text-white/85 max-w-lg leading-relaxed tracking-tight">
              Saanjh is a quiet, dignified place to find a life partner — built for the Punjabi and Indian community.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-foreground font-medium tracking-tight hover:bg-white/90 transition shadow-lg"
              >
                Create Free Profile <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl bg-white/10 border border-white/30 text-white font-medium tracking-tight hover:bg-white/20 transition"
              >
                See Membership Plans
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-3 gap-6">
              <Stat n="10k+" label="Profiles" />
              <Stat n="1,200+" label="Matches" />
              <Stat n="100%" label="Verified" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-surface-alt py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <p className="divider-ornament max-w-xs mx-auto text-xs uppercase tracking-[0.3em]">
              How Saanjh Works
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl mt-6 leading-tight">
              Three quiet steps to <em className="text-primary not-italic">forever</em>.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Step
              n="01"
              title="Create your profile"
              gurmukhi="ਪ੍ਰੋਫਾਈਲ ਬਣਾਓ"
              body="Tell us about you — your background, your values, what you're looking for. Free to start, always."
            />
            <Step
              n="02"
              title="Discover matches"
              gurmukhi="ਜੋੜੀ ਲੱਭੋ"
              body="Browse thoughtfully curated profiles, send interests, and connect with people who match your story."
            />
            <Step
              n="03"
              title="Begin your saanjh"
              gurmukhi="ਨਵੀਂ ਸਾਂਝ"
              body="When both hearts accept, chat opens. Take it slow, take it real. Families welcome."
            />
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <img src={detail2} alt="Sikh couple at gurdwara wedding" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Our promise</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-tight">
              Built on <em className="text-primary not-italic">trust</em>, not algorithms.
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              Every profile is reviewed. Contact details are private. Phone numbers, emails, and social handles are automatically blocked everywhere — in profiles and in chat.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                { icon: Shield, t: "Admin-verified profiles", d: "Every account is manually reviewed before going live." },
                { icon: Users, t: "Family-friendly chat", d: "Match-only conversations, monitored for safety." },
                { icon: Heart, t: "Dignified by design", d: "No swiping, no shouting — just thoughtful connection." },
              ].map((f) => (
                <li key={f.t} className="flex gap-4">
                  <span className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary grid place-items-center">
                    <f.icon className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{f.t}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{f.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="bg-secondary/30 py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Membership</p>
            <h2 className="font-serif text-4xl sm:text-5xl mt-4">Free to begin. Premium when ready.</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: "Free", price: "₹0", tag: "Always", features: ["Limited profiles", "Send interest", "Basic photos"] },
              { name: "7 Days", price: "₹199", tag: "Quick start", features: ["Chat after match", "5 interests/day", "Full photos"], hl: false },
              { name: "1 Month", price: "₹499", tag: "Most popular", features: ["Unlimited chat", "Unlimited interests", "Contact access"], hl: true },
              { name: "6 Months", price: "₹1,999", tag: "Best value", features: ["All premium", "Priority visibility", "Concierge support"] },
            ].map((p) => (
              <div
                key={p.name}
                className={`relative rounded-lg p-6 ${p.hl ? "bg-primary text-primary-foreground shadow-xl" : "bg-card border border-border"}`}
              >
                {p.hl && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] uppercase tracking-wider rounded-full bg-gold text-ink">
                    {p.tag}
                  </span>
                )}
                <p className={`text-xs uppercase tracking-wide ${p.hl ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{p.tag}</p>
                <h3 className="font-serif text-2xl mt-1">{p.name}</h3>
                <p className="font-serif text-4xl mt-3">{p.price}</p>
                <ul className={`mt-5 space-y-2 text-sm ${p.hl ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2"><Check className="w-4 h-4 shrink-0 mt-0.5" /> {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/pricing" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
              View full pricing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 text-center">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <p className="font-gurmukhi text-2xl text-primary">ਆਪਣੀ ਸਾਂਝ ਲੱਭੋ</p>
          <h2 className="font-serif text-5xl sm:text-6xl leading-tight mt-3">
            Your <em className="text-primary not-italic">forever</em> begins today.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Free to register. No commitment. Cancel anytime.
          </p>
          <Link
            to="/signup"
            className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
          >
            Create Free Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p className="font-serif text-3xl text-foreground">{n}</p>
      <p className="text-xs uppercase tracking-wide text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function Step({ n, title, gurmukhi, body }: { n: string; title: string; gurmukhi: string; body: string }) {
  return (
    <div className="relative rounded-lg bg-card border border-border p-8 hover:shadow-lg hover:-translate-y-1 transition">
      <p className="font-serif text-5xl text-primary/30">{n}</p>
      <h3 className="font-serif text-2xl mt-4">{title}</h3>
      <p className="font-gurmukhi text-base text-primary/80 mt-1">{gurmukhi}</p>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{body}</p>
    </div>
  );
}
