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

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-20 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/60 border border-primary/15 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs tracking-wide text-foreground/70">
                Trusted by families across Punjab &amp; beyond
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-foreground">
              Where two<br />
              <em className="text-primary not-italic">souls</em> meet.
            </h1>

            <p className="font-gurmukhi text-2xl mt-4 text-primary/90">
              ਜਿੱਥੇ ਦੋ ਰੂਹਾਂ ਮਿਲਦੀਆਂ ਹਨ
            </p>

            <p className="mt-8 text-lg text-muted-foreground max-w-lg leading-relaxed">
              Saanjh is a quiet, dignified place to find a life partner — built for the Punjabi and Indian community, free to begin, premium when you're ready.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
              >
                Create Free Profile <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md border border-primary/30 text-foreground font-medium hover:bg-primary/5 transition"
              >
                See Membership Plans
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <Stat n="10k+" label="Profiles" />
              <Stat n="1,200+" label="Matches" />
              <Stat n="100%" label="Verified" />
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-2xl shadow-primary/20">
              <img
                src={heroImage}
                alt="Punjabi bride and groom walking through marigold petals at their wedding"
                className="w-full h-full object-cover"
                width={1600}
                height={1200}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
            </div>
            <div className="hidden md:block absolute -bottom-8 -left-8 w-44 h-44 rounded-lg overflow-hidden shadow-xl border-4 border-background">
              <img src={detail1} alt="Bride's mehndi hands" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="hidden md:flex absolute -top-6 -right-6 w-32 px-4 py-3 rounded-md bg-background shadow-xl border border-border items-center gap-2">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span className="text-xs font-medium">New match today</span>
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
