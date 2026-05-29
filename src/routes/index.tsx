import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Shield, Users, Sparkles, ArrowRight, Check, UserPlus, Search, MessageCircleHeart, Crown, Star, Zap, Gem, BadgeCheck, HeartHandshake } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
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

      {/* HERO — floating glass card, centered, premium */}
      <section className="font-sf relative min-h-[100vh] w-full overflow-hidden flex items-center justify-center px-4 sm:px-6 py-24 sm:py-8">
        {/* Background image with slow ken-burns */}
        <img
          src={heroImage}
          alt="Punjabi bride and groom walking through marigold petals at their wedding"
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
        />
        {/* Romantic vignette */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-primary/20 to-black/55" />

        {/* Floating decorative orbs */}
        <div className="hidden md:block absolute top-24 left-16 w-40 h-40 rounded-full bg-primary/40 blur-3xl animate-float-slow" />
        <div className="hidden md:block absolute bottom-24 right-16 w-52 h-52 rounded-full bg-gold/25 blur-3xl animate-float-medium" />
        <div className="hidden md:block absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-white/10 blur-2xl animate-float-tilt" />

        {/* Floating curved glass card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-6xl mx-auto rounded-[2.5rem] backdrop-blur-2xl bg-white/12 border border-white/25 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] overflow-hidden"
        >
          {/* Inner gradient sheen */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-primary/10 pointer-events-none" />

          <div className="relative grid lg:grid-cols-12 gap-10 lg:gap-8 items-center px-6 sm:px-12 py-12 sm:py-16">
            {/* LEFT — copy */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.7 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/15 border border-white/30 mb-6"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-xs tracking-tight text-white/95">Trusted by families across Punjab &amp; beyond</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.02] tracking-[-0.03em]"
              >
                <span className="bg-gradient-to-br from-white via-white to-[#ffd6df] bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(255,200,210,0.25)]">
                  Where two{" "}
                  <em className="italic font-light bg-gradient-to-br from-[#ffe1e8] via-[#ffc9d4] to-[#ff9fb5] bg-clip-text text-transparent">
                    souls
                  </em>{" "}
                  meet.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="font-gurmukhi text-2xl sm:text-3xl mt-5 text-white/90"
              >
                ਜਿੱਥੇ ਦੋ ਰੂਹਾਂ ਮਿਲਦੀਆਂ ਹਨ
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75, duration: 0.7 }}
                className="mt-6 text-base sm:text-lg text-white/85 leading-relaxed tracking-tight max-w-xl mx-auto lg:mx-0"
              >
                Saanjh is a quiet, dignified place to find a life partner — built for the Punjabi and Indian community.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.7 }}
                className="mt-9 flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                <Link
                  to="/signup"
                  className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-foreground font-semibold tracking-tight shadow-[0_10px_40px_-10px_rgba(255,255,255,0.6)] hover:shadow-[0_15px_50px_-5px_rgba(255,200,210,0.8)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white via-[#ffe9ee] to-white opacity-0 group-hover:opacity-100 transition" />
                  <span className="relative">Create Free Profile</span>
                  <ArrowRight className="relative w-4 h-4 group-hover:translate-x-0.5 transition" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/40 text-white font-semibold tracking-tight hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
                >
                  See Membership Plans
                </Link>
              </motion.div>
            </div>

            {/* RIGHT — luxury stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 grid grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-5 lg:pl-6 lg:border-l lg:border-white/20"
            >
              <StatCard icon={Users} value={10000} suffix="k+" displayDivisor={1000} label="Profiles" delay={0.9} />
              <StatCard icon={HeartHandshake} value={1200} suffix="+" label="Matches" delay={1.05} />
              <StatCard icon={BadgeCheck} value={100} suffix="%" label="Verified" delay={1.2} />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="font-sf bg-gradient-to-b from-background to-surface-alt py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold tracking-tight uppercase">How Saanjh Works</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.04em] leading-[1.05]">
              Three quiet steps to <span className="text-primary">forever</span>.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto tracking-tight">
              From profile to proposal — guided, private, and built around your family.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 perspective-1000">
            <Step
              n="01"
              icon={UserPlus}
              title="Create your profile"
              gurmukhi="ਪ੍ਰੋਫਾਈਲ ਬਣਾਓ"
              body="Tell us about you — your background, your values, what you're looking for. Free to start, always."
            />
            <Step
              n="02"
              icon={Search}
              title="Discover matches"
              gurmukhi="ਜੋੜੀ ਲੱਭੋ"
              body="Browse thoughtfully curated profiles, send interests, and connect with people who match your story."
              highlight
            />
            <Step
              n="03"
              icon={MessageCircleHeart}
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
      <section className="font-sf bg-gradient-to-b from-secondary/20 to-secondary/40 py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-5">
              <Crown className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold tracking-tight uppercase">Membership Plans</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.04em] leading-[1.05]">
              Free to begin. <span className="text-primary">Premium</span> when ready.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto tracking-tight">
              Honest pricing. No hidden fees. Cancel anytime.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 perspective-1000">
            {[
              { name: "Free", price: "₹0", tag: "Always", icon: Heart, features: ["Limited profiles", "Send interest", "Basic photos"] },
              { name: "7 Days", price: "₹199", tag: "Quick Start", icon: Zap, features: ["Chat after match", "5 interests/day", "Full photos"] },
              { name: "1 Month", price: "₹499", tag: "Most Popular", icon: Star, features: ["Unlimited chat", "Unlimited interests", "Contact access"], hl: true },
              { name: "6 Months", price: "₹1,999", tag: "Best Value", icon: Gem, features: ["All premium", "Priority visibility", "Concierge support"] },
            ].map((p) => (
              <div
                key={p.name}
                className={`tilt-3d relative rounded-2xl p-7 ${
                  p.hl
                    ? "bg-gradient-to-br from-primary to-primary/85 text-primary-foreground shadow-2xl shadow-primary/30 ring-1 ring-primary/40"
                    : "bg-card border border-border/60 shadow-sm hover:shadow-lg"
                }`}
              >
                {p.hl && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gold text-ink shadow">
                    {p.tag}
                  </span>
                )}
                <div className={`w-11 h-11 rounded-xl grid place-items-center mb-5 ${
                  p.hl ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                }`}>
                  <p.icon className="w-5 h-5" />
                </div>
                <p className={`text-[11px] font-semibold uppercase tracking-wider ${p.hl ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{p.tag}</p>
                <h3 className="text-xl font-semibold mt-1 tracking-tight">{p.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-[-0.03em]">{p.price}</span>
                </div>
                <ul className={`mt-6 space-y-3 text-sm ${p.hl ? "text-primary-foreground/95" : "text-foreground/80"}`}>
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2 items-start">
                      <span className={`shrink-0 mt-0.5 w-4 h-4 rounded-full grid place-items-center ${
                        p.hl ? "bg-white/25" : "bg-primary/15 text-primary"
                      }`}>
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/pricing"
                  className={`mt-7 inline-flex w-full items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold tracking-tight transition ${
                    p.hl
                      ? "bg-white text-primary hover:bg-white/90"
                      : "bg-foreground/5 text-foreground hover:bg-foreground/10"
                  }`}
                >
                  Choose plan <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/pricing" className="text-primary font-semibold tracking-tight inline-flex items-center gap-1.5 hover:gap-2 transition-all">
              Compare all features <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="font-sf relative py-28 overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/85 text-primary-foreground">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md mb-6">
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span className="text-xs font-semibold tracking-tight uppercase">Join 10,000+ families</span>
          </div>
          <p className="font-gurmukhi text-2xl text-white/90 mb-3">ਆਪਣੀ ਸਾਂਝ ਲੱਭੋ</p>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[1.02]">
            Your <span className="italic font-light">forever</span><br />begins today.
          </h2>
          <p className="mt-6 text-lg text-white/85 tracking-tight">
            Free to register. No commitment. Cancel anytime.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-primary font-semibold tracking-tight hover:bg-white/90 transition shadow-xl"
            >
              Create Free Profile <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold tracking-tight hover:bg-white/20 transition"
            >
              View Plans
            </Link>
          </div>
          <div className="mt-10 flex items-center justify-center gap-6 text-white/80 text-xs">
            <span className="inline-flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Verified profiles</span>
            <span className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> 1,200+ matches</span>
            <span className="inline-flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> 4.8 rating</span>
          </div>
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

function StatCard({
  icon: Icon,
  value,
  suffix = "",
  displayDivisor,
  label,
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix?: string;
  displayDivisor?: number;
  label: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const spring = useSpring(count, { damping: 30, stiffness: 60 });
  const display = useTransform(spring, (latest) => {
    const v = displayDivisor ? latest / displayDivisor : latest;
    return displayDivisor
      ? Math.round(v).toLocaleString()
      : Math.round(v).toLocaleString();
  });

  useEffect(() => {
    if (inView) count.set(value);
  }, [inView, value, count]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 p-4 sm:p-5 text-center lg:text-left hover:bg-white/15 transition"
    >
      <div className="flex items-center justify-center lg:justify-start mb-2 sm:mb-3">
        <span className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 grid place-items-center text-white animate-float-tilt">
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] text-white leading-none">
        <motion.span>{display}</motion.span>
        <span className="text-white/85">{suffix}</span>
      </p>
      <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70 mt-2 font-semibold">
        {label}
      </p>
    </motion.div>
  );
}

function Step({ n, icon: Icon, title, gurmukhi, body, highlight }: { n: string; icon: React.ComponentType<{ className?: string }>; title: string; gurmukhi: string; body: string; highlight?: boolean }) {
  return (
    <div className={`tilt-3d group relative rounded-2xl p-8 ${
      highlight
        ? "bg-gradient-to-br from-primary/8 to-primary/3 border border-primary/30 shadow-lg shadow-primary/10"
        : "bg-card border border-border/60 hover:shadow-xl hover:border-primary/20"
    }`}>
      <div className="flex items-start justify-between mb-6">
        <div className={`w-12 h-12 rounded-xl grid place-items-center ${
          highlight ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition"
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold tracking-widest text-muted-foreground/60">{n}</span>
      </div>
      <h3 className="text-xl font-bold tracking-tight">{title}</h3>
      <p className="font-gurmukhi text-sm text-primary/80 mt-1">{gurmukhi}</p>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed tracking-tight">{body}</p>
    </div>
  );
}
