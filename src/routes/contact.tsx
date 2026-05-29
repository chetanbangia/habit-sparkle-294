import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · Saanjh" },
      { name: "description", content: "Get in touch with the Saanjh team — questions, partnership, or support." },
      { property: "og:title", content: "Contact Saanjh" },
      { property: "og:description", content: "Reach our team for support, partnerships, or feedback." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    setSent(true);
    toast.success("Thank you — we'll respond within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-20 grid md:grid-cols-2 gap-16">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Contact</p>
          <h1 className="font-serif text-5xl mt-4 leading-tight">
            We'd love to <em className="text-primary not-italic">hear</em> from you.
          </h1>
          <p className="font-gurmukhi text-xl mt-3 text-primary/80">ਸਾਡੇ ਨਾਲ ਜੁੜੋ</p>
          <p className="text-muted-foreground mt-6">
            Have a question, suggestion, or want to partner with Saanjh? Our small team reads every message.
          </p>

          <ul className="mt-10 space-y-5 text-sm">
            <li className="flex gap-3 items-start">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Email</p>
                <p className="text-muted-foreground">care@saanjh.in</p>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Office</p>
                <p className="text-muted-foreground">Amritsar, Punjab, India</p>
              </div>
            </li>
          </ul>
        </div>

        <form onSubmit={submit} className="bg-card border border-border rounded-lg p-8 space-y-4">
          <div>
            <label className="text-sm font-medium">Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              className="mt-1.5 w-full px-4 py-2.5 rounded-md bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={120}
              className="mt-1.5 w-full px-4 py-2.5 rounded-md bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              rows={6}
              className="mt-1.5 w-full px-4 py-2.5 rounded-md bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={sent}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {sent ? "Sent" : <>Send message <Send className="w-4 h-4" /></>}
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
}
