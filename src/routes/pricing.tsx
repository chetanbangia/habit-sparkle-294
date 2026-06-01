import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Membership Plans · Saanjh" },
      { name: "description", content: "Choose from Free, Basic, Bronze and Gold matrimonial membership plans. Transparent pricing in Indian Rupees." },
      { property: "og:title", content: "Saanjh Membership Plans" },
      { property: "og:description", content: "Free, ₹199, ₹499, ₹1999 — transparent matrimonial pricing." },
    ],
  }),
  component: PricingPage,
});

type Plan = {
  name: string;
  price: string;
  perMonth?: string;
  duration: string;
  tagline: string;
  popular?: boolean;
  best?: boolean;
  features: { label: string; included: boolean }[];
  cta: string;
  href: string;
};

const PLANS: Plan[] = [
  {
    name: "Free",
    price: "₹0",
    duration: "Forever",
    tagline: "Get started, no card required",
    cta: "Get Started",
    href: "/signup",
    features: [
      { label: "View limited profiles", included: true },
      { label: "3 interests per day", included: true },
      { label: "Blurred photos", included: true },
      { label: "Chat with matches", included: false },
      { label: "Contact access", included: false },
      { label: "Priority visibility", included: false },
    ],
  },
  {
    name: "Basic",
    price: "₹199",
    duration: "7 days",
    tagline: "Try premium for a week",
    cta: "Choose Basic",
    href: "/membership",
    features: [
      { label: "View all profiles", included: true },
      { label: "5 interests per day", included: true },
      { label: "Full photos", included: true },
      { label: "Chat with matches", included: true },
      { label: "Contact access", included: false },
      { label: "Priority visibility", included: false },
    ],
  },
  {
    name: "Bronze",
    price: "₹499",
    duration: "30 days",
    perMonth: "₹16/day",
    tagline: "Most chosen by members",
    popular: true,
    cta: "Choose Bronze",
    href: "/membership",
    features: [
      { label: "View all profiles", included: true },
      { label: "Unlimited interests", included: true },
      { label: "Full photos", included: true },
      { label: "Chat with matches", included: true },
      { label: "Contact access", included: true },
      { label: "Priority visibility", included: false },
    ],
  },
  {
    name: "Gold",
    price: "₹1,999",
    duration: "6 months",
    perMonth: "₹11/day",
    tagline: "Best value, longest validity",
    best: true,
    cta: "Choose Gold",
    href: "/membership",
    features: [
      { label: "View all profiles", included: true },
      { label: "Unlimited interests", included: true },
      { label: "Full photos", included: true },
      { label: "Chat with matches", included: true },
      { label: "Contact access", included: true },
      { label: "Priority visibility", included: true },
    ],
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary font-medium">Membership Plans</p>
          <h1 className="text-4xl sm:text-5xl mt-3 leading-[1.05] tracking-tight">
            Find your match, <span className="text-primary">faster</span>.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-4">
            Transparent pricing. No auto-renewals. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {PLANS.map((p) => {
            const highlight = p.popular || p.best;
            return (
              <div
                key={p.name}
                className={[
                  "relative flex flex-col rounded-xl bg-card border",
                  highlight ? "border-primary shadow-[0_6px_30px_-12px_rgba(181,84,106,0.35)]" : "border-border",
                ].join(" ")}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-[10px] uppercase tracking-wider rounded-full bg-primary text-primary-foreground font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                {p.best && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-[10px] uppercase tracking-wider rounded-full bg-gold text-ink font-semibold">
                      Best Value
                    </span>
                  </div>
                )}

                <div className="p-6 border-b border-border">
                  <h3 className="text-xl font-semibold tracking-tight">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 min-h-[16px]">{p.tagline}</p>
                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="text-4xl font-semibold tracking-tight">{p.price}</span>
                    <span className="text-sm text-muted-foreground">/ {p.duration}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 min-h-[16px]">
                    {p.perMonth ? `Effective ${p.perMonth}` : "\u00A0"}
                  </p>
                  <Link
                    to={p.href}
                    className={[
                      "mt-5 block text-center py-2.5 rounded-md text-sm font-medium transition-colors",
                      highlight
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    ].join(" ")}
                  >
                    {p.cta}
                  </Link>
                </div>

                <ul className="p-6 space-y-3 flex-1">
                  {p.features.map((f) => (
                    <li
                      key={f.label}
                      className={[
                        "flex items-start gap-2.5 text-sm",
                        f.included ? "text-foreground" : "text-muted-foreground/60",
                      ].join(" ")}
                    >
                      {f.included ? (
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      ) : (
                        <X className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/40" />
                      )}
                      <span className={f.included ? "" : "line-through"}>{f.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Prices in Indian Rupees (₹). GST included where applicable. Payments processed securely.
        </p>
      </section>
      <Footer />
    </div>
  );
}
