import { Link, createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { LoaderCircleIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useId, useState, useTransition } from "react";
import { toast } from "sonner";

import { FieldLabel, Illustration, fieldClass } from "@/components/sheet/parchment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HOUSES, houseDataAttr } from "@/lib/character/rules";
import { createCharacterInput } from "@/lib/character/schema";
import { cn } from "@/lib/utils";
import { createCharacter, deleteCharacter, listCharacters } from "@/server/characters";

export const Route = createFileRoute("/")({
  loader: () => listCharacters(),
  component: CharacterOverview,
});

type CharacterSummary = Awaited<ReturnType<typeof listCharacters>>[number];

const dateFormat = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" });

function CharacterOverview() {
  const characters = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="text-center">
        <Illustration
          name="castle"
          className="mx-auto w-48 [--house-ink:var(--backdrop-foreground)] sm:w-60"
        />
        <h1 className="mt-5 font-display text-4xl font-black tracking-wide uppercase sm:text-5xl">
          Charaktere
        </h1>
        <p className="mt-2 text-lg italic opacity-80">
          {characters.length > 0
            ? "Wähle einen Charakterbogen oder lege einen neuen an."
            : "Noch keine Charaktere – lege deinen ersten an."}
        </p>
      </header>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li>
          <NewCharacterCard />
        </li>
        {characters.map((character) => (
          <li key={character.id}>
            <CharacterCard character={character} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function CharacterCard({ character }: { character: CharacterSummary }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const name = character.name.trim() || "Unbenannt";

  return (
    <article
      data-house={houseDataAttr(character.house)}
      className="parchment relative flex h-full min-h-48 flex-col rounded-md p-6 shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-1.5 rounded-sm border border-house-ink/60"
      />
      <div className="flex items-start gap-4">
        <Illustration name="crest" className="w-11" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-xl font-bold text-house-ink">
            {/* Der Link deckt die ganze Karte ab. */}
            <Link
              to="/characters/$characterId"
              params={{ characterId: character.id }}
              className="outline-none after:absolute after:inset-0 after:rounded-md focus-visible:after:ring-2 focus-visible:after:ring-house-accent"
            >
              {name}
            </Link>
          </h2>
          <p className="text-sm font-semibold tracking-wider uppercase">
            {character.house ? HOUSES[character.house].label : "Noch nicht eingeteilt"}
          </p>
        </div>
      </div>
      <p className="mt-4 flex-1 text-[1.05rem] italic">
        {character.highConcept || <span className="opacity-60">Noch kein Kernkonzept</span>}
      </p>
      <div className="mt-4 flex items-center justify-between gap-2 text-sm text-ink/70">
        <span>
          Zuletzt bearbeitet{" "}
          <time dateTime={character.updatedAt.toISOString()} suppressHydrationWarning>
            {dateFormat.format(character.updatedAt)}
          </time>
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`${name} löschen`}
          onClick={() => setConfirmOpen(true)}
          className="relative z-10 text-ink/70 hover:text-destructive"
        >
          <Trash2Icon />
        </Button>
      </div>
      <DeleteCharacterDialog
        id={character.id}
        name={name}
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
      />
    </article>
  );
}

function NewCharacterCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-full min-h-48 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-backdrop-foreground/40 text-backdrop-foreground/85 transition outline-none hover:border-backdrop-foreground/80 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-backdrop-foreground"
      >
        <PlusIcon className="size-8" />
        <span className="font-display text-lg font-bold tracking-wide uppercase">
          Neuer Charakter
        </span>
      </button>
      <NewCharacterDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

function NewCharacterDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const id = useId();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const changeOpen = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setName("");
      setError(null);
    }
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = createCharacterInput.safeParse({ name });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Ungültiger Name.");
      return;
    }
    startTransition(async () => {
      try {
        const created = await createCharacter({ data: parsed.data });
        await navigate({
          to: "/characters/$characterId",
          params: { characterId: created.id },
          search: { edit: true },
        });
      } catch {
        toast.error("Der Charakter konnte nicht angelegt werden.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent className="parchment rounded-md text-ink ring-house-ink/40">
        <form onSubmit={submit} className="grid gap-5">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Neuer Charakter</DialogTitle>
            <DialogDescription className="text-base text-ink/80">
              Wie heißt deine neue Hexe oder dein neuer Zauberer? Alles Weitere trägst du direkt auf
              dem Bogen ein.
            </DialogDescription>
          </DialogHeader>
          <div>
            <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
            <input
              id={`${id}-name`}
              type="text"
              autoComplete="off"
              autoFocus
              maxLength={100}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError(null);
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-error` : undefined}
              className={cn(fieldClass, "h-10")}
            />
            {error ? (
              <p id={`${id}-error`} className="mt-1 text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="lg" onClick={() => changeOpen(false)}>
              Abbrechen
            </Button>
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? <LoaderCircleIcon className="animate-spin" /> : <PlusIcon />}
              Anlegen
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteCharacterDialog({
  id,
  name,
  open,
  onOpenChange,
}: {
  id: string;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const remove = async () => {
    try {
      await deleteCharacter({ data: { id } });
      toast.success(`„${name}“ wurde gelöscht.`);
      await router.invalidate();
    } catch {
      toast.error("Der Charakter konnte nicht gelöscht werden.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="parchment rounded-md text-ink">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display font-bold">„{name}“ löschen?</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-ink/80">
            Der Charakterbogen wird endgültig entfernt. Das lässt sich nicht rückgängig machen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel size="lg">Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            size="lg"
            onClick={remove}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            Löschen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
