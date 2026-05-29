import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing · Saanjh — Free to begin, premium when ready" },
      { name: "description", content: "Simple matrimonial membership plans. Start free, upgrade for chat, contact access, and unlimited interests." },
      { property: "og:title", content: "Saanjh Membership Plans" },
      { property: "og:description", content: "Free, ₹199, ₹499, ₹1999 — transparent matrimonial pricing." },
    ],
  }),
  component: PricingPage,
});

const PLANS = [
  {
    name: "Free", price: "₹0", duration: "Forever",
    features: ["View limited profiles", "3 interests / day", "Basic (blurred) photos", "No chat"],
  },
  {
    name: "7 Days", price: "₹199", duration: "1 week",
    features: ["Chat after match", "5 interests / day", "Full photos", "Email support"],
  },
  {
    name: "1 Month", price: "₹499", duration: "30 days", popular: true,
    features: ["Unlimited chat", "Unlimited interests", "Contact access", "Priority browse"],
  },
  {
    name: "6 Months", price: "₹1,999", duration: "180 days",
    features: ["Everything in 1 Month", "Priority visibility", "Concierge support", "Featured profile badge"],
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Membership Plans</p>
          <h1 className="font-serif text-5xl sm:text-6xl mt-4 leading-tight">
            One <em className="text-primary not-italic">honest</em> price.
          </h1>
          <p className="font-gurmukhi text-xl mt-3 text-primary/80">ਸਪੱਸ਼ਟ ਕੀਮਤ</p>
          <p className="text-lg text-muted-foreground mt-6">
            No hidden fees. No auto-renewals you didn't ask for. Cancel anytime.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-lg p-7 ${p.popular ? "bg-primary text-primary-foreground shadow-2xl scale-[1.03]" : "bg-card border border-border"}`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] uppercase tracking-wider rounded-full bg-gold text-ink flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Most popular
                </span>
              )}
              <h3 className="font-serif text-2xl">{p.name}</h3>
              <p className={`text-xs uppercase tracking-wide mt-1 ${p.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{p.duration}</p>
              <p className="font-serif text-5xl mt-5">{p.price}</p>
              <ul className={`mt-6 space-y-2.5 text-sm ${p.popular ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2"><Check className="w-4 h-4 shrink-0 mt-0.5" /> {f}</li>
                ))}
              </ul>
              <Link
                to={p.name === "Free" ? "/signup" : "/membership"}
                className={`mt-8 block text-center py-3 rounded-md font-medium transition ${
                  p.popular
                    ? "bg-background text-primary hover:opacity-90"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {p.name === "Free" ? "Get started" : "Choose plan"}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          Prices in Indian Rupees (₹). Payments processed securely. GST included where applicable.
        </p>
      </section>
      <Footer />
    </div>
  );
}
