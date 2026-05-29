import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ · Saanjh — Frequently Asked Questions" },
      { name: "description", content: "Answers to common questions about Saanjh — registration, safety, premium plans, profile verification, and more." },
      { property: "og:title", content: "Saanjh FAQ" },
      { property: "og:description", content: "Everything you wanted to know about Saanjh matrimony." },
    ],
  }),
  component: FaqPage,
});

const FAQS = [
  { q: "Is Saanjh really free?", a: "Yes. Creating a profile, browsing limited profiles, and sending a few interests every day is completely free, forever. You only pay if you want to chat, see contact details, or send unlimited interests." },
  { q: "How are profiles verified?", a: "Every new profile is manually reviewed by our admin team before going live. We check for genuine photos, complete information, and signs of fake activity. Profiles that pass become visible to others." },
  { q: "Can free users see my photos?", a: "No. Until someone has an active premium plan, photos appear blurred. This protects your privacy and keeps Saanjh feeling intentional." },
  { q: "When can I chat with someone?", a: "Chat opens when both of you have accepted each other's interest (a match) AND at least one of you has an active premium plan. This keeps conversations meaningful." },
  { q: "How do you stop people sharing fake numbers or links?", a: "Every text field — profile, chat, anywhere — runs through an automatic filter that strips phone numbers, emails, social handles, and platform names like WhatsApp or Instagram. Anyone trying repeatedly gets reported to admin." },
  { q: "What payment methods do you accept?", a: "We accept UPI, debit cards, credit cards, and net banking through our secure payment partner. All transactions are encrypted." },
  { q: "Will my membership auto-renew?", a: "No. Saanjh memberships expire at the end of the period you paid for. We never charge you again without you choosing to renew." },
  { q: "Can I delete my profile?", a: "Yes, anytime, from your profile settings. We delete your photos and personal data permanently within 30 days." },
  { q: "Is Saanjh only for Punjabi families?", a: "Saanjh is built with deep respect for Punjabi culture and is bilingual in Punjabi and English. But every Indian community is welcome — Hindu, Sikh, Muslim, Christian, Jain, and more." },
];

function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Frequently Asked</p>
          <h1 className="font-serif text-5xl mt-4 leading-tight">Questions, <em className="text-primary not-italic">answered</em>.</h1>
          <p className="font-gurmukhi text-xl mt-3 text-primary/80">ਅਕਸਰ ਪੁੱਛੇ ਜਾਣ ਵਾਲੇ ਸਵਾਲ</p>
        </div>

        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-lg px-6 bg-card">
              <AccordionTrigger className="font-serif text-lg text-left hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <Footer />
    </div>
  );
}
