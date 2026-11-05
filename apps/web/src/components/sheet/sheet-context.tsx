import { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import type { Character, CharacterPatch } from "@/lib/character/schema";
import { updateCharacter } from "@/server/characters";

export type SaveStatus = "saved" | "pending" | "saving" | "error";

type PatchInput = CharacterPatch | ((current: Character) => CharacterPatch);

interface SheetContextValue {
  character: Character;
  /** Bearbeitungsmodus: Alle Felder sind änderbar, sonst nur Stress, Konsequenzen und Notizen. */
  editing: boolean;
  status: SaveStatus;
  update: (input: PatchInput) => void;
  /** Speichert ausstehende Änderungen sofort. */
  flush: () => Promise<void>;
}

const SheetContext = createContext<SheetContextValue | null>(null);

const SAVE_DELAY_MS = 500;

export function SheetProvider({
  initial,
  editing,
  children,
}: {
  initial: Character;
  editing: boolean;
  children: React.ReactNode;
}) {
  const [character, setCharacter] = useState(initial);
  const [status, setStatus] = useState<SaveStatus>("saved");

  const latest = useRef(initial);
  const pending = useRef<CharacterPatch>({});
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inFlight = useRef<Promise<void> | null>(null);

  const flush = useCallback(async () => {
    clearTimeout(timer.current);
    timer.current = undefined;
    // Speichervorgänge nacheinander ausführen, damit die Reihenfolge erhalten bleibt.
    while (inFlight.current) await inFlight.current;

    const patch = pending.current;
    if (Object.keys(patch).length === 0) return;
    pending.current = {};
    setStatus("saving");

    const run = updateCharacter({ data: { id: latest.current.id, patch } })
      .then(() => {
        if (Object.keys(pending.current).length === 0) setStatus("saved");
      })
      .catch((error: unknown) => {
        // Änderungen behalten, damit sie beim nächsten Speichern erneut gesendet werden.
        pending.current = { ...patch, ...pending.current };
        setStatus("error");
        toast.error("Speichern fehlgeschlagen", {
          description: error instanceof Error ? error.message : undefined,
          action: { label: "Erneut versuchen", onClick: () => void flush() },
        });
      })
      .finally(() => {
        inFlight.current = null;
      });
    inFlight.current = run;
    await run;
  }, []);

  const update = useCallback(
    (input: PatchInput) => {
      const patch = typeof input === "function" ? input(latest.current) : input;
      latest.current = { ...latest.current, ...patch };
      setCharacter(latest.current);
      pending.current = { ...pending.current, ...patch };
      setStatus("pending");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), SAVE_DELAY_MS);
    },
    [flush],
  );

  // Beim Verlassen des Bogens sofort speichern.
  useEffect(() => () => void flush(), [flush]);

  // Warnen, wenn das Fenster mit ungespeicherten Änderungen geschlossen wird.
  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (Object.keys(pending.current).length > 0 || inFlight.current) {
        event.preventDefault();
        void flush();
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [flush]);

  const value = useMemo(
    () => ({ character, editing, status, update, flush }),
    [character, editing, status, update, flush],
  );

  return <SheetContext value={value}>{children}</SheetContext>;
}

export function useSheet() {
  const context = use(SheetContext);
  if (!context) throw new Error("useSheet muss innerhalb von <SheetProvider> verwendet werden.");
  return context;
}
