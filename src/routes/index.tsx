import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Shield, Users, Sparkles, ArrowRight, Check, UserPlus, Search, MessageCircleHeart, Crown, Star, Zap, Gem, BadgeCheck, HeartHandshake, ShieldCheck, Lock } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import heroImage from "@/assets/hero-punjabi-couple.jpg";
import detail1 from "@/assets/wedding-detail-1.jpg";
import detail2 from "@/assets/wedding-detail-2.jpg";
import profile1 from "@/assets/profile-1.jpg";
import profile2 from "@/assets/profile-2.jpg";
import profile3 from "@/assets/profile-3.jpg";

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

      {/* HERO — full-bleed Punjabi couple, floating stats card */}
      <section className="font-sf relative w-full">
        <div className="relative w-full h-[88vh] min-h-[640px] lg:h-[92vh] overflow-hidden">
          {/* Background image */}
          <img
            src={heroImage}
            alt="A Punjabi couple sharing a quiet moment"
            width={1920}
            height={1280}
            className="absolute inset-0 w-full h-full object-cover object-left animate-ken-burns"
          />
          {/* Soft gradients for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-black/0" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          {/* Right-aligned hero copy */}
          <div className="relative z-10 max-w-7xl mx-auto h-full px-6 sm:px-10 lg:px-16 flex items-center">
            <div className="ml-auto w-full lg:w-[52%]">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/15 border border-white/25 text-white/95 text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase shadow-lg"
              >
                <Heart className="w-3 h-3 fill-primary text-primary" />
                Saanjh · ਸਾਂਝ
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif mt-5 text-white text-[2.6rem] sm:text-6xl lg:text-[5.2rem] leading-[1.02] tracking-[-0.02em] font-semibold"
                style={{ textShadow: "0 2px 30px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.35)" }}
              >
                Where <em className="not-italic bg-gradient-to-r from-[#ffd9a8] via-[#ffb38a] to-primary bg-clip-text text-transparent">two souls</em>
                <br className="hidden sm:block" /> quietly meet.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.7 }}
                className="mt-5 max-w-lg text-white/90 text-base sm:text-lg tracking-tight leading-relaxed"
                style={{ textShadow: "0 1px 12px rgba(0,0,0,0.4)" }}
              >
                A modern matrimonial home for Punjabi & Indian families — verified profiles, private chat, and meaningful matches built on trust.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.7 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-2 pl-7 pr-6 py-4 rounded-full bg-primary text-primary-foreground text-sm font-semibold tracking-tight shadow-[0_18px_45px_-12px_color-mix(in_oklab,var(--color-primary)_70%,transparent)] hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300 animate-pulse-glow"
                >
                  <span>Register Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </Link>
                <Link
                  to="/about"
                  className="text-sm font-semibold text-white/95 hover:text-white tracking-tight underline-offset-4 hover:underline"
                  style={{ textShadow: "0 1px 12px rgba(0,0,0,0.45)" }}
                >
                  How Saanjh works →
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating stats / promise card — overlapping the hero */}
        <div className="relative z-20 max-w-6xl mx-auto px-5 sm:px-8 -mt-20 sm:-mt-24 lg:-mt-32 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[2rem] bg-card/95 backdrop-blur-xl border border-white/60 shadow-[0_30px_80px_-20px_rgba(60,20,30,0.25)] p-7 sm:p-10"
          >
            <div className="mb-7 sm:mb-9">
              <p className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground">
                Trusted by Punjabi families
              </p>
              <h2 className="font-serif mt-2 text-2xl sm:text-3xl lg:text-4xl tracking-tight text-foreground">
                Bringing two souls <span className="text-primary italic">together</span>.
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-7 sm:gap-10">
              {[
                { icon: BadgeCheck, title: "100% Verified Profiles", body: "Every account is manually reviewed — search by community, profession & location." },
                { icon: ShieldCheck, title: "Family-Friendly Privacy", body: "Phone, email & socials are auto-hidden. Share only when both hearts say yes." },
                { icon: Lock, title: "Control Over Your Match", body: "Decide who can view your photos, story and contact — always in your hands." },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.05 + i * 0.12, duration: 0.6 }}
                  className="group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-4 group-hover:scale-105 transition-transform">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-foreground tracking-tight text-base sm:text-[17px]">{f.title}</h3>
                  <div className="mt-2 h-[2px] w-10 bg-gradient-to-r from-primary to-gold rounded-full" />
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col items-center text-center hover:-translate-y-0.5 transition"
    >
      <span className="w-7 h-7 rounded-full bg-white/12 border border-white/20 grid place-items-center text-white/90 mb-2">
        <Icon className="w-3.5 h-3.5" />
      </span>
      <p className="font-serif text-xl sm:text-2xl font-bold tracking-[-0.02em] text-white leading-none">
        <motion.span>{display}</motion.span>
        <span className="text-white/85">{suffix}</span>
      </p>
      <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-white/65 mt-1.5 font-semibold">
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
