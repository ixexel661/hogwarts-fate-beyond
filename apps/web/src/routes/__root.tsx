import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";

import Header from "../components/header";
import appCss from "../index.css?url";

export type RouterAppContext = Record<string, never>;

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Hogwarts – Fate Core Charakterbogen",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
  }),

  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="de">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="flex min-h-svh flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
        <Toaster theme="light" richColors />

        <Scripts />
      </body>
    </html>
  );
}
