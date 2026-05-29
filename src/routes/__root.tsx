import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Saanjh · ਸਾਂਝ — Where two souls meet" },
      {
        name: "description",
        content:
          "Saanjh is a modern matrimonial platform for Punjabi and Indian families. Verified profiles, private chat, and meaningful matches built on trust.",
      },
      { name: "author", content: "Saanjh" },
      { property: "og:title", content: "Saanjh · ਸਾਂਝ — Where two souls meet" },
      {
        property: "og:description",
        content:
          "A modern matrimonial home for the Punjabi and Indian community. Verified profiles, dignified matchmaking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Saanjh · ਸਾਂਝ — Where two souls meet" },
      {
        name: "twitter:description",
        content: "A modern matrimonial home for the Punjabi and Indian community.",
      },
      { name: "description", content: "Bringing two souls together." },
      { property: "og:description", content: "Bringing two souls together." },
      { name: "twitter:description", content: "Bringing two souls together." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/5a304e4c-8de0-4fb8-a616-48cae924b9e9" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/5a304e4c-8de0-4fb8-a616-48cae924b9e9" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="pb-[env(safe-area-inset-bottom)]">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <div className="animate-page-enter">
        <Outlet />
      </div>
      <Toaster position="top-center" />
    </>
  );
}
