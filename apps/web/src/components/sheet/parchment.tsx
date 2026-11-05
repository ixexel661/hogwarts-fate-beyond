import { cn } from "@/lib/utils";

// Optische Bausteine des Charakterbogens: Seite, Titel, Abschnitte, Ornamente.

const ILLUSTRATIONS = {
  castle: { width: 345, height: 266 },
  crest: { width: 124, height: 180 },
  "owl-flying": { width: 173, height: 170 },
  "owl-letter": { width: 160, height: 215 },
  wand: { width: 520, height: 36 },
} as const;

export type IllustrationName = keyof typeof ILLUSTRATIONS;

/** Strichzeichnung aus dem Original-Bogen, eingefärbt in der aktuellen Hausfarbe. */
export function Illustration({ name, className }: { name: IllustrationName; className?: string }) {
  const { width, height } = ILLUSTRATIONS[name];
  return (
    <div
      aria-hidden
      className={cn("illustration shrink-0", className)}
      style={{
        aspectRatio: `${width} / ${height}`,
        maskImage: `url(/illustrations/${name}.png)`,
      }}
    />
  );
}

/** Vierzackiger Stern wie auf dem Original-Bogen. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={cn("size-4 fill-current", className)}>
      <path d="M12 0 L13.6 10.4 L24 12 L13.6 13.6 L12 24 L10.4 13.6 L0 12 L10.4 10.4 Z" />
    </svg>
  );
}

/** Kleines Ornament zwischen zwei Abschnitten. */
export function Divider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-3 text-house-ink/70", className)}>
      <span className="h-px flex-1 bg-linear-to-r from-transparent to-current" />
      <svg viewBox="0 0 40 24" className="h-5 w-9 fill-none stroke-current" strokeWidth="1.2">
        <path d="M20 1 L24 12 L20 23 L16 12 Z" className="fill-current" />
        <path d="M2 12 H14 M26 12 H38" />
        <circle cx="9" cy="12" r="2" />
        <circle cx="31" cy="12" r="2" />
      </svg>
      <span className="h-px flex-1 bg-linear-to-l from-transparent to-current" />
    </div>
  );
}

function Corner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 48"
      className={cn(
        "pointer-events-none absolute size-10 fill-none stroke-current sm:size-12",
        className,
      )}
      strokeWidth="1.4"
    >
      <path d="M4 44 V14 Q4 4 14 4 H44" />
      <path d="M10 44 V18 Q10 10 18 10 H44" strokeWidth="0.8" />
      <path d="M4 14 C 14 14, 14 4, 14 4" />
      <circle cx="17" cy="17" r="3" className="fill-current" />
      <path d="M17 24 C 17 30, 22 32, 26 30 M24 17 C 30 17, 32 22, 30 26" strokeWidth="1" />
    </svg>
  );
}

/** Banner („Schule für Hexerei und Zauberei“) mit Schwalbenschwanz-Enden. */
function Ribbon({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-fit px-9 py-1">
      <svg
        aria-hidden
        viewBox="0 0 200 30"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full fill-parchment-field/80 stroke-house-ink"
      >
        <path
          d="M1 2 H199 L189 15 L199 28 H1 L11 15 Z"
          vectorEffect="non-scaling-stroke"
          strokeWidth="1.2"
        />
        <path d="M14 5 H186 M14 25 H186" vectorEffect="non-scaling-stroke" strokeWidth="0.6" />
      </svg>
      <span className="relative font-display text-[0.7rem] font-bold tracking-wider whitespace-nowrap uppercase sm:text-sm">
        {children}
      </span>
    </div>
  );
}

export function SheetPage({
  subtitle,
  page,
  footer,
  left,
  right,
  children,
}: {
  subtitle: string;
  page: number;
  footer: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article
      aria-label={`Seite ${page} von 2`}
      className="parchment relative mx-auto w-full max-w-[52rem] rounded-sm px-4 pt-6 pb-4 shadow-[0_20px_50px_-12px_rgb(0_0_0/0.6)] sm:px-9 sm:pt-9 sm:pb-6"
    >
      {/* Doppelter Rahmen mit Eckornamenten */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-1.5 rounded-sm border-2 border-house-ink/75"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-sm border border-house-ink/45"
      />
      <div className="text-house-ink/80">
        <Corner className="top-1.5 left-1.5" />
        <Corner className="top-1.5 right-1.5 -scale-x-100" />
        <Corner className="bottom-1.5 left-1.5 -scale-y-100" />
        <Corner className="right-1.5 bottom-1.5 -scale-100" />
      </div>

      <header className="relative flex items-center justify-center gap-2 sm:gap-4">
        {left ? <div className="hidden w-[22%] justify-center sm:flex">{left}</div> : null}
        <div className="flex-1 text-center text-ink">
          <h1 className="font-display text-4xl leading-none font-black tracking-wide uppercase sm:text-6xl">
            Hogwarts
          </h1>
          <div className="mt-2">
            <Ribbon>Schule für Hexerei und Zauberei</Ribbon>
          </div>
          <p className="mt-2 font-display text-sm font-medium tracking-wider uppercase sm:text-base">
            Fate Core · Charakterbogen
          </p>
          <p className="mt-1.5 font-display text-xs font-bold tracking-wider text-house-ink uppercase sm:text-sm">
            {subtitle}
          </p>
        </div>
        {right ? <div className="hidden w-[22%] justify-center sm:flex">{right}</div> : null}
      </header>

      <div className="relative mt-5 flex flex-col gap-4 sm:mt-6">{children}</div>

      <footer className="relative mt-5 flex justify-center">
        <div className="flex items-center gap-2 rounded-sm border border-house-ink/50 bg-parchment-field/50 px-4 py-1 font-display text-[0.7rem] font-bold tracking-wider uppercase sm:text-xs">
          {footer}
          <span aria-hidden>·</span>
          <span>Seite {page} / 2</span>
        </div>
      </footer>
    </article>
  );
}

export function SheetSection({
  title,
  className,
  action,
  children,
}: {
  title: string;
  className?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "relative rounded-md border border-house-ink/60 bg-parchment/40 p-3 outline-1 -outline-offset-5 outline-house-ink/20 sm:p-5",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-display text-base font-bold tracking-wide text-house-ink uppercase sm:text-xl">
          {title}
        </h2>
        {action ?? <Sparkle className="text-house-ink/70" />}
      </div>
      {children}
    </section>
  );
}

/** Beschriftung eines Feldes in Versalien wie auf dem Bogen. */
export function FieldLabel({
  htmlFor,
  children,
  className,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-1 block text-xs font-bold tracking-wider text-ink uppercase sm:text-[0.8rem]",
        className,
      )}
    >
      {children}
    </label>
  );
}

/** Gemeinsamer Stil der beschreibbaren Kästen. */
export const fieldClass =
  "w-full min-w-0 rounded-[3px] border border-ink/45 bg-parchment-field/75 px-2.5 py-1.5 text-base text-ink shadow-[inset_0_1px_3px_rgb(90_60_20/0.12)] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-ink/35 placeholder:italic focus-visible:border-house-ink focus-visible:ring-2 focus-visible:ring-house-accent/45 read-only:bg-parchment-field/35 read-only:shadow-none aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25";
