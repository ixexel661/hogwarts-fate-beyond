import { Link } from "@tanstack/react-router";

import { Sparkle } from "./sheet/parchment";

export default function Header() {
  return (
    <header className="border-b border-backdrop-foreground/15">
      <div className="mx-auto flex max-w-[110rem] items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-sm font-bold tracking-[0.2em] uppercase sm:text-base"
        >
          <Sparkle className="size-3.5" />
          Hogwarts · Fate Core
        </Link>
        <nav>
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="text-base opacity-80 transition hover:opacity-100 data-[status=active]:underline data-[status=active]:underline-offset-4 data-[status=active]:opacity-100"
          >
            Charaktere
          </Link>
        </nav>
      </div>
    </header>
  );
}
